import { userRepository } from "../repositories/userRepository";

interface SupabaseUserData {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export const authService = {
  /**
   * Sync a Supabase auth user into the local users table.
   * Called from POST /api/auth/sync after first login.
   */
  async syncUser(supabaseUser: SupabaseUserData) {
    const email = supabaseUser.email || "";
    const fullName =
      supabaseUser.user_metadata?.full_name || email.split("@")[0] || "User";
    const avatarUrl = supabaseUser.user_metadata?.avatar_url;

    return userRepository.upsert({
      id: supabaseUser.id,
      email,
      fullName,
      avatarUrl,
    });
  },
};
