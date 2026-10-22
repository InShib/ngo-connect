import { Request, Response } from 'express';
import NGO from '../models/NGO';
import Campaign from '../models/Campaign';
import { AuthRequest } from '../middleware/auth';

// @desc Get all verified NGOs with search & filter
// @route GET /api/v1/ngos
export const getNgos = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, category, city, status } = req.query;
    let query: any = {};

    if (status) {
      query.verificationStatus = status;
    } else {
      query.verificationStatus = 'verified';
    }

    if (search) {
      query.$or = [
        { organizationName: { $regex: search, $options: 'i' } },
        { mission: { $regex: search, $options: 'i' } },
        { workingAreas: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      query.workingAreas = { $in: [category] };
    }

    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    const ngos = await NGO.find(query).populate('user', 'name email avatar phone');
    res.status(200).json({ success: true, count: ngos.length, data: ngos });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get single NGO profile
// @route GET /api/v1/ngos/:id
export const getNgoById = async (req: Request, res: Response): Promise<void> => {
  try {
    const ngo = await NGO.findById(req.params.id).populate('user', 'name email avatar phone');
    if (!ngo) {
      res.status(404).json({ success: false, message: 'NGO not found' });
      return;
    }

    const activeCampaigns = await Campaign.find({ ngo: ngo._id, status: 'active' });

    res.status(200).json({ success: true, data: ngo, activeCampaigns });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update NGO profile (NGO Owner only)
// @route PUT /api/v1/ngos/profile
export const updateNgoProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    let ngo = await NGO.findOne({ user: req.user._id });
    if (!ngo) {
      res.status(404).json({ success: false, message: 'NGO record not found for this user' });
      return;
    }

    Object.assign(ngo, req.body);
    await ngo.save();

    res.status(200).json({ success: true, data: ngo, message: 'NGO profile updated successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
