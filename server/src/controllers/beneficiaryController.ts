import { Request, Response } from 'express';
import BeneficiaryRequest from '../models/BeneficiaryRequest';
import { AuthRequest } from '../middleware/auth';

// @desc Submit Assistance Request (Beneficiary / Community member)
// @route POST /api/v1/beneficiaries/requests
export const createRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    const { fullName, contactPhone, address, city, state, category, urgency, title, description } = req.body;

    const request = await BeneficiaryRequest.create({
      user: req.user._id,
      fullName: fullName || req.user.name,
      contactPhone: contactPhone || req.user.phone || '9876543210',
      address: address || req.user.address || 'Local Street',
      city: city || req.user.city || 'Delhi',
      state: state || req.user.state || 'Delhi',
      category,
      urgency: urgency || 'medium',
      title,
      description,
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      data: request,
      message: 'Assistance request submitted successfully! Local NGOs notified.',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get All Assistance Requests (For NGOs / Admin review)
// @route GET /api/v1/beneficiaries/requests
export const getRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, urgency, status, city } = req.query;
    let query: any = {};

    if (category) query.category = category;
    if (urgency) query.urgency = urgency;
    if (status) query.status = status;
    if (city) query.city = { $regex: city, $options: 'i' };

    const requests = await BeneficiaryRequest.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: requests.length, data: requests });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Review & Process Request (NGO approval/rejection)
// @route PUT /api/v1/beneficiaries/requests/:id/review
export const reviewRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, reviewNotes } = req.body;
    const request = await BeneficiaryRequest.findById(req.params.id);

    if (!request) {
      res.status(404).json({ success: false, message: 'Request not found' });
      return;
    }

    request.status = status || request.status;
    if (reviewNotes) request.reviewNotes = reviewNotes;
    if (status === 'fulfilled') request.fulfilledDate = new Date();

    await request.save();

    res.status(200).json({ success: true, data: request, message: `Request updated to ${request.status}` });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
