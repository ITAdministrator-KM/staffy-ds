import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'staff' | 'division_cc' | 'division_head' | 'hod' | 'admin';
  division?: string;
  createdAt: Date;
  lastLoginAt: Date;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

export interface SimpleResult {
  success: boolean;
  error?: string;
}

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();

export const firebaseAuth = {
  // Email/Password Sign Up
  signUpWithEmail: async (email: string, password: string, displayName: string, role: string = 'staff'): Promise<AuthResult> => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName });
      
      // Create user profile in Firestore
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        displayName,
        role: role as UserProfile['role'],
        createdAt: new Date(),
        lastLoginAt: new Date()
      };
      
      await setDoc(doc(db, 'users', user.uid), userProfile);
      
      return { success: true, user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Email/Password Sign In
  signInWithEmail: async (email: string, password: string): Promise<AuthResult> => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      
      // Update last login
      await setDoc(doc(db, 'users', user.uid), { 
        lastLoginAt: new Date() 
      }, { merge: true });
      
      return { success: true, user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Google Sign In
  signInWithGoogle: async (): Promise<AuthResult> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user profile exists, create if not
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        const userProfile: UserProfile = {
          uid: user.uid,
          email: user.email!,
          displayName: user.displayName || 'Unknown User',
          role: 'staff', // Default role for new Google users
          createdAt: new Date(),
          lastLoginAt: new Date()
        };
        await setDoc(doc(db, 'users', user.uid), userProfile);
      } else {
        // Update last login
        await setDoc(doc(db, 'users', user.uid), { 
          lastLoginAt: new Date() 
        }, { merge: true });
      }
      
      return { success: true, user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Password Reset
  resetPassword: async (email: string): Promise<SimpleResult> => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Sign Out
  signOut: async (): Promise<SimpleResult> => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Get User Profile
  getUserProfile: async (uid: string): Promise<UserProfile | null> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      return userDoc.exists() ? userDoc.data() as UserProfile : null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }
};