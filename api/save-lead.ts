import { VercelRequest, VercelResponse } from '@vercel/node';

interface LeadData {
  leadId: string;
  date: string;
  time: string;
  businessType: string;
  businessName: string;
  businessDescription: string;
  package: string;
  basePrice: number;
  additionalFeatures: string;
  brandIdentityOption: string;
  logoRequirement: string;
  logoStyle: string;
  logoUploadStatus: string;
  brandColour: string;
  customColours: string;
  businessOwnerName: string;
  phoneNumber: string;
  email: string;
  city: string;
  website: string;
  estimatedTotal: number;
  submissionStatus: string;
  contactMethod: string;
  followUpStatus: string;
}

function buildRow(data: LeadData): string[] {
  return [
    data.leadId,
    data.date,
    data.time,
    data.businessType,
    data.businessName,
    data.businessDescription,
    data.package,
    data.basePrice.toString(),
    data.additionalFeatures,
    data.brandIdentityOption,
    data.logoRequirement,
    data.logoStyle,
    data.logoUploadStatus,
    data.brandColour,
    data.customColours,
    data.businessOwnerName,
    data.phoneNumber,
    data.email,
    data.city,
    data.website,
    data.estimatedTotal.toString(),
    data.submissionStatus,
    data.contactMethod,
    data.followUpStatus,
  ];
}

function getGoogleSheetsUrl(): string {
  const scriptId = process.env.GOOGLE_APPS_SCRIPT_ID;
  if (!scriptId) {
    throw new Error('GOOGLE_APPS_SCRIPT_ID not configured');
  }
  return `https://script.google.com/macros/s/${scriptId}/exec`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const leadData = req.body as LeadData;
    
    if (!leadData.leadId) {
      return res.status(400).json({ error: 'Missing leadId' });
    }

    const sheetsUrl = getGoogleSheetsUrl();
    
    const response = await fetch(sheetsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'saveLead',
        data: buildRow(leadData),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Sheets API error:', errorText);
      return res.status(500).json({ error: 'Failed to save lead to Google Sheets' });
    }

    const result = await response.json() as { success: boolean; error?: string };
    
    if (!result.success) {
      console.error('Google Sheets save failed:', result.error);
      return res.status(500).json({ error: result.error || 'Failed to save lead' });
    }

    return res.json({ ok: true, leadId: leadData.leadId });
  } catch (err) {
    console.error('Save lead error:', err);
    return res.status(500).json({ error: 'Failed to save lead' });
  }
}