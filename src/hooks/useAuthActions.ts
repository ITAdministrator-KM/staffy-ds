import { firebaseAuth, AuthResult, SimpleResult } from '../services/firebaseAuth';
import { useAuth } from '../contexts/AuthContext';

export const useAuthActions = () => {
  const { refreshUserProfile } = useAuth();

  const signUp = async (email: string, password: string, displayName: string, role?: string): Promise<AuthResult> => {
    const result = await firebaseAuth.signUpWithEmail(email, password, displayName, role);
    if (result.success) {
      await refreshUserProfile();
    }
    return result;
  };

  const logIn = async (email: string, password: string): Promise<AuthResult> => {
    const result = await firebaseAuth.signInWithEmail(email, password);
    if (result.success) {
      await refreshUserProfile();
    }
    return result;
  };

  const signInWithGoogle = async (): Promise<AuthResult> => {
    const result = await firebaseAuth.signInWithGoogle();
    if (result.success) {
      await refreshUserProfile();
    }
    return result;
  };

  const resetPassword = async (email: string): Promise<SimpleResult> => {
    return await firebaseAuth.resetPassword(email);
  };

  const logOut = async (): Promise<SimpleResult> => {
    return await firebaseAuth.signOut();
  };

  return {
    signUp,
    logIn,
    signInWithGoogle,
    resetPassword,
    logOut
  };
};