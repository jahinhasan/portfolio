import type { Project } from "@/types";

/**
 * Project catalog — the single source of truth for every project on the site.
 *
 * Editing guide:
 *  - `featured: true`  → appears in Selected Projects. Exactly the four
 *                        flagship projects are featured (a test enforces it).
 *  - `screenshot`      → path under /public for a REAL screenshot only —
 *                        prefix with import.meta.env.BASE_URL (see rover-ui)
 *                        so it resolves on GitHub Pages. When omitted,
 *                        neutral generated art is shown — never invent an
 *                        image.
 *  - Every claim below was verified against the actual repositories in
 *    October 2026. Keep it that way — no invented features or metrics.
 *
 * NOTE: `payment-recovery-digital-twin` is intentionally NOT listed — it is a
 * near-identical mirror of the `aprs` repository (same README and code), so it
 * is deduplicated into the entry below. Add it as a separate card only if the
 * projects genuinely diverge.
 *
 * NEEDS CONFIRMATION: ShopSync role wording (group vs. solo contribution split).
 */

export const projects: Project[] = [
  {
    id: "rover-ui",
    name: "Mars Rover Competition Website",
    tagline:
      "Mission-control site for Team Antigravity's University Rover Challenge 2026 rover — a 3D solar-system navigator with telemetry, science, and vision dashboards.",
    category: "web",
    tech: ["React", "TypeScript", "Vite", "Tailwind CSS", "Three.js", "React Three Fiber", "React Router"],
    github: "https://github.com/jahinhasan/rover-ui",
    featured: true,
    year: "2026",
    status: "active",
    role: "Personal project — design & frontend",
    // BASE_URL keeps this correct on GitHub Pages (`/portfolio/`) and locally.
    screenshot: `${import.meta.env.BASE_URL}images/projects/rover-ui.jpg`,
    details: {
      problem:
        "A self-set brief for Team Antigravity's University Rover Challenge effort: a web interface that feels like mission control — a navigable 3D scene as the hub, with data-driven rover dashboards one click away — using only structured JSON as the 'spacecraft data source'.",
      approach: [
        "Built the scene with React Three Fiber and Three.js: instanced planet and star nodes, a rover model, postprocessing effects, and camera parallax for depth.",
        "Routed each planet plus moons/objects catalogs as real routes with React Router, keeping the 3D hub as the index.",
        "Drove every dashboard (telemetry, vision, navigation, science, team) from typed JSON data files so content is editable without touching components.",
      ],
      features: [
        "Interactive 3D space navigator with postprocessing effects",
        "Per-planet pages for all eight planets, plus moons and object catalogs",
        "Dashboard pages (telemetry, vision, science, navigation) fed by structured data",
        "Rover and team context for the University Rover Challenge (ARES-URC)",
      ],
      learnings: [
        "Performance budgeting for 3D on the web: instance what repeats, and keep the render loop free of per-frame allocations.",
        "Tailwind CSS v4 with a 3D-heavy app: utility-first styling still works when most layout is a canvas.",
      ],
    },
  },
  {
    id: "shopsync",
    name: "ShopSync",
    tagline:
      "Multi-vendor e-commerce marketplace with shop onboarding, moderation, realtime buyer–seller chat, and a loyalty program.",
    category: "web",
    tech: ["Laravel", "PHP 8.3", "MySQL", "Tailwind CSS", "Alpine.js", "Laravel Reverb", "Pest"],
    github: "https://github.com/jahinhasan/shopsync-a-web-development-project",
    featured: true,
    year: "2026",
    status: "coursework",
    role: "Academic web-development project — backend & frontend", // NEEDS CONFIRMATION: exact role split
    screenshot: undefined, // add one (BASE_URL-prefixed, see rover-ui) when you capture a real shot
    details: {
      problem:
        "The project brief was a marketplace where three very different audiences share one platform: customers who buy, independent shop owners who sell, and admins who keep the marketplace trustworthy — built around local payment habits (bKash, Nagad, cash on delivery).",
      approach: [
        "Modeled the domain around three role-specific surfaces: storefront, owner dashboard, and admin moderation panel, each with its own authorization rules.",
        "Built the full order lifecycle with per-item status tracking (pending → processing → shipped → delivered) instead of a single flat order state.",
        "Added realtime buyer–seller chat over WebSockets using Laravel Reverb, plus an in-app notification center with mark-as-read controls.",
        "Recorded every inventory movement as an audit transaction (stock before / change / after) so owner stock edits are traceable.",
        "Designed a loyalty engine: points on delivered orders, redeemable vouchers scoped to products/categories, and surprise reward vouchers.",
        "Covered checkout voucher rules and rate limiting with Pest feature tests.",
      ],
      features: [
        "Storefront search across product, category, seller, and shop name, with filtering and pagination",
        "Session cart with live stock validation at checkout",
        "bKash / Nagad manual payment reference verification by shop owners",
        "One review per customer per product — ratings require a verified purchase",
        "Shop onboarding: application with business details and identity documents, reviewer assignment, approve / reject / request-info workflow",
        "Admin moderation: suspend, warn, remove, or restore products; activate or suspend shops",
        "Sales reports for owners and platform-wide reports for admins",
      ],
      learnings: [
        "Laravel policy- and middleware-based authorization across three user roles",
        "Event broadcasting with Reverb and structuring chat around conversations rather than raw messages",
        "Why audit-trail tables beat mutating stock counts silently",
        "Writing feature tests around money-adjacent logic (vouchers, checkout)",
      ],
    },
  },
  {
    id: "focus-app",
    name: "Focus Dashboard",
    tagline:
      "Local-first productivity command center: CustomTkinter desktop dashboard with AI schedule parsing, timers, a file vault, and gamified habit tracking.",
    category: "automation",
    tech: ["Python", "CustomTkinter", "JSON storage", "Gemini API", "PyInstaller"],
    github: "https://github.com/jahinhasan/Focus-app",
    featured: true,
    year: "2026",
    status: "active",
    role: "Personal project",
    screenshot: undefined,
    details: {
      problem:
        "My tasks, class schedule, and study files lived in three different places. I wanted one local-first dashboard that also handles the most annoying input: transcribing a photo of a class routine into recurring calendar entries.",
      approach: [
        "Built the desktop core in Python with CustomTkinter, keeping all data in local JSON storage — private by default, no account required.",
        "Integrated AI schedule parsing (Gemini) for photo/screenshot → structured routine, with offline fuzzy-matched fallbacks so the app keeps working without the API.",
        "Packaged the app for distribution with PyInstaller alongside the source build.",
      ],
      features: [
        "Unified timeline of tasks and recurring class schedules, with overdue persistence",
        "XP/level system with daily habits and streaks; attendance tracking per class",
        "Pomodoro and stopwatch timers that survive app restarts via elapsed-time calculation",
        "Subject-based file vault with secure local persistence",
        "AI assistant chat for schedule queries with graceful offline degradation",
      ],
      learnings: [
        "Keeping a desktop UI responsive means moving every slow operation off the main thread.",
        "Designing AI features to fail soft: the app must stay useful offline.",
      ],
    },
  },
  {
    id: "rpg-the-student-life",
    name: "RPG — The Student Life",
    tagline:
      "Gamified CSE learning platform: realtime battle arenas, skill trees, classmate leaderboards, and 2D campus maps on Flutter + Firebase.",
    category: "mobile",
    tech: ["Flutter", "Dart", "Firebase Auth", "Cloud Firestore", "Cloud Functions", "Riverpod", "Clean Architecture"],
    github: "https://github.com/jahinhasan/RPG-the-student-life",
    featured: true,
    year: "2026",
    status: "active",
    role: "Team project",
    screenshot: undefined,
    details: {
      problem:
        "University coursework is more motivating when progress is visible and competitive. The team set out to turn CSE courses into a realtime RPG: XP, battles, leaderboards — without letting concurrent players corrupt shared state.",
      approach: [
        "Structured the app with Clean Architecture and Riverpod: features for auth, student, and admin, with shared services for matchmaking and storage.",
        "Made matchmaking transaction-safe with Firestore transactions so simultaneous queue joins can't double-match.",
        "Synced battle boards, leaderboards, and live activity tickers through Firestore stream providers, with Google Sign-In for student accounts.",
        "Scoped leaderboards to the viewer's own batch, department, and section so competition stays fair and local.",
      ],
      features: [
        "Competitive battle arenas with automated, transaction-safe matchmaking and graceful queue cancellation",
        "“Spot the Error” debugging game and a compiler sandbox with mock compile pipelines and test-assertion logs",
        "Keystroke-exact typing race with autocorrect and suggestion input disabled for clean mobile code entry",
        "CSE skill trees (Web, Mobile, Backend, DevOps) bound to level and XP",
        "2D campus map with live avatar positions",
        "Admin console for seeding questions, quests, and the student roster; widget tests for core flows",
      ],
      learnings: [
        "Firestore transactions vs. simple writes: what actually breaks when two clients race.",
        "Stream-provider architecture keeps realtime UIs declarative instead of imperative.",
      ],
    },
  },
  {
    id: "smartroute-lab",
    name: "SmartRoute Lab",
    tagline:
      "Network routing simulator comparing Dijkstra, multi-metric, and ML-assisted route selection on identical held-out scenarios — with honest baselines.",
    category: "networking",
    tech: ["Python 3.12+", "Pydantic", "scikit-learn", "NetworkX", "Streamlit", "pytest", "GitHub Actions"],
    github: "https://github.com/jahinhasan/smartroute-lab",
    featured: false,
    year: "2026",
    status: "active",
    role: "Personal project",
    details: {
      problem:
        "ML-assisted routing is often claimed to beat classical algorithms without a controlled comparison. I wanted a simulator where routing methods compete on identical, seeded scenarios — and where the honest answer (including “the ML model loses”) is documented.",
      approach: [
        "Modeled the network as a weighted graph with validated link properties (latency, bandwidth, packet loss, congestion, availability) enforced by Pydantic models at construction time.",
        "Implemented Dijkstra from scratch with deterministic tie-breaking, then cross-checked it against NetworkX on random topologies.",
        "Built a seeded, reproducible simulation engine: mutable link conditions, failure/recovery events, a documented fluid congestion model, and a structured event log.",
        "Ran the ML experiment under strict leakage rules: decision-time features only, scenario-grouped train/validation split, and evaluation against fixed-cost baselines plus the analytic formula the model never sees.",
        "Exposed every pipeline step through both a Streamlit dashboard and a scriptable CLI (`python -m smartroute.cli`).",
      ],
      features: [
        "Route comparison: hops, latency, bottleneck bandwidth, and independent-loss delivery probability",
        "Multi-metric weighted cost with normalization, alongside pure latency Dijkstra",
        "Link failure/recovery and live utilization tuning from the dashboard",
        "ML experiment with regression metrics per model and regret vs. the oracle selection",
        "Host monitoring (psutil CPU/memory) kept strictly separate from simulated network metrics",
        "CI on GitHub Actions: ruff lint + format check + pytest across Python 3.12 and 3.14",
      ],
      learnings: [
        "On held-out scenarios, the random forest beat mean and linear baselines but did not beat the analytic expectation (MAE 233 ms vs 127 ms) — documented openly in the repo rather than hidden.",
        "Why scenario-grouped splits matter: without them, near-duplicate scenarios leak between train and validation.",
        "Validating domain models at construction time removes whole classes of simulation bugs.",
      ],
    },
  },
  {
    id: "aprs",
    name: "APRS — Payment Recovery Digital Twin",
    tagline:
      "Event-driven platform that reconstructs failed payments, scores recovery risk with ML, and executes deterministic recovery decisions behind a fresh-evidence safety gate.",
    category: "backend",
    tech: ["Python", "FastAPI", "PostgreSQL", "SQLAlchemy", "Alembic", "XGBoost", "OpenAI API", "React", "TypeScript", "Docker"],
    github: "https://github.com/jahinhasan/aprs",
    featured: false,
    year: "2026",
    status: "active",
    role: "Personal project, built in staged milestones",
    mirrorOf: "payment-recovery-digital-twin",
    details: {
      problem:
        "Failed payments strand customer funds and flood support teams. Auto-releasing everything is financially risky; manual review of every failure is slow. The system needed to recover the safe cases automatically and prove, after the fact, why every decision was made.",
      approach: [
        "Reconstruct payment flows from fine-grained events (customer debit, gateway, merchant confirmation, settlement) as a pure deterministic function — auditable by construction.",
        "Classify anomalies with a 9-category taxonomy where deterministic rules always take precedence over ML anomaly scores.",
        "Run recovery through a pipeline: assessment → eligibility policy → fresh-evidence safety gate (prevents settlement races and double deductions) → idempotent executor with bounded retries → verification.",
        "Record every state transition in an append-only Digital Twin event log with correlation/causation IDs, enabling temporal queries over past system state.",
        "Generate GenAI explanations (English/Bangla) after decisions are made — they never influence outcomes, and customers never see risk scores.",
        "Harden the API: role-based authorization (SYSTEM > ADMIN > SUPPORT > CUSTOMER), ownership scoping, rate limiting, request correlation, and digest-based conflict detection on ingestion.",
      ],
      features: [
        "Policy simulation: replay historical evidence through versioned policies without touching live decisions",
        "Support workspace: customer reports → automatic case creation, transaction search, customer profiles",
        "Six deterministic demo scenarios plus a chaos lab with ten fault scenarios (concurrent recovery, provider failures, late events)",
        "React/TypeScript operations frontend with React Query and Zod-validated API contracts",
        "Docker Compose for the full stack; deployment configs for Vercel, Netlify, Railway, and Render",
      ],
      learnings: [
        "Designing idempotent, retry-safe execution when the same failure can be reported twice",
        "Why deterministic policy logic — not the ML score — must own the final decision in money-adjacent systems",
        "Event sourcing as an audit strategy: reconstructing any past state from an append-only log",
      ],
    },
  },
  {
    id: "snake-agent",
    name: "Snake Agent",
    tagline:
      "Snake with three brains: a human, a graph-search agent, and a PyTorch deep-RL agent trained for 100k episodes — with seeded benchmarks.",
    category: "ai-ml",
    tech: ["Python", "PyTorch", "NumPy", "pygame"],
    github: "https://github.com/jahinhasan/snake-agent",
    featured: false,
    year: "2026",
    status: "active",
    role: "Personal project",
    details: {
      problem:
        "I wanted to understand deep reinforcement learning end to end — not by tuning a tutorial, but by defining the observation space, reward function, and evaluation myself, and comparing the result against a classical search baseline on the same game.",
      approach: [
        "Built the game core from small composable modules (grid cells, directions, snake state, game loop) with a seeded food generator for reproducibility.",
        "Implemented a graph-based agent and an A* pathfinding agent as classical baselines.",
        "Trained a DQN-style agent: 4-channel grid observation plus head-direction and hunger features, 3 relative actions, ~645k parameters.",
        "Ran the full 100k-episode training (~7 hours on an RTX 5070 Ti laptop GPU) and kept the training history and the trained model in the repository.",
        "Added a benchmarking CLI that runs any mode for N seeded rounds so agents are compared on identical conditions.",
      ],
      features: [
        "Three switchable play modes: human, graph, and RL (`python main.py -m rl`)",
        "Seeded benchmark mode (`--bench-rounds`) reporting average reward and score per agent",
        "Frame recording option for capture and debugging",
        "Documented training curve: average score climbs from ~3 (episode 200) to ~23 (episode 100k)",
      ],
      learnings: [
        "Reward shaping dominates: most early training was spent fixing reward signals, not network architecture.",
        "Relative actions and hunger features materially improved learning stability compared to my first absolute-action attempt.",
        "Seeded evaluation is the only fair way to compare a stochastic RL agent against deterministic search.",
      ],
    },
  },
  {
    id: "web-scraper-tool",
    name: "Web Scraper Tool",
    tagline:
      "Desktop GUI scraper for paginated sites: custom CSS selector rules, polite crawling, retries with backoff, and one-click CSV/JSON/Excel export.",
    category: "automation",
    tech: ["Python", "Tkinter", "requests", "BeautifulSoup4", "pandas"],
    github: "https://github.com/jahinhasan/web-scraper-tool",
    featured: false,
    year: "2026",
    status: "complete",
    role: "Personal project",
    details: {
      problem:
        "Repeating the same extract-table-from-pages ritual by hand wastes hours. I wanted a tool where the scraping rules are configurable at runtime — no code edits — while staying polite to the target server.",
      approach: [
        "Separated the crawling engine (HTTP, parsing, rate limits) from the GUI layer so the rules are testable without a window.",
        "Defined scraping as a rule set: a CSS container selector plus per-field sub-selectors, with attribute extraction (a[href], img[src]) via bracket syntax.",
        "Kept the UI responsive by running pagination loops in a background thread pool and streaming results into a live table preview.",
        "Built politeness in rather than bolting it on: user-agent rotation, an adjustable delay slider, bounded worker count, and exponential backoff on 5xx responses.",
      ],
      features: [
        "Two modes: a pre-configured demo sandbox (quotes.toscrape.com) and a fully custom target with URL, page parameters, and page range",
        "Multi-format export to CSV, JSON, and Excel via pandas/openpyxl",
        "Live data preview as items arrive",
        "Documented ethics guidance: robots.txt, request delays, low thread counts",
      ],
      learnings: [
        "Thread/queue discipline: one producer, bounded work, UI updates marshalled back to the main loop.",
        "Real-world pages break selector assumptions — attribute fallbacks and per-field error isolation matter.",
      ],
    },
  },
  {
    id: "pdf-merger-tool",
    name: "PDF Merger Tool",
    tagline:
      "Local-first PDF workbench: merge with per-file page ranges, split, rotate, and encrypt/decrypt — with a threaded, always-responsive UI.",
    category: "automation",
    tech: ["Python", "Tkinter", "pypdf"],
    github: "https://github.com/jahinhasan/pdf-merger-tool",
    featured: false,
    year: "2026",
    status: "complete",
    role: "Personal project",
    details: {
      problem:
        "Every free online PDF merger wants an upload. Routine document work — merging course PDFs, extracting chapters, rotating scans — should happen locally, with no file leaving the machine.",
      approach: [
        "Implemented all document operations with pypdf and kept every byte local — the tool has no network use at all.",
        "Accepted per-file page-range syntax (e.g. `1-3, 5, 7-end`) parsed and validated before any document is touched.",
        "Ran heavy operations on worker threads with a progress bar and a live log console so the window never freezes.",
      ],
      features: [
        "Merge multiple PDFs with reorderable file list and per-file page ranges",
        "Extract a range to a new PDF, or explode a document into single-page files",
        "Rotate pages or ranges by 90°/180°/270°",
        "Password-protect PDFs and remove passwords (given the current one)",
      ],
      learnings: [
        "Keeping long operations off the UI thread is the difference between 'works' and 'usable'.",
        "Range parsing looks trivial until users type `7-end` — validate early, fail clearly.",
      ],
    },
  },
  {
    id: "safemind",
    name: "SafeMind",
    tagline:
      "Mental-health peer-support app for university students: anonymous posting, advisor responses, and moderation, built on Flutter + Firebase.",
    category: "mobile",
    tech: ["Flutter", "Dart", "Firebase Auth", "Cloud Firestore", "Firebase Storage"],
    github: "https://github.com/jahinhasan/safemind",
    featured: false,
    year: "2026",
    status: "coursework",
    role: "Team software-engineering course project",
    details: {
      problem:
        "Students often avoid seeking mental-health support because it isn't anonymous. The team designed a space for anonymous peer exchange where advisors can respond and moderators keep the feed safe.",
      approach: [
        "Modeled users, posts, comments, and reports as first-class domain objects with a backend-service abstraction that falls back to a demo mode when Firebase isn't configured.",
        "Enforced safety rules in Firestore security rules rather than only in client code.",
        "Treated moderation as a product flow (report → review → action), not an afterthought.",
      ],
      features: [
        "Anonymous login alongside standard sign-up",
        "Feed from a live stream source with post details and comments",
        "Support/like counts and best-solution marking",
        "Report submission flow and a safety/disclaimer screen",
      ],
      learnings: [
        "Security rules are the real API surface in a Firebase app — client checks are UX, not security.",
        "Designing for a sensitive domain changes defaults: anonymity first, data minimization, clear disclaimers.",
      ],
    },
  },
  {
    id: "hotel-management",
    name: "Hotel Management System",
    tagline:
      "PHP + MySQL booking system covering rooms, reservations, payments, staff, and guest feedback over a session-based API layer.",
    category: "web",
    tech: ["PHP", "MySQL", "JavaScript", "HTML/CSS"],
    github: "https://github.com/jahinhasan/Hotel_Management_system",
    featured: false,
    year: "2025",
    status: "coursework",
    role: "Academic coursework",
    details: {
      problem:
        "A classic first full-stack brief: run a hotel's core operations — availability, bookings, payments, staff, feedback — without any framework, to learn what frameworks actually automate.",
      approach: [
        "Designed a relational schema (users, rooms, bookings, payments, feedback) in SQL with foreign keys and seed data.",
        "Exposed focused JSON endpoints per resource (bookings, rooms, payments, staff, customers) with a shared bootstrap for session and DB handling.",
        "Handled the booking flow end to end: registration/login, room selection, booking creation, payment record, feedback.",
      ],
      features: [
        "Session-based authentication with login/register/logout and session checks",
        "Room inventory and availability endpoints",
        "Booking creation and listing with payment tracking",
        "Guest feedback capture",
      ],
      learnings: [
        "Writing raw SQL and session handling first made Laravel's equivalents (Eloquent, middleware) click later.",
        "Separating API endpoints from the page layer early keeps even small PHP apps sane.",
      ],
    },
  },
  {
    id: "team-infinity",
    name: "Team Infinity — Vision-Guided Rover",
    tagline:
      "Robotics competition build: YOLOv5 object detection on a laptop feeding steering commands over serial to an Arduino rover with ultrasonic obstacle avoidance.",
    category: "robotics",
    tech: ["Python", "YOLOv5", "PyTorch", "OpenCV", "PySerial", "C++ (Arduino)", "Ultrasonic sensors"],
    github: "https://github.com/jahinhasan/Team_Infinity",
    featured: false,
    year: "2025",
    status: "coursework",
    role: "Team competition project",
    details: {
      problem:
        "The rover had to find and physically approach target objects on a competition field within strict time limits — pure obstacle-avoidance wasn't enough, it needed to recognize what to approach.",
      approach: [
        "Trained a compact YOLOv5 detector (224px inference for CPU speed) and ran it against a live camera feed from a dedicated capture thread with a single-frame queue to stay real-time.",
        "Translated detections into bearing/distance commands and streamed them over PySerial to the Arduino at 9600 baud.",
        "Implemented the low-level rover firmware in C++: motor driver control plus three-ultrasonic (front/left/right) obstacle avoidance that always overrides vision commands when something is too close.",
      ],
      features: [
        "Real-time detection loop decoupled from camera capture via a bounded queue",
        "Serial command link between vision laptop and rover MCU with graceful handling when the Arduino is absent",
        "Trained weights and competition documentation checked into the repository",
      ],
      learnings: [
        "Latency budgeting across a two-computer pipeline: detection, serial, and motor response each add delay you must plan for.",
        "Safety layers belong in firmware — the lowest level must refuse dangerous commands regardless of what the 'smart' layer says.",
      ],
    },
  },
];

/** Default display order — featured projects first, then the archive. */
export const defaultProjectOrder: string[] = projects.map((p) => p.id);

export const projectCategoryLabels: Record<Project["category"], string> = {
  web: "Web Development",
  backend: "Backend & APIs",
  automation: "Automation & Tools",
  "ai-ml": "AI / ML",
  networking: "Networking & Systems",
  mobile: "Mobile / Desktop Apps",
  robotics: "Robotics",
};

export function getProjectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}
