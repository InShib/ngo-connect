import { Request, Response } from 'express';
import NgoCollaboration from '../models/NgoCollaboration';
import NGO from '../models/NGO';
import { AuthRequest } from '../middleware/auth';

// @desc Request Inter-NGO Collaboration / Surplus Exchange
// @route POST /api/v1/collaborations
export const createCollaborationRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    const requestingNgo = await NGO.findOne({ user: req.user._id });
    if (!requestingNgo) {
      res.status(403).json({ success: false, message: 'Only registered NGOs can initiate collaboration requests' });
      return;
    }

    const { targetNgoId, type, title, details, itemsRequested } = req.body;

    const collab = await NgoCollaboration.create({
      requestingNgo: requestingNgo._id,
      targetNgo: targetNgoId,
      type,
      title,
      details,
      itemsRequested: itemsRequested || [],
      status: 'pending',
    });

    res.status(201).json({ success: true, data: collab, message: 'Collaboration request sent successfully!' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get Collaborations for Current NGO
// @route GET /api/v1/collaborations
export const getMyCollaborations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    const ngo = await NGO.findOne({ user: req.user._id });
    if (!ngo) {
      res.status(403).json({ success: false, message: 'Only NGOs can view collaboration dashboard' });
      return;
    }

    const collabs = await NgoCollaboration.find({
      $or: [{ requestingNgo: ngo._id }, { targetNgo: ngo._id }],
    })
      .populate('requestingNgo', 'organizationName logo city contactPhone')
      .populate('targetNgo', 'organizationName logo city contactPhone')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: collabs.length, data: collabs });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Respond to Collaboration Request
// @route PUT /api/v1/collaborations/:id/respond
export const respondToCollaboration = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, responseNotes } = req.body;
    const collab = await NgoCollaboration.findById(req.params.id);

    if (!collab) {
      res.status(404).json({ success: false, message: 'Collaboration request not found' });
      return;
    }

    collab.status = status;
    if (responseNotes) collab.responseNotes = responseNotes;
    await collab.save();

    res.status(200).json({ success: true, data: collab, message: `Request status updated to ${status}` });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
