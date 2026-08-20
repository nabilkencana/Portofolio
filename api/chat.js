// Serverless API route for AI Chatbot (Vercel Serverless Function)
// Keeps GEMINI_API_KEY and system prompt completely hidden from the client browser.

const BASE_BOT_CONTEXT = `
You are an AI assistant for Nabil Kencana's portfolio website. Your goal is to answer questions about Nabil Kencana in a friendly, professional, and helpful manner. You should represent Nabil's personality: enthusiastic about technology, creative, and eager to learn.

Background:
- Name: Nabil Kencana
- Education: Student at SMK Telkom Malang (a prestigious vocational high school in Indonesia).
- Roles: Fullstack Developer, Mobile App Developer, UI/UX Designer.
- Location: Malang, Indonesia.
- Focus: Developing modern, clean, and user-friendly applications using React, Tailwind CSS, NestJS, Flutter, Golang, and cloud technology.
- GitHub Profile: https://github.com/nabilkencana
- LinkedIn Profile: https://www.linkedin.com/in/nabilkencana/

Tech Stack:
- Frontend: ReactJS, Next.js, Tailwind CSS, HTML, CSS, JavaScript, TypeScript.
- Mobile: Flutter, Dart.
- Backend: Laravel, PHP, NestJS, Go (Golang), Node.js, TypeScript.
- Database: PostgreSQL, MySQL, Supabase, SQLite, Firebase.
- Tools & Cloud: Composer, Vite, Git, GitHub, Vercel, Figma.

Achievements & Competition Awards:
- Golden Ticket INOTEK UNISKA: Awarded for excellence in "Aplikasi" and "Ide Bisnis" categories at UNISKA.
- Juara 2 INOTEK Nasional: Achieved 2nd place in National INOTEK Innovation & Technology competition organized by UNISKA.
- Juara 3 Web Development Nasional: Achieved 3rd place in National Web Development competition organized by IITC Purwokerto.

Certifications & Courses (Featured on LinkedIn & Dicoding/Scrimba/GDG):
- Sertifikat Kompetensi Full Stack Developer (SMK Telkom Malang & Mitra Industri): Predikat 'Sangat Kompeten' dalam Uji Unit Kompetensi (UUK) proyek Pengembangan Aplikasi Web menggunakan Next.js & NestJS.
- Dicoding: Belajar Penggunaan Generative AI (Class on leveraging AI tools for productivity).
- Dicoding & DBS Foundation: Introduction to Financial Literacy (Coding Camp powered by DBS Foundation 2026).
- Dicoding: AI Praktis untuk Produktivitas (Practical AI for students and professionals).
- Dicoding: Belajar Dasar Pemrograman Web (Fundamentals of Web Development).
- Scrimba: Spesialisasi Vibe Coding (Interactive hands-on frontend specialization).
- Google Developer Groups: JuaraVibeCoding Certificate.
- AMD Talkshow Participant: Participated in high-level tech talkshow & discussions by AMD.
- Cyber Security Awareness Certification: Certified in fundamental cybersecurity and online safety practices.

Experience:
- Fullstack & Multi-Platform Development: Architecting and developing end-to-end ecosystems including React/TypeScript frontend, NestJS backend API, Flutter mobile app, and admin dashboard.
- Backend Engineering (Golang & NestJS): Building RESTful APIs, microservices, task management systems, and authentication mechanisms with Go (Golang) and NestJS.
- Frontend Development (React & Next.js): Developing modern, responsive web applications, corporate websites, and interactive portals using React, Next.js, and Tailwind CSS.
- Mobile Development (Flutter): Creating cross-platform mobile applications with state management, Supabase, and SQLite.
- AI & Smart Systems Integration: Integrating artificial intelligence features and Computer Vision capabilities into digital web and mobile products.

Instructions:
- Keep your answers concise, engaging, and professional.
- Tone: Professional, enthusiastic, and helpful.
- Language: Use Indonesian (Bahasa Indonesia) as the primary language. Respond in English only if the user specifically asks in English or language is set to English.
- Personalization: Use emojis occasionally (e.g., 🚀, ✨, 👨‍💻) to feel more personal.
- Dynamic GitHub & LinkedIn Context: Refer to Nabil's LinkedIn profile (nabilkencana) and GitHub profile (nabilkencana) when answering questions about his recent repositories, course certifications, awards, or professional background.
- Off-topic redirection: Jika pengguna bertanya di luar topik portofolio, pekerjaan, atau keahlian Nabil, arahkan kembali dengan sopan ke informasi yang relevan tentang portofolio Nabil.
`;

// In-memory cache for dynamic GitHub context (10 minutes TTL)
let cachedGithubContext = null;
let lastGithubFetchTime = 0;
const GITHUB_CACHE_TTL_MS = 10 * 60 * 1000;

// Simple in-memory rate limiting (max 20 requests per minute per IP)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 20;

const checkRateLimit = (ip) => {
  const now = Date.now();
  const userRate = rateLimitMap.get(ip) || { count: 0, firstRequest: now };

  if (now - userRate.firstRequest > RATE_LIMIT_WINDOW_MS) {
    userRate.count = 1;
    userRate.firstRequest = now;
  } else {
    userRate.count += 1;
  }

  rateLimitMap.set(ip, userRate);
  return userRate.count <= MAX_REQUESTS_PER_WINDOW;
};

// Periodically clean up rate limit map
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimitMap.entries()) {
    if (now - data.firstRequest > RATE_LIMIT_WINDOW_MS) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000);

const getDynamicSystemPrompt = async (language = 'id') => {
  const now = Date.now();
  let repoSummaries = '';

  if (cachedGithubContext && now - lastGithubFetchTime < GITHUB_CACHE_TTL_MS) {
    repoSummaries = cachedGithubContext;
  } else {
    try {
      const res = await fetch('https://api.github.com/users/nabilkencana/repos?sort=updated&per_page=15', {
        headers: { 'User-Agent': 'Canadev-Portfolio-Bot' },
      });
      if (res.ok) {
        const repos = await res.json();
        if (Array.isArray(repos) && repos.length > 0) {
          repoSummaries = repos
            .map((r) => {
              const desc = r.description ? ` - ${r.description}` : '';
              const lang = r.language ? ` [Language: ${r.language}]` : '';
              const stars = r.stargazers_count > 0 ? ` (⭐ ${r.stargazers_count})` : '';
              return `- ${r.name}${lang}${desc}${stars} (URL: ${r.html_url})`;
            })
            .join('\n');
          cachedGithubContext = repoSummaries;
          lastGithubFetchTime = now;
        }
      }
    } catch (err) {
      console.warn('[ChatBot Server] GitHub API fetch error:', err.message);
      if (cachedGithubContext) {
        repoSummaries = cachedGithubContext;
      }
    }
  }

  const langInstruction =
    language === 'en'
      ? '\n\nIMPORTANT: The user is browsing in English. Respond in English unless asked otherwise.'
      : '\n\nIMPORTANT: Respond in Indonesian (Bahasa Indonesia).';

  let prompt = BASE_BOT_CONTEXT;
  if (repoSummaries) {
    prompt += `\n\nLive GitHub Repositories (GitHub username: nabilkencana):\n${repoSummaries}\n\nNote: Always prioritize real-time GitHub data above when users ask about Nabil Kencana's latest repositories or project details.`;
  }
  prompt += langInstruction;

  return prompt;
};

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Basic rate limiting
  const clientIp =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    '127.0.0.1';

  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({ error: 'Too many requests. Please wait a moment before trying again.' });
  }

  // Parse Body
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: 'Invalid JSON payload' });
    }
  }

  const { message, history = [], language = 'id' } = body || {};

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (message.length > 1000) {
    return res.status(400).json({ error: 'Message is too long (maximum 1000 characters)' });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.error('[ChatBot Server] GEMINI_API_KEY is not configured on server.');
    return res.status(500).json({ error: 'AI service configuration error. Please contact administrator.' });
  }

  try {
    const systemPrompt = await getDynamicSystemPrompt(language);

    // Format history for Gemini API: [{ role: 'user'|'model', parts: [{ text: '...' }] }]
    const formattedContents = [];

    if (Array.isArray(history)) {
      const sanitizedHistory = history.slice(-15); // Limit history to last 15 messages
      for (const item of sanitizedHistory) {
        if (!item || !item.content || typeof item.content !== 'string') continue;
        const role = item.role === 'assistant' || item.role === 'model' ? 'model' : 'user';
        formattedContents.push({
          role,
          parts: [{ text: item.content.slice(0, 1500) }],
        });
      }
    }

    // Append the latest user message
    formattedContents.push({
      role: 'user',
      parts: [{ text: message.trim() }],
    });

    // Make request to Gemini 2.5 Flash API securely
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const geminiPayload = {
      system_instruction: {
        parts: [{ text: systemPrompt }],
      },
      contents: formattedContents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
    };

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(geminiPayload),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[ChatBot Server] Gemini API error HTTP ${response.status}:`, errText);
      return res.status(response.status).json({
        error: 'Failed to generate response from AI model',
        details: response.status === 429 ? 'Rate limit reached from AI provider' : undefined,
      });
    }

    const data = await response.json();
    const replyText =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      '';

    if (!replyText) {
      return res.status(500).json({ error: 'No content received from AI model' });
    }

    return res.status(200).json({ reply: replyText });
  } catch (error) {
    console.error('[ChatBot Server] Unexpected error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
