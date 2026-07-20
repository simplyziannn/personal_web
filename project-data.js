window.PROJECTS = {
  fintech: {
    name: 'FinTech — UNOVA', category: 'Financial Technology', visibility: 'Public',
    tagline: 'One actionable view of financial wellness, not another fragmented dashboard.',
    overview: 'UNOVA brings portfolio holdings, cash, liabilities and financial goals into a single financial-wellness experience. It was built for the FinTech Innovators’ Hackathon 2026 and placed fourth out of 171 teams.',
    problem: 'People often track investments, cash and long-term goals across disconnected tools. That makes it difficult to understand resilience, diversification and retirement readiness as one complete picture.',
    solution: 'The platform combines a React interface, FastAPI analytics and a Chrome extension that imports brokerage holdings from screenshots. It calculates wellness metrics and turns them into personalised insights and planning flows.',
    tech: ['React', 'FastAPI', 'Python', 'Chrome Extension', 'OpenAI', 'Docker', 'Railway'],
    highlights: ['Portfolio import from brokerage screenshots', 'Financial wellness and stress scoring', 'Peer benchmarking and retirement planning', '4th place out of 171 hackathon teams'],
    github: 'https://github.com/simplyziannn/FinTech', colors: ['#c58b45','#8d513f']
  },
  factoring: {
    name: 'Factoring', category: 'Financial Systems', visibility: 'Private',
    tagline: 'A private financial-technology build focused on factoring workflows.',
    overview: 'Factoring is a private portfolio project exploring how software can organise and streamline a financial workflow with multiple operational steps.',
    problem: 'Financial workflows become difficult to manage when information and actions are spread across manual processes.',
    solution: 'The project explores a structured software approach to keeping the workflow traceable and easier to operate. Detailed architecture is available as a private case study.',
    tech: ['Financial workflows', 'Backend systems', 'Automation'],
    highlights: ['Private repository', 'Workflow-oriented system design', 'Case study available on request'], colors: ['#ad6f45','#715164']
  },
  btohelper: {
    name: 'BTO Helper', category: 'Civic Technology', visibility: 'Private',
    tagline: 'A private helper for navigating Singapore’s BTO journey.',
    overview: 'BTO Helper is a private product experiment centred on making a complex, high-stakes housing journey easier to understand and navigate.',
    problem: 'Housing decisions involve many steps, constraints and pieces of information that can feel fragmented to applicants.',
    solution: 'The project explores a guided digital experience that organises the journey around the decisions a user needs to make. Product details are kept private.',
    tech: ['Product design', 'Civic tech', 'Decision support'],
    highlights: ['Singapore-focused use case', 'Guided workflow concept', 'Private repository'], colors: ['#bb8642','#6a7286']
  },
  unclegowhere: {
    name: 'UncleGoWhere', category: 'Agentic AI', visibility: 'Public',
    tagline: 'A multi-agent travel buddy delivered through Telegram.',
    overview: 'UncleGoWhere is an OpenClaw-based agentic travel assistant. A central orchestrator coordinates specialist agents for flights, stays, itineraries, reviews, profiles and response rewriting, then delivers one consolidated response through Telegram.',
    problem: 'Travel planning requires users to move repeatedly between search tools, booking information and itinerary documents.',
    solution: 'The assistant routes each request to specialised agents, consolidates their work and returns one response through a Telegram interface deployed around an OpenClaw workspace.',
    tech: ['OpenClaw', 'Multi-agent systems', 'Telegram', 'AWS', 'APIs'],
    highlights: ['Specialist agent orchestration', 'Telegram conversation layer', 'Cloud deployment design', 'Personal Assistant-as-a-Service exploration'],
    github: 'https://github.com/simplyziannn/UncleGoWhere', colors: ['#b8763e','#4f7080']
  },
  hawkersg: {
    name: 'HawkerSG Directory', category: 'Full-stack Civic Tech', visibility: 'Public',
    tagline: 'Discover hawker centres while giving stall owners control of their listings.',
    overview: 'HawkerSG is a full-stack prototype for diners and hawker businesses. It combines Singapore Food Agency data with consumer discovery, favourites and business listing management.',
    problem: 'Useful hawker information can be scattered, while small food businesses need a straightforward way to maintain accurate listings.',
    solution: 'A FastAPI backend seeds and serves structured hawker-centre data, while a React interface supports consumer search and business-facing management flows.',
    tech: ['FastAPI', 'React', 'TypeScript', 'SQLAlchemy', 'SQLite', 'Tailwind CSS'],
    highlights: ['SFA data ingestion', 'Consumer and owner experiences', 'Full software-design documentation', 'Team full-stack project'],
    github: 'https://github.com/simplyziannn/hawkersg', colors: ['#c18c3e','#8f4c3e']
  },
  whatsapp: {
    name: 'WhatsApp Business Chatbot', category: 'AI Automation', visibility: 'Public',
    tagline: 'Reliable, grounded customer automation for small businesses.',
    overview: 'A modular WhatsApp assistant for SMEs using the WhatsApp Business Cloud API, FastAPI and retrieval-augmented generation.',
    problem: 'Small businesses need fast customer responses without the expense and maintenance burden of a large support stack.',
    solution: 'The chatbot combines webhook processing, grounded LLM responses, pgvector retrieval, caching, deduplication and message persistence. A simple dashboard lets businesses maintain their knowledge base.',
    tech: ['FastAPI', 'WhatsApp Cloud API', 'OpenAI', 'Postgres', 'pgvector', 'RAG'],
    highlights: ['Grounded responses from a business knowledge base', 'Caching and idempotency for reliability', 'Admin and dashboard knowledge management', 'Modular model-ready architecture'],
    github: 'https://github.com/simplyziannn/whatsapp-business', colors: ['#9c7044','#526d61']
  },
  tarotcarrot: {
    name: 'TarotCarrot', category: 'Product Experiment', visibility: 'Private',
    tagline: 'A private product experiment still taking shape.',
    overview: 'TarotCarrot is a private software project. Its source and product details are intentionally not exposed in the public portfolio.',
    problem: 'The project explores a focused product idea through rapid software experimentation.',
    solution: 'The implementation and design decisions can be discussed as a private case study.',
    tech: ['Product experimentation', 'Software prototyping'],
    highlights: ['Private repository', 'Details available on request'], colors: ['#bd7847','#6e526f']
  },
  pokescan: {
    name: 'Poke Scan', category: 'Computer Vision', visibility: 'Public',
    tagline: 'Point a camera at a Pokémon card and turn pixels into an identified collectible.',
    overview: 'Poke Scan is a local-first card-scanning MVP with a mobile-friendly Next.js interface and a FastAPI recognition backend.',
    problem: 'Collectors need a quick way to identify a card and connect it with catalogue information without manually searching through an entire set.',
    solution: 'The backend uses Tesseract OCR and fuzzy matching against a complete set catalogue, then returns the strongest candidates and available pricing information.',
    tech: ['Next.js', 'TypeScript', 'FastAPI', 'Tesseract OCR', 'RapidFuzz'],
    highlights: ['Camera and upload scanning flow', 'OCR plus fuzzy candidate ranking', 'Full-set catalogue matching', 'Local-first architecture without API keys'],
    github: 'https://github.com/simplyziannn/poke-scan', colors: ['#b94f42','#566e88']
  },
  ascent: {
    name: 'Ascent — TechFest 2026', category: 'Multi-agent AI', visibility: 'Public',
    tagline: 'Career guidance that is analysed, challenged and refined by specialised agents.',
    overview: 'Built for TechFest 2026, Ascent helps students and early-career professionals assess job readiness, identify skill gaps and turn them into structured, actionable career-progression plans.',
    problem: 'Career information is fragmented, and a single generic AI response can produce advice that lacks challenge or industry context.',
    solution: 'Multiple specialised agents analyse resumes, match skill gaps to learning opportunities and critique one another before producing a final roadmap.',
    tech: ['LLM agents', 'OCR', 'Vector embeddings', 'JavaScript', 'SkillsFuture data'],
    highlights: ['Agent critique and consensus', '23 industry-specific resume agents', 'Personalised learning roadmaps', 'TechFest 2026 team build'],
    github: 'https://github.com/simplyziannn/TechFest-2026', colors: ['#ba7c39','#526788']
  },
  flowers102: {
    name: 'Flowers102 Classification', category: 'Machine Learning Research', visibility: 'Public',
    tagline: 'Comparing few-shot learning, optimisation and ensembles on fine-grained images.',
    overview: 'A systematic image-classification study using the Flowers102 dataset, covering baseline models, few-shot metric learning, hyperparameter optimisation and ensembles.',
    problem: 'Fine-grained classification becomes difficult when categories look similar and labelled examples are limited.',
    solution: 'The project compares ResNet baselines, Siamese and triplet networks, greedy and Optuna tuning, and ensembles ranging from one to fifteen folds.',
    tech: ['PyTorch', 'ResNet', 'Optuna', 'Siamese Networks', 'Triplet Loss', 'Python'],
    highlights: ['One-shot and five-shot experiments', 'Greedy versus Optuna tuning', 'Twelve-fold best-performing ensemble', 'Reproducible experiment pipeline'],
    github: 'https://github.com/simplyziannn/SC4001-Flowers102-Classification-Project', colors: ['#bd8642','#78835a']
  },
  fyp: {
    name: 'FYP — Collaboration of Experts', category: 'Final-year Research', visibility: 'Collaborative',
    tagline: 'Exploring how specialised experts can work together on complex tasks.',
    overview: 'A collaborative final-year project centred on expert collaboration. The public portfolio presents the research direction without exposing work owned by collaborators.',
    problem: 'Complex problems often require different forms of expertise rather than a single monolithic system.',
    solution: 'The project explores how specialised contributors or intelligent experts can coordinate their knowledge and outputs.',
    tech: ['Expert systems', 'Collaboration', 'Research'],
    highlights: ['Final-year project', 'Collaborative ownership', 'Research case study available on request'], colors: ['#a86b43','#667185']
  },
  hlf: {
    name: 'Operations Automation', category: 'Operational Automation', visibility: 'Private',
    tagline: 'Reducing repetitive operational work with dependable automation.',
    overview: 'A private automation project designed around operational efficiency, service reliability and reduced manual effort.',
    problem: 'Manual handoffs create delays, repeated effort and opportunities for error across operational workflows.',
    solution: 'The system connects workflow steps and automates repeatable actions while keeping the implementation private.',
    tech: ['Backend automation', 'APIs', 'CI/CD', 'Operational tooling'],
    highlights: ['Operational workload reduction', 'Reliability-focused design', 'Private implementation'], colors: ['#bb7b42','#4f6d73']
  },
  psa: {
    name: 'PSA Hackathon 2026', category: 'Hackathon Build', visibility: 'Private',
    tagline: 'A fast-moving team solution developed for PSA.',
    overview: 'Team Mediocre’s private PSA Hackathon 2026 project, built under hackathon constraints around an operational challenge.',
    problem: 'The challenge called for a practical solution in a complex operational environment.',
    solution: 'The team rapidly designed, implemented and presented a working concept. Repository details remain private.',
    tech: ['Rapid prototyping', 'Team delivery', 'Operational technology'],
    highlights: ['Hackathon delivery', 'Cross-functional teamwork', 'Private repository'], colors: ['#b66945','#536c7e']
  },
  biohackathon: {
    name: 'BioHackathon 25', category: 'Bioinformatics', visibility: 'Private',
    tagline: 'Turning plant gene-expression data into interpretable biological insight.',
    overview: 'A bioinformatics project that analyses plant gene-expression data and uses established computational tools to derive useful insights.',
    problem: 'Gene-expression datasets are high-dimensional and require careful processing before meaningful biological patterns become visible.',
    solution: 'The project applies bioinformatics analysis techniques to explore the data, identify patterns and communicate findings.',
    tech: ['Bioinformatics', 'Gene-expression analysis', 'Data science'],
    highlights: ['Plant expression dataset', 'Computational biological analysis', 'Insight-focused reporting', 'Private repository'], colors: ['#ad7f42','#668260']
  }
};
