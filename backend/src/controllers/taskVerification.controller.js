const { supabase } = require('../supabase');
const { createNotification } = require('../utils/notification.helper');
const { createPayoutFromEscrow } = require('../utils/payout.helper');

/**
 * POST /api/tasks/:task_id/verify
 * Busy individual verifies task and releases escrow
 */
async function verifyTask(req, res) {
  try {
    const taskId = req.params.task_id;
    const userId = req.user.userId;

    // 1️⃣ Load task
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select('task_id, request_id, finder_id, status')
      .eq('task_id', taskId)
      .single();

    if (taskError || !task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (task.status !== 'accepted') {
      return res.status(400).json({
        error: `Task cannot be verified in status: ${task.status}`
      });
    }

    // 2️⃣ Verify ownership via rental_requests
    const { data: request, error: requestError } = await supabase
      .from('rental_requests')
      .select('user_id')
      .eq('request_id', task.request_id)
      .single();

    if (requestError || !request) {
      return res.status(404).json({ error: 'Rental request not found' });
    }

    if (request.user_id !== userId) {
      return res.status(403).json({
        error: 'You are not authorized to verify this task'
      });
    }

    // 3️⃣ Load escrow
    const { data: escrow, error: escrowError } = await supabase
      .from('escrow_payments')
      .select('*')
      .eq('task_id', taskId)
      .single();

    if (escrowError || !escrow) {
      return res.status(404).json({ error: 'Escrow not found' });
    }

    if (escrow.status !== 'held') {
      return res.status(400).json({
        error: `Escrow cannot be released in status: ${escrow.status}`
      });
    }

    // 4️⃣ Release escrow (provider-agnostic)
    await supabase
      .from('escrow_payments')
      .update({
        status: 'released',
        updated_at: new Date()
      })
      .eq('escrow_id', escrow.escrow_id);

    await createPayoutFromEscrow(escrow);
      


    // 5️⃣ Update task
    await supabase
      .from('tasks')
      .update({ status: 'verified' })
      .eq('task_id', taskId);

    // 6️⃣ Notifications
    await createNotification({
      userId: task.finder_id,
      type: 'escrow.released',
      message: `Your payment of ${escrow.total_amount} NAD has been released.`
    });

    await createNotification({
      userId: request.user_id,
      type: 'task.verified',
      message: 'The task has been verified and payment released.'
    });
    await recordEscrowAudit({
      escrowId: escrow.escrow_id,
      action: 'escrow_released',
      performedBy: userId,
      amount: escrow.refundable_amount,
      note: 'Task verified, payout to finder'
    });

    res.json({
      message: 'Task verified and escrow released successfully'
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { verifyTask };
