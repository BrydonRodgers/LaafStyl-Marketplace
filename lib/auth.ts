import { supabase } from './supabase';
import { useAuthStore } from './store';

export async function signUp(email: string, password: string, role: 'admin' | 'customer' = 'customer') {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    if (authData.user) {
      // Create user record in users table
      const { error: dbError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            email,
            role,
          },
        ]);

      if (dbError) throw dbError;
    }

    return { success: true, user: authData.user };
  } catch (error) {
    console.error('Sign up error:', error);
    return { success: false, error: String(error) };
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Fetch user record from users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (userError) throw userError;

    useAuthStore.setState({ user: userData });
    return { success: true, user: userData };
  } catch (error) {
    console.error('Sign in error:', error);
    return { success: false, error: String(error) };
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    useAuthStore.setState({ user: null });
    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    return { success: false, error: String(error) };
  }
}

export async function getCurrentUser() {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) return null;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', sessionData.session.user.id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

export function isAdmin(user: any): boolean {
  return user?.role === 'admin';
}
