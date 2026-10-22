import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser, UserRole } from '../models/User';
import NGO from '../models/NGO';
import Volunteer from '../models/Volunteer';
import { AuthRequest } from '../middleware/auth';

const generateToken = (id: string, role: string): string => {
  const secret = process.env.JWT_SECRET || 'ngo_connect_super_secret_jwt_key_2026_enterprise_production';
  return jwt.sign({ id, role }, secret, { expiresIn: '7d' });
};

// @desc Register User (Admin, NGO, Volunteer, Donor, Beneficiary)
// @route POST /api/v1/auth/register
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role, phone, address, city, state, organizationName, registrationNumber, mission } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ success: false, message: 'User with this email already exists' });
      return;
    }

    const userRole: UserRole = role || 'donor';
    const newUser = await User.create({
      name,
      email,
      password,
      role: userRole,
      phone: phone || '',
      address: address || '',
      city: city || '',
      state: state || '',
      isVerified: true, // Default active for seamless production demo
    });

    // If registered as NGO, initialize NGO entity
    if (userRole === 'ngo') {
      await NGO.create({
        user: newUser._id,
        organizationName: organizationName || `${name} Organization`,
        registrationNumber: registrationNumber || `REG-${Date.now().toString().slice(-6)}`,
        mission: mission || 'Empowering communities through technology and transparent social initiatives.',
        vision: 'A world where every community receives immediate support and resources.',
        description: 'Dedicated non-profit working towards social transformation.',
        verificationStatus: 'verified', // Auto-verify seed/registered NGOs for easy testing
        workingAreas: ['Education', 'Healthcare', 'Food Security'],
        contactEmail: email,
        contactPhone: phone || '+91 9876543210',
        address: address || '123 Tech Park Road',
        city: city || 'New Delhi',
        state: state || 'Delhi',
        pincode: '110001',
      });
    }

    // If registered as Volunteer, initialize Volunteer profile
    if (userRole === 'volunteer') {
      await Volunteer.create({
        user: newUser._id,
        skills: ['Community Outreach', 'Teaching', 'Event Management', 'First Aid'],
        languages: ['English', 'Hindi'],
        availability: 'flexible',
      });
    }

    const token = generateToken(newUser._id.toString(), newUser.role);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Login User
// @route POST /api/v1/auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Please provide email and password' });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const token = generateToken(user._id.toString(), user.role);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        city: user.city,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Google OAuth Login / Register Simulation
// @route POST /api/v1/auth/google
export const googleLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, name, avatar, googleId, role } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: name || 'Google User',
        email,
        role: role || 'donor',
        avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        googleId: googleId || `google_${Date.now()}`,
        isVerified: true,
      });
    }

    const token = generateToken(user._id.toString(), user.role);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get Current Logged-In User Profile
// @route GET /api/v1/auth/me
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    let extraData: any = {};
    if (req.user.role === 'ngo') {
      extraData.ngo = await NGO.findOne({ user: req.user._id });
    } else if (req.user.role === 'volunteer') {
      extraData.volunteer = await Volunteer.findOne({ user: req.user._id });
    }

    res.status(200).json({
      success: true,
      user: req.user,
      ...extraData,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update Profile
// @route PUT /api/v1/auth/profile
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    const { name, phone, address, city, state, bio, avatar } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (city) user.city = city;
    if (state) user.state = state;
    if (bio) user.bio = bio;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.status(200).json({
      success: true,
      user,
      message: 'Profile updated successfully',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
