import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import NGO from '../models/NGO';
import Campaign from '../models/Campaign';
import Donation from '../models/Donation';
import Volunteer from '../models/Volunteer';
import Event from '../models/Event';
import BeneficiaryRequest from '../models/BeneficiaryRequest';
import Inventory from '../models/Inventory';
import Blog from '../models/Blog';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ngo_connect';

export const seedDatabase = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(MONGO_URI);
    }
    console.log('[Seed] Database connected.');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      NGO.deleteMany({}),
      Campaign.deleteMany({}),
      Donation.deleteMany({}),
      Volunteer.deleteMany({}),
      Event.deleteMany({}),
      BeneficiaryRequest.deleteMany({}),
      Inventory.deleteMany({}),
      Blog.deleteMany({}),
    ]);

    console.log('[Seed] Cleared existing records.');

    // 1. Create Core Users
    const adminUser = await User.create({
      name: 'System Admin',
      email: 'admin@ngoconnect.org',
      password: 'admin123',
      role: 'admin',
      city: 'New Delhi',
    });

    const ngoUser1 = await User.create({
      name: 'Green Earth Foundation',
      email: 'contact@greenearth.org',
      password: 'ngo123',
      role: 'ngo',
      city: 'Mumbai',
    });

    const ngoUser2 = await User.create({
      name: 'Food For All Trust',
      email: 'support@foodforall.org',
      password: 'ngo123',
      role: 'ngo',
      city: 'Bengaluru',
    });

    const donorUser = await User.create({
      name: 'Aarav Sharma',
      email: 'aarav.donor@gmail.com',
      password: 'donor123',
      role: 'donor',
      city: 'Delhi',
    });

    const volUser = await User.create({
      name: 'Priya Patel',
      email: 'priya.vol@gmail.com',
      password: 'vol123',
      role: 'volunteer',
      city: 'Mumbai',
    });

    const beneficiaryUser = await User.create({
      name: 'Ramesh Kumar',
      email: 'ramesh.ben@gmail.com',
      password: 'user123',
      role: 'beneficiary',
      city: 'Delhi',
    });

    // 2. Create NGO Profiles
    const ngo1 = await NGO.create({
      user: ngoUser1._id,
      organizationName: 'Green Earth Foundation',
      registrationNumber: 'REG-2024-8849',
      mission: 'Planting 1,000,000 trees and protecting urban biodiversity across India.',
      vision: 'A greener, cleaner, carbon-neutral future.',
      description: 'Dedicated environmental non-profit focusing on urban afforestation, plastic waste recycling, and solar energy drives.',
      verificationStatus: 'verified',
      workingAreas: ['Environment', 'Tree Plantation', 'Disaster Relief'],
      contactEmail: 'contact@greenearth.org',
      contactPhone: '+91 9876543210',
      address: '45 Eco Park Road, Bandra',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
      impactMetrics: {
        livesImpacted: 15400,
        campaignsCompleted: 12,
        totalFundsRaised: 850000,
        volunteersEngaged: 340,
      },
    });

    const ngo2 = await NGO.create({
      user: ngoUser2._id,
      organizationName: 'Food For All Trust',
      registrationNumber: 'REG-2025-1029',
      mission: 'Eliminating hunger by redistributing surplus food and providing daily warm meals.',
      vision: 'Zero hunger in every city and rural community.',
      description: 'A tech-enabled food rescue network feeding over 5,000 daily wage earners and underprivileged children every day.',
      verificationStatus: 'verified',
      workingAreas: ['Food Hunger', 'Healthcare', 'Education'],
      contactEmail: 'support@foodforall.org',
      contactPhone: '+91 9812345678',
      address: '88 Sunshine Avenue, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
      impactMetrics: {
        livesImpacted: 42000,
        campaignsCompleted: 28,
        totalFundsRaised: 1420000,
        volunteersEngaged: 890,
      },
    });

    // 3. Create Campaigns
    const campaign1 = await Campaign.create({
      ngo: ngo1._id,
      title: 'Mission 100,000 Urban Trees Campaign',
      slug: 'mission-100000-urban-trees',
      tagline: 'Join us to plant 100,000 native trees to combat urban heat waves.',
      description: 'Our rapid urban afforestation campaign plants dense Miyawaki forests in urban schools, parks, and highway belts.',
      category: 'environment',
      targetAmount: 500000,
      raisedAmount: 325000,
      volunteerNeededCount: 50,
      volunteerRegisteredCount: 32,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'active',
      isFeatured: true,
      isUrgent: false,
      bannerImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
    });

    const campaign2 = await Campaign.create({
      ngo: ngo2._id,
      title: 'Zero Hunger Slum Kitchen Drive',
      slug: 'zero-hunger-slum-kitchen-drive',
      tagline: 'Providing 10,000 warm nutritious meals to displaced families.',
      description: 'Emergency food kit distribution providing rice, pulses, oil, and nutrition supplements to children in need.',
      category: 'food_hunger',
      targetAmount: 300000,
      raisedAmount: 280000,
      volunteerNeededCount: 30,
      volunteerRegisteredCount: 28,
      startDate: new Date(),
      endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      status: 'active',
      isFeatured: true,
      isUrgent: true,
      bannerImage: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
    });

    // 4. Create Sample Donations
    await Donation.create({
      donor: donorUser._id,
      donorName: donorUser.name,
      donorEmail: donorUser.email,
      ngo: ngo1._id,
      campaign: campaign1._id,
      type: 'money',
      amount: 10000,
      paymentMethod: 'UPI',
      transactionId: 'TXN-99881122',
      receiptNumber: 'REC-2026-0001',
    });

    await Donation.create({
      donor: donorUser._id,
      donorName: donorUser.name,
      donorEmail: donorUser.email,
      ngo: ngo2._id,
      type: 'item',
      items: [{ name: 'Warm Clothes & Blankets', category: 'clothes', quantity: 25, unit: 'pcs' }],
      trackingStatus: 'scheduled',
      receiptNumber: 'ITEM-REC-2026-0002',
    });

    // 5. Create Volunteer Profiles & Events
    await Volunteer.create({
      user: volUser._id,
      skills: ['Tree Plantation', 'First Aid', 'Public Relations'],
      languages: ['English', 'Marathi', 'Hindi'],
      totalHoursWorked: 28,
      badgeLevel: 'Gold',
      completedEventsCount: 7,
    });

    await Event.create({
      ngo: ngo1._id,
      title: 'Mega Weekend Tree Plantation Drive',
      description: 'Join 100+ volunteers planting saplings at Sanjay Gandhi National Park.',
      category: 'tree_plantation',
      bannerImage: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80',
      location: {
        venue: 'Sanjay Gandhi National Park Gate 2',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400066',
      },
      eventDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      startTime: '08:00 AM',
      endTime: '12:00 PM',
      volunteersRequired: 40,
      qrCheckInCode: 'QR-TREE-2026',
    });

    // 6. Create Beneficiary Requests
    await BeneficiaryRequest.create({
      user: beneficiaryUser._id,
      fullName: 'Ramesh Kumar',
      contactPhone: '+91 9711223344',
      address: 'Block C, Seelampur',
      city: 'Delhi',
      state: 'Delhi',
      category: 'food',
      urgency: 'high',
      title: 'Urgent Ration Assistance for 5-member family',
      description: 'Lost daily wage job due to seasonal illness. Need essential monthly ration kit.',
      status: 'pending',
    });

    // 7. Create NGO Inventories
    await Inventory.create({
      ngo: ngo2._id,
      itemName: 'Rice Bags (25kg)',
      category: 'food',
      quantity: 120,
      unit: 'bags',
      location: 'Warehouse Central',
      lowStockAlert: 20,
    });

    // 8. Create Blog Posts
    await Blog.create({
      title: 'How Technology is Revolutionizing NGO Transparency in 2026',
      slug: 'how-technology-is-revolutionizing-ngo-transparency-in-2026',
      category: 'ngo_news',
      authorName: 'NGO CONNECT Editorial',
      content: 'Digital platforms like NGO CONNECT bridge the trust gap between donors and non-profits by introducing real-time item tracking, QR verification, and automated 80G PDF receipts...',
      excerpt: 'Discover how real-time logistics and open data are creating unprecedented donor trust.',
      coverImage: 'https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?auto=format&fit=crop&w=1200&q=80',
      tags: ['Transparency', 'Technology', 'Impact'],
    });

    console.log('[Seed] Database populated successfully with test accounts!');
  } catch (error) {
    console.error('[Seed Error]', error);
  }
};

if (require.main === module) {
  seedDatabase().then(() => mongoose.disconnect());
}
