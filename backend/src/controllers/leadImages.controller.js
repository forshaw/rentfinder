const { supabase } = require('../supabase');
const { v4: uuidv4 } = require('uuid');

// ===============================
// POST /api/leads/:id/images
// Upload image for a lead (optional)
// ===============================
async function uploadLeadImage(req, res) {
  try {
    const leadId = req.params.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Verify lead exists
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('lead_id')
      .eq('lead_id', leadId)
      .single();

    if (leadError || !lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    // Generate storage path
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${leadId}/${fileName}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('lead-images')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
      });

    if (uploadError) {
      return res.status(500).json({ error: uploadError.message });
    }

    // Public URL
    const { data } = supabase.storage
      .from('lead-images')
      .getPublicUrl(filePath);

    // Save URL in database
    const { error: dbError } = await supabase
      .from('lead_images')
      .insert([
        {
          lead_id: leadId,
          image_url: data.publicUrl,
        },
      ]);

    if (dbError) {
      return res.status(500).json({ error: dbError.message });
    }

    res.status(201).json({
      message: 'Image uploaded',
      image_url: data.publicUrl,
    });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { uploadLeadImage };