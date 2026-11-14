# ⚡ LEVELUP — Your Career. Your Skills. Your Next Level.

> **“Don’t just learn skills. Build your future.”**  
> *Tagline: Learn Smarter. Grow Faster. Level Up.*

**LEVELUP** is a production-quality, Agentic AI-powered personalized learning and career development platform built for modern software engineers, students, and career transitioners. 

Unlike traditional LMS platforms that recommend identical courses to everyone, LEVELUP orchestrates **8 autonomous AI agents** that analyze individual strengths and gaps, generate dependency-ordered roadmaps, evaluate coding and quiz telemetry, and **automatically adapt learning paths in real time** based on learner performance.

---

## 🎨 Visual Design System

Designed as a futuristic SaaS telemetry platform inspired by Linear, Vercel, and high-performance developer dashboards:
- **Color Palette**:
  - Background: `#0B0B0D`
  - Secondary Background: `#111114`
  - Card Surfaces: `#18181D` (Elevated: `#202027`)
  - Subtle Borders: `#292930`
  - Primary Text: `#F5F5F7`
  - Secondary Text: `#92929D`
  - Neon Accents: Neon Green (`#B7FF5A`), Cyan (`#42D9F5`), Purple (`#A78BFA`)
- **Typography**:
  - Headings: `Space Grotesk`
  - Body: `Inter`
  - Code & Telemetry: `JetBrains Mono`
- **Animations & Scrolling**:
  - Lenis smooth momentum scrolling
  - Framer Motion micro-interactions, layout transitions, and toast notifications
  - Recharts radar, area, and bar charts
  - Bespoke concentric circular SWOT hierarchy sunburst chart matching the reference UI screenshot

---

## 🤖 Multi-Agent AI System Architecture

LEVELUP implements **8 collaborating specialized AI agents** sharing a unified state graph:

1. **Profile Intelligence Agent**: Extracts programming languages, frameworks, GitHub projects, and estimates experience levels from resumes and telemetry.
2. **Career Intelligence Agent**: Evaluates industry demand and establishes 2026 technical and soft skill benchmarks for target roles.
3. **Skill Gap Analyst Agent**: Performs differential analysis comparing existing competencies against target benchmarks, categorizing proficiencies into *Mastered*, *Improving*, *Weak*, and *Missing*.
4. **Learning Path Architect Agent**: Synthesizes modular personalized roadmaps in topological dependency order (Foundations → Core → Advanced → Capstone).
5. **Resource Intelligence Agent**: Curates verified, open-access, high-yield documentation, tutorials, and interactive sandboxes (MDN, React.dev, CSS Tricks, etc.).
6. **Performance Evaluation Agent**: Diagnoses assessment scores and coding submissions, identifies underlying conceptual gaps, and triggers conditional roadmap adaptation.
7. **Project Evaluation Agent**: Generates real-world portfolio specs, evaluates submitted code across 4 dimensions (Correctness, Architecture, Best Practices, Error Handling), and boosts verified skill levels.
8. **AI Mentor Agent**: Central conversational coordinator that explains complex concepts Socratically, provides code examples, and explains adaptive roadmap modifications.

---

## 🔄 The Core Adaptive Feedback Loop

The beating heart of LEVELUP is its closed-loop multi-agent adaptation:

```
Learner takes Assessment
          │
          ▼
Performance Evaluation Agent
(Scores answers & diagnoses conceptual gaps)
          │
          ├── Score >= 80% (Mastery)
          │   └── Learning Path Architect accelerates curriculum & unlocks advanced modules early.
          │
          ├── Score 50% - 79% (Developing)
          │   └── Learning Path Architect injects targeted retry exercises and queues.
          │
          └── Score < 50% (Remediation Required)
              └── Learning Path Architect dynamically inserts a specialized Revision Module
                  (e.g. Microtask & Event Loop Diagnostics) and pauses dependent modules.
```

---

## 🚀 Key Modules & Pages

- **Landing Page (`/`)**: Futuristic hero, animated preview mockup, multi-agent architecture breakdown, features showcase, and demo launcher.
- **Onboarding (`/onboarding`)**: 5-step onboarding wizard collecting profile info, target career, self-reported skills, and daily hours, ending with an animated live multi-agent orchestration terminal.
- **Main Dashboard (`/dashboard`)**:
  - Personalized career readiness score meter & streak telemetry.
  - Analytics cards: Mastered, In Progress, Missing Skills, Learning Hours, Streak, Projects.
  - **Skill Scores Bar List**: Status-badged metrics (`CRITICAL`, `WEAKNESS`, `IMPROVEMENTS`, `STRENGTH`) matching the reference UI.
  - **Concentric Circular SWOT Visualization**: Interactive sunburst donut chart displaying 22 metrics across Strengths, Weaknesses, Opportunities, and Threats with hover tooltips and drill-down panels.
  - Live agent activity summary ticker.
- **Career Twin (`/career-twin`)**: AI digital career identity with verified vs. self-reported breakdown, verified portfolio artifacts, and interactive telemetry Q&A.
- **Skill Intelligence (`/skill-intelligence`)**: Radar comparison chart and topological dependency graph (DAG) showing prerequisite chains.
- **Adaptive Roadmap (`/roadmap`)**: Interactive phase checkpoints with status badges, verified resource links, and "Take Assessment" triggers.
- **Learning Workspace (`/workspace`)**: Topic guide and interactive coding sandbox with unit test runner.
- **AI Mentor (`/mentor`)**: Conversational Socratic mentor loaded with the learner's complete skill matrix and roadmap context.
- **AI Project Lab (`/project-lab`)**: Project generator for specific skill gaps with code submission box and multi-rubric AI grading.
- **Mock Interviews (`/interviews`)**: Technical and behavioral interview simulator with AI feedback on accuracy, clarity, and depth.
- **Career Simulator (`/simulator`)**: Lateral career switcher comparing skill overlap %, missing skills, and delta weeks while preserving earned milestones.
- **Progress Analytics (`/analytics`)**: Recharts visualizations of readiness score trajectory, study hours, and score distributions.
- **Agent Control Center (`/agent-control`)**: AI command center displaying live status, tasks, and Server-Sent Events (SSE) stream for all 8 agents.
- **Settings (`/settings`)**: API keys configuration, portfolio JSON export, and one-click Demo Mode reset for hackathon judges.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Framer Motion, Lenis, Recharts, Lucide React, Canvas Confetti.
- **Backend**: Node.js, Express, TypeScript, Server-Sent Events (SSE), `@google/generative-ai`.
- **Database & Auth**: Supabase PostgreSQL schema with Row Level Security (RLS) migrations, plus high-performance local store fallback.
- **Agent Orchestrator**: LangGraph StateGraph design pattern with 8 specialized agent roles and deterministic fallback execution engine.

---

## 📦 Getting Started Locally

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v24.20.0)
- **npm**: v9+

### 2. Installation
```bash
# Clone the repository
git clone <repo-url>
cd LEVELUP

# Install dependencies for both client and server
npm install --prefix server
npm install --prefix client
```

### 3. Environment Variables (Optional)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*Note: If no API keys are provided, LEVELUP automatically runs in **Deterministic Heuristic Demo Mode** with realistic Alex Chen seed data and full functionality!*

### 4. Running the Application
Open two terminal windows:

**Terminal 1 (Backend Server on http://localhost:5001):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend Client on http://localhost:5173):**
```bash
cd client
npm run dev
```

Open your browser to: **`http://localhost:5173`**

---

## 🧪 Testing the Complete Feedback Loop (For Judges)

1. **Explore the Main Dashboard**: Notice Alex Chen's profile targeting *Full Stack Developer* with a 59% readiness score, the SWOT sunburst chart, and skill scores list.
2. **Trigger the Adaptive Loop**:
   - On the Dashboard or Roadmap page, click **"Take Module 2 Assessment"**.
   - Answer the 4 questions on JavaScript Asynchronous Execution & Microtasks.
   - Click **"Submit & Trigger Adaptive Loop"**.
3. **Observe Agent Reactions**:
   - The **Performance Evaluation Agent** diagnoses strong vs. weak concepts.
   - The **Learning Path Architect Agent** recalculates the roadmap (if score < 50%, a **Specialized Revision Module** is dynamically injected; if >= 80%, advanced React modules are accelerated).
   - The **AI Mentor Agent** sends a contextual summary to Alex.
4. **Inspect the Agent Control Center**:
   - Navigate to **Agent Control Center** in the sidebar to view all 8 agents and the live streaming event log.
5. **Test Project Lab**:
   - Go to **Project Lab**, view the auto-generated project for JavaScript async, click **"Submit to Project Agent"**, and watch your skill score boost!
6. **Simulate Career Switching**:
   - Go to **Career Simulator**, select *AI Engineer*, and observe the 58% skill overlap and transferable Python/SQL skills preserved without resetting!
7. **Reset Demo State Anytime**:
   - Click **"Reset Demo"** in the top navigation bar at any time to restore the original benchmark state.

---

## 🗄️ Database Setup (Supabase / PostgreSQL)

A complete database migration file is included at [`supabase/migrations/20261114_init.sql`](supabase/migrations/20261114_init.sql). It defines:
- `profiles`, `learner_skills`, `career_goals`, `career_requirements`
- `learning_roadmaps`, `roadmap_modules`, `learning_resources`
- `assessments`, `assessment_results`, `skill_assessments`
- `agent_runs`, `agent_events`, `mentor_conversations`, `project_evaluations`
- Row Level Security (RLS) policies and foreign keys.

To run this in Supabase:
1. Create a project in [Supabase](https://supabase.com).
2. Go to the **SQL Editor** tab.
3. Paste the contents of `supabase/migrations/20261114_init.sql` and run.
4. Copy your Supabase URL and Anon Key into `.env` or enter them in the app's **Settings** page.

---

## 🚢 Deployment

### Frontend (Vercel / Cloudflare Pages / Netlify)
```bash
cd client
npm run build
# Deploy the resulting /client/dist directory
```

### Backend (Render / Railway / Cloud Run)
```bash
cd server
npm run build
npm start
```

---

## 📄 License & Attribution
LEVELUP is open-source software built for the hackathon. Designed with craft, precision, and passion.

