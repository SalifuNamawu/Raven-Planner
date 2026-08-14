import { VercelRequest, VercelResponse } from '@vercel/node';
import { upsertLead } from './google-sheets.js';

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const leadData = req.body as LeadData;
    
    if (!leadData.leadId) {
      return res.status(400).json({ error: 'Missing leadId' });
    }

    await upsertLead(buildRow(leadData));

    return res.json({ ok: true, leadId: leadData.leadId });
  } catch (err) {
    console.error('Save lead error:', err);
    return res.status(500).json({ error: 'Failed to save lead' });
  }
}
