import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  User
} from 'firebase/auth';
import { auth } from '../services/firebase';

interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

interface SimpleResult {
  success: boolean;
  error?: string;
}

export const useAuthActions = () => {
  const signUp = async (email: string, password: string, displayName: string): Promise<AuthResult> => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName });
      return { success: true, user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const logIn = async (email: string, password: string): Promise<AuthResult> => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const resetPassword = async (email: string): Promise<SimpleResult> => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const logOut = async (): Promise<SimpleResult> => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  return {
    signUp,
    logIn,
    resetPassword,
    logOut
  };
};