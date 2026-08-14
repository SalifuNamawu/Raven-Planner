import { VercelRequest, VercelResponse } from '@vercel/node';
import { updateLeadStatusInSheet } from './google-sheets.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { leadId, submissionStatus, contactMethod } = req.body as {
      leadId: string;
      submissionStatus: string;
      contactMethod: string;
    };

    if (!leadId) {
      return res.status(400).json({ error: 'Missing leadId' });
    }

    const updated = await updateLeadStatusInSheet(leadId, submissionStatus, contactMethod);
    if (!updated) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error('Update lead status error:', err);
    return res.status(500).json({ error: 'Failed to update lead status' });
  }
}
