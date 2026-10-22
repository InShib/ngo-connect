import { Request, Response } from 'express';
import Inventory from '../models/Inventory';
import NGO from '../models/NGO';
import { AuthRequest } from '../middleware/auth';

// @desc Get NGO Inventory
// @route GET /api/v1/inventory
export const getInventory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    const ngo = await NGO.findOne({ user: req.user._id });
    if (!ngo) {
      res.status(403).json({ success: false, message: 'NGO not found' });
      return;
    }

    const items = await Inventory.find({ ngo: ngo._id }).sort({ updatedAt: -1 });
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Add or Update Inventory Item
// @route POST /api/v1/inventory
export const addInventoryItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    const ngo = await NGO.findOne({ user: req.user._id });
    if (!ngo) {
      res.status(403).json({ success: false, message: 'NGO not found' });
      return;
    }

    const { itemName, category, quantity, unit, location, lowStockAlert, expiryDate, notes } = req.body;

    const item = await Inventory.create({
      ngo: ngo._id,
      itemName,
      category,
      quantity,
      unit: unit || 'units',
      location: location || 'Warehouse A',
      lowStockAlert: lowStockAlert || 10,
      expiryDate,
      notes,
    });

    res.status(201).json({ success: true, data: item, message: 'Inventory item recorded successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
