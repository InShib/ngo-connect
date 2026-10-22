import { Router } from 'express';
import * as authCtrl from '../controllers/authController';
import * as ngoCtrl from '../controllers/ngoController';
import * as campaignCtrl from '../controllers/campaignController';
import * as donationCtrl from '../controllers/donationController';
import * as volunteerCtrl from '../controllers/volunteerController';
import * as eventCtrl from '../controllers/eventController';
import * as beneficiaryCtrl from '../controllers/beneficiaryController';
import * as collabCtrl from '../controllers/collaborationController';
import * as inventoryCtrl from '../controllers/inventoryController';
import * as blogCtrl from '../controllers/blogController';
import * as aiCtrl from '../controllers/aiController';
import * as adminCtrl from '../controllers/adminController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

// Auth Routes
router.post('/auth/register', authCtrl.register);
router.post('/auth/login', authCtrl.login);
router.post('/auth/google', authCtrl.googleLogin);
router.get('/auth/me', protect, authCtrl.getMe);
router.put('/auth/profile', protect, authCtrl.updateProfile);

// NGO Routes
router.get('/ngos', ngoCtrl.getNgos);
router.get('/ngos/:id', ngoCtrl.getNgoById);
router.put('/ngos/profile', protect, authorize('ngo', 'admin'), ngoCtrl.updateNgoProfile);

// Campaign Routes
router.get('/campaigns', campaignCtrl.getCampaigns);
router.get('/campaigns/:id', campaignCtrl.getCampaignById);
router.post('/campaigns', protect, authorize('ngo', 'admin'), campaignCtrl.createCampaign);
router.post('/campaigns/:id/comments', protect, campaignCtrl.addCampaignComment);

// Donation Routes
router.post('/donations/money', protect, donationCtrl.createMoneyDonation);
router.post('/donations/item', protect, donationCtrl.createItemDonation);
router.get('/donations/my-donations', protect, donationCtrl.getMyDonations);
router.get('/donations/receipt/:id', donationCtrl.downloadReceipt);

// Volunteer & Event Routes
router.get('/volunteers/leaderboard', volunteerCtrl.getVolunteerLeaderboard);
router.get('/volunteers/me', protect, volunteerCtrl.getMyVolunteerProfile);
router.get('/events', eventCtrl.getEvents);
router.post('/events', protect, authorize('ngo', 'admin'), eventCtrl.createEvent);
router.post('/events/:id/apply', protect, eventCtrl.applyForEvent);
router.post('/events/:id/checkin', protect, authorize('ngo', 'admin'), eventCtrl.checkInVolunteer);

// Beneficiary & Collaboration Routes
router.post('/beneficiaries/requests', protect, beneficiaryCtrl.createRequest);
router.get('/beneficiaries/requests', beneficiaryCtrl.getRequests);
router.put('/beneficiaries/requests/:id/review', protect, authorize('ngo', 'admin'), beneficiaryCtrl.reviewRequest);
router.post('/collaborations', protect, authorize('ngo', 'admin'), collabCtrl.createCollaborationRequest);
router.get('/collaborations', protect, authorize('ngo', 'admin'), collabCtrl.getMyCollaborations);
router.put('/collaborations/:id/respond', protect, authorize('ngo', 'admin'), collabCtrl.respondToCollaboration);

// Inventory Routes
router.get('/inventory', protect, authorize('ngo', 'admin'), inventoryCtrl.getInventory);
router.post('/inventory', protect, authorize('ngo', 'admin'), inventoryCtrl.addInventoryItem);

// Blog Routes
router.get('/blogs', blogCtrl.getBlogs);
router.get('/blogs/:slug', blogCtrl.getBlogBySlug);
router.post('/blogs', protect, authorize('ngo', 'admin'), blogCtrl.createBlog);

// AI Engine Routes
router.post('/ai/chat', aiCtrl.aiChat);
router.post('/ai/generate-campaign', aiCtrl.generateCampaignDescription);

// Admin Control Panel Routes
router.get('/admin/stats', protect, authorize('admin'), adminCtrl.getAdminStats);
router.put('/admin/ngos/:id/verify', protect, authorize('admin'), adminCtrl.verifyNgo);
router.get('/admin/audit-logs', protect, authorize('admin'), adminCtrl.getAuditLogs);

export default router;
