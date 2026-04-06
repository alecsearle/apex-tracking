"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const userRepository_1 = require("../repositories/userRepository");
exports.authService = {
    /**
     * Sync a Supabase auth user into the local users table.
     * Called from POST /api/auth/sync after first login.
     */
    async syncUser(supabaseUser) {
        const email = supabaseUser.email || "";
        const fullName = supabaseUser.user_metadata?.full_name || email.split("@")[0] || "User";
        const avatarUrl = supabaseUser.user_metadata?.avatar_url;
        return userRepository_1.userRepository.upsert({
            id: supabaseUser.id,
            email,
            fullName,
            avatarUrl,
        });
    },
};
