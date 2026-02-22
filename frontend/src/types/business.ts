export type MemberRole = "owner" | "employee";

export interface Business {
  id: string;
  name: string;
  businessCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface Membership {
  id: string;
  userId: string;
  businessId: string;
  role: MemberRole;
  joinedAt: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    avatarUrl?: string;
  };
}
