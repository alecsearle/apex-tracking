import { v4 as uuidv4 } from "uuid";
import {
  UsageSession,
  CreateManualUsageDTO,
  StartTimedSessionDTO,
  StopTimedSessionDTO,
  UpdateUsageSessionDTO,
} from "../models/UsageSession";

// Temporary in memory storage
let usageSessions: UsageSession[] = [];

export const usageService = {
  // Create a manual usage entry
  createManualSession: async (data: CreateManualUsageDTO): Promise<UsageSession> => {
    const endTime = new Date(data.startTime);
    endTime.setMinutes(endTime.getMinutes() + data.duration);

    const session: UsageSession = {
      id: uuidv4(),
      assetId: data.assetId,
      startTime: data.startTime,
      endTime: endTime.toISOString(),
      duration: data.duration,
      type: "manual",
      status: "completed",
      description: data.description,
      location: data.location,
      performedBy: data.performedBy,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    usageSessions.push(session);
    return session;
  },

  // Start a timed session
  startTimedSession: async (data: StartTimedSessionDTO): Promise<UsageSession> => {
    // Check if asset is in active session
    const existingActive = usageSessions.find(
      (s) => s.assetId === data.assetId && s.status === "active",
    );

    if (existingActive) {
      throw new Error("Asset already has an active session");
    }

    const session: UsageSession = {
      id: uuidv4(),
      assetId: data.assetId,
      startTime: new Date().toISOString(),
      type: "timed",
      status: "active",
      location: data.location,
      performedBy: data.performedBy,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    usageSessions.push(session);
    return session;
  },

  // Stop a timed session
  stopTimedSession: async (id: string, data: StopTimedSessionDTO): Promise<UsageSession | null> => {
    const sessionIndex = usageSessions.findIndex((s) => s.id === id);

    if (sessionIndex === -1) {
      return null;
    }

    const session = usageSessions[sessionIndex];

    if (session.status !== "active") {
      throw new Error("Session is not active");
    }

    const endTime = new Date();
    const startTime = new Date(session.startTime);
    const durationMinutes = Math.floor((endTime.getTime() - startTime.getTime()) / (1000 * 60));

    usageSessions[sessionIndex] = {
      ...session,
      endTime: endTime.toISOString(),
      duration: durationMinutes,
      status: "completed",
      description: data.description || session.description,
      updatedAt: new Date().toISOString(),
    };

    return usageSessions[sessionIndex];
  },

  // Get active session for an asset
  getActiveSessionByAssetId: async (assetId: string): Promise<UsageSession | null> => {
    const session = usageSessions.find((s) => s.assetId === assetId && s.status === "active");
    return session || null;
  },

  // Get all active sessions
  getAllActiveSessions: async (): Promise<UsageSession[]> => {
    return usageSessions.filter((s) => s.status === "active");
  },

  // Get all usage sessions for an asset
  getSessionsByAssetId: async (assetId: string): Promise<UsageSession[]> => {
    return usageSessions
      .filter((s) => s.assetId === assetId)
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
  },

  // Get a usage session by ID
  getSessionById: async (id: string): Promise<UsageSession | null> => {
    const session = usageSessions.find((s) => s.id === id);
    return session || null;
  },

  // Update a usage session (for fixing abandoned sessions or correcting data)
  updateSession: async (
    id: string,
    updates: UpdateUsageSessionDTO,
  ): Promise<UsageSession | null> => {
    const sessionIndex = usageSessions.findIndex((s) => s.id === id);

    if (sessionIndex === -1) {
      return null;
    }

    const session = usageSessions[sessionIndex];

    // If updating endTime and we have startTime, reacalculate duration
    let duration = updates.duration;
    if (updates.endTime && session.startTime && !updates.duration) {
      const start = new Date(updates.startTime || session.startTime);
      const end = new Date(updates.endTime);
      duration = Math.floor((end.getTime() - start.getTime()) / (1000 * 60));
    }

    usageSessions[sessionIndex] = {
      ...session,
      ...updates,
      duration: duration || session.duration,
      updatedAt: new Date().toISOString(),
    };

    return usageSessions[sessionIndex];
  },

  // Delete a usage session
  deleteSession: async (id: string): Promise<boolean> => {
    const sessionIndex = usageSessions.findIndex((s) => s.id === id);

    if (sessionIndex === -1) {
      return false;
    }

    usageSessions.splice(sessionIndex, 1);
    return true;
  },

  // Mark old active session as abandoned (if it has been running for > 24 hours)
  markAbandonedSessions: async (): Promise<number> => {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    let count = 0;
    usageSessions.forEach((session, index) => {
      if (session.status === "active" && new Date(session.startTime) < twentyFourHoursAgo) {
        usageSessions[index] = {
          ...session,
          status: "abandoned",
          updatedAt: new Date().toISOString(),
        };
        count++;
      }
    });
    return count;
  },

  // Calculate total usage hours for an asset
  getTotalHoursForAsset: async (assetId: string): Promise<number> => {
    const sessions = usageSessions.filter(
      (s) => s.assetId === assetId && s.status === "completed" && s.duration,
    );

    const totalMinutes = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    return Math.round((totalMinutes / 60) * 100) / 100; // Round to 2 decimal places
  },
};
