import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { 
  Gift, 
  Share2, 
  Copy, 
  Check, 
  Users, 
  QrCode, 
  Sparkles, 
  Send, 
  MessageSquare, 
  Mail, 
  Award, 
  ArrowRight, 
  ExternalLink, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  Smartphone,
  Info,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ReferralInvite } from '../types';

export const ReferralProgramSection: React.FC = () => {
  const { 
    user, 
    referrals, 
    sendReferralInvite, 
    claimReferralReward, 
    simulateReferralSuccess, 
    resendReferralReminder 
  } = useAuth();
  const { showToast } = useStore();

  const referralCode = user?.referralCode || 'MILAD-AHMED-88';
  const referralLink = `https://miladwater.com/ref/${referralCode}`;

  // State
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [showQRModal, setShowQRModal] = useState<boolean>(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'claimable' | 'claimed'>('all');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Invite Form State
  const [friendName, setFriendName] = useState<string>('');
  const [friendContact, setFriendContact] = useState<string>('');
  const [inviteChannel, setInviteChannel] = useState<'whatsapp' | 'sms' | 'email'>('whatsapp');
  const [inviteNote, setInviteNote] = useState<string>('Get ৳50 OFF on 100% pure 20L water jars with UV-C disinfection & rapid doorstep delivery.');
  const [isSending, setIsSending] = useState<boolean>(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    showToast('success', 'Code Copied!', `${referralCode} copied to clipboard.`);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    showToast('success', 'Link Copied!', `Referral link copied to clipboard.`);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendName.trim() || !friendContact.trim()) {
      showToast('error', 'Incomplete Form', 'Please enter your friend\'s name and phone/email.');
      return;
    }

    setIsSending(true);
    try {
      await sendReferralInvite(friendName.trim(), friendContact.trim(), inviteChannel, inviteNote);
      showToast('success', 'Invitation Sent!', `Invited ${friendName} via ${inviteChannel.toUpperCase()}.`);
      setFriendName('');
      setFriendContact('');
      
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (err) {
      showToast('error', 'Failed to Send', 'Could not dispatch referral invitation.');
    } finally {
      setIsSending(false);
    }
  };

  const handleClaimReward = async (invite: ReferralInvite) => {
    await claimReferralReward(invite.id);
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });
    showToast('success', '৳50 Credited!', `৳${invite.rewardEarned} added to your Milad Wallet from ${invite.friendName}'s order.`);
  };

  const handleSimulateDelivery = async (invite: ReferralInvite) => {
    await simulateReferralSuccess(invite.id);
    showToast('info', 'First Delivery Simulated', `${invite.friendName} completed their first 20L order! You can now claim your ৳50 reward.`);
  };

  const handleResend = async (invite: ReferralInvite) => {
    await resendReferralReminder(invite.id);
    showToast('success', 'Reminder Sent', `Follow-up reminder sent to ${invite.friendName}.`);
  };

  const handleWhatsAppShare = () => {
    const text = `Hey! I use Milad Drinking Water for 100% pure 20L mineral water refills. Use my code *${referralCode}* to get ৳50 OFF your first delivery: ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleEmailShare = () => {
    const subject = `৳50 Discount on Pure Drinking Water from Milad`;
    const body = `Hi there,\n\nI recommend Milad Drinking Water for purified 20L bottled water. Use my referral code ${referralCode} to get ৳50 off your first delivery.\n\nOrder here: ${referralLink}\n\nStay hydrated!`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  // Stats calculation
  const totalInvites = referrals.length;
  const successfulReferrals = referrals.filter(r => r.status === 'ordered' || r.status === 'reward_claimed').length;
  const claimableInvites = referrals.filter(r => r.status === 'ordered');
  const claimableTotal = claimableInvites.reduce((acc, curr) => acc + curr.rewardEarned, 0);
  const totalEarned = referrals.filter(r => r.status === 'reward_claimed').reduce((acc, curr) => acc + curr.rewardEarned, 0);

  // Filtered referrals
  const filteredReferrals = referrals.filter(r => {
    if (filterStatus === 'pending') return r.status === 'invited' || r.status === 'registered';
    if (filterStatus === 'claimable') return r.status === 'ordered';
    if (filterStatus === 'claimed') return r.status === 'reward_claimed';
    return true;
  });

  const faqs = [
    {
      q: 'How does the ৳50 referral discount work?',
      a: 'When your friend signs up or enters your referral code during checkout, they get an instant ৳50 discount on their first water delivery. Once their delivery is marked completed, you get ৳50 credited directly to your Milad Wallet.'
    },
    {
      q: 'Is there a limit to how many friends I can invite?',
      a: 'No limit! You can invite as many neighbors, friends, and colleagues as you like. Every unique household that completes their first delivery earns you ৳50 wallet credits.'
    },
    {
      q: 'What can I use my referral wallet credits for?',
      a: 'Your Milad Wallet credits can be used directly to pay for one-time 20L/5L water jar refills, automatic weekly/monthly subscriptions, or bottle accessories (manual and automatic pumps).'
    },
    {
      q: 'Do referral credits expire?',
      a: 'Milad referral wallet balance never expires as long as your account remains active.'
    }
  ];

  return (
    <div className="space-y-8">
      
      {/* 1. Hero Card - Multi-color Vibrant Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-950 via-indigo-950 to-teal-950 text-white p-6 sm:p-10 border-2 border-cyan-400/40 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-gradient-to-br from-cyan-500/20 via-pink-500/20 to-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -top-10 w-60 h-60 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500/30 to-pink-500/30 border border-amber-400/50 text-amber-300 text-xs font-black uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-300" />
            <span>Milad Community Hydration Rewards</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-heading font-black tracking-tight text-white leading-tight">
            Give <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400 font-extrabold">৳50</span>, Get <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-300 font-extrabold">৳50</span> for Every Friend You Refer
          </h2>

          <p className="text-cyan-100/90 text-xs sm:text-sm leading-relaxed max-w-2xl font-medium">
            Share pure hydration with your neighbors and colleagues. Your friends get <strong className="text-amber-300 font-bold">৳50 OFF</strong> their first 20L water jar delivery, and you earn <strong className="text-emerald-300 font-bold">৳50 Wallet Credits</strong> the moment it arrives at their door!
          </p>

          {/* 3 Step Loop Visual with Vibrant Colored Nodes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-cyan-500/30">
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-br from-indigo-900/60 to-purple-900/60 border border-indigo-400/40 shadow-inner">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md">
                1
              </div>
              <p className="text-xs text-indigo-100 font-semibold">
                Share your unique referral code or invite link.
              </p>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-br from-amber-900/60 to-orange-900/60 border border-amber-400/40 shadow-inner">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center font-black text-sm shrink-0 shadow-md">
                2
              </div>
              <p className="text-xs text-amber-100 font-semibold">
                Friend gets <strong className="text-white">৳50 OFF</strong> first 20L water order.
              </p>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-br from-emerald-900/60 to-teal-900/60 border border-emerald-400/50 text-emerald-200 shadow-inner">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-slate-950 flex items-center justify-center font-black text-sm shrink-0 shadow-md">
                3
              </div>
              <p className="text-xs text-white font-bold">
                You get <strong className="text-emerald-300">৳50 credited</strong> to your Milad Wallet!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Referral Key Metrics - Multi-color cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Blue / Indigo */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-blue-500/10 to-white border-2 border-indigo-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-indigo-900">
            <span className="text-xs font-black uppercase tracking-wider">Friends Invited</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-heading font-black text-indigo-950">{totalInvites}</p>
          <p className="text-[11px] text-indigo-700 font-bold">Invitations shared</p>
        </div>

        {/* Card 2: Emerald */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-white border-2 border-emerald-300 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-emerald-900">
            <span className="text-xs font-black uppercase tracking-wider">Completed Deliveries</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-heading font-black text-emerald-950">{successfulReferrals}</p>
          <p className="text-[11px] text-emerald-700 font-extrabold">Delivered first water jars</p>
        </div>

        {/* Card 3: Amber / Gold */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-white border-2 border-amber-300 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-amber-900">
            <span className="text-xs font-black uppercase tracking-wider">Total Earned</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-xs">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-heading font-black text-amber-950">৳{totalEarned}</p>
          <p className="text-[11px] text-amber-800 font-bold">Credited to wallet to date</p>
        </div>

        {/* Card 4: Glowing Claimable - Pink/Rose to Emerald */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-500/20 via-teal-500/15 to-white border-2 border-emerald-400 shadow-md space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-emerald-900">
            <span className="text-xs font-black uppercase tracking-wider">Ready to Claim</span>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-heading font-black text-emerald-950">৳{claimableTotal}</p>
            {claimableInvites.length > 0 && (
              <button
                onClick={() => handleClaimReward(claimableInvites[0])}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-black shadow-md shadow-emerald-600/30 transition-all flex items-center gap-1 cursor-pointer animate-pulse"
              >
                <span>Claim All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <p className="text-[11px] text-emerald-800 font-extrabold">
            {claimableInvites.length > 0 ? `${claimableInvites.length} reward ready to claim!` : '0 pending claims'}
          </p>
        </div>

      </div>

      {/* 3. Share Center & Direct Invite Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: Code & Share Suite (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border-2 border-cyan-200 shadow-sm space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 text-[10px] font-black uppercase tracking-wider mb-2">
              <Share2 className="w-3 h-3" />
              <span>Share Center</span>
            </div>
            <h3 className="text-base sm:text-xl font-heading font-black text-slate-900">
              Your Exclusive Referral Code & Link
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Give this code to friends to type at checkout, or send them your direct invitation link.
            </p>
          </div>

          {/* Referral Code Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-500/15 via-teal-500/15 to-indigo-500/10 border-2 border-cyan-300 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] font-black text-cyan-900 uppercase tracking-widest">
                Referral Code
              </span>
              <p className="text-2xl sm:text-3xl font-mono font-black text-cyan-950 tracking-wider">
                {referralCode}
              </p>
            </div>

            <button
              onClick={handleCopyCode}
              className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                copiedCode 
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' 
                  : 'bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white shadow-md shadow-cyan-600/30'
              }`}
            >
              {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedCode ? 'Code Copied!' : 'Copy Referral Code'}</span>
            </button>
          </div>

          {/* Referral Link Field */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
              Shareable Direct Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={referralLink}
                className="w-full bg-slate-50 border-2 border-slate-200 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-bold select-all"
              />
              <button
                onClick={handleCopyLink}
                className={`px-5 py-2.5 rounded-xl font-black text-xs shrink-0 transition-all border cursor-pointer ${
                  copiedLink
                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs'
                    : 'bg-gradient-to-r from-slate-800 to-slate-900 hover:bg-slate-950 text-white border-slate-900'
                }`}
              >
                {copiedLink ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>

          {/* Quick Channels Buttons with Rich Branded Colors */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">
              Quick Share Channels
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={handleWhatsAppShare}
                className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-600 to-green-700 text-white font-black text-xs flex flex-col items-center gap-1.5 shadow-md shadow-emerald-600/20 hover:scale-102 transition-all cursor-pointer"
              >
                <MessageSquare className="w-5 h-5 text-white" />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={handleEmailShare}
                className="p-3.5 rounded-2xl bg-gradient-to-br from-cyan-600 to-sky-700 text-white font-black text-xs flex flex-col items-center gap-1.5 shadow-md shadow-cyan-600/20 hover:scale-102 transition-all cursor-pointer"
              >
                <Mail className="w-5 h-5 text-white" />
                <span>Email</span>
              </button>

              <button
                onClick={() => setShowQRModal(true)}
                className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white font-black text-xs flex flex-col items-center gap-1.5 shadow-md shadow-purple-600/20 hover:scale-102 transition-all cursor-pointer"
              >
                <QrCode className="w-5 h-5 text-white" />
                <span>QR Code</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-slate-950 font-black text-xs flex flex-col items-center gap-1.5 shadow-md shadow-orange-500/20 hover:scale-102 transition-all cursor-pointer"
              >
                <Share2 className="w-5 h-5 text-slate-950" />
                <span>Copy Link</span>
              </button>
            </div>
          </div>

          {/* Milestone Tier Progress */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-pink-500/10 border-2 border-amber-300 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-lg bg-amber-500 text-slate-950">
                  <Award className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-black text-amber-950 uppercase tracking-wider">
                  Referral Milestone: Purity Champion (Tier 2)
                </h4>
              </div>
              <span className="text-xs font-black text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-full">
                {successfulReferrals}/3 Friends
              </span>
            </div>

            {/* Vibrant Multi-stop Progress Bar */}
            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 h-2.5 rounded-full transition-all duration-500 shadow-xs" 
                style={{ width: `${Math.min(100, (successfulReferrals / 3) * 100)}%` }} 
              />
            </div>

            <p className="text-[11px] text-amber-900 leading-relaxed font-semibold">
              Refer 1 more friend to unlock the <strong className="text-amber-950 font-black">৳200 Milestone Bonus</strong> and a <strong className="text-amber-950 font-black">Free Automatic Electric Water Dispenser Pump</strong>!
            </p>
          </div>
        </div>

        {/* Right Col: Direct Invite Form (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border-2 border-teal-200 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-[10px] font-black uppercase tracking-wider mb-2">
              <Send className="w-3 h-3" />
              <span>Instant Dispatch</span>
            </div>
            <h3 className="text-base sm:text-lg font-heading font-black text-slate-900">
              Direct Friend Invitation
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Enter your friend's details to log an invitation and dispatch a ready-to-use discount link.
            </p>
          </div>

          <form onSubmit={handleSendInvite} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Friend's Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Mahfuz Alam or Farhana Yasmin"
                value={friendName}
                onChange={(e) => setFriendName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Phone Number or Email
              </label>
              <input
                type="text"
                required
                placeholder="+880 17XX-XXXXXX or email@domain.com"
                value={friendContact}
                onChange={(e) => setFriendContact(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Invitation Channel
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['whatsapp', 'sms', 'email'] as const).map((ch) => (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => setInviteChannel(ch)}
                    className={`py-2 rounded-xl text-xs font-black border-2 capitalize transition-all cursor-pointer ${
                      inviteChannel === ch
                        ? 'bg-cyan-600 text-white border-cyan-600 shadow-md shadow-cyan-600/20'
                        : 'border-slate-200 text-slate-700 hover:border-cyan-300'
                    }`}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Personal Note / Recommendation
              </label>
              <textarea
                rows={2}
                value={inviteNote}
                onChange={(e) => setInviteNote(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 hover:from-cyan-700 hover:to-emerald-700 text-white font-black text-xs shadow-lg shadow-cyan-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-101"
            >
              <Send className="w-4 h-4" />
              <span>{isSending ? 'Dispatching...' : 'Send ৳50 Invite Now'}</span>
            </button>
          </form>

          <div className="p-3 bg-cyan-50/80 rounded-2xl border border-cyan-200 flex items-center gap-2 text-[11px] text-cyan-900 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>We never spam or share contacts with third parties.</span>
          </div>
        </div>

      </div>

      {/* 4. Referral Tracker & Activity Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base sm:text-lg font-heading font-extrabold text-slate-900">
              Referral Activity & Reward Claim Tracker
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Track your invited contacts, live delivery progress, and claim your ৳50 wallet credits.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterStatus === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({referrals.length})
            </button>

            <button
              onClick={() => setFilterStatus('claimable')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterStatus === 'claimable' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ready ({claimableInvites.length})
            </button>

            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterStatus === 'pending' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pending
            </button>

            <button
              onClick={() => setFilterStatus('claimed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterStatus === 'claimed' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Claimed
            </button>
          </div>
        </div>

        {/* Table */}
        {filteredReferrals.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="pb-3">Friend</th>
                  <th className="pb-3">Channel</th>
                  <th className="pb-3">Invited Date</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Reward</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReferrals.map((invite) => (
                  <tr key={invite.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4">
                      <div className="font-bold text-slate-900">{invite.friendName}</div>
                      <div className="text-[11px] text-slate-500">{invite.friendContact}</div>
                    </td>

                    <td className="py-4">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase">
                        {invite.channel}
                      </span>
                    </td>

                    <td className="py-4 text-slate-600">
                      <div>{new Date(invite.invitedAt).toLocaleDateString()}</div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(invite.invitedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>

                    <td className="py-4">
                      {invite.status === 'invited' && (
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] inline-flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>Invite Sent</span>
                        </span>
                      )}
                      {invite.status === 'registered' && (
                        <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px] inline-flex items-center gap-1">
                          <Users className="w-3 h-3 text-blue-600" />
                          <span>Signed Up</span>
                        </span>
                      )}
                      {invite.status === 'ordered' && (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] inline-flex items-center gap-1 animate-pulse">
                          <Sparkles className="w-3 h-3 text-emerald-600" />
                          <span>Delivered (Ready to Claim)</span>
                        </span>
                      )}
                      {invite.status === 'reward_claimed' && (
                        <span className="px-2.5 py-1 rounded-full bg-cyan-100 text-cyan-800 font-bold text-[10px] inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-cyan-600" />
                          <span>৳50 Credited to Wallet</span>
                        </span>
                      )}
                    </td>

                    <td className="py-4 font-bold text-slate-900">
                      <span className={invite.status === 'reward_claimed' || invite.status === 'ordered' ? 'text-emerald-600 font-extrabold' : 'text-slate-500'}>
                        +৳{invite.rewardEarned}
                      </span>
                    </td>

                    <td className="py-4 text-right">
                      {invite.status === 'ordered' ? (
                        <button
                          onClick={() => handleClaimReward(invite)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] shadow-sm shadow-emerald-600/20 transition-all inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Gift className="w-3.5 h-3.5" />
                          <span>Claim ৳50</span>
                        </button>
                      ) : invite.status === 'reward_claimed' ? (
                        <span className="text-[11px] font-bold text-slate-400">
                          Deposited
                        </span>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <button
                            onClick={() => handleSimulateDelivery(invite)}
                            title="Simulate friend placing their first order & receiving delivery"
                            className="px-2.5 py-1 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-700 font-bold text-[10px] transition-colors"
                          >
                            Simulate 1st Order
                          </button>
                          <button
                            onClick={() => handleResend(invite)}
                            title="Resend invitation reminder"
                            className="p-1 text-slate-400 hover:text-slate-600"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400 space-y-2">
            <Users className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-xs font-bold text-slate-600">No referral invites found in this view.</p>
            <p className="text-[11px]">Send an invite above to earn discounts on your next water refills.</p>
          </div>
        )}
      </div>

      {/* 5. FAQ Accordion */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-heading font-extrabold text-slate-900">
          Frequently Asked Questions About Milad Referrals
        </h3>
        
        <div className="divide-y divide-slate-100">
          {faqs.map((faq, index) => {
            const isOpen = expandedFaq === index;
            return (
              <div key={index} className="py-3.5">
                <button
                  type="button"
                  onClick={() => setExpandedFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between text-left text-xs font-bold text-slate-800 hover:text-cyan-700 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-cyan-600" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {isOpen && (
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed pl-2 border-l-2 border-cyan-500">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-5 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-sm font-bold text-slate-900">Scan to Order with ৳50 Discount</h4>
              <button 
                onClick={() => setShowQRModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* QR Code Graphic Box */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 inline-block shadow-inner">
              {/* Visual simulated QR code with Milad drop icon */}
              <div className="w-48 h-48 bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-col items-center justify-center relative">
                <div className="grid grid-cols-6 gap-1 w-full h-full p-2 bg-slate-900 rounded-lg">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`rounded-xs ${
                        (i % 2 === 0 || i % 5 === 0 || i === 0 || i === 5 || i === 30 || i === 35) 
                          ? 'bg-white' 
                          : 'bg-transparent'
                      }`} 
                    />
                  ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-xl bg-cyan-600 text-white font-extrabold text-xs flex items-center justify-center shadow-lg ring-4 ring-white">
                    M
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-900">{referralCode}</p>
              <p className="text-[11px] text-slate-500">
                Let your friends scan with their camera to open the order page with ৳50 promo pre-applied.
              </p>
            </div>

            <button
              onClick={() => {
                handleCopyLink();
                setShowQRModal(false);
              }}
              className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs"
            >
              Copy Link & Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
