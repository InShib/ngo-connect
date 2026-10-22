import { Request, Response } from 'express';
import Donation from '../models/Donation';
import Campaign from '../models/Campaign';
import NGO from '../models/NGO';
import QRCode from 'qrcode';
import { AuthRequest } from '../middleware/auth';
import { generateDonationPDF } from '../services/pdfService';

// @desc Create Monetary Donation
// @route POST /api/v1/donations/money
export const createMoneyDonation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    const { ngoId, campaignId, amount, paymentMethod, isAnonymous, notes } = req.body;

    if (!amount || amount <= 0) {
      res.status(400).json({ success: false, message: 'Donation amount must be greater than zero' });
      return;
    }

    const ngo = await NGO.findById(ngoId);
    if (!ngo) {
      res.status(404).json({ success: false, message: 'Beneficiary NGO not found' });
      return;
    }

    const receiptNumber = `REC-${Date.now().toString().slice(-8)}`;
    const qrCodeData = await QRCode.toDataURL(JSON.stringify({ receiptNumber, amount, donor: req.user.name, ngo: ngo.organizationName }));

    const donation = await Donation.create({
      donor: req.user._id,
      donorName: req.user.name,
      donorEmail: req.user.email,
      ngo: ngo._id,
      campaign: campaignId || null,
      type: 'money',
      amount,
      paymentMethod: paymentMethod || 'UPI',
      transactionId: `TXN-${Date.now().toString().slice(-6)}`,
      isAnonymous: isAnonymous || false,
      receiptNumber,
      qrCodeData,
      notes: notes || '',
    });

    // Update Campaign raisedAmount
    if (campaignId) {
      const campaign = await Campaign.findById(campaignId);
      if (campaign) {
        campaign.raisedAmount += amount;
        if (campaign.raisedAmount >= campaign.targetAmount) {
          campaign.status = 'completed';
        }
        await campaign.save();
      }
    }

    // Update NGO impact metrics
    ngo.impactMetrics.totalFundsRaised += amount;
    ngo.impactMetrics.livesImpacted += Math.floor(amount / 500) + 1;
    await ngo.save();

    res.status(201).json({
      success: true,
      data: donation,
      message: 'Donation processed successfully! PDF receipt generated.',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Schedule Physical Item Donation Pickup
// @route POST /api/v1/donations/item
export const createItemDonation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    const { ngoId, items, pickupAddress, pickupDate, notes } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ success: false, message: 'Please provide at least one item to donate' });
      return;
    }

    const ngo = await NGO.findById(ngoId);
    if (!ngo) {
      res.status(404).json({ success: false, message: 'NGO not found' });
      return;
    }

    const receiptNumber = `ITEM-REC-${Date.now().toString().slice(-8)}`;
    const qrCodeData = await QRCode.toDataURL(JSON.stringify({ receiptNumber, itemsCount: items.length, donor: req.user.name }));

    const donation = await Donation.create({
      donor: req.user._id,
      donorName: req.user.name,
      donorEmail: req.user.email,
      ngo: ngo._id,
      type: 'item',
      items,
      pickupAddress: pickupAddress || {
        street: req.user.address || 'Main Street',
        city: req.user.city || 'Delhi',
        state: req.user.state || 'Delhi',
        pincode: '110001',
        phone: req.user.phone || '9876543210',
      },
      pickupDate: pickupDate || new Date(Date.now() + 24 * 60 * 60 * 1000), // Default tomorrow
      trackingStatus: 'scheduled',
      receiptNumber,
      qrCodeData,
      notes: notes || '',
    });

    res.status(201).json({
      success: true,
      data: donation,
      message: 'Item pickup scheduled! Delivery tracking barcode issued.',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get My Donations
// @route GET /api/v1/donations/my-donations
export const getMyDonations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    const donations = await Donation.find({ donor: req.user._id })
      .populate('ngo', 'organizationName logo')
      .populate('campaign', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: donations.length, data: donations });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Download PDF Donation Receipt
// @route GET /api/v1/donations/receipt/:id
export const downloadReceipt = async (req: Request, res: Response): Promise<void> => {
  try {
    const donation = await Donation.findById(req.params.id).populate('ngo', 'organizationName');
    if (!donation) {
      res.status(404).json({ success: false, message: 'Donation record not found' });
      return;
    }

    const pdfBuffer = await generateDonationPDF({
      receiptNumber: donation.receiptNumber,
      donorName: donation.donorName,
      donorEmail: donation.donorEmail,
      amount: donation.amount,
      type: donation.type,
      ngoName: (donation.ngo as any)?.organizationName || 'NGO CONNECT Partner',
      date: donation.createdAt,
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Donation_Receipt_${donation.receiptNumber}.pdf`);
    res.send(pdfBuffer);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
