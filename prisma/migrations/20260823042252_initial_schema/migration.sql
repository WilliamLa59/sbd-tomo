-- CreateEnum
CREATE TYPE "gender" AS ENUM ('male', 'female');

-- CreateEnum
CREATE TYPE "weight_unit" AS ENUM ('kg', 'lb');

-- CreateEnum
CREATE TYPE "team_role" AS ENUM ('coach', 'assistant_coach', 'athlete');

-- CreateEnum
CREATE TYPE "training_session_status" AS ENUM ('planned', 'in_progress', 'completed', 'skipped');

-- CreateEnum
CREATE TYPE "set_type" AS ENUM ('warmup', 'working', 'top', 'backdown', 'amrap');

-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "sessions" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "competition_weight_class_kg" DECIMAL(65,30),
ADD COLUMN     "date_of_birth" TIMESTAMP(3),
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "gender" "gender",
ADD COLUMN     "height_cm" DECIMAL(65,30),
ADD COLUMN     "preferred_unit" "weight_unit" NOT NULL DEFAULT 'kg',
ADD COLUMN     "timezone" TEXT;

-- AlterTable
ALTER TABLE "verifications" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "teams" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_memberships" (
    "id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" "team_role" NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "left_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "team_memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coach_athlete_assignments" (
    "id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "coach_membership_id" TEXT NOT NULL,
    "athlete_membership_id" TEXT NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unassigned_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "coach_athlete_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_settings" (
    "id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "allow_athlete_stats_visibility" BOOLEAN NOT NULL DEFAULT false,
    "allow_assistant_coach_self_assignment" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "team_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercises" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "parent_exercise_id" TEXT,
    "created_by_user_id" TEXT,
    "is_system" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "programs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "team_id" TEXT,
    "created_by_user_id" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "programs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "program_blocks" (
    "id" TEXT NOT NULL,
    "program_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "block_number" INTEGER NOT NULL,
    "number_of_weeks" INTEGER NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "program_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "block_id" TEXT,
    "week_number" INTEGER,
    "day_number" INTEGER,
    "name" TEXT,
    "scheduled_date" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "status" "training_session_status" NOT NULL DEFAULT 'planned',
    "bodyweight_kg" DECIMAL(65,30),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "training_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_session_exercises" (
    "id" TEXT NOT NULL,
    "training_session_id" TEXT NOT NULL,
    "exercise_id" TEXT NOT NULL,
    "exercise_order" INTEGER NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "training_session_exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prescribed_sets" (
    "id" TEXT NOT NULL,
    "training_session_exercise_id" TEXT NOT NULL,
    "set_number" INTEGER NOT NULL,
    "set_type" "set_type" NOT NULL DEFAULT 'working',
    "weight_kg" DECIMAL(65,30),
    "reps" INTEGER,
    "rpe" DECIMAL(65,30),
    "rir" DECIMAL(65,30),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "prescribed_sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "performed_sets" (
    "id" TEXT NOT NULL,
    "training_session_exercise_id" TEXT NOT NULL,
    "prescribed_set_id" TEXT,
    "set_number" INTEGER NOT NULL,
    "set_type" "set_type" NOT NULL DEFAULT 'working',
    "weight_kg" DECIMAL(65,30) NOT NULL,
    "reps" INTEGER NOT NULL,
    "rpe" DECIMAL(65,30),
    "rir" DECIMAL(65,30),
    "completed_at" TIMESTAMP(3),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "performed_sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personal_records" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "exercise_id" TEXT NOT NULL,
    "performed_set_id" TEXT NOT NULL,
    "weight_kg" DECIMAL(65,30) NOT NULL,
    "reps" INTEGER NOT NULL,
    "achieved_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "personal_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "team_memberships_user_id_idx" ON "team_memberships"("user_id");

-- CreateIndex
CREATE INDEX "team_memberships_team_id_idx" ON "team_memberships"("team_id");

-- CreateIndex
CREATE INDEX "team_memberships_team_user_idx" ON "team_memberships"("team_id", "user_id");

-- CreateIndex
CREATE INDEX "coach_athlete_assignments_team_id_idx" ON "coach_athlete_assignments"("team_id");

-- CreateIndex
CREATE INDEX "coach_athlete_assignments_coach_membership_id_idx" ON "coach_athlete_assignments"("coach_membership_id");

-- CreateIndex
CREATE INDEX "coach_athlete_assignments_athlete_membership_id_idx" ON "coach_athlete_assignments"("athlete_membership_id");

-- CreateIndex
CREATE INDEX "coach_athlete_assignments_coach_athlete_idx" ON "coach_athlete_assignments"("coach_membership_id", "athlete_membership_id");

-- CreateIndex
CREATE UNIQUE INDEX "team_settings_team_id_key" ON "team_settings"("team_id");

-- CreateIndex
CREATE INDEX "exercises_parent_exercise_id_idx" ON "exercises"("parent_exercise_id");

-- CreateIndex
CREATE INDEX "exercises_created_by_user_id_idx" ON "exercises"("created_by_user_id");

-- CreateIndex
CREATE INDEX "exercises_slug_idx" ON "exercises"("slug");

-- CreateIndex
CREATE INDEX "programs_user_id_idx" ON "programs"("user_id");

-- CreateIndex
CREATE INDEX "programs_team_id_idx" ON "programs"("team_id");

-- CreateIndex
CREATE INDEX "programs_created_by_user_id_idx" ON "programs"("created_by_user_id");

-- CreateIndex
CREATE INDEX "program_blocks_program_id_idx" ON "program_blocks"("program_id");

-- CreateIndex
CREATE INDEX "program_blocks_program_block_number_idx" ON "program_blocks"("program_id", "block_number");

-- CreateIndex
CREATE INDEX "training_sessions_user_id_idx" ON "training_sessions"("user_id");

-- CreateIndex
CREATE INDEX "training_sessions_block_id_idx" ON "training_sessions"("block_id");

-- CreateIndex
CREATE INDEX "training_sessions_block_week_day_idx" ON "training_sessions"("block_id", "week_number", "day_number");

-- CreateIndex
CREATE INDEX "training_session_exercises_training_session_id_idx" ON "training_session_exercises"("training_session_id");

-- CreateIndex
CREATE INDEX "training_session_exercises_exercise_id_idx" ON "training_session_exercises"("exercise_id");

-- CreateIndex
CREATE INDEX "training_session_exercises_session_order_idx" ON "training_session_exercises"("training_session_id", "exercise_order");

-- CreateIndex
CREATE INDEX "prescribed_sets_training_session_exercise_id_idx" ON "prescribed_sets"("training_session_exercise_id");

-- CreateIndex
CREATE INDEX "prescribed_sets_exercise_set_number_idx" ON "prescribed_sets"("training_session_exercise_id", "set_number");

-- CreateIndex
CREATE INDEX "performed_sets_training_session_exercise_id_idx" ON "performed_sets"("training_session_exercise_id");

-- CreateIndex
CREATE INDEX "performed_sets_prescribed_set_id_idx" ON "performed_sets"("prescribed_set_id");

-- CreateIndex
CREATE INDEX "personal_records_user_id_idx" ON "personal_records"("user_id");

-- CreateIndex
CREATE INDEX "personal_records_exercise_id_idx" ON "personal_records"("exercise_id");

-- CreateIndex
CREATE INDEX "personal_records_performed_set_id_idx" ON "personal_records"("performed_set_id");

-- CreateIndex
CREATE INDEX "personal_records_user_exercise_reps_idx" ON "personal_records"("user_id", "exercise_id", "reps");

-- AddForeignKey
ALTER TABLE "team_memberships" ADD CONSTRAINT "team_memberships_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_memberships" ADD CONSTRAINT "team_memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coach_athlete_assignments" ADD CONSTRAINT "coach_athlete_assignments_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coach_athlete_assignments" ADD CONSTRAINT "coach_athlete_assignments_coach_membership_id_fkey" FOREIGN KEY ("coach_membership_id") REFERENCES "team_memberships"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coach_athlete_assignments" ADD CONSTRAINT "coach_athlete_assignments_athlete_membership_id_fkey" FOREIGN KEY ("athlete_membership_id") REFERENCES "team_memberships"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_settings" ADD CONSTRAINT "team_settings_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_parent_exercise_id_fkey" FOREIGN KEY ("parent_exercise_id") REFERENCES "exercises"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programs" ADD CONSTRAINT "programs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programs" ADD CONSTRAINT "programs_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programs" ADD CONSTRAINT "programs_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_blocks" ADD CONSTRAINT "program_blocks_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_sessions" ADD CONSTRAINT "training_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_sessions" ADD CONSTRAINT "training_sessions_block_id_fkey" FOREIGN KEY ("block_id") REFERENCES "program_blocks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_session_exercises" ADD CONSTRAINT "training_session_exercises_training_session_id_fkey" FOREIGN KEY ("training_session_id") REFERENCES "training_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_session_exercises" ADD CONSTRAINT "training_session_exercises_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescribed_sets" ADD CONSTRAINT "prescribed_sets_training_session_exercise_id_fkey" FOREIGN KEY ("training_session_exercise_id") REFERENCES "training_session_exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "performed_sets" ADD CONSTRAINT "performed_sets_training_session_exercise_id_fkey" FOREIGN KEY ("training_session_exercise_id") REFERENCES "training_session_exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "performed_sets" ADD CONSTRAINT "performed_sets_prescribed_set_id_fkey" FOREIGN KEY ("prescribed_set_id") REFERENCES "prescribed_sets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal_records" ADD CONSTRAINT "personal_records_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal_records" ADD CONSTRAINT "personal_records_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal_records" ADD CONSTRAINT "personal_records_performed_set_id_fkey" FOREIGN KEY ("performed_set_id") REFERENCES "performed_sets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Only one active membership per user/team.
CREATE UNIQUE INDEX "team_memberships_active_team_user_key"
ON "team_memberships" ("team_id", "user_id")
WHERE "left_at" IS NULL
  AND "deleted_at" IS NULL;

-- Only one active assignment of an athlete to a coach.
CREATE UNIQUE INDEX "coach_athlete_assignments_active_coach_athlete_key"
ON "coach_athlete_assignments" ("coach_membership_id", "athlete_membership_id")
WHERE "unassigned_at" IS NULL
  AND "deleted_at" IS NULL;

-- Exercise slugs only need to be unique among active exercises.
CREATE UNIQUE INDEX "exercises_active_slug_key"
ON "exercises" ("slug")
WHERE "deleted_at" IS NULL;

-- A block number can only appear once per program while active.
CREATE UNIQUE INDEX "program_blocks_active_program_block_number_key"
ON "program_blocks" ("program_id", "block_number")
WHERE "deleted_at" IS NULL;

-- An exercise position can only appear once in an active training session.
CREATE UNIQUE INDEX "training_session_exercises_active_order_key"
ON "training_session_exercises" ("training_session_id", "exercise_order")
WHERE "deleted_at" IS NULL;

-- A prescribed set number can only appear once per active session exercise.
CREATE UNIQUE INDEX "prescribed_sets_active_exercise_set_number_key"
ON "prescribed_sets" ("training_session_exercise_id", "set_number")
WHERE "deleted_at" IS NULL;

CREATE UNIQUE INDEX "personal_records_active_performed_set_key"
ON "personal_records" ("performed_set_id")
WHERE "deleted_at" IS NULL;
