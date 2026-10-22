import { Request, Response } from 'express';
import Volunteer from '../models/Volunteer';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

// @desc Get Volunteer Leaderboard & Top Contributors
// @route GET /api/v1/volunteers/leaderboard
export const getVolunteerLeaderboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const leaderboard = await Volunteer.find()
      .populate('user', 'name avatar city state')
      .sort({ totalHoursWorked: -1, completedEventsCount: -1 })
      .limit(10);

    res.status(200).json({ success: true, data: leaderboard });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get Current Volunteer Profile & Badges
// @route GET /api/v1/volunteers/me
export const getMyVolunteerProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    let volunteer = await Volunteer.findOne({ user: req.user._id }).populate('user', 'name email avatar phone');
    if (!volunteer) {
      volunteer = await Volunteer.create({
        user: req.user._id,
        skills: ['Community Support', 'Teaching'],
        languages: ['English'],
      });
    }

    res.status(200).json({ success: true, data: volunteer });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
