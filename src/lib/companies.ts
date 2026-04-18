export type CompanyCategory =
  | "frontier-ai"
  | "ai-applications"
  | "ai-infra"
  | "devtools"
  | "coding-agents"
  | "robotics"
  | "space"
  | "defense"
  | "autonomy"
  | "biotech"
  | "health-ai"
  | "legal-ai"
  | "finance-ai"
  | "fintech"
  | "consumer-ai"
  | "search-ai"
  | "voice-ai"
  | "media-ai"
  | "data-ai"
  | "energy"
  | "climate"
  | "neurotech";

export type Company = {
  slug: string;
  name: string;
  category: CompanyCategory;
  website: string;
  careers: string;
  hq: string;
  blurb: string;
  tags: string[];
};

export const COMPANIES: Company[] = [
  // ---------- Frontier AI ----------
  { slug: "anthropic", name: "Anthropic", category: "frontier-ai", website: "https://anthropic.com", careers: "https://www.anthropic.com/careers", hq: "San Francisco", blurb: "Builder of Claude. Safety-first frontier lab.", tags: ["ai-research", "engineer", "product", "safety"] },
  { slug: "openai", name: "OpenAI", category: "frontier-ai", website: "https://openai.com", careers: "https://openai.com/careers", hq: "San Francisco", blurb: "GPT/ChatGPT. AGI-scale compute.", tags: ["ai-research", "engineer", "product"] },
  { slug: "google-deepmind", name: "Google DeepMind", category: "frontier-ai", website: "https://deepmind.google", careers: "https://deepmind.google/about/careers/", hq: "London / Mountain View", blurb: "Gemini + research. AlphaFold lineage.", tags: ["ai-research", "engineer"] },
  { slug: "xai", name: "xAI", category: "frontier-ai", website: "https://x.ai", careers: "https://x.ai/careers", hq: "San Francisco / Memphis", blurb: "Grok. Colossus training cluster.", tags: ["ai-research", "engineer", "infra"] },
  { slug: "meta-superintelligence", name: "Meta Superintelligence Labs", category: "frontier-ai", website: "https://ai.meta.com", careers: "https://www.metacareers.com/", hq: "Menlo Park", blurb: "FAIR + superintelligence push.", tags: ["ai-research", "engineer"] },
  { slug: "mistral", name: "Mistral AI", category: "frontier-ai", website: "https://mistral.ai", careers: "https://mistral.ai/careers", hq: "Paris", blurb: "Open weights frontier from Europe.", tags: ["ai-research", "engineer"] },
  { slug: "cohere", name: "Cohere", category: "frontier-ai", website: "https://cohere.com", careers: "https://cohere.com/careers", hq: "Toronto", blurb: "Enterprise LLM platform. Command-R.", tags: ["ai-research", "engineer", "forward-deployed"] },
  { slug: "safe-superintelligence", name: "Safe Superintelligence Inc.", category: "frontier-ai", website: "https://ssi.inc", careers: "https://ssi.inc", hq: "Palo Alto / Tel Aviv", blurb: "Sutskever's SSI. One goal, one product.", tags: ["ai-research"] },
  { slug: "thinking-machines", name: "Thinking Machines Lab", category: "frontier-ai", website: "https://thinkingmachines.ai", careers: "https://thinkingmachines.ai/careers", hq: "San Francisco", blurb: "Mira Murati's lab. Frontier research.", tags: ["ai-research", "engineer"] },
  { slug: "poolside", name: "Poolside", category: "frontier-ai", website: "https://poolside.ai", careers: "https://poolside.ai/careers", hq: "Paris / SF", blurb: "Frontier models for software engineering.", tags: ["ai-research", "engineer", "coding"] },
  { slug: "magic", name: "Magic", category: "frontier-ai", website: "https://magic.dev", careers: "https://magic.dev/careers", hq: "San Francisco", blurb: "Ultra-long-context code models.", tags: ["ai-research", "engineer", "coding"] },
  { slug: "reka", name: "Reka AI", category: "frontier-ai", website: "https://reka.ai", careers: "https://reka.ai/careers", hq: "San Francisco", blurb: "Multimodal frontier models.", tags: ["ai-research", "engineer"] },
  { slug: "liquid-ai", name: "Liquid AI", category: "frontier-ai", website: "https://liquid.ai", careers: "https://liquid.ai/careers", hq: "Cambridge, MA", blurb: "Liquid foundation models out of MIT.", tags: ["ai-research", "engineer"] },

  // ---------- AI applications ----------
  { slug: "perplexity", name: "Perplexity", category: "search-ai", website: "https://perplexity.ai", careers: "https://perplexity.ai/hub/careers", hq: "San Francisco", blurb: "Answer engine replacing search.", tags: ["engineer", "product", "gtm"] },
  { slug: "harvey", name: "Harvey", category: "legal-ai", website: "https://harvey.ai", careers: "https://www.harvey.ai/careers", hq: "San Francisco", blurb: "Generative AI for elite law firms.", tags: ["forward-deployed", "engineer", "product", "legal"] },
  { slug: "hebbia", name: "Hebbia", category: "finance-ai", website: "https://hebbia.ai", careers: "https://www.hebbia.com/careers", hq: "New York", blurb: "Matrix — AI for complex knowledge work (finance, consulting).", tags: ["forward-deployed", "engineer", "product", "finance"] },
  { slug: "rogo", name: "Rogo", category: "finance-ai", website: "https://rogo.ai", careers: "https://rogo.ai/careers", hq: "New York", blurb: "AI analyst for investment banking + PE.", tags: ["forward-deployed", "engineer", "finance", "banker"] },
  { slug: "glean", name: "Glean", category: "ai-applications", website: "https://glean.com", careers: "https://www.glean.com/careers", hq: "Palo Alto", blurb: "Enterprise search + AI assistant.", tags: ["engineer", "product", "forward-deployed"] },
  { slug: "sierra", name: "Sierra", category: "ai-applications", website: "https://sierra.ai", careers: "https://sierra.ai/careers", hq: "San Francisco", blurb: "Bret Taylor's conversational AI for customer experience.", tags: ["engineer", "forward-deployed", "product"] },
  { slug: "decagon", name: "Decagon", category: "ai-applications", website: "https://decagon.ai", careers: "https://decagon.ai/careers", hq: "San Francisco", blurb: "AI agents for customer support.", tags: ["engineer", "forward-deployed", "gtm"] },
  { slug: "crusoe", name: "Crusoe", category: "ai-infra", website: "https://crusoe.ai", careers: "https://crusoe.ai/careers", hq: "Denver", blurb: "Clean-compute for AI. GPU clouds on stranded energy.", tags: ["engineer", "infra", "energy"] },
  { slug: "observe-ai", name: "Observe.AI", category: "ai-applications", website: "https://observe.ai", careers: "https://www.observe.ai/careers", hq: "San Francisco", blurb: "Contact center AI.", tags: ["engineer", "product"] },
  { slug: "cresta", name: "Cresta", category: "ai-applications", website: "https://cresta.com", careers: "https://cresta.com/careers", hq: "San Francisco", blurb: "Real-time AI for contact centers.", tags: ["engineer", "forward-deployed"] },
  { slug: "scale", name: "Scale AI", category: "ai-applications", website: "https://scale.com", careers: "https://scale.com/careers", hq: "San Francisco", blurb: "Data infra for AI + defense.", tags: ["engineer", "forward-deployed", "defense"] },
  { slug: "you-com", name: "You.com", category: "search-ai", website: "https://you.com", careers: "https://about.you.com/careers/", hq: "Palo Alto", blurb: "AI-native search + productivity.", tags: ["engineer", "product"] },
  { slug: "character-ai", name: "Character.AI", category: "consumer-ai", website: "https://character.ai", careers: "https://character.ai/jobs", hq: "Menlo Park", blurb: "Companions + consumer AI.", tags: ["engineer", "product"] },
  { slug: "replika", name: "Replika", category: "consumer-ai", website: "https://replika.com", careers: "https://replika.com/careers", hq: "San Francisco", blurb: "AI companion.", tags: ["engineer", "product"] },
  { slug: "nothingai", name: "Adept", category: "ai-applications", website: "https://adept.ai", careers: "https://adept.ai/careers", hq: "San Francisco", blurb: "Action models for knowledge work.", tags: ["ai-research", "engineer"] },
  { slug: "tennr", name: "Tennr", category: "health-ai", website: "https://tennr.com", careers: "https://tennr.com/careers", hq: "New York", blurb: "Healthcare workflow automation with LLMs.", tags: ["engineer", "forward-deployed", "health"] },
  { slug: "abridge", name: "Abridge", category: "health-ai", website: "https://abridge.com", careers: "https://www.abridge.com/careers", hq: "Pittsburgh / SF", blurb: "Clinical documentation AI.", tags: ["engineer", "health", "product"] },
  { slug: "ambience", name: "Ambience Healthcare", category: "health-ai", website: "https://ambiencehealthcare.com", careers: "https://ambiencehealthcare.com/careers", hq: "San Francisco", blurb: "Ambient AI scribe for clinicians.", tags: ["engineer", "health"] },
  { slug: "hippocratic", name: "Hippocratic AI", category: "health-ai", website: "https://hippocraticai.com", careers: "https://www.hippocraticai.com/careers", hq: "Palo Alto", blurb: "Safety-focused healthcare LLMs.", tags: ["ai-research", "engineer", "health"] },
  { slug: "openevidence", name: "OpenEvidence", category: "health-ai", website: "https://openevidence.com", careers: "https://www.openevidence.com/careers", hq: "Cambridge, MA", blurb: "Evidence-based clinical AI.", tags: ["engineer", "health", "research"] },

  // ---------- Coding agents / devtools ----------
  { slug: "cursor", name: "Cursor (Anysphere)", category: "coding-agents", website: "https://cursor.com", careers: "https://anysphere.inc/careers", hq: "San Francisco", blurb: "The AI code editor.", tags: ["engineer", "product", "coding"] },
  { slug: "cognition", name: "Cognition (Devin)", category: "coding-agents", website: "https://cognition.ai", careers: "https://cognition.ai/careers", hq: "San Francisco", blurb: "Devin — autonomous software engineer.", tags: ["ai-research", "engineer", "coding"] },
  { slug: "windsurf", name: "Windsurf (Codeium)", category: "coding-agents", website: "https://codeium.com", careers: "https://codeium.com/careers", hq: "Mountain View", blurb: "Agentic IDE.", tags: ["engineer", "coding"] },
  { slug: "replit", name: "Replit", category: "coding-agents", website: "https://replit.com", careers: "https://replit.com/careers", hq: "San Francisco", blurb: "Agent-first dev environment.", tags: ["engineer", "coding", "product"] },
  { slug: "vercel", name: "Vercel", category: "devtools", website: "https://vercel.com", careers: "https://vercel.com/careers", hq: "San Francisco", blurb: "Frontend cloud + Next.js.", tags: ["engineer", "devtools", "gtm"] },
  { slug: "modal", name: "Modal", category: "ai-infra", website: "https://modal.com", careers: "https://modal.com/careers", hq: "New York", blurb: "Serverless Python for AI workloads.", tags: ["engineer", "infra"] },
  { slug: "baseten", name: "Baseten", category: "ai-infra", website: "https://baseten.co", careers: "https://www.baseten.co/careers", hq: "San Francisco", blurb: "Inference infra.", tags: ["engineer", "infra"] },
  { slug: "together", name: "Together AI", category: "ai-infra", website: "https://together.ai", careers: "https://www.together.ai/careers", hq: "San Francisco", blurb: "Open model cloud.", tags: ["engineer", "infra", "ai-research"] },
  { slug: "fireworks", name: "Fireworks AI", category: "ai-infra", website: "https://fireworks.ai", careers: "https://fireworks.ai/careers", hq: "Redwood City", blurb: "Fast inference for production.", tags: ["engineer", "infra"] },
  { slug: "groq", name: "Groq", category: "ai-infra", website: "https://groq.com", careers: "https://groq.com/careers", hq: "Mountain View", blurb: "LPU inference engine.", tags: ["engineer", "hardware", "infra"] },
  { slug: "sambanova", name: "SambaNova", category: "ai-infra", website: "https://sambanova.ai", careers: "https://sambanova.ai/careers", hq: "Palo Alto", blurb: "Reconfigurable dataflow for AI.", tags: ["engineer", "hardware"] },
  { slug: "cerebras", name: "Cerebras", category: "ai-infra", website: "https://cerebras.ai", careers: "https://cerebras.ai/careers", hq: "Sunnyvale", blurb: "Wafer-scale chips.", tags: ["engineer", "hardware"] },
  { slug: "tenstorrent", name: "Tenstorrent", category: "ai-infra", website: "https://tenstorrent.com", careers: "https://tenstorrent.com/careers", hq: "Toronto / Austin", blurb: "Open RISC-V AI hardware.", tags: ["engineer", "hardware"] },
  { slug: "nvidia", name: "NVIDIA", category: "ai-infra", website: "https://nvidia.com", careers: "https://www.nvidia.com/en-us/about-nvidia/careers/", hq: "Santa Clara", blurb: "The AI hardware company.", tags: ["engineer", "ai-research", "hardware"] },
  { slug: "amd", name: "AMD", category: "ai-infra", website: "https://amd.com", careers: "https://careers.amd.com", hq: "Santa Clara", blurb: "MI accelerators + ROCm.", tags: ["engineer", "hardware"] },
  { slug: "anyscale", name: "Anyscale", category: "ai-infra", website: "https://anyscale.com", careers: "https://www.anyscale.com/careers", hq: "San Francisco", blurb: "Ray + compute for AI.", tags: ["engineer", "infra"] },
  { slug: "langchain", name: "LangChain", category: "devtools", website: "https://langchain.com", careers: "https://www.langchain.com/careers", hq: "San Francisco", blurb: "Agent framework + LangSmith.", tags: ["engineer", "devtools"] },
  { slug: "pinecone", name: "Pinecone", category: "ai-infra", website: "https://pinecone.io", careers: "https://www.pinecone.io/careers/", hq: "New York", blurb: "Vector database.", tags: ["engineer", "infra"] },
  { slug: "weaviate", name: "Weaviate", category: "ai-infra", website: "https://weaviate.io", careers: "https://weaviate.io/company/careers", hq: "Amsterdam", blurb: "Open-source vector DB.", tags: ["engineer", "infra"] },
  { slug: "chroma", name: "Chroma", category: "ai-infra", website: "https://trychroma.com", careers: "https://www.trychroma.com/careers", hq: "San Francisco", blurb: "Embedding database.", tags: ["engineer", "infra"] },
  { slug: "turbopuffer", name: "turbopuffer", category: "ai-infra", website: "https://turbopuffer.com", careers: "https://turbopuffer.com/careers", hq: "San Francisco", blurb: "Serverless vector search.", tags: ["engineer", "infra"] },
  { slug: "supabase", name: "Supabase", category: "devtools", website: "https://supabase.com", careers: "https://supabase.com/careers", hq: "Remote", blurb: "Open-source Firebase.", tags: ["engineer", "devtools", "open-source"] },
  { slug: "neon", name: "Neon", category: "devtools", website: "https://neon.tech", careers: "https://neon.tech/careers", hq: "Remote", blurb: "Serverless Postgres.", tags: ["engineer", "devtools"] },
  { slug: "planetscale", name: "PlanetScale", category: "devtools", website: "https://planetscale.com", careers: "https://planetscale.com/careers", hq: "Remote", blurb: "Serverless MySQL at scale.", tags: ["engineer", "devtools"] },
  { slug: "turso", name: "Turso", category: "devtools", website: "https://turso.tech", careers: "https://turso.tech/careers", hq: "Remote", blurb: "SQLite at the edge.", tags: ["engineer", "devtools"] },
  { slug: "databricks", name: "Databricks", category: "data-ai", website: "https://databricks.com", careers: "https://www.databricks.com/company/careers", hq: "San Francisco", blurb: "Lakehouse platform.", tags: ["engineer", "data", "product"] },
  { slug: "hugging-face", name: "Hugging Face", category: "ai-infra", website: "https://huggingface.co", careers: "https://apply.workable.com/huggingface/", hq: "New York / Paris", blurb: "The AI community hub.", tags: ["engineer", "ai-research", "open-source"] },
  { slug: "wandb", name: "Weights & Biases", category: "devtools", website: "https://wandb.com", careers: "https://wandb.ai/careers", hq: "San Francisco", blurb: "ML experiment tracking.", tags: ["engineer", "devtools"] },
  { slug: "exa", name: "Exa", category: "search-ai", website: "https://exa.ai", careers: "https://exa.ai/careers", hq: "San Francisco", blurb: "Search engine for AI.", tags: ["engineer", "ai-research"] },
  { slug: "firecrawl", name: "Firecrawl", category: "devtools", website: "https://firecrawl.dev", careers: "https://firecrawl.dev/careers", hq: "San Francisco", blurb: "Scrape + crawl for LLMs.", tags: ["engineer", "devtools"] },
  { slug: "linear", name: "Linear", category: "devtools", website: "https://linear.app", careers: "https://linear.app/careers", hq: "Remote", blurb: "Issue tracking with taste.", tags: ["engineer", "product", "design"] },
  { slug: "figma", name: "Figma", category: "devtools", website: "https://figma.com", careers: "https://figma.com/careers", hq: "San Francisco", blurb: "Collaborative design + AI tools.", tags: ["engineer", "design", "product"] },
  { slug: "notion", name: "Notion", category: "ai-applications", website: "https://notion.so", careers: "https://www.notion.com/careers", hq: "San Francisco", blurb: "Docs + AI.", tags: ["engineer", "product"] },
  { slug: "retool", name: "Retool", category: "devtools", website: "https://retool.com", careers: "https://retool.com/careers", hq: "San Francisco", blurb: "Internal tools + agents.", tags: ["engineer", "forward-deployed"] },
  { slug: "datadog", name: "Datadog", category: "devtools", website: "https://datadoghq.com", careers: "https://careers.datadoghq.com", hq: "New York", blurb: "Observability.", tags: ["engineer", "infra"] },

  // ---------- Cloud security / infra ----------
  { slug: "wiz", name: "Wiz", category: "devtools", website: "https://wiz.io", careers: "https://wiz.io/careers", hq: "New York", blurb: "Cloud security.", tags: ["engineer", "security"] },
  { slug: "chainguard", name: "Chainguard", category: "devtools", website: "https://chainguard.dev", careers: "https://www.chainguard.dev/careers", hq: "Kirkland, WA", blurb: "Secure software supply chain.", tags: ["engineer", "security"] },
  { slug: "tailscale", name: "Tailscale", category: "devtools", website: "https://tailscale.com", careers: "https://tailscale.com/careers", hq: "Toronto", blurb: "Mesh VPN for humans.", tags: ["engineer", "infra"] },
  { slug: "fly", name: "Fly.io", category: "devtools", website: "https://fly.io", careers: "https://fly.io/jobs", hq: "Remote", blurb: "Edge compute.", tags: ["engineer", "infra"] },

  // ---------- Fintech ----------
  { slug: "stripe", name: "Stripe", category: "fintech", website: "https://stripe.com", careers: "https://stripe.com/jobs", hq: "San Francisco / Dublin", blurb: "Payments infra for the internet.", tags: ["engineer", "product", "gtm"] },
  { slug: "ramp", name: "Ramp", category: "fintech", website: "https://ramp.com", careers: "https://ramp.com/careers", hq: "New York", blurb: "Corporate cards + AI finance ops.", tags: ["engineer", "product", "gtm"] },
  { slug: "mercury", name: "Mercury", category: "fintech", website: "https://mercury.com", careers: "https://mercury.com/jobs", hq: "San Francisco", blurb: "Banking for startups.", tags: ["engineer", "product"] },
  { slug: "brex", name: "Brex", category: "fintech", website: "https://brex.com", careers: "https://brex.com/careers", hq: "San Francisco", blurb: "Finance stack for growth companies.", tags: ["engineer", "product"] },
  { slug: "plaid", name: "Plaid", category: "fintech", website: "https://plaid.com", careers: "https://plaid.com/careers", hq: "San Francisco", blurb: "Financial data APIs.", tags: ["engineer"] },
  { slug: "chime", name: "Chime", category: "fintech", website: "https://chime.com", careers: "https://careers.chime.com", hq: "San Francisco", blurb: "Consumer banking.", tags: ["engineer", "product"] },

  // ---------- Robotics / autonomy ----------
  { slug: "figure", name: "Figure AI", category: "robotics", website: "https://figure.ai", careers: "https://figure.ai/careers", hq: "Sunnyvale", blurb: "Humanoid robots for work.", tags: ["engineer", "robotics", "ai-research"] },
  { slug: "apptronik", name: "Apptronik", category: "robotics", website: "https://apptronik.com", careers: "https://apptronik.com/careers", hq: "Austin", blurb: "Humanoid robotics (Apollo).", tags: ["engineer", "robotics"] },
  { slug: "physical-intelligence", name: "Physical Intelligence (π)", category: "robotics", website: "https://physicalintelligence.company", careers: "https://physicalintelligence.company/careers", hq: "San Francisco", blurb: "General-purpose robot foundation models.", tags: ["ai-research", "engineer", "robotics"] },
  { slug: "1x", name: "1X", category: "robotics", website: "https://1x.tech", careers: "https://1x.tech/careers", hq: "Moss / Palo Alto", blurb: "Humanoid robots for the home.", tags: ["engineer", "robotics"] },
  { slug: "covariant", name: "Covariant", category: "robotics", website: "https://covariant.ai", careers: "https://covariant.ai/careers", hq: "Emeryville", blurb: "Robot foundation models for warehouses.", tags: ["ai-research", "robotics", "engineer"] },
  { slug: "skydio", name: "Skydio", category: "autonomy", website: "https://skydio.com", careers: "https://www.skydio.com/careers", hq: "San Mateo", blurb: "Autonomous drones.", tags: ["engineer", "autonomy", "defense"] },
  { slug: "waymo", name: "Waymo", category: "autonomy", website: "https://waymo.com", careers: "https://waymo.com/careers", hq: "Mountain View", blurb: "Self-driving at scale.", tags: ["engineer", "autonomy", "ai-research"] },
  { slug: "zoox", name: "Zoox", category: "autonomy", website: "https://zoox.com", careers: "https://zoox.com/careers", hq: "Foster City", blurb: "Purpose-built robotaxi.", tags: ["engineer", "autonomy"] },
  { slug: "applied-intuition", name: "Applied Intuition", category: "autonomy", website: "https://appliedintuition.com", careers: "https://appliedintuition.com/careers", hq: "Mountain View", blurb: "Simulation + autonomy for vehicles.", tags: ["engineer", "autonomy", "defense"] },
  { slug: "tesla", name: "Tesla", category: "autonomy", website: "https://tesla.com", careers: "https://www.tesla.com/careers", hq: "Austin", blurb: "EVs, FSD, Optimus.", tags: ["engineer", "autonomy", "robotics"] },
  { slug: "nuro", name: "Nuro", category: "autonomy", website: "https://nuro.ai", careers: "https://nuro.ai/careers", hq: "Mountain View", blurb: "Autonomous delivery.", tags: ["engineer", "autonomy"] },

  // ---------- Space ----------
  { slug: "spacex", name: "SpaceX", category: "space", website: "https://spacex.com", careers: "https://www.spacex.com/careers/", hq: "Hawthorne", blurb: "Starship + Starlink.", tags: ["engineer", "space"] },
  { slug: "blue-origin", name: "Blue Origin", category: "space", website: "https://blueorigin.com", careers: "https://www.blueorigin.com/careers", hq: "Kent, WA", blurb: "New Glenn + lunar.", tags: ["engineer", "space"] },
  { slug: "relativity", name: "Relativity Space", category: "space", website: "https://relativityspace.com", careers: "https://www.relativityspace.com/careers", hq: "Long Beach", blurb: "3D-printed rockets (Terran R).", tags: ["engineer", "space"] },
  { slug: "stoke-space", name: "Stoke Space", category: "space", website: "https://stokespace.com", careers: "https://stokespace.com/careers", hq: "Kent, WA", blurb: "Fully reusable rockets.", tags: ["engineer", "space"] },
  { slug: "rocket-lab", name: "Rocket Lab", category: "space", website: "https://rocketlabusa.com", careers: "https://rocketlabusa.com/careers", hq: "Long Beach", blurb: "Electron + Neutron.", tags: ["engineer", "space"] },
  { slug: "varda", name: "Varda Space", category: "space", website: "https://varda.com", careers: "https://varda.com/careers", hq: "El Segundo", blurb: "In-space manufacturing.", tags: ["engineer", "space"] },
  { slug: "k2-space", name: "K2 Space", category: "space", website: "https://k2space.com", careers: "https://k2space.com/careers", hq: "Los Angeles", blurb: "Giant satellites for Starship.", tags: ["engineer", "space"] },
  { slug: "astranis", name: "Astranis", category: "space", website: "https://astranis.com", careers: "https://www.astranis.com/careers", hq: "San Francisco", blurb: "Small GEO satellites.", tags: ["engineer", "space"] },
  { slug: "impulse-space", name: "Impulse Space", category: "space", website: "https://impulsespace.com", careers: "https://impulsespace.com/careers", hq: "El Segundo", blurb: "In-space logistics. Mueller's co.", tags: ["engineer", "space"] },

  // ---------- Defense ----------
  { slug: "anduril", name: "Anduril", category: "defense", website: "https://anduril.com", careers: "https://anduril.com/careers", hq: "Costa Mesa", blurb: "Autonomous defense. Lattice OS.", tags: ["engineer", "defense", "autonomy"] },
  { slug: "shield-ai", name: "Shield AI", category: "defense", website: "https://shield.ai", careers: "https://shield.ai/careers", hq: "San Diego", blurb: "Hivemind autonomy for defense.", tags: ["engineer", "defense", "autonomy"] },
  { slug: "saronic", name: "Saronic", category: "defense", website: "https://saronic.com", careers: "https://saronic.com/careers", hq: "Austin", blurb: "Autonomous surface vessels.", tags: ["engineer", "defense", "autonomy"] },
  { slug: "palantir", name: "Palantir", category: "defense", website: "https://palantir.com", careers: "https://jobs.lever.co/palantir", hq: "Denver", blurb: "Foundry + Gotham + AIP.", tags: ["engineer", "forward-deployed", "defense"] },
  { slug: "hadrian", name: "Hadrian", category: "defense", website: "https://hadrian.co", careers: "https://hadrian.co/careers", hq: "Torrance", blurb: "Precision manufacturing factories.", tags: ["engineer", "defense", "manufacturing"] },
  { slug: "vannevar-labs", name: "Vannevar Labs", category: "defense", website: "https://vannevarlabs.com", careers: "https://vannevarlabs.com/careers", hq: "Palo Alto", blurb: "Non-kinetic national security tech.", tags: ["engineer", "defense"] },
  { slug: "true-anomaly", name: "True Anomaly", category: "defense", website: "https://trueanomaly.space", careers: "https://trueanomaly.space/careers", hq: "Denver", blurb: "Space domain awareness.", tags: ["engineer", "defense", "space"] },

  // ---------- Biotech / bio-AI ----------
  { slug: "insitro", name: "Insitro", category: "biotech", website: "https://insitro.com", careers: "https://insitro.com/careers", hq: "South SF", blurb: "ML-first drug discovery.", tags: ["engineer", "research", "bio"] },
  { slug: "recursion", name: "Recursion", category: "biotech", website: "https://recursion.com", careers: "https://recursion.com/careers", hq: "Salt Lake City", blurb: "Maps of cellular biology.", tags: ["research", "engineer", "bio"] },
  { slug: "isomorphic", name: "Isomorphic Labs", category: "biotech", website: "https://isomorphiclabs.com", careers: "https://www.isomorphiclabs.com/careers", hq: "London", blurb: "AI-first drug design (Alphabet).", tags: ["ai-research", "bio"] },
  { slug: "generate-biomed", name: "Generate:Biomedicines", category: "biotech", website: "https://generatebiomedicines.com", careers: "https://generatebiomedicines.com/careers", hq: "Somerville", blurb: "Generative protein design.", tags: ["research", "bio"] },
  { slug: "enveda", name: "Enveda", category: "biotech", website: "https://enveda.com", careers: "https://enveda.com/careers", hq: "Boulder", blurb: "Machine learning on natural products.", tags: ["research", "bio"] },
  { slug: "atomic-ai", name: "Atomic AI", category: "biotech", website: "https://atomic.ai", careers: "https://atomic.ai/careers", hq: "South SF", blurb: "RNA drug discovery + ML.", tags: ["research", "bio"] },
  { slug: "moderna", name: "Moderna", category: "biotech", website: "https://modernatx.com", careers: "https://modernatx.com/careers", hq: "Cambridge, MA", blurb: "mRNA platform.", tags: ["research", "bio"] },

  // ---------- Neurotech ----------
  { slug: "neuralink", name: "Neuralink", category: "neurotech", website: "https://neuralink.com", careers: "https://neuralink.com/careers", hq: "Fremont", blurb: "Brain-computer interface.", tags: ["engineer", "research", "neuro"] },
  { slug: "precision-neuroscience", name: "Precision Neuroscience", category: "neurotech", website: "https://precisionneuro.io", careers: "https://precisionneuro.io/careers", hq: "New York", blurb: "Minimally invasive BCI.", tags: ["engineer", "research"] },
  { slug: "synchron", name: "Synchron", category: "neurotech", website: "https://synchron.com", careers: "https://synchron.com/careers", hq: "New York", blurb: "Endovascular BCI.", tags: ["engineer", "research"] },

  // ---------- Energy / climate ----------
  { slug: "helion", name: "Helion", category: "energy", website: "https://helionenergy.com", careers: "https://www.helionenergy.com/careers", hq: "Everett, WA", blurb: "Fusion energy.", tags: ["engineer", "energy"] },
  { slug: "cfs", name: "Commonwealth Fusion Systems", category: "energy", website: "https://cfs.energy", careers: "https://cfs.energy/careers", hq: "Devens, MA", blurb: "SPARC / ARC fusion.", tags: ["engineer", "energy"] },
  { slug: "terrapower", name: "TerraPower", category: "energy", website: "https://terrapower.com", careers: "https://www.terrapower.com/careers", hq: "Bellevue", blurb: "Advanced nuclear (Natrium).", tags: ["engineer", "energy"] },
  { slug: "kairos-power", name: "Kairos Power", category: "energy", website: "https://kairospower.com", careers: "https://kairospower.com/careers", hq: "Alameda", blurb: "Molten-salt small reactors.", tags: ["engineer", "energy"] },
  { slug: "x-energy", name: "X-energy", category: "energy", website: "https://x-energy.com", careers: "https://x-energy.com/careers", hq: "Rockville", blurb: "TRISO fuel + small reactors.", tags: ["engineer", "energy"] },
  { slug: "form-energy", name: "Form Energy", category: "climate", website: "https://formenergy.com", careers: "https://formenergy.com/careers", hq: "Somerville", blurb: "Long-duration iron-air batteries.", tags: ["engineer", "climate"] },

  // ---------- Voice / media AI ----------
  { slug: "elevenlabs", name: "ElevenLabs", category: "voice-ai", website: "https://elevenlabs.io", careers: "https://elevenlabs.io/careers", hq: "London / NYC", blurb: "Frontier voice AI.", tags: ["ai-research", "engineer", "product"] },
  { slug: "suno", name: "Suno", category: "media-ai", website: "https://suno.ai", careers: "https://suno.ai/careers", hq: "Cambridge, MA", blurb: "Generative music.", tags: ["ai-research", "engineer"] },
  { slug: "runway", name: "Runway", category: "media-ai", website: "https://runwayml.com", careers: "https://runwayml.com/careers", hq: "New York", blurb: "Video generation + creative tools.", tags: ["ai-research", "engineer", "product"] },
  { slug: "pika", name: "Pika", category: "media-ai", website: "https://pika.art", careers: "https://pika.art/careers", hq: "Palo Alto", blurb: "Text-to-video.", tags: ["ai-research", "product"] },
  { slug: "luma", name: "Luma AI", category: "media-ai", website: "https://lumalabs.ai", careers: "https://lumalabs.ai/careers", hq: "Palo Alto", blurb: "Dream Machine video.", tags: ["ai-research", "engineer"] },
  { slug: "midjourney", name: "Midjourney", category: "media-ai", website: "https://midjourney.com", careers: "https://www.midjourney.com/jobs", hq: "San Francisco", blurb: "Image generation.", tags: ["ai-research", "engineer", "design"] },
  { slug: "black-forest-labs", name: "Black Forest Labs", category: "media-ai", website: "https://blackforestlabs.ai", careers: "https://blackforestlabs.ai/careers", hq: "Freiburg / SF", blurb: "FLUX image models.", tags: ["ai-research"] },

  // ---------- Extended set ----------
  { slug: "sakana", name: "Sakana AI", category: "frontier-ai", website: "https://sakana.ai", careers: "https://sakana.ai/careers", hq: "Tokyo", blurb: "Nature-inspired foundation models.", tags: ["ai-research", "engineer"] },
  { slug: "kyutai", name: "Kyutai", category: "frontier-ai", website: "https://kyutai.org", careers: "https://kyutai.org/careers", hq: "Paris", blurb: "Open-source speech + language research.", tags: ["ai-research"] },
  { slug: "writer", name: "Writer", category: "ai-applications", website: "https://writer.com", careers: "https://writer.com/careers", hq: "San Francisco", blurb: "Enterprise generative AI platform.", tags: ["engineer", "forward-deployed", "product"] },
  { slug: "gamma", name: "Gamma", category: "ai-applications", website: "https://gamma.app", careers: "https://gamma.app/careers", hq: "San Francisco", blurb: "AI decks + docs.", tags: ["engineer", "product"] },
  { slug: "tome", name: "Tome", category: "ai-applications", website: "https://tome.app", careers: "https://tome.app/careers", hq: "San Francisco", blurb: "AI storytelling.", tags: ["engineer", "product", "design"] },
  { slug: "browser-company", name: "The Browser Company (Arc / Dia)", category: "consumer-ai", website: "https://thebrowser.company", careers: "https://thebrowser.company/careers", hq: "New York", blurb: "AI-first browser.", tags: ["engineer", "product", "design"] },
  { slug: "snowflake", name: "Snowflake", category: "data-ai", website: "https://snowflake.com", careers: "https://careers.snowflake.com", hq: "Bozeman / SF", blurb: "Data cloud + Cortex AI.", tags: ["engineer", "product", "data"] },
  { slug: "dbt-labs", name: "dbt Labs", category: "data-ai", website: "https://getdbt.com", careers: "https://www.getdbt.com/careers", hq: "Philadelphia", blurb: "Analytics engineering.", tags: ["engineer", "devtools"] },
  { slug: "temporal", name: "Temporal", category: "devtools", website: "https://temporal.io", careers: "https://temporal.io/careers", hq: "Seattle", blurb: "Durable workflow execution.", tags: ["engineer", "devtools"] },
  { slug: "airbyte", name: "Airbyte", category: "data-ai", website: "https://airbyte.com", careers: "https://airbyte.com/careers", hq: "San Francisco", blurb: "Open-source ELT.", tags: ["engineer", "devtools"] },
  { slug: "lambda-labs", name: "Lambda", category: "ai-infra", website: "https://lambdalabs.com", careers: "https://lambdalabs.com/careers", hq: "San Francisco", blurb: "GPU cloud for AI.", tags: ["engineer", "infra"] },
  { slug: "voltage-park", name: "Voltage Park", category: "ai-infra", website: "https://voltagepark.com", careers: "https://voltagepark.com/careers", hq: "San Francisco", blurb: "Affordable H100 cloud.", tags: ["engineer", "infra"] },
  { slug: "braintrust", name: "Braintrust", category: "devtools", website: "https://braintrust.dev", careers: "https://www.braintrust.dev/careers", hq: "San Francisco", blurb: "Evals platform for AI.", tags: ["engineer", "devtools"] },
  { slug: "helicone", name: "Helicone", category: "devtools", website: "https://helicone.ai", careers: "https://helicone.ai/careers", hq: "San Francisco", blurb: "Observability for LLMs.", tags: ["engineer", "devtools"] },
  { slug: "langfuse", name: "Langfuse", category: "devtools", website: "https://langfuse.com", careers: "https://langfuse.com/careers", hq: "Berlin", blurb: "Open-source LLM observability.", tags: ["engineer", "devtools"] },
  { slug: "coinbase", name: "Coinbase", category: "fintech", website: "https://coinbase.com", careers: "https://www.coinbase.com/careers", hq: "Remote-first", blurb: "Crypto exchange + onchain infra.", tags: ["engineer", "product"] },
  { slug: "carta", name: "Carta", category: "fintech", website: "https://carta.com", careers: "https://carta.com/careers", hq: "San Francisco", blurb: "Cap tables + fund admin.", tags: ["engineer", "product"] },
  { slug: "wealthfront", name: "Wealthfront", category: "fintech", website: "https://wealthfront.com", careers: "https://www.wealthfront.com/careers", hq: "Palo Alto", blurb: "Automated investing.", tags: ["engineer", "product"] },
  { slug: "aurora", name: "Aurora Innovation", category: "autonomy", website: "https://aurora.tech", careers: "https://aurora.tech/careers", hq: "Pittsburgh", blurb: "Autonomous trucking.", tags: ["engineer", "autonomy"] },
  { slug: "waabi", name: "Waabi", category: "autonomy", website: "https://waabi.ai", careers: "https://waabi.ai/careers", hq: "Toronto", blurb: "Generative AI for self-driving.", tags: ["ai-research", "autonomy"] },
  { slug: "luminar", name: "Luminar", category: "autonomy", website: "https://luminartech.com", careers: "https://www.luminartech.com/careers", hq: "Orlando", blurb: "Automotive lidar.", tags: ["engineer", "hardware"] },
  { slug: "firefly", name: "Firefly Aerospace", category: "space", website: "https://fireflyspace.com", careers: "https://fireflyspace.com/careers", hq: "Austin", blurb: "Responsive launch + lunar lander.", tags: ["engineer", "space"] },
  { slug: "axiom-space", name: "Axiom Space", category: "space", website: "https://axiomspace.com", careers: "https://axiomspace.com/careers", hq: "Houston", blurb: "Commercial space station.", tags: ["engineer", "space"] },
  { slug: "abl-space", name: "ABL Space Systems", category: "space", website: "https://ablspacesystems.com", careers: "https://ablspacesystems.com/careers", hq: "El Segundo", blurb: "RS1 small launch.", tags: ["engineer", "space"] },
  { slug: "ursa-major", name: "Ursa Major", category: "space", website: "https://ursamajor.com", careers: "https://ursamajor.com/careers", hq: "Berthoud", blurb: "Rocket + hypersonic engines.", tags: ["engineer", "space", "defense"] },
  { slug: "mach-industries", name: "Mach Industries", category: "defense", website: "https://machindustries.com", careers: "https://machindustries.com/careers", hq: "El Segundo", blurb: "Hydrogen-powered weapons systems.", tags: ["engineer", "defense"] },
  { slug: "epirus", name: "Epirus", category: "defense", website: "https://epirusinc.com", careers: "https://www.epirusinc.com/careers", hq: "Torrance", blurb: "Solid-state microwave counter-drone.", tags: ["engineer", "defense"] },
  { slug: "rebellion-defense", name: "Rebellion Defense", category: "defense", website: "https://rebelliondefense.com", careers: "https://rebelliondefense.com/careers", hq: "Washington DC", blurb: "AI for defense.", tags: ["engineer", "defense"] },
  { slug: "xaira", name: "Xaira Therapeutics", category: "biotech", website: "https://xaira.com", careers: "https://xaira.com/careers", hq: "South SF", blurb: "AI-first drug development.", tags: ["research", "bio"] },
  { slug: "owkin", name: "Owkin", category: "biotech", website: "https://owkin.com", careers: "https://owkin.com/careers", hq: "Paris / NYC", blurb: "Federated AI for biopharma.", tags: ["research", "bio"] },
  { slug: "spring-health", name: "Spring Health", category: "health-ai", website: "https://springhealth.com", careers: "https://springhealth.com/careers", hq: "New York", blurb: "Mental health care platform.", tags: ["engineer", "health"] },
  { slug: "maven-clinic", name: "Maven Clinic", category: "health-ai", website: "https://mavenclinic.com", careers: "https://mavenclinic.com/careers", hq: "New York", blurb: "Women's + family health platform.", tags: ["engineer", "health"] },
  { slug: "mistral-alt-vellum", name: "Vellum", category: "devtools", website: "https://vellum.ai", careers: "https://vellum.ai/careers", hq: "San Francisco", blurb: "LLM app development platform.", tags: ["engineer", "devtools"] },
  { slug: "codium", name: "CodeRabbit", category: "coding-agents", website: "https://coderabbit.ai", careers: "https://coderabbit.ai/careers", hq: "San Francisco", blurb: "AI code reviews.", tags: ["engineer", "coding"] },
  { slug: "sweep", name: "Sweep", category: "coding-agents", website: "https://sweep.dev", careers: "https://sweep.dev/careers", hq: "San Francisco", blurb: "Agentic code refactors.", tags: ["engineer", "coding"] },
  { slug: "mem", name: "Mem", category: "ai-applications", website: "https://mem.ai", careers: "https://mem.ai/careers", hq: "San Francisco", blurb: "AI-powered notes.", tags: ["engineer", "product"] },
];

export const COMPANY_CATEGORIES: { key: CompanyCategory; label: string }[] = [
  { key: "frontier-ai", label: "Frontier AI" },
  { key: "ai-applications", label: "AI apps" },
  { key: "coding-agents", label: "Coding agents" },
  { key: "ai-infra", label: "AI infra" },
  { key: "devtools", label: "Devtools" },
  { key: "search-ai", label: "Search AI" },
  { key: "voice-ai", label: "Voice AI" },
  { key: "media-ai", label: "Media AI" },
  { key: "data-ai", label: "Data AI" },
  { key: "consumer-ai", label: "Consumer AI" },
  { key: "health-ai", label: "Health AI" },
  { key: "legal-ai", label: "Legal AI" },
  { key: "finance-ai", label: "Finance AI" },
  { key: "fintech", label: "Fintech" },
  { key: "robotics", label: "Robotics" },
  { key: "autonomy", label: "Autonomy" },
  { key: "space", label: "Space" },
  { key: "defense", label: "Defense" },
  { key: "biotech", label: "Biotech" },
  { key: "neurotech", label: "Neurotech" },
  { key: "energy", label: "Energy" },
  { key: "climate", label: "Climate" },
];

export const ROLE_PRESETS = [
  { key: "engineer", label: "Engineer", queries: ["software engineer", "forward deployed engineer", "member of technical staff"] },
  { key: "ai-research", label: "Research", queries: ["research engineer", "research scientist", "ml researcher"] },
  { key: "pm", label: "PM", queries: ["product manager", "product lead"] },
  { key: "gtm", label: "GTM", queries: ["go to market", "solutions engineer", "sales engineer"] },
  { key: "corp-dev", label: "Corp dev", queries: ["corporate development", "strategy", "chief of staff"] },
  { key: "design", label: "Design", queries: ["product design", "design engineer"] },
  { key: "founder", label: "Founder", queries: ["founding engineer", "founding product"] },
];
