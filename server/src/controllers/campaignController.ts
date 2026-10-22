import { Request, Response } from 'express';
import Campaign from '../models/Campaign';
import NGO from '../models/NGO';
import { AuthRequest } from '../middleware/auth';

// @desc Get all campaigns with search, category & urgency filters
// @route GET /api/v1/campaigns
export const getCampaigns = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, category, isUrgent, isFeatured, status } = req.query;
    let query: any = {};

    if (status) {
      query.status = status;
    } else {
      query.status = 'active';
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { tagline: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (isUrgent === 'true') {
      query.isUrgent = true;
    }

    if (isFeatured === 'true') {
      query.isFeatured = true;
    }

    const campaigns = await Campaign.find(query)
      .populate({
        path: 'ngo',
        select: 'organizationName logo city state verificationStatus',
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: campaigns.length, data: campaigns });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get single campaign details
// @route GET /api/v1/campaigns/:id
export const getCampaignById = async (req: Request, res: Response): Promise<void> => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate({
      path: 'ngo',
      select: 'organizationName logo banner mission contactEmail contactPhone address city state website',
    });

    if (!campaign) {
      res.status(404).json({ success: false, message: 'Campaign not found' });
      return;
    }

    res.status(200).json({ success: true, data: campaign });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Create new campaign (NGO only)
// @route POST /api/v1/campaigns
export const createCampaign = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    const ngo = await NGO.findOne({ user: req.user._id });
    if (!ngo) {
      res.status(403).json({ success: false, message: 'Only registered NGO accounts can create campaigns' });
      return;
    }

    const slug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);

    const campaign = await Campaign.create({
      ...req.body,
      ngo: ngo._id,
      slug,
      raisedAmount: 0,
      status: 'active',
    });

    res.status(201).json({ success: true, data: campaign, message: 'Campaign created successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Add Comment to Campaign
// @route POST /api/v1/campaigns/:id/comments
export const addCampaignComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    const { comment } = req.body;
    if (!comment) {
      res.status(400).json({ success: false, message: 'Comment text is required' });
      return;
    }

    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      res.status(404).json({ success: false, message: 'Campaign not found' });
      return;
    }

    campaign.comments.unshift({
      user: req.user._id,
      userName: req.user.name,
      userAvatar: req.user.avatar,
      comment,
      createdAt: new Date(),
    });

    await campaign.save();

    res.status(200).json({ success: true, data: campaign.comments, message: 'Comment added successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
