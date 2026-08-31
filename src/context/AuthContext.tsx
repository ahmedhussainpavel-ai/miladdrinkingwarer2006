import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  fbSignOut, 
  onAuthStateChanged,
  db,
  doc,
  setDoc,
  getDoc
} from '../lib/firebase';
import { UserProfile, Role, Address, ReferralInvite } from '../types';
import { DEFAULT_SAMPLE_ADDRESSES, DEFAULT_REFERRAL_INVITES } from '../lib/mockData';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  loginWithPhoneAndName: (displayName: string, phone: string, area?: string, addressLine?: string) => Promise<UserProfile>;
  signOut: () => Promise<void>;
  loginAsDemoUser: (role: Role) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  addSavedAddress: (address: Omit<Address, 'id'>) => Promise<void>;
  removeSavedAddress: (addressId: string) => Promise<void>;
  updateWalletBalance: (amountDelta: number) => Promise<void>;
  updateEmptyJars: (delta20L: number, delta5L: number) => Promise<void>;
  // Referral Program
  referrals: ReferralInvite[];
  sendReferralInvite: (friendName: string, friendContact: string, channel: ReferralInvite['channel'], note?: string) => Promise<ReferralInvite>;
  claimReferralReward: (inviteId: string) => Promise<void>;
  simulateReferralSuccess: (inviteId: string) => Promise<void>;
  resendReferralReminder: (inviteId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_CUSTOMER: UserProfile = {
  uid: 'demo-customer-sylhet',
  email: 'customer@miladwater.com',
  displayName: 'আহমেদ হোসেন পাবেল',
  phone: '01711102448',
  photoURL: '',
  role: 'customer',
  walletBalance: 0,
  emptyJarsHeld: {
    jar20L: 0,
    jar5L: 0
  },
  savedAddresses: [],
  referralCode: 'MILAD-SYLHET-01',
  referralStats: {
    totalInvites: 0,
    successfulReferrals: 0,
    totalCreditsEarned: 0,
    pendingCredits: 0
  },
  createdAt: new Date().toISOString()
};

const DEMO_ADMIN: UserProfile = {
  uid: 'demo-admin-milad',
  email: 'admin@miladwater.com',
  displayName: 'এডমিন (ফ্যাক্টরি ইনচার্জ)',
  phone: '01711102448',
  photoURL: '',
  role: 'admin',
  walletBalance: 0,
  emptyJarsHeld: {
    jar20L: 0,
    jar5L: 0
  },
  savedAddresses: [],
  referralCode: 'MILAD-ADMIN-HQ',
  referralStats: {
    totalInvites: 0,
    successfulReferrals: 0,
    totalCreditsEarned: 0,
    pendingCredits: 0
  },
  createdAt: new Date().toISOString()
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const cached = localStorage.getItem('milad_user_profile');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState<boolean>(true);

  const [referrals, setReferrals] = useState<ReferralInvite[]>(() => {
    const cached = localStorage.getItem('milad_referrals');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        return DEFAULT_REFERRAL_INVITES;
      }
    }
    return DEFAULT_REFERRAL_INVITES;
  });

  // Sync to local storage
  useEffect(() => {
    if (user) {
      localStorage.setItem('milad_user_profile', JSON.stringify(user));
    } else {
      localStorage.removeItem('milad_user_profile');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('milad_referrals', JSON.stringify(referrals));
  }, [referrals]);

  // Listen to live Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const userSnap = await getDoc(userDocRef);

          if (userSnap.exists()) {
            const data = userSnap.data() as UserProfile;
            setUser(data);
          } else {
            const generatedCode = `MILAD-${(fbUser.displayName || 'USER').split(' ')[0].toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`;
            const newProfile: UserProfile = {
              uid: fbUser.uid,
              email: fbUser.email || '',
              displayName: fbUser.displayName || 'Valued Customer',
              phone: fbUser.phoneNumber || '',
              photoURL: fbUser.photoURL || '',
              role: fbUser.email?.includes('admin') ? 'admin' : 'customer',
              walletBalance: 0,
              emptyJarsHeld: {
                jar20L: 0,
                jar5L: 0
              },
              savedAddresses: [],
              referralCode: generatedCode,
              referralStats: {
                totalInvites: 0,
                successfulReferrals: 0,
                totalCreditsEarned: 0,
                pendingCredits: 0
              },
              createdAt: new Date().toISOString()
            };
            await setDoc(userDocRef, newProfile);
            setUser(newProfile);
          }
        } catch (err) {
          console.warn('Firestore user fetch failed, fallback to local user:', err);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      
      const userDocRef = doc(db, 'users', fbUser.uid);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        setUser(userSnap.data() as UserProfile);
      } else {
        const generatedCode = `MILAD-${(fbUser.displayName || 'USER').split(' ')[0].toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`;
        const newProfile: UserProfile = {
          uid: fbUser.uid,
          email: fbUser.email || '',
          displayName: fbUser.displayName || 'Valued Customer',
          phone: fbUser.phoneNumber || '',
          photoURL: fbUser.photoURL || '',
          role: fbUser.email?.includes('admin') ? 'admin' : 'customer',
          walletBalance: 0,
          emptyJarsHeld: { jar20L: 0, jar5L: 0 },
          savedAddresses: [],
          referralCode: generatedCode,
          referralStats: {
            totalInvites: 0,
            successfulReferrals: 0,
            totalCreditsEarned: 0,
            pendingCredits: 0
          },
          createdAt: new Date().toISOString()
        };
        await setDoc(userDocRef, newProfile);
        setUser(newProfile);
      }
    } catch (error) {
      console.error('Google Sign-In error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithPhoneAndName = async (displayName: string, phone: string, area = 'মিরবক্সটুলা', addressLine = ''): Promise<UserProfile> => {
    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    const uid = 'user-' + (cleanPhone || Date.now().toString());
    const generatedCode = `MILAD-${(displayName || 'CUSTOMER').split(' ')[0].toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    
    const userProfile: UserProfile = {
      uid,
      email: `${cleanPhone || 'user'}@miladwater.com`,
      displayName: displayName.trim() || 'সম্মানিত গ্রাহক',
      phone: cleanPhone || '০১৭১১-১০২৪৪৮',
      photoURL: '',
      role: 'customer',
      walletBalance: 0,
      emptyJarsHeld: {
        jar20L: 0,
        jar5L: 0
      },
      savedAddresses: addressLine ? [{
        id: 'addr-primary',
        tag: 'Home',
        recipientName: displayName,
        phone: cleanPhone,
        addressLine: addressLine,
        floorUnit: '',
        area: area || 'মিরবক্সটুলা',
        city: 'সিলেট',
        lat: 24.8949,
        lng: 91.8687,
        isDefault: true
      }] : [],
      referralCode: generatedCode,
      referralStats: {
        totalInvites: 0,
        successfulReferrals: 0,
        totalCreditsEarned: 0,
        pendingCredits: 0
      },
      createdAt: new Date().toISOString()
    };

    setUser(userProfile);
    try {
      await setDoc(doc(db, 'users', uid), userProfile, { merge: true });
    } catch (e) {
      console.warn('Local storage fallback used for user profile:', e);
    }
    return userProfile;
  };

  const signOut = async () => {
    try {
      await fbSignOut(auth);
      setUser(null);
      localStorage.removeItem('milad_user_profile');
    } catch (error) {
      console.error('Sign out error:', error);
      setUser(null);
      localStorage.removeItem('milad_user_profile');
    }
  };

  const loginAsDemoUser = (role: Role) => {
    if (role === 'admin') {
      setUser(DEMO_ADMIN);
    } else {
      setUser(DEMO_CUSTOMER);
    }
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    try {
      await setDoc(doc(db, 'users', user.uid), updated, { merge: true });
    } catch (e) {
      console.warn('Firestore sync optional error', e);
    }
  };

  const addSavedAddress = async (addressData: Omit<Address, 'id'>) => {
    if (!user) return;
    const newAddress: Address = {
      ...addressData,
      id: 'addr-' + Date.now()
    };
    const updatedAddresses = [...user.savedAddresses, newAddress];
    await updateUserProfile({ savedAddresses: updatedAddresses });
  };

  const removeSavedAddress = async (addressId: string) => {
    if (!user) return;
    const updatedAddresses = user.savedAddresses.filter(a => a.id !== addressId);
    await updateUserProfile({ savedAddresses: updatedAddresses });
  };

  const updateWalletBalance = async (amountDelta: number) => {
    if (!user) return;
    const newBalance = Math.max(0, user.walletBalance + amountDelta);
    await updateUserProfile({ walletBalance: newBalance });
  };

  const updateEmptyJars = async (delta20L: number, delta5L: number) => {
    if (!user) return;
    const new20L = Math.max(0, user.emptyJarsHeld.jar20L + delta20L);
    const new5L = Math.max(0, user.emptyJarsHeld.jar5L + delta5L);
    await updateUserProfile({
      emptyJarsHeld: { jar20L: new20L, jar5L: new5L }
    });
  };

  // Referral Actions
  const sendReferralInvite = async (
    friendName: string, 
    friendContact: string, 
    channel: ReferralInvite['channel'],
    note?: string
  ): Promise<ReferralInvite> => {
    const code = user?.referralCode || 'MILAD-WATER-50';
    const newInvite: ReferralInvite = {
      id: 'ref-inv-' + Date.now(),
      referrerUserId: user?.uid || 'guest-user',
      referralCode: code,
      friendName,
      friendContact,
      channel,
      status: 'invited',
      discountGiven: 50,
      rewardEarned: 50,
      invitedAt: new Date().toISOString(),
      note: note || `Invited via ${channel.toUpperCase()}`
    };

    setReferrals(prev => [newInvite, ...prev]);

    if (user) {
      const stats = user.referralStats || { totalInvites: 0, successfulReferrals: 0, totalCreditsEarned: 0, pendingCredits: 0 };
      await updateUserProfile({
        referralStats: {
          ...stats,
          totalInvites: stats.totalInvites + 1
        }
      });
    }

    return newInvite;
  };

  const claimReferralReward = async (inviteId: string) => {
    const invite = referrals.find(r => r.id === inviteId);
    if (!invite || invite.status !== 'ordered') return;

    // Credit to wallet
    await updateWalletBalance(invite.rewardEarned);

    // Update invite status
    setReferrals(prev =>
      prev.map(r => r.id === inviteId ? { ...r, status: 'reward_claimed' } : r)
    );

    // Update user stats
    if (user) {
      const stats = user.referralStats || { totalInvites: 0, successfulReferrals: 0, totalCreditsEarned: 0, pendingCredits: 0 };
      await updateUserProfile({
        referralStats: {
          ...stats,
          totalCreditsEarned: stats.totalCreditsEarned + invite.rewardEarned,
          pendingCredits: Math.max(0, stats.pendingCredits - invite.rewardEarned)
        }
      });
    }
  };

  const simulateReferralSuccess = async (inviteId: string) => {
    const invite = referrals.find(r => r.id === inviteId);
    if (!invite) return;

    setReferrals(prev =>
      prev.map(r =>
        r.id === inviteId
          ? {
              ...r,
              status: 'ordered',
              completedAt: new Date().toISOString(),
              note: 'First 20L delivery delivered & confirmed!'
            }
          : r
      )
    );

    if (user) {
      const stats = user.referralStats || { totalInvites: 0, successfulReferrals: 0, totalCreditsEarned: 0, pendingCredits: 0 };
      await updateUserProfile({
        referralStats: {
          ...stats,
          successfulReferrals: stats.successfulReferrals + 1,
          pendingCredits: stats.pendingCredits + invite.rewardEarned
        }
      });
    }
  };

  const resendReferralReminder = async (inviteId: string) => {
    setReferrals(prev =>
      prev.map(r =>
        r.id === inviteId
          ? { ...r, note: `Reminder re-sent on ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` }
          : r
      )
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        signOut,
        loginAsDemoUser,
        updateUserProfile,
        addSavedAddress,
        removeSavedAddress,
        updateWalletBalance,
        updateEmptyJars,
        referrals,
        sendReferralInvite,
        claimReferralReward,
        simulateReferralSuccess,
        resendReferralReminder
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

