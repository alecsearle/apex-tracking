import { UsageSession } from "@/src/types/session";
import { sessionService } from "@/src/services/sessionService";
import { useAuth } from "./useAuth";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Hook for usage sessions.
 * Pause/resume is handled client-side only — the backend only knows active/completed.
 * totalPausedMs is accumulated locally and sent when ending the session.
 */
export function useSessions(assetId?: string) {
  const { businessId } = useAuth();
  const [sessions, setSessions] = useState<UsageSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Track client-side pause state per session
  const pauseState = useRef<
    Map<string, { pausedAt: number; totalPausedMs: number }>
  >(new Map());

  const refetch = useCallback(async () => {
    if (!businessId) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const data = assetId
        ? await sessionService.getForAsset(businessId, assetId)
        : await sessionService.getActive(businessId);
      // Apply client-side pause status to active sessions
      const enriched = data.map((s) => {
        const ps = pauseState.current.get(s.id);
        if (ps?.pausedAt) {
          return { ...s, status: "paused" as const, pausedAt: new Date(ps.pausedAt).toISOString() };
        }
        return s;
      });
      setSessions(enriched);
    } catch (e: any) {
      setError(e.message || "Failed to load sessions");
    } finally {
      setLoading(false);
    }
  }, [businessId, assetId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const startSession = useCallback(
    async (targetAssetId: string, _assetName?: string) => {
      if (!businessId) return;
      setLoading(true);
      setError(null);
      try {
        await sessionService.start(businessId, { assetId: targetAssetId });
        await refetch();
      } catch (e: any) {
        setError(e.message || "Failed to start session");
      } finally {
        setLoading(false);
      }
    },
    [businessId, refetch]
  );

  const endSession = useCallback(
    async (sessionId: string, options?: { notes?: string; jobSiteName?: string }) => {
      if (!businessId) return;
      setLoading(true);
      setError(null);
      try {
        // Include accumulated pause time from client-side tracking
        const ps = pauseState.current.get(sessionId);
        let totalPausedMs = ps?.totalPausedMs ?? 0;
        // If currently paused, add the current pause duration
        if (ps?.pausedAt) {
          totalPausedMs += Date.now() - ps.pausedAt;
        }
        pauseState.current.delete(sessionId);

        await sessionService.end(businessId, sessionId, {
          notes: options?.notes,
          totalPausedMs: totalPausedMs > 0 ? totalPausedMs : undefined,
        });
        await refetch();
      } catch (e: any) {
        setError(e.message || "Failed to end session");
      } finally {
        setLoading(false);
      }
    },
    [businessId, refetch]
  );

  /** Client-side pause — does not call backend */
  const pauseSession = useCallback(
    (sessionId: string) => {
      const existing = pauseState.current.get(sessionId) ?? { pausedAt: 0, totalPausedMs: 0 };
      existing.pausedAt = Date.now();
      pauseState.current.set(sessionId, existing);
      // Update local state to show paused status
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId
            ? { ...s, status: "paused" as const, pausedAt: new Date().toISOString() }
            : s
        )
      );
    },
    []
  );

  /** Client-side resume — does not call backend */
  const resumeSession = useCallback(
    (sessionId: string) => {
      const ps = pauseState.current.get(sessionId);
      if (ps?.pausedAt) {
        ps.totalPausedMs += Date.now() - ps.pausedAt;
        ps.pausedAt = 0;
        pauseState.current.set(sessionId, ps);
      }
      // Update local state to show active status
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId
            ? { ...s, status: "active" as const, pausedAt: undefined }
            : s
        )
      );
    },
    []
  );

  return { sessions, loading, error, refetch, startSession, endSession, pauseSession, resumeSession };
}
