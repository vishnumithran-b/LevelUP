-- LEVELUP Core Database Schema
-- Supabase PostgreSQL Migration

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    education TEXT,
    experience_level TEXT DEFAULT 'Beginner', -- Beginner, Intermediate, Advanced
    daily_available_hours NUMERIC DEFAULT 2.0,
    preferred_learning_style TEXT DEFAULT 'Practical / Project-based',
    learning_pace TEXT DEFAULT 'Moderate',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Career Goals
CREATE TABLE IF NOT EXISTS career_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    target_role TEXT NOT NULL, -- e.g. "Full Stack Developer", "AI Engineer"
    current_role TEXT DEFAULT 'Student / Career Transitioner',
    target_timeline_months INTEGER DEFAULT 6,
    career_readiness_score NUMERIC DEFAULT 45.0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Career Requirements Benchmark
CREATE TABLE IF NOT EXISTS career_requirements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_name TEXT UNIQUE NOT NULL,
    description TEXT,
    category TEXT, -- Frontend, Backend, AI/ML, Cloud
    required_skills JSONB NOT NULL DEFAULT '[]'::jsonb, -- [{ skill: 'React', min_proficiency: 80, importance: 'high' }]
    soft_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Learner Skills
CREATE TABLE IF NOT EXISTS learner_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    skill_name TEXT NOT NULL,
    category TEXT NOT NULL, -- Language, Framework, Tool, Soft Skill, Concept
    proficiency_level NUMERIC DEFAULT 50.0, -- 0 - 100
    status TEXT DEFAULT 'improving', -- 'mastered', 'improving', 'weak', 'missing'
    is_verified BOOLEAN DEFAULT FALSE,
    confidence_score NUMERIC DEFAULT 70.0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(profile_id, skill_name)
);

-- 5. Certifications
CREATE TABLE IF NOT EXISTS certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    issuer TEXT NOT NULL,
    issue_date DATE,
    credential_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Projects
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    tech_stack TEXT[] DEFAULT ARRAY[]::TEXT[],
    repo_url TEXT,
    live_url TEXT,
    verification_score NUMERIC DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Learning Roadmaps
CREATE TABLE IF NOT EXISTS learning_roadmaps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    career_goal_id UUID REFERENCES career_goals(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    summary TEXT,
    total_estimated_hours NUMERIC DEFAULT 120,
    completed_hours NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'active', -- active, completed, archived, adapted
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Roadmap Modules
CREATE TABLE IF NOT EXISTS roadmap_modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    roadmap_id UUID REFERENCES learning_roadmaps(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL,
    phase_name TEXT NOT NULL, -- 'Phase 1: Foundations', 'Phase 2: Core Development'
    title TEXT NOT NULL,
    description TEXT,
    target_skill TEXT NOT NULL,
    estimated_hours NUMERIC DEFAULT 15,
    status TEXT DEFAULT 'pending', -- 'completed', 'in_progress', 'pending', 'revision_needed'
    dependencies UUID[] DEFAULT ARRAY[]::UUID[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Learning Resources
CREATE TABLE IF NOT EXISTS learning_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID REFERENCES roadmap_modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    type TEXT NOT NULL, -- 'documentation', 'interactive_tutorial', 'video', 'course', 'exercise'
    is_free BOOLEAN DEFAULT TRUE,
    estimated_minutes INTEGER DEFAULT 30,
    difficulty TEXT DEFAULT 'Beginner',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Assessments
CREATE TABLE IF NOT EXISTS assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID REFERENCES roadmap_modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    skill_targeted TEXT NOT NULL,
    total_points INTEGER DEFAULT 100,
    passing_score INTEGER DEFAULT 75,
    questions JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Assessment Results
CREATE TABLE IF NOT EXISTS assessment_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
    score NUMERIC NOT NULL,
    total_score NUMERIC DEFAULT 100,
    passed BOOLEAN NOT NULL,
    evaluator_agent_summary TEXT,
    weak_concepts TEXT[] DEFAULT ARRAY[]::TEXT[],
    strong_concepts TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Skill Assessments
CREATE TABLE IF NOT EXISTS skill_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    skill_name TEXT NOT NULL,
    previous_score NUMERIC,
    new_score NUMERIC NOT NULL,
    evaluation_trigger TEXT, -- 'quiz', 'project', 'interview'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Learning Activity
CREATE TABLE IF NOT EXISTS learning_activity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL, -- 'lesson_completed', 'quiz_taken', 'project_submitted', 'mentor_interaction'
    title TEXT NOT NULL,
    duration_minutes INTEGER DEFAULT 30,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Agent Runs
CREATE TABLE IF NOT EXISTS agent_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    workflow_name TEXT NOT NULL, -- 'initial_onboarding_pipeline', 'adaptive_learning_loop', 'project_grading'
    status TEXT DEFAULT 'pending', -- 'running', 'completed', 'failed'
    input_payload JSONB DEFAULT '{}'::jsonb,
    output_payload JSONB DEFAULT '{}'::jsonb,
    execution_time_ms INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. Agent Events (Live Stream)
CREATE TABLE IF NOT EXISTS agent_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    run_id UUID REFERENCES agent_runs(id) ON DELETE CASCADE,
    agent_name TEXT NOT NULL, -- 'Profile Intelligence Agent', 'Skill Gap Analyst Agent', etc.
    event_type TEXT NOT NULL, -- 'agent_start', 'agent_progress', 'agent_finish', 'decision_branch'
    message TEXT NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. Mentor Conversations
CREATE TABLE IF NOT EXISTS mentor_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL, -- 'user', 'assistant', 'system'
    message TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. Project Evaluations
CREATE TABLE IF NOT EXISTS project_evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    project_title TEXT NOT NULL,
    submitted_code TEXT,
    overall_score NUMERIC NOT NULL,
    correctness_score NUMERIC NOT NULL,
    architecture_score NUMERIC NOT NULL,
    best_practices_score NUMERIC NOT NULL,
    error_handling_score NUMERIC NOT NULL,
    feedback TEXT NOT NULL,
    actionable_improvements TEXT[] DEFAULT ARRAY[]::TEXT[],
    skills_boosted JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE learner_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_evaluations ENABLE ROW LEVEL SECURITY;

-- Helper policies for demo / authenticated user
CREATE POLICY "Public read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "User edit profile" ON profiles FOR ALL USING (true);

CREATE POLICY "Public read skills" ON learner_skills FOR SELECT USING (true);
CREATE POLICY "User edit skills" ON learner_skills FOR ALL USING (true);

CREATE POLICY "Public read goals" ON career_goals FOR SELECT USING (true);
CREATE POLICY "User edit goals" ON career_goals FOR ALL USING (true);

CREATE POLICY "Public read roadmaps" ON learning_roadmaps FOR SELECT USING (true);
CREATE POLICY "User edit roadmaps" ON learning_roadmaps FOR ALL USING (true);

CREATE POLICY "Public read modules" ON roadmap_modules FOR SELECT USING (true);
CREATE POLICY "User edit modules" ON roadmap_modules FOR ALL USING (true);

