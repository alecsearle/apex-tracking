import {
  CURRENT_USER,
  getActiveSessions,
  getSessionsForAsset,
  mockEndSession,
  mockPauseSession,
  mockResumeSession,
  mockStartSession,
} from "@/src/mocks/mockData";
import { UsageSession } from "@/src/types/session";
import { useCallback, useState } from "react";

export function useSessions(assetId?: string) {
  const [sessions, setSessions] = useState<UsageSession[]>(
    assetId ? getSessionsForAsset(assetId) : getActiveSessions(),
  );
  const [loading, setLoading] = useState(false);
  const [error] = useState<string | null>(null);

  const refetch = useCallback(() => {
    setSessions(
      assetId ? [...getSessionsForAsset(assetId)] : [...getActiveSessions()],
    );
  }, [assetId]);

  const startSession = useCallback(
    (targetAssetId: string, assetName: string) => {
      setLoading(true);
      mockStartSession(targetAssetId, CURRENT_USER.id, CURRENT_USER.fullName, assetName);
      setSessions(
        assetId ? [...getSessionsForAsset(assetId)] : [...getActiveSessions()],
      );
      setLoading(false);
    },
    [assetId],
  );

  const endSession = useCallback(
    (sessionId: string, options?: { notes?: string; jobSiteName?: string }) => {
      setLoading(true);
      mockEndSession(sessionId, CURRENT_USER.id, CURRENT_USER.fullName, options);
      setSessions(
        assetId ? [...getSessionsForAsset(assetId)] : [...getActiveSessions()],
      );
      setLoading(false);
    },
    [assetId],
  );

  const pauseSession = useCallback(
    (sessionId: string) => {
      setLoading(true);
      mockPauseSession(sessionId);
      setSessions(
        assetId ? [...getSessionsForAsset(assetId)] : [...getActiveSessions()],
      );
      setLoading(false);
    },
    [assetId],
  );

  const resumeSession = useCallback(
    (sessionId: string) => {
      setLoading(true);
      mockResumeSession(sessionId);
      setSessions(
        assetId ? [...getSessionsForAsset(assetId)] : [...getActiveSessions()],
      );
      setLoading(false);
    },
    [assetId],
  );

  return { sessions, loading, error, refetch, startSession, endSession, pauseSession, resumeSession };
}
