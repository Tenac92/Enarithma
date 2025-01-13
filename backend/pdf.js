const express = require('express');
const router = express.Router();
const db = require('./db.js');
const PDFDocument = require('pdfkit');

router.get('/:id/document', async (req, res) => {
  const { id } = req.params;

  try {
    const { data: project } = await db.supabase.from('enarithma').select('*').eq('id', id).single();

    if (!project) return res.status(404).send('Project not found.');

    // Create PDF
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${project.title}.pdf`);

    doc.pipe(res);
    doc.fontSize(18).text(`Project Report`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Name: ${project.title}`);
    doc.text(`Description: ${project.description}`);
    doc.text(`Amount: $${project.amount}`);
    // Assuming you have a field for assigned users
    doc.text(`Assigned Users: ${project.assigned_users.join(', ')}`); // Replace with your actual field
    doc.end();

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;