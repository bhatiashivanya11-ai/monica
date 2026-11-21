import express from 'express';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

interface MentorMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface MentorRequestBody {
  message?: string;
  track?: string;
  codeSnippet?: string;
  history?: MentorMessage[];
}

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      timeout: 35000,
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const SUPPORTED_SUBJECTS = new Set([
  'Robotics',
  'Scratch',
  'Python',
  'Arduino',
  'Artificial Intelligence',
]);

async function withRetry<T>(fn: () => Promise<T>, maxRetries = 2): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err: unknown) {
      lastError = err;
      const msg = err instanceof Error ? err.message : '';
      const errName = err instanceof Error ? err.name : '';
      const isNonRetryable =
        errName === 'AbortError' ||
        errName === 'TimeoutError' ||
        msg.includes('timed out') ||
        msg.includes('API_KEY_INVALID') ||
        msg.includes('PERMISSION_DENIED') ||
        msg.includes('403') ||
        msg.includes('400') ||
        msg.includes('404') ||
        msg.includes('429') ||
        msg.includes('RESOURCE_EXHAUSTED');
      if (isNonRetryable || attempt === maxRetries) {
        throw err;
      }
      await new Promise((resolve) => setTimeout(resolve, 400 * Math.pow(2, attempt)));
    }
  }
  throw lastError;
}

const GALLERY_STORE_PATH = path.join(os.tmpdir(), 'robolearn-gallery-v1.json');

interface GalleryRecord {
  id: string;
  title: string;
  studentName: string;
  studentAge: number;
  track: string;
  trackLabel: string;
  description: string;
  learningObjectives: string[];
  componentsUsed: string[];
  imageUrl: string;
  likes: number;
  submittedAt: string;
  codeHighlight?: string;
  isOwner?: boolean;
}

function readGalleryStore(): GalleryRecord[] | null {
  try {
    if (!fs.existsSync(GALLERY_STORE_PATH)) return null;
    const raw = fs.readFileSync(GALLERY_STORE_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as GalleryRecord[]) : null;
  } catch {
    return null;
  }
}

function writeGalleryStore(items: GalleryRecord[]): boolean {
  try {
    fs.writeFileSync(GALLERY_STORE_PATH, JSON.stringify(items, null, 2), 'utf8');
    return true;
  } catch {
    return false;
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '4mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'RoboLearn Hub' });
  });

  app.get('/api/gallery', (_req, res) => {
    const items = readGalleryStore();
    return res.json({ items });
  });

  app.post('/api/gallery', (req, res) => {
    const item = req.body as Partial<GalleryRecord>;
    if (
      !item ||
      typeof item.id !== 'string' ||
      typeof item.title !== 'string' ||
      !item.title.trim() ||
      typeof item.studentName !== 'string' ||
      !item.studentName.trim() ||
      typeof item.description !== 'string' ||
      !item.description.trim()
    ) {
      return res.status(400).json({ error: 'Missing required project submission fields.' });
    }
    const existing = readGalleryStore() ?? [];
    const nextItem: GalleryRecord = {
      id: item.id,
      title: item.title.trim(),
      studentName: item.studentName.trim(),
      studentAge: typeof item.studentAge === 'number' ? item.studentAge : 13,
      track: typeof item.track === 'string' ? item.track : 'robotics',
      trackLabel: typeof item.trackLabel === 'string' ? item.trackLabel : 'Robotics',
      description: item.description.trim(),
      learningObjectives: Array.isArray(item.learningObjectives) ? item.learningObjectives : [],
      componentsUsed: Array.isArray(item.componentsUsed) ? item.componentsUsed : [],
      imageUrl: typeof item.imageUrl === 'string' ? item.imageUrl : '',
      likes: typeof item.likes === 'number' ? item.likes : 1,
      submittedAt: typeof item.submittedAt === 'string' ? item.submittedAt : 'Just now',
      codeHighlight: typeof item.codeHighlight === 'string' ? item.codeHighlight : undefined,
      isOwner: Boolean(item.isOwner),
    };
    const filtered = existing.filter((x) => x.id !== nextItem.id);
    const updated = [nextItem, ...filtered];
    writeGalleryStore(updated);
    return res.status(201).json({ item: nextItem });
  });

  app.put('/api/gallery/:id', (req, res) => {
    const targetId = req.params.id;
    const patch = req.body as Partial<GalleryRecord>;
    const existing = readGalleryStore();
    if (!existing) {
      return res.status(200).json({ item: patch, persisted: false });
    }
    const idx = existing.findIndex((x) => x.id === targetId);
    if (idx === -1) {
      const created = { ...(patch as GalleryRecord), id: targetId };
      writeGalleryStore([created, ...existing]);
      return res.status(200).json({ item: created, persisted: true });
    }
    const updatedItem: GalleryRecord = {
      ...existing[idx],
      ...patch,
      id: targetId,
    };
    const next = [...existing];
    next[idx] = updatedItem;
    writeGalleryStore(next);
    return res.json({ item: updatedItem, persisted: true });
  });

  app.delete('/api/gallery/:id', (req, res) => {
    const targetId = req.params.id;
    const existing = readGalleryStore();
    if (existing) {
      writeGalleryStore(existing.filter((x) => x.id !== targetId));
    }
    return res.json({ deleted: true, id: targetId });
  });

  app.post('/api/mentor/chat', async (req, res) => {
    try {
      const body = req.body as MentorRequestBody;
      const userMessage = typeof body.message === 'string' ? body.message.trim() : '';
      const rawTrack = typeof body.track === 'string' ? body.track.trim() : 'Robotics';
      const subject = SUPPORTED_SUBJECTS.has(rawTrack) ? rawTrack : 'Robotics';
      const codeSnippet = typeof body.codeSnippet === 'string' ? body.codeSnippet.trim() : '';
      const rawHistory = Array.isArray(body.history) ? body.history.slice(-10) : [];

      if (!userMessage) {
        return res.status(400).json({ error: 'Please enter a question or problem for your mentor.' });
      }

      if (userMessage.length > 4000) {
        return res.status(400).json({ error: 'Your question is a bit long. Please keep it under 4,000 characters.' });
      }

      const ai = getGeminiClient();
      if (!ai) {
        return res.status(503).json({
          error:
            'AI Coding Mentor is not connected yet. Please configure GEMINI_API_KEY in Settings > Secrets to chat with Gemini.',
        });
      }

      const systemInstruction = [
        'You are the RoboLearn Hub AI Coding Mentor — a warm, patient, encouraging STEM tutor for school students aged 8 to 16.',
        `Active Subject Focus: ${subject} (Supported subjects: Robotics, Scratch, Python, Arduino, Artificial Intelligence).`,
        '',
        'PEDAGOGY & COMMUNICATION RULES:',
        '1. Use simple, clear, friendly language suitable for school students aged 8–16. Avoid unnecessarily complicated jargon.',
        '2. Always explain step by step and include concrete, relatable examples.',
        '3. Encourage students to think independently. When a student is solving a coding challenge or puzzle, give guiding hints and ask what they notice BEFORE giving away a complete solution.',
        '4. Stay focused on educational STEM topics (Robotics, Scratch, Python, Arduino, AI, electronics, math, and engineering). If asked about unrelated non-STEM topics, kindly steer the conversation back to a STEM project or coding idea.',
        '5. End your response with an encouraging follow-up question or small next experiment to invite the student to keep exploring.',
        '',
        'SUBJECT-SPECIFIC GUIDELINES:',
        '- Python: Show clean, short Python code snippets and explain what each line does in plain words.',
        '- Robotics: Explain sensors, motors, motor drivers, circuits, and mechanical components clearly (e.g., how inputs sense the world and outputs act on it).',
        '- Arduino: Provide clear Arduino C++ code (`setup()`, `loop()`, pin constants) and explain the exact pin wiring and circuit connections when relevant.',
        '- Scratch: Explain block logic (`when green flag clicked`, `forever`, `if <> then`, variables, sensing, broadcasts) in a beginner-friendly way.',
        '- Artificial Intelligence: Explain datasets, features, labels, predictions, confidence thresholds, and fairness using intuitive everyday examples.',
        '',
        'SAFETY RULES (CRITICAL):',
        '- Never encourage unsafe electronics or robotics experiments (never mains AC wall power, lithium battery shorting/puncturing, high-power lasers, or hazardous chemicals).',
        '- Whenever a question involves electrical components, batteries, motors, soldering, or hand tools, clearly mention practical safety precautions (such as disconnecting battery power before changing wires, double-checking +5V/GND polarity, using current-limiting resistors for LEDs, and asking an adult for help when soldering or cutting).',
      ].join('\n');

      // Build clean alternating Gemini chat history (excluding any leading assistant greeting)
      const chatHistory: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];
      for (const item of rawHistory) {
        if (!item || typeof item.content !== 'string' || !item.content.trim()) continue;
        const mappedRole = item.role === 'assistant' ? 'model' : 'user';
        if (chatHistory.length === 0 && mappedRole === 'model') {
          continue;
        }
        const prev = chatHistory[chatHistory.length - 1];
        if (prev && prev.role === mappedRole) {
          prev.parts[0].text += `\n\n${item.content.trim()}`;
        } else {
          chatHistory.push({
            role: mappedRole,
            parts: [{ text: item.content.trim() }],
          });
        }
      }

      const currentTurnParts = [`[Selected Subject: ${subject}]`];
      if (codeSnippet) {
        currentTurnParts.push(`Student's Code or Wiring Notes:\n\`\`\`\n${codeSnippet}\n\`\`\``);
      }
      currentTurnParts.push(`Student Question: ${userMessage}`);

      const response = await withRetry(async () => {
        const chat = ai.chats.create({
          model: 'gemini-4-hydrogen',
          history: chatHistory,
          config: {
            systemInstruction,
            thinkingConfig: {
              thinkingLevel: ThinkingLevel.LOW,
            },
          },
        });
        return chat.sendMessage({
          message: currentTurnParts.join('\n\n'),
        });
      });

      const reply = response.text?.trim();
      if (!reply) {
        return res.status(502).json({
          error: 'The AI Coding Mentor returned an empty reply. Please try asking your question again.',
        });
      }

      return res.json({ reply });
    } catch (err: unknown) {
      console.error('Gemini mentor error:', err);
      const message =
        err instanceof Error ? err.message : 'Unexpected error while contacting the AI Coding Mentor.';
      if (
        message.includes('API_KEY_INVALID') ||
        message.includes('PERMISSION_DENIED') ||
        message.includes('403')
      ) {
        return res.status(403).json({
          error:
            'The Gemini API key appears invalid or lacks permission. Please verify GEMINI_API_KEY in Settings > Secrets.',
        });
      }
      if (message.includes('RESOURCE_EXHAUSTED') || message.includes('429')) {
        return res.status(429).json({
          error: 'Mentor request limit reached for the moment. Please wait a few seconds and try again.',
        });
      }
      if (message.includes('NOT_FOUND') || message.includes('404')) {
        return res.status(502).json({
          error: 'The configured Gemini model could not be reached. Please try again shortly.',
        });
      }
      if (
        (err instanceof Error && (err.name === 'AbortError' || err.name === 'TimeoutError')) ||
        message.toLowerCase().includes('timeout') ||
        message.toLowerCase().includes('timed out')
      ) {
        return res.status(504).json({
          error:
            'The AI Coding Mentor took too long to respond. Please wait a moment and click Retry.',
        });
      }
      return res.status(500).json({
        error: 'Unable to reach the AI Coding Mentor right now. Please try again in a moment.',
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RoboLearn Hub server listening on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
