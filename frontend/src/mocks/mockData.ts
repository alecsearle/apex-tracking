import { Asset } from "@/src/types/asset";
import { Business, Membership } from "@/src/types/business";
import { DueStatus, MaintenanceLog, MaintenanceSchedule } from "@/src/types/maintenance";
import { MaintenanceReport } from "@/src/types/report";
import { UsageSession } from "@/src/types/session";
import { Sop } from "@/src/types/sop";
import { User } from "@/src/types/user";

// ── Users ──────────────────────────────────────────────

export const MOCK_USERS: User[] = [
  {
    id: "user-001",
    email: "dev@apextracking.local",
    fullName: "Alex Carter",
    createdAt: "2025-11-01T08:00:00Z",
    updatedAt: "2026-02-20T10:00:00Z",
  },
  {
    id: "user-002",
    email: "jordan@apextracking.local",
    fullName: "Jordan Mitchell",
    createdAt: "2025-12-10T09:00:00Z",
    updatedAt: "2026-02-18T14:30:00Z",
  },
  {
    id: "user-003",
    email: "sam@apextracking.local",
    fullName: "Sam Rivera",
    createdAt: "2026-01-15T07:30:00Z",
    updatedAt: "2026-02-19T16:00:00Z",
  },
];

export const CURRENT_USER = MOCK_USERS[0];

// ── Business ───────────────────────────────────────────

export const MOCK_BUSINESS: Business = {
  id: "biz-001",
  name: "Carter Landscaping",
  businessCode: "APEX-7K2X",
  createdAt: "2025-11-01T08:00:00Z",
  updatedAt: "2026-02-20T10:00:00Z",
};

// ── Memberships ────────────────────────────────────────

export const MOCK_MEMBERSHIPS: Membership[] = [
  {
    id: "mem-001",
    userId: "user-001",
    businessId: "biz-001",
    role: "owner",
    joinedAt: "2025-11-01T08:00:00Z",
    user: { id: "user-001", fullName: "Alex Carter", email: "dev@apextracking.local" },
  },
  {
    id: "mem-002",
    userId: "user-002",
    businessId: "biz-001",
    role: "employee",
    joinedAt: "2025-12-10T09:00:00Z",
    user: { id: "user-002", fullName: "Jordan Mitchell", email: "jordan@apextracking.local" },
  },
  {
    id: "mem-003",
    userId: "user-003",
    businessId: "biz-001",
    role: "employee",
    joinedAt: "2026-01-15T07:30:00Z",
    user: { id: "user-003", fullName: "Sam Rivera", email: "sam@apextracking.local" },
  },
];

// ── Assets ─────────────────────────────────────────────

export let MOCK_ASSETS: Asset[] = [
  {
    id: "asset-001",
    businessId: "biz-001",
    name: "Chainsaw",
    brand: "Stihl",
    model: "MS 261",
    serialNumber: "SN-CS-2024-001",
    purchaseDate: "2025-03-15",
    status: "in_use",
    totalUsageHours: 142.5,
    manualUrl: "local:sample-manual",
    createdBy: "user-001",
    createdAt: "2025-03-15T10:00:00Z",
    updatedAt: "2026-02-20T08:30:00Z",
  },
  {
    id: "asset-002",
    businessId: "biz-001",
    name: "Ride-On Mower",
    brand: "John Deere",
    model: "X350",
    serialNumber: "SN-RM-2024-002",
    purchaseDate: "2025-01-20",
    status: "available",
    totalUsageHours: 310.2,
    createdBy: "user-001",
    createdAt: "2025-01-20T10:00:00Z",
    updatedAt: "2026-02-19T17:00:00Z",
  },
  {
    id: "asset-003",
    businessId: "biz-001",
    name: "Leaf Blower",
    brand: "Husqvarna",
    model: "525BX",
    serialNumber: "SN-LB-2024-003",
    purchaseDate: "2025-06-10",
    status: "available",
    totalUsageHours: 85.0,
    createdBy: "user-001",
    createdAt: "2025-06-10T10:00:00Z",
    updatedAt: "2026-02-18T12:00:00Z",
  },
  {
    id: "asset-004",
    businessId: "biz-001",
    name: "Hedge Trimmer",
    brand: "Stihl",
    model: "HS 82",
    serialNumber: "SN-HT-2024-004",
    purchaseDate: "2025-04-22",
    status: "maintenance",
    totalUsageHours: 67.3,
    createdBy: "user-001",
    createdAt: "2025-04-22T10:00:00Z",
    updatedAt: "2026-02-17T09:00:00Z",
  },
  {
    id: "asset-005",
    businessId: "biz-001",
    name: "Line Trimmer",
    brand: "Husqvarna",
    model: "535RXT",
    serialNumber: "SN-LT-2025-005",
    purchaseDate: "2025-09-01",
    status: "in_use",
    totalUsageHours: 45.8,
    createdBy: "user-001",
    createdAt: "2025-09-01T10:00:00Z",
    updatedAt: "2026-02-21T07:45:00Z",
  },
  {
    id: "asset-006",
    businessId: "biz-001",
    name: "Compact Excavator",
    brand: "Kubota",
    model: "KX040-4",
    serialNumber: "SN-EX-2025-006",
    purchaseDate: "2025-08-15",
    nfcTagId: "NFC-006",
    status: "available",
    totalUsageHours: 220.0,
    manualUrl: "local:sample-manual",
    createdBy: "user-001",
    createdAt: "2025-08-15T10:00:00Z",
    updatedAt: "2026-02-20T16:00:00Z",
  },
];

// ── Active Sessions ────────────────────────────────────

export let MOCK_SESSIONS: UsageSession[] = [
  {
    id: "session-001",
    assetId: "asset-001",
    startedBy: "user-002",
    startedAt: "2026-02-21T06:30:00Z",
    status: "active",
    assetName: "Chainsaw",
    startedByName: "Jordan Mitchell",
  },
  {
    id: "session-002",
    assetId: "asset-005",
    startedBy: "user-003",
    startedAt: "2026-02-21T07:45:00Z",
    status: "active",
    assetName: "Line Trimmer",
    startedByName: "Sam Rivera",
  },
  {
    id: "session-003",
    assetId: "asset-002",
    startedBy: "user-001",
    endedBy: "user-001",
    startedAt: "2026-02-20T08:00:00Z",
    endedAt: "2026-02-20T12:30:00Z",
    notes: "Mowed sections A and B of the Henderson property.",
    status: "completed",
    assetName: "Ride-On Mower",
    startedByName: "Alex Carter",
    endedByName: "Alex Carter",
  },
  {
    id: "session-004",
    assetId: "asset-003",
    startedBy: "user-003",
    endedBy: "user-003",
    startedAt: "2026-02-19T13:00:00Z",
    endedAt: "2026-02-19T15:15:00Z",
    status: "completed",
    assetName: "Leaf Blower",
    startedByName: "Sam Rivera",
    endedByName: "Sam Rivera",
  },
];

// ── Maintenance Schedules ──────────────────────────────

export const MOCK_SCHEDULES: MaintenanceSchedule[] = [
  {
    id: "sched-001",
    assetId: "asset-001",
    businessId: "biz-001",
    createdBy: "user-001",
    title: "Chain Sharpening",
    description: "Sharpen the chain and inspect for wear. Replace if teeth are below minimum height.",
    triggerType: "usage_hours",
    intervalHours: 20,
    lastCompletedAt: "2026-01-28T10:00:00Z",
    lastCompletedUsageHours: 120,
    active: true,
    createdAt: "2025-04-01T10:00:00Z",
    updatedAt: "2026-01-28T10:00:00Z",
    assetName: "Chainsaw",
    createdByName: "Alex Carter",
    dueStatus: "overdue",
    dueInfo: "2.5h overdue",
  },
  {
    id: "sched-002",
    assetId: "asset-002",
    businessId: "biz-001",
    createdBy: "user-001",
    title: "Oil Change",
    description: "Change engine oil and replace oil filter. Use SAE 10W-30.",
    triggerType: "usage_hours",
    intervalHours: 50,
    lastCompletedAt: "2026-02-01T10:00:00Z",
    lastCompletedUsageHours: 270,
    active: true,
    createdAt: "2025-02-01T10:00:00Z",
    updatedAt: "2026-02-01T10:00:00Z",
    assetName: "Ride-On Mower",
    createdByName: "Alex Carter",
    dueStatus: "due_soon",
    dueInfo: "Due in 9.8h",
  },
  {
    id: "sched-003",
    assetId: "asset-002",
    businessId: "biz-001",
    createdBy: "user-001",
    title: "Blade Sharpening",
    description: "Remove and sharpen mower blades. Check for cracks and balance.",
    triggerType: "time_interval",
    intervalDays: 30,
    lastCompletedAt: "2026-02-05T10:00:00Z",
    active: true,
    createdAt: "2025-02-01T10:00:00Z",
    updatedAt: "2026-02-05T10:00:00Z",
    assetName: "Ride-On Mower",
    createdByName: "Alex Carter",
    dueStatus: "due_soon",
    dueInfo: "Due in 14 days",
  },
  {
    id: "sched-004",
    assetId: "asset-003",
    businessId: "biz-001",
    createdBy: "user-002",
    title: "Air Filter Cleaning",
    description: "Remove and clean the foam air filter. Replace if damaged.",
    triggerType: "usage_hours",
    intervalHours: 25,
    lastCompletedAt: "2026-02-10T10:00:00Z",
    lastCompletedUsageHours: 75,
    active: true,
    createdAt: "2025-07-01T10:00:00Z",
    updatedAt: "2026-02-10T10:00:00Z",
    assetName: "Leaf Blower",
    createdByName: "Jordan Mitchell",
    dueStatus: "on_track",
    dueInfo: "Due in 15h",
  },
  {
    id: "sched-005",
    assetId: "asset-004",
    businessId: "biz-001",
    createdBy: "user-001",
    title: "Blade Alignment Check",
    description: "Check blade alignment and tighten bolts. Lubricate moving parts.",
    triggerType: "time_interval",
    intervalDays: 60,
    lastCompletedAt: "2025-12-15T10:00:00Z",
    active: true,
    createdAt: "2025-05-01T10:00:00Z",
    updatedAt: "2025-12-15T10:00:00Z",
    assetName: "Hedge Trimmer",
    createdByName: "Alex Carter",
    dueStatus: "overdue",
    dueInfo: "8 days overdue",
  },
  {
    id: "sched-006",
    assetId: "asset-006",
    businessId: "biz-001",
    createdBy: "user-001",
    title: "Hydraulic Fluid Check",
    description: "Check hydraulic fluid level and top up if needed. Inspect hoses for leaks.",
    triggerType: "usage_hours",
    intervalHours: 100,
    lastCompletedAt: "2026-01-20T10:00:00Z",
    lastCompletedUsageHours: 180,
    active: true,
    createdAt: "2025-09-01T10:00:00Z",
    updatedAt: "2026-01-20T10:00:00Z",
    assetName: "Compact Excavator",
    createdByName: "Alex Carter",
    dueStatus: "on_track",
    dueInfo: "Due in 60h",
  },
  {
    id: "sched-007",
    assetId: "asset-006",
    businessId: "biz-001",
    createdBy: "user-001",
    title: "Track Tension Adjustment",
    description: "Check and adjust track tension. Inspect for wear on sprockets and rollers.",
    triggerType: "time_interval",
    intervalDays: 90,
    lastCompletedAt: "2026-01-10T10:00:00Z",
    active: true,
    createdAt: "2025-09-15T10:00:00Z",
    updatedAt: "2026-01-10T10:00:00Z",
    assetName: "Compact Excavator",
    createdByName: "Alex Carter",
    dueStatus: "on_track",
    dueInfo: "Due in 49 days",
  },
];

// ── Maintenance Logs ───────────────────────────────────

export const MOCK_LOGS: MaintenanceLog[] = [
  {
    id: "log-001",
    scheduleId: "sched-001",
    assetId: "asset-001",
    businessId: "biz-001",
    completedBy: "user-002",
    completedAt: "2026-01-28T10:00:00Z",
    usageHoursAtCompletion: 120,
    notes: "Chain sharpened and inspected. Teeth are at 60% — one more service before replacement.",
    createdAt: "2026-01-28T10:00:00Z",
    completedByName: "Jordan Mitchell",
  },
  {
    id: "log-002",
    scheduleId: "sched-001",
    assetId: "asset-001",
    businessId: "biz-001",
    completedBy: "user-001",
    completedAt: "2026-01-05T10:00:00Z",
    usageHoursAtCompletion: 100,
    notes: "Sharpened chain. All good.",
    createdAt: "2026-01-05T10:00:00Z",
    completedByName: "Alex Carter",
  },
  {
    id: "log-003",
    scheduleId: "sched-002",
    assetId: "asset-002",
    businessId: "biz-001",
    completedBy: "user-001",
    completedAt: "2026-02-01T10:00:00Z",
    usageHoursAtCompletion: 270,
    notes: "Oil and filter changed. Used SAE 10W-30 as specified.",
    createdAt: "2026-02-01T10:00:00Z",
    completedByName: "Alex Carter",
  },
  {
    id: "log-004",
    scheduleId: "sched-003",
    assetId: "asset-002",
    businessId: "biz-001",
    completedBy: "user-003",
    completedAt: "2026-02-05T10:00:00Z",
    notes: "Blades sharpened and balanced. No cracks found.",
    createdAt: "2026-02-05T10:00:00Z",
    completedByName: "Sam Rivera",
  },
  {
    id: "log-005",
    scheduleId: "sched-005",
    assetId: "asset-004",
    businessId: "biz-001",
    completedBy: "user-001",
    completedAt: "2025-12-15T10:00:00Z",
    notes: "Blades realigned and bolts tightened. Applied grease to pivot points.",
    createdAt: "2025-12-15T10:00:00Z",
    completedByName: "Alex Carter",
  },
];

// ── SOPs ───────────────────────────────────────────────

export const MOCK_SOPS: Sop[] = [
  {
    id: "sop-001",
    businessId: "biz-001",
    title: "General Safety Guidelines",
    content: `## Personal Protective Equipment (PPE)

All team members must wear the following PPE at all times on job sites:

- **Safety glasses** or goggles
- **Hearing protection** when operating power tools
- **Steel-capped boots**
- **High-visibility vest** when working near roads
- **Gloves** appropriate to the task

## Before Starting Any Equipment

1. Perform a visual inspection of the equipment
2. Check fuel and oil levels
3. Ensure all guards and safety features are in place
4. Confirm the work area is clear of bystanders
5. Log the session start in Apex Tracking

## Emergency Procedures

- **First Aid Kit** location: Company vehicle toolbox
- **Emergency Contact**: 000 (Australia) / 111 (NZ)
- Report all incidents to the business owner immediately`,
    source: "manual",
    createdBy: "user-001",
    createdAt: "2025-11-15T10:00:00Z",
    updatedAt: "2026-01-20T10:00:00Z",
    createdByName: "Alex Carter",
  },
  {
    id: "sop-002",
    businessId: "biz-001",
    title: "Vehicle & Trailer Checklist",
    content: `## Daily Pre-Start Checklist

Before leaving the depot each morning:

- [ ] Check tyre pressure on vehicle and trailer
- [ ] Verify all equipment is secured on the trailer
- [ ] Confirm fuel level is sufficient for the day
- [ ] Check all lights (headlights, indicators, brake lights, trailer lights)
- [ ] Ensure fire extinguisher is accessible and in-date
- [ ] Review the day's job schedule

## Loading Equipment

1. Place heaviest items (mower, excavator) at the front of the trailer
2. Secure with ratchet straps — minimum 2 per large item
3. Smaller tools in lockable toolbox
4. Fuel containers upright and secured separately`,
    source: "custom",
    createdBy: "user-001",
    createdAt: "2025-12-01T10:00:00Z",
    updatedAt: "2026-02-10T10:00:00Z",
    createdByName: "Alex Carter",
  },
  {
    id: "sop-003",
    businessId: "biz-001",
    assetId: "asset-001",
    title: "Chainsaw Operating Procedure",
    content: `## Pre-Start Checks

1. Inspect chain tension — should have slight give but not sag
2. Check bar oil reservoir level
3. Inspect chain for damaged or missing teeth
4. Ensure chain brake is functioning
5. Check fuel mix (50:1 for Stihl MS 261)

## Operating Procedure

1. Start on flat ground, engage chain brake
2. Use choke for cold starts
3. Disengage chain brake before cutting
4. Always cut with the base of the bar, not the tip (kickback danger)
5. Never cut above shoulder height
6. Keep firm two-handed grip at all times

## After Use

1. Let idle for 30 seconds, then shut off
2. Engage chain brake
3. Clean sawdust from bar and chain area
4. Log session end in Apex Tracking
5. Report any issues via maintenance report`,
    source: "manual",
    assetName: "Chainsaw",
    createdBy: "user-001",
    createdAt: "2025-11-20T10:00:00Z",
    updatedAt: "2026-01-15T10:00:00Z",
    createdByName: "Alex Carter",
  },
  {
    id: "sop-004",
    businessId: "biz-001",
    assetId: "asset-002",
    title: "Ride-On Mower Operating Procedure",
    content: `## Pre-Start Checks

1. Walk the mowing area — remove rocks, sticks, debris
2. Check engine oil level (dipstick)
3. Inspect blades for damage
4. Check tyre pressure (10 PSI front, 14 PSI rear)
5. Ensure fuel tank is adequately filled

## Mowing

1. Start engine with PTO disengaged
2. Set cutting height before engaging blades
3. Mow in overlapping rows for even coverage
4. Reduce speed on slopes — never mow across steep gradients
5. Disengage PTO before reversing

## After Use

1. Disengage PTO and let engine idle for 2 minutes
2. Clean underside of deck (use scraper, not water)
3. Park on flat ground
4. Log session end in Apex Tracking`,
    source: "manual",
    assetName: "Ride-On Mower",
    createdBy: "user-001",
    createdAt: "2025-11-25T10:00:00Z",
    updatedAt: "2026-02-01T10:00:00Z",
    createdByName: "Alex Carter",
  },
  {
    id: "sop-005",
    businessId: "biz-001",
    assetId: "asset-006",
    title: "Excavator Operating Procedure",
    content: `## Pre-Start Checks

1. Walk around — check for fluid leaks, damage, loose parts
2. Check hydraulic fluid level
3. Inspect tracks for tension and wear
4. Verify all mirrors and camera are clean
5. Check bucket teeth for wear

## Operating

1. Fasten seatbelt before starting
2. Allow engine to warm up for 2 minutes
3. Test all controls before beginning work
4. Maintain safe distance from edges and trenches
5. Be aware of underground services — always check plans

## Shut Down

1. Lower bucket to ground
2. Return all controls to neutral
3. Let engine idle for 2 minutes before shutdown
4. Engage travel lock
5. Log session end in Apex Tracking`,
    source: "manual",
    assetName: "Compact Excavator",
    createdBy: "user-001",
    createdAt: "2025-09-20T10:00:00Z",
    updatedAt: "2026-01-25T10:00:00Z",
    createdByName: "Alex Carter",
  },
];

// ── Reports ────────────────────────────────────────────

export let MOCK_REPORTS: MaintenanceReport[] = [
  {
    id: "report-001",
    assetId: "asset-004",
    businessId: "biz-001",
    reportedBy: "user-003",
    title: "Blade guard loose",
    description: "The blade guard is loose and rattles during operation. Bolts may need replacing. Took it out of service until fixed.",
    severity: "high",
    status: "open",
    createdAt: "2026-02-17T09:00:00Z",
    updatedAt: "2026-02-17T09:00:00Z",
    assetName: "Hedge Trimmer",
    reportedByName: "Sam Rivera",
    photos: [],
  },
  {
    id: "report-002",
    assetId: "asset-002",
    sessionId: "session-003",
    businessId: "biz-001",
    reportedBy: "user-001",
    title: "Unusual engine noise",
    description: "Engine is making a slight knocking sound at high RPM. Doesn't affect operation yet but should be checked.",
    severity: "medium",
    status: "open",
    createdAt: "2026-02-20T12:35:00Z",
    updatedAt: "2026-02-20T12:35:00Z",
    assetName: "Ride-On Mower",
    reportedByName: "Alex Carter",
    photos: [],
  },
];

// ── Mutation Functions ────────────────────────────────

let sessionCounter = 0;

export function mockStartSession(
  assetId: string,
  startedBy: string,
  startedByName: string,
  assetName: string,
): UsageSession {
  sessionCounter++;
  const newSession: UsageSession = {
    id: `session-new-${sessionCounter}`,
    assetId,
    startedBy,
    startedAt: new Date().toISOString(),
    status: "active",
    assetName,
    startedByName,
  };
  MOCK_SESSIONS = [newSession, ...MOCK_SESSIONS];
  MOCK_ASSETS = MOCK_ASSETS.map((a) =>
    a.id === assetId ? { ...a, status: "in_use" as const, updatedAt: new Date().toISOString() } : a,
  );
  return newSession;
}

export function mockPauseSession(sessionId: string): void {
  MOCK_SESSIONS = MOCK_SESSIONS.map((s) => {
    if (s.id !== sessionId || s.status !== "active") return s;
    return {
      ...s,
      status: "paused" as const,
      pausedAt: new Date().toISOString(),
    };
  });
}

export function mockResumeSession(sessionId: string): void {
  const now = Date.now();
  MOCK_SESSIONS = MOCK_SESSIONS.map((s) => {
    if (s.id !== sessionId || s.status !== "paused") return s;
    const pauseDuration = s.pausedAt ? now - new Date(s.pausedAt).getTime() : 0;
    return {
      ...s,
      status: "active" as const,
      pausedAt: undefined,
      totalPausedMs: (s.totalPausedMs ?? 0) + pauseDuration,
    };
  });
}

export function mockEndSession(
  sessionId: string,
  endedBy: string,
  endedByName: string,
  options?: { notes?: string; jobSiteName?: string },
): void {
  const now = new Date();
  MOCK_SESSIONS = MOCK_SESSIONS.map((s) => {
    if (s.id !== sessionId) return s;
    // If ending while paused, accumulate the final pause duration
    let totalPausedMs = s.totalPausedMs ?? 0;
    if (s.status === "paused" && s.pausedAt) {
      totalPausedMs += now.getTime() - new Date(s.pausedAt).getTime();
    }
    return {
      ...s,
      endedBy,
      endedByName,
      endedAt: now.toISOString(),
      status: "completed" as const,
      totalPausedMs,
      pausedAt: undefined,
      notes: options?.notes || s.notes,
      jobSiteName: options?.jobSiteName,
    };
  });

  const session = MOCK_SESSIONS.find((s) => s.id === sessionId);
  if (session) {
    const startTime = new Date(session.startedAt).getTime();
    const totalMs = now.getTime() - startTime - (session.totalPausedMs ?? 0);
    const durationHours = Math.round((totalMs / (1000 * 60 * 60)) * 10) / 10;
    MOCK_ASSETS = MOCK_ASSETS.map((a) =>
      a.id === session.assetId
        ? {
            ...a,
            status: "available" as const,
            totalUsageHours: Math.round((a.totalUsageHours + durationHours) * 10) / 10,
            updatedAt: now.toISOString(),
          }
        : a,
    );
  }
}

let reportCounter = 0;

export function mockCreateReport(params: {
  assetId: string;
  sessionId?: string;
  title: string;
  description: string;
  severity: import("@/src/types/report").ReportSeverity;
}): MaintenanceReport {
  reportCounter++;
  const asset = MOCK_ASSETS.find((a) => a.id === params.assetId);
  const newReport: MaintenanceReport = {
    id: `report-new-${reportCounter}`,
    assetId: params.assetId,
    sessionId: params.sessionId,
    businessId: "biz-001",
    reportedBy: CURRENT_USER.id,
    title: params.title,
    description: params.description,
    severity: params.severity,
    status: "open",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    assetName: asset?.name ?? "Unknown",
    reportedByName: CURRENT_USER.fullName,
    photos: [],
  };
  MOCK_REPORTS.push(newReport);
  return newReport;
}

export function mockUpdateAsset(assetId: string, updates: Partial<Asset>): Asset | null {
  const index = MOCK_ASSETS.findIndex((a) => a.id === assetId);
  if (index === -1) return null;
  MOCK_ASSETS[index] = { ...MOCK_ASSETS[index], ...updates, updatedAt: new Date().toISOString() };
  return MOCK_ASSETS[index];
}

export function mockDeleteAsset(assetId: string): void {
  MOCK_ASSETS = MOCK_ASSETS.filter((a) => a.id !== assetId);
  MOCK_SESSIONS = MOCK_SESSIONS.filter((s) => s.assetId !== assetId);
}

// ── Onboarding Mock Functions ─────────────────────────

let businessCounter = 0;

function generateBusinessCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `APEX-${code}`;
}

export function mockCreateBusiness(name: string): { business: Business; membership: Membership } {
  businessCounter++;
  const businessId = `biz-new-${businessCounter}`;
  const business: Business = {
    id: businessId,
    name,
    businessCode: generateBusinessCode(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const membership: Membership = {
    id: `mem-new-${businessCounter}`,
    userId: CURRENT_USER.id,
    businessId,
    role: "owner",
    joinedAt: new Date().toISOString(),
    user: { id: CURRENT_USER.id, fullName: CURRENT_USER.fullName, email: CURRENT_USER.email },
  };
  return { business, membership };
}

export function mockJoinBusiness(code: string): { success: boolean; error?: string; membership?: Membership } {
  if (code.toUpperCase() !== MOCK_BUSINESS.businessCode) {
    return { success: false, error: "Invalid business code. Please check the code and try again." };
  }
  const membership: Membership = {
    id: `mem-join-${Date.now()}`,
    userId: CURRENT_USER.id,
    businessId: MOCK_BUSINESS.id,
    role: "employee",
    joinedAt: new Date().toISOString(),
    user: { id: CURRENT_USER.id, fullName: CURRENT_USER.fullName, email: CURRENT_USER.email },
  };
  return { success: true, membership };
}

// ── Helper Functions ───────────────────────────────────

export function getActiveSessions(): UsageSession[] {
  return MOCK_SESSIONS.filter((s) => s.status === "active" || s.status === "paused");
}

export function getSessionsForAsset(assetId: string): UsageSession[] {
  return MOCK_SESSIONS.filter((s) => s.assetId === assetId);
}

export function getSchedulesForAsset(assetId: string): MaintenanceSchedule[] {
  return MOCK_SCHEDULES.filter((s) => s.assetId === assetId);
}

export function getLogsForSchedule(scheduleId: string): MaintenanceLog[] {
  return MOCK_LOGS.filter((l) => l.scheduleId === scheduleId);
}

export function getSOPsForAsset(assetId: string): Sop[] {
  return MOCK_SOPS.filter((s) => s.assetId === assetId);
}

export function getBusinessWideSOPs(): Sop[] {
  return MOCK_SOPS.filter((s) => !s.assetId);
}

export function getOverdueSchedules(): MaintenanceSchedule[] {
  return MOCK_SCHEDULES.filter((s) => s.dueStatus === "overdue");
}

export function getDueSoonSchedules(): MaintenanceSchedule[] {
  return MOCK_SCHEDULES.filter((s) => s.dueStatus === "due_soon");
}

export function getAssetsInUseCount(): number {
  return MOCK_ASSETS.filter((a) => a.status === "in_use").length;
}

export function getMaintenanceDueCount(): number {
  return MOCK_SCHEDULES.filter((s) => s.dueStatus === "overdue" || s.dueStatus === "due_soon").length;
}

export function getReportsForAsset(assetId: string): MaintenanceReport[] {
  return MOCK_REPORTS.filter((r) => r.assetId === assetId);
}
