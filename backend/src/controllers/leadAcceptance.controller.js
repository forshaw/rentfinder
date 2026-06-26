const { supabase } = require('../supabase');
const { createNotification } = require('../utils/notification.helper');
const { recordEscrowAudit } = require('../utils/escrowAudit.helper');
const { sendNotification } = require("../services/push.service");

/**
 * POST /api/leads/:id/accept
 * Busy individual accepts a lead
 */
async function acceptLead(req, res) {
  console.log('>>> ACCEPT handler called');
  try {
    const leadId = req.params.id;
    const actingUserId = req.user.user_id; // busy_individual

    // 1️⃣ Fetch the lead
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('lead_id, task_id')
      .eq('lead_id', leadId)
      .single();

    if (leadError || !lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    // 2️⃣ Fetch the task linked to the lead
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select('task_id, request_id, finder_id, status')
      .eq('task_id', lead.task_id)
      .single();

    if (taskError || !task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // ✅ Prevent double acceptance
    if (task.status === 'accepted') {
      return res.status(400).json({
        error: 'Task already accepted'
      });
    }

    // 3️⃣ Resolve ownership through rental_requests
    const { data: request, error: requestError } = await supabase
      .from('rental_requests')
      .select('user_id')
      .eq('request_id', task.request_id)
      .single();

    if (requestError || !request) {
      return res.status(404).json({
        error: 'Rental request not found'
      });
    }

    // ✅ AUTHORISATION CHECK (THIS IS THE FIX)
    if (request.user_id !== actingUserId) {
      return res.status(403).json({
        error: 'Not authorized to accept this lead'
      });
    }

    // 4️⃣ Mark the accepted lead as verified
    const { error: acceptError } = await supabase
      .from('leads')
      .update({ verified: true })
      .eq('lead_id', leadId);

    if (acceptError) {
      return res.status(500).json({ error: acceptError.message });
    }

    // 5️⃣ Reject all other leads for this task
    await supabase
      .from('leads')
      .update({ verified: false })
      .eq('task_id', lead.task_id)
      .neq('lead_id', leadId);

    // 6️⃣ Close the task and accept the lead
    const { error: closeTaskError } = await supabase
      .from('tasks')
      .update({ status: 'accepted' })
      .eq('task_id', lead.task_id);

    // 7️⃣ Create escrow payment (no funds moved yet)
    await supabase.from('escrow_payments').insert([
      {
        task_id: task.task_id,

        payer_id: request.user_id,   // busy individual
        payee_id: task.finder_id,    // rent finder

        total_amount: 250.00,
        refundable_amount: 200.00,
        service_fee: 50.00,

        status: 'pending'
      }
    ]);
    await recordEscrowAudit({
      escrowId: escrow.escrow_id,
      action: 'escrow_created',
      performedBy: request.user_id,
      amount: escrow.total_amount,
      note: 'Escrow created on lead acceptance'
    });



    if (closeTaskError) {
      return res.status(500).json({ error: closeTaskError.message });
    }

    res.json({
      message: 'Lead accepted and task closed'
    });
    await createNotification({
      userId: task.finder_id,
      type: 'lead.accepted',
      message: 'Your lead has been accepted. You may proceed.',
      link: `/tasks/${task.task_id}`,
});
  }
  
  
  catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}



/**
 * POST /api/leads/:id/reject
 * Busy individual rejects a lead
 */
async function rejectLead(req, res) {
  console.log('>>> REJECT handler called');
  try {
    const leadId = req.params.id;
    const actingUserId = req.user.user_id;

    // 1️⃣ Fetch lead
    const { data: lead } = await supabase
      .from('leads')
      .select('lead_id, task_id')
      .eq('lead_id', leadId)
      .single();

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    // 2️⃣ Fetch task
    const { data: task } = await supabase
      .from('tasks')
      .select('task_id, request_id, finder_id, status')
      .eq('task_id', lead.task_id)
      .single();

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Prevent post‑decision changes
    if (task.status === 'accepted' || task.status === 'verified') {
      return res.status(400).json({
        error: 'Cannot reject lead after task acceptance'
      });
    }

    // 3️⃣ Verify ownership via rental request
    const { data: request } = await supabase
      .from('rental_requests')
      .select('user_id')
      .eq('request_id', task.request_id)
      .single();

    if (!request || request.user_id !== actingUserId) {
      return res.status(403).json({
        error: 'Not authorized to reject this lead'
      });
    }

    // 4️⃣ Update lead to rejected
    await supabase
      .from('leads')
      .update({ status: 'rejected' })
      .eq('lead_id', leadId);

    res.json({ message: 'Lead rejected' });
    await createNotification({
      userId: task.finder_id,
      type: 'lead.rejected',
      message: 'Your lead was not accepted this time.'
    });
  }
  
  catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}


module.exports = {
  acceptLead,
  rejectLead
};