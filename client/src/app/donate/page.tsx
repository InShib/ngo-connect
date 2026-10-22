'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Heart, Gift, ShieldCheck, Download, QrCode, CheckCircle2, Truck, Sparkles, Building2 } from 'lucide-react';
import { api, getStoredUser } from '@/lib/api';

export default function DonatePage() {
  const searchParams = useSearchParams();
  const preselectedNgo = searchParams.get('ngoId');
  const preselectedCampaign = searchParams.get('campaignId');

  const [activeTab, setActiveTab] = useState<'money' | 'item'>('money');
  const [ngos, setNgos] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  // Money Donation Form state
  const [moneyForm, setMoneyForm] = useState({
    ngoId: preselectedNgo || '',
    campaignId: preselectedCampaign || '',
    amount: 1000,
    paymentMethod: 'UPI',
    isAnonymous: false,
    notes: '',
  });

  // Item Donation Form state
  const [itemForm, setItemForm] = useState({
    ngoId: preselectedNgo || '',
    itemName: 'Warm Blankets & Clothes',
    category: 'clothes',
    quantity: 10,
    street: '',
    city: '',
    state: '',
    phone: '',
    notes: '',
  });

  const [donationResult, setDonationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUser(getStoredUser());
    fetchNgos();
  }, []);

  const fetchNgos = async () => {
    try {
      const res = await api.get('/ngos?status=verified');
      if (res.data.success) {
        setNgos(res.data.data);
        if (!preselectedNgo && res.data.data.length > 0) {
          setMoneyForm((prev) => ({ ...prev, ngoId: res.data.data[0]._id }));
          setItemForm((prev) => ({ ...prev, ngoId: res.data.data[0]._id }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMoneySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert('Please sign in to process donation and receive PDF receipt.');
    setLoading(true);

    try {
      const res = await api.post('/donations/money', moneyForm);
      if (res.data.success) {
        setDonationResult(res.data.data);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Donation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert('Please sign in to schedule doorstep item pickup.');
    setLoading(true);

    try {
      const res = await api.post('/donations/item', {
        ngoId: itemForm.ngoId,
        items: [{ name: itemForm.itemName, category: itemForm.category, quantity: itemForm.quantity, unit: 'items' }],
        pickupAddress: {
          street: itemForm.street || 'Main Street',
          city: itemForm.city || 'Delhi',
          state: itemForm.state || 'Delhi',
          pincode: '110001',
          phone: itemForm.phone || '9876543210',
        },
        notes: itemForm.notes,
      });

      if (res.data.success) {
        setDonationResult(res.data.data);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Item pickup scheduling failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mx-auto">
          <ShieldCheck className="w-4 h-4" />
          <span>100% Tax Exempt (Section 80G) & Doorstep Pickup</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          Make a Social <span className="gradient-text">Contribution</span>
        </h1>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          Donate money directly to verified NGOs or schedule a doorstep pickup for physical supplies (food, clothes, books, medical kits).
        </p>
      </div>

      {/* Mode Selector Tabs */}
      <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl max-w-md mx-auto text-xs font-bold">
        <button
          onClick={() => { setActiveTab('money'); setDonationResult(null); }}
          className={`py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
            activeTab === 'money' ? 'bg-emerald-500 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Heart className="w-4 h-4 fill-current" />
          <span>Financial Donation</span>
        </button>

        <button
          onClick={() => { setActiveTab('item'); setDonationResult(null); }}
          className={`py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
            activeTab === 'item' ? 'bg-teal-500 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Gift className="w-4 h-4" />
          <span>Item Doorstep Pickup</span>
        </button>
      </div>

      {/* Donation Success Receipt State */}
      {donationResult ? (
        <div className="glass-panel p-8 space-y-6 text-center border-emerald-500/40">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white">Donation Processed Successfully!</h2>
            <p className="text-xs text-slate-400">Receipt Number: {donationResult.receiptNumber}</p>
          </div>

          {/* Receipt / QR Code Box */}
          <div className="glass-card p-6 max-w-sm mx-auto space-y-4 border-slate-700">
            {donationResult.qrCodeData && (
              <img src={donationResult.qrCodeData} alt="QR Code Barcode" className="w-36 h-36 mx-auto rounded-xl border border-slate-700 p-2 bg-white" />
            )}
            <div className="text-xs text-slate-300 font-medium">
              {donationResult.type === 'money' ? (
                <>Amount: <span className="text-emerald-400 font-bold">₹{donationResult.amount?.toLocaleString('en-IN')}</span></>
              ) : (
                <>Items Count: <span className="text-teal-400 font-bold">{donationResult.items?.length || 1} Package</span></>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {donationResult.type === 'money' && (
              <a
                href={`http://localhost:5000/api/v1/donations/receipt/${donationResult._id}`}
                target="_blank"
                rel="noreferrer"
                className="btn-primary py-3 px-6 text-xs"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF 80G Receipt</span>
              </a>
            )}
            <button onClick={() => setDonationResult(null)} className="btn-secondary py-3 px-6 text-xs">
              Make Another Donation
            </button>
          </div>
        </div>
      ) : (
        /* Form View */
        <div className="glass-panel p-8">
          {activeTab === 'money' ? (
            <form onSubmit={handleMoneySubmit} className="space-y-6 text-xs">
              <div className="space-y-2">
                <label className="font-semibold text-slate-300">Select Beneficiary NGO</label>
                <select
                  value={moneyForm.ngoId}
                  onChange={(e) => setMoneyForm({ ...moneyForm, ngoId: e.target.value })}
                  className="glass-input w-full bg-slate-900 cursor-pointer"
                  required
                >
                  {ngos.map((n) => (
                    <option key={n._id} value={n._id}>
                      {n.organizationName} ({n.city})
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount Quick Select Pills */}
              <div className="space-y-2">
                <label className="font-semibold text-slate-300">Donation Amount (INR)</label>
                <div className="grid grid-cols-4 gap-2">
                  {[500, 1000, 2500, 5000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setMoneyForm({ ...moneyForm, amount: amt })}
                      className={`py-2.5 rounded-xl border font-bold text-xs transition-all ${
                        moneyForm.amount === amt
                          ? 'bg-emerald-500 text-slate-950 border-emerald-500'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  required
                  value={moneyForm.amount}
                  onChange={(e) => setMoneyForm({ ...moneyForm, amount: Number(e.target.value) })}
                  className="glass-input w-full mt-2"
                  placeholder="Custom amount..."
                />
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-slate-300">Payment Gateway Simulation</label>
                <div className="grid grid-cols-3 gap-2">
                  {['UPI', 'Card', 'NetBanking'].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setMoneyForm({ ...moneyForm, paymentMethod: method })}
                      className={`py-2.5 rounded-xl border font-semibold text-xs transition-all ${
                        moneyForm.paymentMethod === method
                          ? 'bg-slate-800 border-emerald-500 text-emerald-400'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-xs font-bold">
                {loading ? 'Processing Transaction...' : `Donate ₹${moneyForm.amount.toLocaleString('en-IN')} & Issue Receipt`}
              </button>
            </form>
          ) : (
            /* Item Pickup Form */
            <form onSubmit={handleItemSubmit} className="space-y-6 text-xs">
              <div className="space-y-2">
                <label className="font-semibold text-slate-300">Recipient NGO</label>
                <select
                  value={itemForm.ngoId}
                  onChange={(e) => setItemForm({ ...itemForm, ngoId: e.target.value })}
                  className="glass-input w-full bg-slate-900 cursor-pointer"
                  required
                >
                  {ngos.map((n) => (
                    <option key={n._id} value={n._id}>
                      {n.organizationName} ({n.city})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-semibold text-slate-300">Item Name / Description</label>
                  <input
                    type="text"
                    required
                    value={itemForm.itemName}
                    onChange={(e) => setItemForm({ ...itemForm, itemName: e.target.value })}
                    placeholder="e.g. 20 Woolen Jackets & Blankets"
                    className="glass-input w-full"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Category</label>
                  <select
                    value={itemForm.category}
                    onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
                    className="glass-input w-full bg-slate-900"
                  >
                    <option value="clothes">Clothes</option>
                    <option value="food">Food Items</option>
                    <option value="books">Books & Stationery</option>
                    <option value="medical_supplies">Medical Supplies</option>
                    <option value="electronics">Electronics</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Doorstep Pickup Street Address</label>
                <input
                  type="text"
                  required
                  value={itemForm.street}
                  onChange={(e) => setItemForm({ ...itemForm, street: e.target.value })}
                  placeholder="House 42, Sector 15"
                  className="glass-input w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">City</label>
                  <input
                    type="text"
                    required
                    value={itemForm.city}
                    onChange={(e) => setItemForm({ ...itemForm, city: e.target.value })}
                    placeholder="New Delhi"
                    className="glass-input w-full"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Contact Phone for Pickup Driver</label>
                  <input
                    type="tel"
                    required
                    value={itemForm.phone}
                    onChange={(e) => setItemForm({ ...itemForm, phone: e.target.value })}
                    placeholder="+91 9876543210"
                    className="glass-input w-full"
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-xs font-bold">
                <Truck className="w-4 h-4" />
                <span>{loading ? 'Scheduling...' : 'Schedule Doorstep Pickup & Issue Barcode'}</span>
              </button>
            </form>
          )}
        </div>
      )}

    </div>
  );
}
