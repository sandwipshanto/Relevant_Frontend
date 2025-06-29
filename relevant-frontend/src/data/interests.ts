// Predefined interest categories with common subcategories and keywords
export const INTEREST_CATEGORIES = {
    "Technology": {
        priority: 8,
        subcategories: {
            "Artificial Intelligence": ["AI", "machine learning", "deep learning", "neural networks", "GPT", "LLM", "automation"],
            "Web Development": ["JavaScript", "React", "Node.js", "HTML", "CSS", "frontend", "backend", "full-stack"],
            "Mobile Development": ["iOS", "Android", "React Native", "Flutter", "mobile apps", "Swift", "Kotlin"],
            "Data Science": ["Python", "R", "statistics", "data analysis", "visualization", "pandas", "machine learning"],
            "Cybersecurity": ["security", "encryption", "hacking", "vulnerability", "penetration testing", "firewall"],
            "Cloud Computing": ["AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "serverless", "microservices"],
            "Blockchain": ["cryptocurrency", "Bitcoin", "Ethereum", "DeFi", "NFT", "smart contracts", "Web3"],
            "Gaming Development": ["Unity", "Unreal Engine", "game design", "indie games", "gaming industry"],
            "DevOps": ["CI/CD", "automation", "infrastructure", "monitoring", "deployment", "containerization"]
        },
        keywords: ["programming", "coding", "software", "development", "tech", "innovation", "digital"]
    },
    "Science": {
        priority: 7,
        subcategories: {
            "Physics": ["quantum physics", "relativity", "particle physics", "astrophysics", "cosmology"],
            "Biology": ["genetics", "evolution", "ecology", "molecular biology", "biotechnology", "CRISPR"],
            "Chemistry": ["organic chemistry", "biochemistry", "materials science", "nanotechnology"],
            "Mathematics": ["algebra", "calculus", "statistics", "geometry", "number theory", "cryptography"],
            "Space Science": ["astronomy", "space exploration", "NASA", "SpaceX", "Mars", "exoplanets"],
            "Environmental Science": ["climate change", "sustainability", "renewable energy", "conservation"],
            "Medicine": ["healthcare", "medical research", "pharmaceuticals", "clinical trials", "public health"]
        },
        keywords: ["research", "discovery", "experiment", "scientific method", "innovation", "breakthrough"]
    },
    "Business": {
        priority: 6,
        subcategories: {
            "Entrepreneurship": ["startups", "venture capital", "business plan", "innovation", "scaling"],
            "Marketing": ["digital marketing", "SEO", "social media", "content marketing", "branding"],
            "Finance": ["investing", "stocks", "cryptocurrency", "personal finance", "economics", "trading"],
            "Management": ["leadership", "team building", "project management", "strategy", "operations"],
            "E-commerce": ["online retail", "Amazon", "Shopify", "dropshipping", "marketplaces"],
            "Real Estate": ["property investment", "real estate market", "commercial real estate", "REITs"]
        },
        keywords: ["business", "entrepreneurship", "economy", "market", "profit", "growth", "strategy"]
    },
    "Entertainment": {
        priority: 5,
        subcategories: {
            "Movies & TV": ["cinema", "Netflix", "streaming", "film industry", "directors", "actors", "reviews"],
            "Music": ["genres", "artists", "concerts", "music production", "instruments", "streaming platforms"],
            "Gaming": ["video games", "esports", "game reviews", "gaming industry", "consoles", "PC gaming"],
            "Books & Literature": ["fiction", "non-fiction", "authors", "book reviews", "publishing", "writing"],
            "Comedy": ["stand-up comedy", "comedians", "humor", "entertainment industry"],
            "Podcasts": ["podcast recommendations", "audio content", "storytelling", "interviews"]
        },
        keywords: ["entertainment", "media", "culture", "art", "creativity", "leisure", "fun"]
    },
    "Health & Fitness": {
        priority: 7,
        subcategories: {
            "Exercise & Training": ["workout routines", "gym", "strength training", "cardio", "fitness goals"],
            "Nutrition": ["healthy eating", "diet", "supplements", "meal planning", "weight loss", "nutrition science"],
            "Mental Health": ["wellness", "meditation", "stress management", "therapy", "mindfulness"],
            "Sports": ["football", "basketball", "soccer", "tennis", "Olympics", "sports news", "athletics"],
            "Yoga & Mindfulness": ["yoga practice", "meditation", "breathing exercises", "spiritual wellness"],
            "Medical Health": ["healthcare", "medical advice", "diseases", "prevention", "health research"]
        },
        keywords: ["health", "fitness", "wellness", "exercise", "nutrition", "medical", "lifestyle"]
    },
    "Education": {
        priority: 6,
        subcategories: {
            "Online Learning": ["courses", "MOOCs", "Coursera", "edX", "Udemy", "skill development"],
            "Languages": ["language learning", "linguistics", "translation", "multilingual", "culture"],
            "Academic Research": ["universities", "research papers", "academic publishing", "peer review"],
            "Teaching": ["pedagogy", "educational technology", "classroom management", "curriculum"],
            "Professional Development": ["career growth", "certifications", "skills training", "networking"]
        },
        keywords: ["education", "learning", "knowledge", "teaching", "academic", "skill", "development"]
    },
    "Travel": {
        priority: 5,
        subcategories: {
            "Destinations": ["Europe", "Asia", "America", "travel guides", "hidden gems", "tourist attractions"],
            "Travel Tips": ["budget travel", "travel hacks", "packing", "travel insurance", "safety"],
            "Adventure Travel": ["hiking", "backpacking", "extreme sports", "outdoor adventures"],
            "Cultural Travel": ["local culture", "food tourism", "festivals", "historical sites", "museums"],
            "Luxury Travel": ["hotels", "resorts", "first class", "luxury experiences", "high-end destinations"]
        },
        keywords: ["travel", "tourism", "vacation", "exploration", "adventure", "culture", "destinations"]
    },
    "Food & Cooking": {
        priority: 5,
        subcategories: {
            "Cooking Techniques": ["recipes", "cooking methods", "kitchen skills", "chef techniques"],
            "Cuisines": ["Italian", "Asian", "Mexican", "Mediterranean", "Indian", "French", "fusion"],
            "Baking & Desserts": ["baking", "pastries", "desserts", "bread making", "cake decorating"],
            "Food Science": ["food chemistry", "nutrition", "food safety", "molecular gastronomy"],
            "Restaurant Reviews": ["dining", "food critics", "restaurant industry", "culinary trends"],
            "Beverages": ["coffee", "tea", "wine", "cocktails", "brewing", "beverages"]
        },
        keywords: ["food", "cooking", "recipes", "culinary", "cuisine", "dining", "gastronomy"]
    },
    "Art & Design": {
        priority: 5,
        subcategories: {
            "Visual Arts": ["painting", "drawing", "sculpture", "contemporary art", "art history", "galleries"],
            "Graphic Design": ["design principles", "typography", "branding", "UI/UX", "digital art"],
            "Photography": ["photography techniques", "cameras", "photo editing", "portrait", "landscape"],
            "Architecture": ["building design", "urban planning", "architectural styles", "sustainable design"],
            "Fashion": ["fashion trends", "designers", "style", "fashion industry", "clothing"],
            "Interior Design": ["home decor", "furniture", "space planning", "design trends"]
        },
        keywords: ["art", "design", "creativity", "aesthetic", "visual", "artistic", "beauty"]
    },
    "News & Politics": {
        priority: 6,
        subcategories: {
            "World News": ["international affairs", "global events", "breaking news", "journalism"],
            "Politics": ["government", "elections", "policy", "political analysis", "democracy"],
            "Economics": ["economic news", "markets", "inflation", "trade", "economic policy"],
            "Social Issues": ["social justice", "human rights", "equality", "activism", "society"],
            "Environment": ["climate change", "environmental policy", "conservation", "sustainability"]
        },
        keywords: ["news", "politics", "current events", "government", "society", "world affairs"]
    }
};

// Popular keywords for quick selection
export const POPULAR_KEYWORDS = [
    "AI", "machine learning", "JavaScript", "React", "Python", "cryptocurrency", "Bitcoin",
    "startup", "entrepreneurship", "investing", "fitness", "health", "cooking", "travel",
    "photography", "gaming", "music", "movies", "books", "science", "technology",
    "climate change", "sustainability", "education", "learning", "productivity",
    "meditation", "mindfulness", "psychology", "history", "culture", "art", "design"
];

// Get suggestions based on partial input
export const getSuggestions = (input: string, type: 'category' | 'subcategory' | 'keyword'): string[] => {
    const query = input.toLowerCase().trim();

    if (type === 'category') {
        return Object.keys(INTEREST_CATEGORIES).filter(category =>
            category.toLowerCase().includes(query)
        );
    }

    if (type === 'subcategory') {
        const subcategories: string[] = [];
        Object.values(INTEREST_CATEGORIES).forEach(category => {
            if (category.subcategories) {
                subcategories.push(...Object.keys(category.subcategories));
            }
        });
        return subcategories.filter(sub =>
            sub.toLowerCase().includes(query)
        );
    }

    if (type === 'keyword') {
        const allKeywords: string[] = [...POPULAR_KEYWORDS];
        Object.values(INTEREST_CATEGORIES).forEach(category => {
            allKeywords.push(...category.keywords);
            if (category.subcategories) {
                Object.values(category.subcategories).forEach(keywords => {
                    allKeywords.push(...keywords);
                });
            }
        });

        return [...new Set(allKeywords)].filter(keyword =>
            keyword.toLowerCase().includes(query)
        ).slice(0, 10);
    }

    return [];
};

// Get subcategories for a given category
export const getSubcategories = (category: string): string[] => {
    const categoryData = INTEREST_CATEGORIES[category as keyof typeof INTEREST_CATEGORIES];
    return categoryData?.subcategories ? Object.keys(categoryData.subcategories) : [];
};

// Get keywords for a given category or subcategory
export const getKeywords = (category: string, subcategory?: string): string[] => {
    const categoryData = INTEREST_CATEGORIES[category as keyof typeof INTEREST_CATEGORIES];
    if (!categoryData) return [];

    if (subcategory && categoryData.subcategories) {
        const subcategoryData = categoryData.subcategories[subcategory as keyof typeof categoryData.subcategories];
        return subcategoryData || [];
    }

    return categoryData.keywords || [];
};
