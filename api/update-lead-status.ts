import { VercelRequest, VercelResponse } from '@vercel/node';

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

    const scriptId = process.env.GOOGLE_APPS_SCRIPT_ID;
    if (!scriptId) {
      return res.status(500).json({ error: 'Google Apps Script not configured' });
    }

    const sheetsUrl = `https://script.google.com/macros/s/${scriptId}/exec`;
    
    const response = await fetch(sheetsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'updateLeadStatus',
        leadId,
        submissionStatus,
        contactMethod,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Sheets API error:', errorText);
      return res.status(500).json({ error: 'Failed to update lead status' });
    }

    const result = await response.json() as { success: boolean; error?: string };
    
    if (!result.success) {
      console.error('Google Sheets update failed:', result.error);
      return res.status(500).json({ error: result.error || 'Failed to update lead status' });
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error('Update lead status error:', err);
    return res.status(500).json({ error: 'Failed to update lead status' });
  }
}