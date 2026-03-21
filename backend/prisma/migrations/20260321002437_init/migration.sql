-- CreateEnum
CREATE TYPE "MemberRole" AS ENUM ('owner', 'employee');

-- CreateEnum
CREATE TYPE "AssetStatus" AS ENUM ('available', 'in_use', 'maintenance');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('active', 'completed');

-- CreateEnum
CREATE TYPE "ReportSeverity" AS ENUM ('low', 'medium', 'high', 'critical');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('open', 'in_progress', 'resolved');

-- CreateEnum
CREATE TYPE "SopSource" AS ENUM ('manual', 'custom');

-- CreateEnum
CREATE TYPE "ScheduleTrigger" AS ENUM ('usage_hours', 'time_interval');

-- CreateTable
CREATE TABLE "businesses" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "business_code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "businesses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "avatar_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "memberships" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "role" "MemberRole" NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assets" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "serial_number" TEXT NOT NULL,
    "purchase_date" DATE NOT NULL,
    "nfc_tag_id" TEXT,
    "photo_url" TEXT,
    "manual_url" TEXT,
    "status" "AssetStatus" NOT NULL DEFAULT 'available',
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usage_sessions" (
    "id" TEXT NOT NULL,
    "asset_id" TEXT NOT NULL,
    "started_by" TEXT NOT NULL,
    "ended_by" TEXT,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3),
    "notes" TEXT,
    "job_site_name" TEXT,
    "total_paused_ms" INTEGER,
    "status" "SessionStatus" NOT NULL DEFAULT 'active',

    CONSTRAINT "usage_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenance_reports" (
    "id" TEXT NOT NULL,
    "asset_id" TEXT NOT NULL,
    "session_id" TEXT,
    "business_id" TEXT NOT NULL,
    "reported_by" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" "ReportSeverity" NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'open',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "maintenance_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_photos" (
    "id" TEXT NOT NULL,
    "report_id" TEXT NOT NULL,
    "photo_url" TEXT NOT NULL,
    "caption" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "report_photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sops" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "asset_id" TEXT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "source" "SopSource" NOT NULL DEFAULT 'custom',
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenance_schedules" (
    "id" TEXT NOT NULL,
    "asset_id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "trigger_type" "ScheduleTrigger" NOT NULL,
    "interval_hours" DOUBLE PRECISION,
    "interval_days" INTEGER,
    "last_completed_at" TIMESTAMP(3),
    "last_completed_usage_hours" DOUBLE PRECISION,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "maintenance_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenance_logs" (
    "id" TEXT NOT NULL,
    "schedule_id" TEXT NOT NULL,
    "asset_id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "completed_by" TEXT NOT NULL,
    "completed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usage_hours_at_completion" DOUBLE PRECISION,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "maintenance_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenance_log_photos" (
    "id" TEXT NOT NULL,
    "log_id" TEXT NOT NULL,
    "photo_url" TEXT NOT NULL,
    "caption" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "maintenance_log_photos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "businesses_business_code_key" ON "businesses"("business_code");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "memberships_business_id_idx" ON "memberships"("business_id");

-- CreateIndex
CREATE UNIQUE INDEX "memberships_user_id_business_id_key" ON "memberships"("user_id", "business_id");

-- CreateIndex
CREATE UNIQUE INDEX "memberships_user_id_key" ON "memberships"("user_id");

-- CreateIndex
CREATE INDEX "assets_business_id_idx" ON "assets"("business_id");

-- CreateIndex
CREATE UNIQUE INDEX "assets_business_id_serial_number_key" ON "assets"("business_id", "serial_number");

-- CreateIndex
CREATE INDEX "usage_sessions_asset_id_idx" ON "usage_sessions"("asset_id");

-- CreateIndex
CREATE INDEX "usage_sessions_asset_id_status_idx" ON "usage_sessions"("asset_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "maintenance_reports_session_id_key" ON "maintenance_reports"("session_id");

-- CreateIndex
CREATE INDEX "maintenance_reports_business_id_idx" ON "maintenance_reports"("business_id");

-- CreateIndex
CREATE INDEX "maintenance_reports_asset_id_idx" ON "maintenance_reports"("asset_id");

-- CreateIndex
CREATE INDEX "report_photos_report_id_idx" ON "report_photos"("report_id");

-- CreateIndex
CREATE INDEX "sops_business_id_idx" ON "sops"("business_id");

-- CreateIndex
CREATE INDEX "sops_asset_id_idx" ON "sops"("asset_id");

-- CreateIndex
CREATE INDEX "maintenance_schedules_asset_id_idx" ON "maintenance_schedules"("asset_id");

-- CreateIndex
CREATE INDEX "maintenance_schedules_business_id_idx" ON "maintenance_schedules"("business_id");

-- CreateIndex
CREATE INDEX "maintenance_logs_schedule_id_idx" ON "maintenance_logs"("schedule_id");

-- CreateIndex
CREATE INDEX "maintenance_logs_asset_id_idx" ON "maintenance_logs"("asset_id");

-- CreateIndex
CREATE INDEX "maintenance_logs_business_id_idx" ON "maintenance_logs"("business_id");

-- CreateIndex
CREATE INDEX "maintenance_log_photos_log_id_idx" ON "maintenance_log_photos"("log_id");

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usage_sessions" ADD CONSTRAINT "usage_sessions_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usage_sessions" ADD CONSTRAINT "usage_sessions_started_by_fkey" FOREIGN KEY ("started_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usage_sessions" ADD CONSTRAINT "usage_sessions_ended_by_fkey" FOREIGN KEY ("ended_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_reports" ADD CONSTRAINT "maintenance_reports_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_reports" ADD CONSTRAINT "maintenance_reports_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "usage_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_reports" ADD CONSTRAINT "maintenance_reports_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_reports" ADD CONSTRAINT "maintenance_reports_reported_by_fkey" FOREIGN KEY ("reported_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_photos" ADD CONSTRAINT "report_photos_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "maintenance_reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sops" ADD CONSTRAINT "sops_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sops" ADD CONSTRAINT "sops_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sops" ADD CONSTRAINT "sops_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_schedules" ADD CONSTRAINT "maintenance_schedules_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_schedules" ADD CONSTRAINT "maintenance_schedules_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_schedules" ADD CONSTRAINT "maintenance_schedules_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_logs" ADD CONSTRAINT "maintenance_logs_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "maintenance_schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_logs" ADD CONSTRAINT "maintenance_logs_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_logs" ADD CONSTRAINT "maintenance_logs_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_logs" ADD CONSTRAINT "maintenance_logs_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_log_photos" ADD CONSTRAINT "maintenance_log_photos_log_id_fkey" FOREIGN KEY ("log_id") REFERENCES "maintenance_logs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
