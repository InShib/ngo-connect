import { Request, Response } from 'express';
import User from '../models/User';
import NGO from '../models/NGO';
import Campaign from '../models/Campaign';
import Donation from '../models/Donation';
import Volunteer from '../models/Volunteer';
import BeneficiaryRequest from '../models/BeneficiaryRequest';
import AuditLog from '../models/AuditLog';
import { AuthRequest } from '../middleware/auth';

// @desc Get Enterprise System Dashboard Analytics
// @route GET /api/v1/admin/stats
export const getAdminStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments();
    const totalNgos = await NGO.countDocuments();
    const verifiedNgos = await NGO.countDocuments({ verificationStatus: 'verified' });
    const pendingNgos = await NGO.countDocuments({ verificationStatus: 'pending' });
    const totalCampaigns = await Campaign.countDocuments();
    const activeCampaigns = await Campaign.countDocuments({ status: 'active' });
    const totalVolunteers = await Volunteer.countDocuments();
    const totalBeneficiaryRequests = await BeneficiaryRequest.countDocuments();

    const donations = await Donation.find({ type: 'money' });
    const totalDonationAmount = donations.reduce((acc, d) => acc + (d.amount || 0), 0);
    const totalItemDonations = await Donation.countDocuments({ type: 'item' });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalNgos,
        verifiedNgos,
        pendingNgos,
        totalCampaigns,
        activeCampaigns,
        totalVolunteers,
        totalBeneficiaryRequests,
        totalDonationAmount,
        totalItemDonations,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Approve or Reject NGO Verification
// @route PUT /api/v1/admin/ngos/:id/verify
export const verifyNgo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, verificationReason } = req.body;
    const ngo = await NGO.findById(req.params.id);

    if (!ngo) {
      res.status(404).json({ success: false, message: 'NGO not found' });
      return;
    }

    ngo.verificationStatus = status || 'verified';
    if (verificationReason) ngo.verificationReason = verificationReason;
    await ngo.save();

    await AuditLog.create({
      user: req.user?._id,
      action: `NGO_VERIFICATION_${status.toUpperCase()}`,
      details: `NGO ${ngo.organizationName} status set to ${status}`,
    });

    res.status(200).json({
      success: true,
      data: ngo,
      message: `NGO ${ngo.organizationName} verification updated to ${status}`,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get All Audit Logs
// @route GET /api/v1/admin/audit-logs
export const getAuditLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const logs = await AuditLog.find().populate('user', 'name email role').sort({ createdAt: -1 }).limit(50);
    res.status(200).json({ success: true, count: logs.length, data: logs });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
