import { Request, Response } from 'express';

// Smart AI Assistant Chatbot
export const aiChat = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, context } = req.body;
    const userMessage = (message || '').toLowerCase();

    let reply = "Hello! I am the NGO CONNECT AI Assistant. How can I help you support social causes today?";

    if (userMessage.includes('donate') || userMessage.includes('money') || userMessage.includes('item')) {
      reply = "You can donate funds directly via UPI/Cards with instant PDF 80G tax receipts, or schedule a doorstep pickup for physical items like clothes, food, books, or medical supplies under the 'Donate' module.";
    } else if (userMessage.includes('volunteer') || userMessage.includes('event')) {
      reply = "We have active volunteer opportunities near you! Browse upcoming blood drives, tree plantation events, and teaching drives in the 'Volunteers' hub to earn verified hours and digital badges.";
    } else if (userMessage.includes('ngo') || userMessage.includes('register')) {
      reply = "NGOs can submit their registration certificate on NGO CONNECT to receive verified status, host fundraising campaigns, request volunteer support, and share surplus inventory with other NGOs.";
    } else if (userMessage.includes('help') || userMessage.includes('request') || userMessage.includes('food')) {
      reply = "Beneficiaries or local community members can submit urgent assistance requests for food, medicine, or shelter in the 'Beneficiaries' section. Nearby verified NGOs are automatically alerted.";
    }

    res.status(200).json({
      success: true,
      reply,
      suggestedActions: [
        { label: 'Explore Campaigns', url: '/campaigns' },
        { label: 'Donate Items', url: '/donate' },
        { label: 'Volunteer Opportunities', url: '/volunteers' },
      ],
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// AI Campaign Description Generator
export const generateCampaignDescription = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, category, targetAmount, location } = req.body;

    const generatedDescription = `## ${title || 'Empower Communities Together'}\n\n### Objective\nThis campaign aims to address urgent needs in ${category || 'community welfare'} across ${location || 'local regions'}. With a target funding goal of ₹${(targetAmount || 100000).toLocaleString('en-IN')}, every contribution directly provides vital supplies, care, and sustainable assistance.\n\n### Why Your Support Matters\n100% of your contributions are deployed with full digital transparency. You will receive real-time campaign updates, progress tracking, and an instant tax-exempt PDF receipt.\n\n### How You Can Help\n1. Donate funds or physical items.\n2. Share this campaign with your network.\n3. Join us as a verified volunteer on the ground.`;

    const generatedTagline = `Join NGO CONNECT in delivering urgent ${category || 'welfare'} support in ${location || 'our communities'}.`;

    res.status(200).json({
      success: true,
      generatedDescription,
      generatedTagline,
      message: 'AI content generated successfully!',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
