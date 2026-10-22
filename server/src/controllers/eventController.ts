import { Request, Response } from 'express';
import Event from '../models/Event';
import NGO from '../models/NGO';
import Volunteer from '../models/Volunteer';
import { AuthRequest } from '../middleware/auth';

// @desc Get list of upcoming events & campaigns
// @route GET /api/v1/events
export const getEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, city, status } = req.query;
    let query: any = {};

    if (category) query.category = category;
    if (city) query['location.city'] = { $regex: city, $options: 'i' };
    if (status) query.status = status;

    const events = await Event.find(query)
      .populate('ngo', 'organizationName logo city state contactPhone')
      .sort({ eventDate: 1 });

    res.status(200).json({ success: true, count: events.length, data: events });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Create Event (NGO only)
// @route POST /api/v1/events
export const createEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    const ngo = await NGO.findOne({ user: req.user._id });
    if (!ngo) {
      res.status(403).json({ success: false, message: 'Only verified NGOs can host events' });
      return;
    }

    const qrCheckInCode = `QR-EVENT-${Date.now().toString().slice(-6)}`;

    const event = await Event.create({
      ...req.body,
      ngo: ngo._id,
      qrCheckInCode,
    });

    res.status(201).json({ success: true, data: event, message: 'Event created successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Register for Event (Volunteer)
// @route POST /api/v1/events/:id/apply
export const applyForEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      res.status(404).json({ success: false, message: 'Event not found' });
      return;
    }

    const alreadyRegistered = event.attendees.some(a => a.user.toString() === req.user?._id.toString());
    if (alreadyRegistered) {
      res.status(400).json({ success: false, message: 'You are already registered for this event' });
      return;
    }

    event.attendees.push({
      user: req.user._id,
      userName: req.user.name,
      userEmail: req.user.email,
      status: 'registered',
    });

    await event.save();

    res.status(200).json({ success: true, message: 'Registered for event successfully! QR pass generated.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Scan QR Code & Check In Volunteer
// @route POST /api/v1/events/:id/checkin
export const checkInVolunteer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { qrCodeSecret, volunteerUserId } = req.body;

    const event = await Event.findById(req.params.id);
    if (!event) {
      res.status(404).json({ success: false, message: 'Event not found' });
      return;
    }

    if (event.qrCheckInCode !== qrCodeSecret) {
      res.status(400).json({ success: false, message: 'Invalid Event QR Check-in code' });
      return;
    }

    const attendeeIndex = event.attendees.findIndex(a => a.user.toString() === volunteerUserId);
    if (attendeeIndex === -1) {
      res.status(400).json({ success: false, message: 'Volunteer is not registered for this event' });
      return;
    }

    event.attendees[attendeeIndex].status = 'attended';
    event.attendees[attendeeIndex].checkInTime = new Date();
    await event.save();

    // Award 4 hours and check badges for volunteer
    const volunteer = await Volunteer.findOne({ user: volunteerUserId });
    if (volunteer) {
      volunteer.totalHoursWorked += 4;
      volunteer.completedEventsCount += 1;

      if (volunteer.totalHoursWorked >= 50) volunteer.badgeLevel = 'Hero';
      else if (volunteer.totalHoursWorked >= 30) volunteer.badgeLevel = 'Platinum';
      else if (volunteer.totalHoursWorked >= 15) volunteer.badgeLevel = 'Gold';
      else if (volunteer.totalHoursWorked >= 5) volunteer.badgeLevel = 'Silver';

      await volunteer.save();
    }

    res.status(200).json({
      success: true,
      message: 'Attendance verified via QR Code! 4 Volunteer Hours awarded.',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
