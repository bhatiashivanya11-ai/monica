import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  Code2,
  Loader2,
  RotateCcw,
  Send,
  ShieldCheck,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { MENTOR_STORAGE_KEY } from '../services/storageService';
import { MentorMessage } from '../types/platform';

type MentorSubject =
  | 'Robotics'
  | 'Scratch'
  | 'Python'
  | 'Arduino'
  | 'Artificial Intelligence';

const SUPPORTED_SUBJECTS: MentorSubject[] = [
  'Robotics',
  'Scratch',
  'Python',
  'Arduino',
  'Artificial Intelligence',
];

const SUGGESTED_QUESTIONS_BY_SUBJECT: Record<MentorSubject, string[]> = {
  Robotics: [
    'How does an HC-SR04 ultrasonic sensor measure distance in centimeters?',
    'Why do we need an L298N motor driver instead of plugging DC motors straight into Arduino?',
    'Give me a hint on how to make my line-following robot stay on a black tape track.',
  ],
  Scratch: [
    'How do I make my sprite jump smoothly with gravity in Scratch?',
    'How can I stop my player sprite from walking through maze walls?',
    'How do I create a Score variable for a Scratch catching game?',
  ],
  Python: [
    'Explain how a Python for loop with range(1, 11) prints a multiplication table.',
    'Can you give me a hint to check if a number is even or odd in Python?',
    'How do lists and functions work together in a Python number guessing game?',
  ],
  Arduino: [
    'Why does an LED need a 220-ohm resistor when wired to Arduino pin 13?',
    'How do I wire and sweep a micro servo motor safely on an Arduino Uno?',
    'What is the difference between digitalRead() and analogRead() in Arduino?',
  ],
  'Artificial Intelligence': [
    'What is the difference between training data and test data in machine learning?',
    'How does a confidence threshold stop a sorting robot from guessing when unsure?',
    'Why does an AI image classifier need examples from many different angles and lighting?',
  ],
};

const LEGACY_MENTOR_STORAGE_KEY = 'robolearn_mentor_session_v1';

const WELCOME_MESSAGE: MentorMessage = {
  id: 'welcome-1',
  role: 'assistant',
  content:
    'Hi! I am your RoboLearn AI Coding Mentor. Pick a subject above (Robotics, Scratch, Python, Arduino, or Artificial Intelligence), try a suggested question, or ask about anything you are building!',
  timestamp: 'Ready',
};

function renderInlineFormatting(text: string): React.ReactNode[] {
  const tokens = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return tokens.map((token, idx) => {
    if (token.startsWith('`') && token.endsWith('`') && token.length >= 2) {
      return (
        <code
          key={idx}
          className="px-1.5 py-0.5 mx-0.5 rounded bg-slate-100 text-slate-900 font-mono text-[12px]"
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    if (token.startsWith('**') && token.endsWith('**') && token.length >= 4) {
      return (
        <strong key={idx} className="font-semibold text-slate-900">
          {token.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={idx}>{token}</React.Fragment>;
  });
}

function renderFormattedReply(content: string): React.ReactNode {
  const segments = content.split(/(```[\s\S]*?```)/g);
  return (
    <div className="space-y-2.5">
      {segments.map((segment, segIdx) => {
        if (segment.startsWith('```') && segment.endsWith('```')) {
          const inner = segment.slice(3, -3);
          const firstNewline = inner.indexOf('\n');
          const lang = firstNewline > 0 ? inner.slice(0, firstNewline).trim() : '';
          const code = firstNewline >= 0 ? inner.slice(firstNewline + 1) : inner;

          return (
            <div key={segIdx} className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
              {lang && (
                <div className="px-3 py-1.5 text-[11px] font-mono text-slate-400 border-b border-slate-800">
                  {lang}
                </div>
              )}
              <pre className="p-3.5 text-xs font-mono text-slate-100 overflow-x-auto leading-relaxed">
                <code>{code.trimEnd()}</code>
              </pre>
            </div>
          );
        }

        const lines = segment.split('\n');
        return (
          <div key={segIdx} className="space-y-1.5">
            {lines.map((line, lineIdx) => {
              const trimmed = line.trim();
              if (!trimmed) {
                return <div key={lineIdx} className="h-1" />;
              }
              return (
                <p key={lineIdx} className="leading-relaxed">
                  {renderInlineFormatting(line)}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export const AiMentorPage: React.FC = () => {
  const [subject, setSubject] = useState<MentorSubject>(() => {
    try {
      const saved =
        localStorage.getItem(MENTOR_STORAGE_KEY) ??
        localStorage.getItem(LEGACY_MENTOR_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as { subject?: MentorSubject };
        if (parsed.subject && SUPPORTED_SUBJECTS.includes(parsed.subject)) {
          return parsed.subject;
        }
      }
    } catch {
      // Ignore storage read errors
    }
    return 'Robotics';
  });

  const [messages, setMessages] = useState<MentorMessage[]>(() => {
    try {
      const saved =
        localStorage.getItem(MENTOR_STORAGE_KEY) ??
        localStorage.getItem(LEGACY_MENTOR_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as { messages?: MentorMessage[] };
        if (Array.isArray(parsed.messages) && parsed.messages.length > 0) {
          return parsed.messages;
        }
      }
    } catch {
      // Ignore storage read errors
    }
    return [WELCOME_MESSAGE];
  });

  const [question, setQuestion] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [showCodeBox, setShowCodeBox] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastFailedPrompt, setLastFailedPrompt] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(MENTOR_STORAGE_KEY, JSON.stringify({ subject, messages }));
    } catch {
      // Ignore quota errors
    }
  }, [subject, messages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = async (
    textToSend?: string,
    overrideSubject?: MentorSubject,
    isRetry = false
  ) => {
    const promptText = (textToSend ?? question).trim();
    const activeSubject = overrideSubject ?? subject;
    if (!promptText || isLoading) return;

    setErrorMsg(null);
    setLastFailedPrompt(null);

    let historyForApi = messages;
    if (!isRetry) {
      const userMsg: MentorMessage = {
        id: `u-${Date.now()}`,
        role: 'user',
        content: promptText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      historyForApi = [...messages, userMsg];
      setMessages(historyForApi);
      if (!textToSend) setQuestion('');
    }

    setIsLoading(true);

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 45000);

    try {
      const response = await fetch('/api/mentor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          message: promptText,
          track: activeSubject,
          codeSnippet: codeSnippet.trim() || undefined,
          history: historyForApi.slice(0, -1).slice(-10).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const rawText = await response.text();
      let data: { reply?: string; error?: string } = {};
      try {
        data = JSON.parse(rawText) as { reply?: string; error?: string };
      } catch {
        data = {};
      }

      if (!response.ok || !data.reply) {
        throw new Error(data.error || 'Could not reach the AI Coding Mentor.');
      }

      const assistantMsg: MentorMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: unknown) {
      const isTimeout =
        err instanceof Error && (err.name === 'AbortError' || err.name === 'TimeoutError');
      const msg = isTimeout
        ? 'The AI Coding Mentor took too long to respond. Please try clicking Retry.'
        : err instanceof Error
        ? err.message
        : 'Unable to contact the AI Coding Mentor right now. Please try again.';
      setErrorMsg(msg);
      setLastFailedPrompt(promptText);
    } finally {
      window.clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setErrorMsg(null);
    setLastFailedPrompt(null);
    setCodeSnippet('');
    setMessages([
      {
        id: `welcome-reset-${Date.now()}`,
        role: 'assistant',
        content: `Conversation cleared! Ask me anything about ${subject} — or switch subjects above anytime.`,
        timestamp: 'Ready',
      },
    ]);
  };

  const suggestedQuestions = SUGGESTED_QUESTIONS_BY_SUBJECT[subject];

  return (
    <div className="space-y-6">
      {/* Header & Clear Conversation Control */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
            AI Coding Mentor
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Friendly step-by-step STEM tutoring for ages 8–16 across Robotics, Scratch, Python, Arduino, and AI.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="hidden md:inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
            <ShieldCheck className="w-4 h-4" />
            <span>Safe Guided Hints</span>
          </span>
          <button
            type="button"
            onClick={handleClearChat}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 h-9 px-3.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors whitespace-nowrap"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Conversation</span>
          </button>
        </div>
      </div>

      {/* Subject Selector Tabs */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div
            className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg"
            role="tablist"
            aria-label="Choose a STEM subject"
          >
            {SUPPORTED_SUBJECTS.map((item) => {
              const isSelected = subject === item;
              return (
                <button
                  key={item}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSubject(item)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                    isSelected
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
          <span className="text-xs text-slate-500">
            Active Subject: <strong className="text-slate-800">{subject}</strong>
          </span>
        </div>

        {/* Suggested Questions for Selected Subject */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {suggestedQuestions.map((prompt) => (
            <button
              key={prompt}
              type="button"
              disabled={isLoading}
              onClick={() => void sendMessage(prompt, subject)}
              className="bg-white border border-slate-200 rounded-xl p-3.5 text-left hover:border-blue-300 hover:bg-blue-50/40 transition-colors disabled:opacity-50"
            >
              <div className="text-xs font-semibold text-blue-700">
                Suggested · {subject}
              </div>
              <div className="text-xs text-slate-700 mt-1 leading-snug line-clamp-2">
                {prompt}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Main Chat Container */}
      <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col">
        <div
          className="p-4 sm:p-6 space-y-4 h-[430px] sm:h-[480px] overflow-y-auto bg-slate-50/60"
          aria-live="polite"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[90%] sm:max-w-[82%] rounded-2xl px-4 py-3 text-sm ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white whitespace-pre-wrap leading-relaxed'
                    : 'bg-white border border-slate-200 text-slate-800'
                }`}
              >
                {msg.role === 'assistant' ? (
                  <>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 mb-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>RoboLearn Mentor · {msg.timestamp}</span>
                    </div>
                    {renderFormattedReply(msg.content)}
                  </>
                ) : (
                  <div>
                    <div>{msg.content}</div>
                    <div className="text-[11px] text-blue-100 mt-1 text-right tabular-nums">
                      {msg.timestamp}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-600 inline-flex items-center gap-2.5">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600 shrink-0" />
                <span>Mentor is thinking through your {subject} question...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Error Display with Retry */}
        {errorMsg && (
          <div className="mx-4 sm:mx-5 mt-3 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-900 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-start gap-2 min-w-0 flex-1">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{errorMsg}</span>
            </div>
            {lastFailedPrompt && (
              <button
                type="button"
                disabled={isLoading}
                onClick={() => void sendMessage(lastFailedPrompt, subject, true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-800 bg-white border border-red-200 rounded-lg hover:bg-red-100 transition-colors whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
            )}
          </div>
        )}

        {/* Message Composer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void sendMessage();
          }}
          className="p-4 sm:p-5 border-t border-slate-200 bg-white space-y-3"
        >
          {showCodeBox && (
            <div>
              <label
                htmlFor="mentor-code"
                className="block text-xs font-semibold text-slate-600 mb-1.5"
              >
                Optional Code or Circuit Notes ({subject})
              </label>
              <textarea
                id="mentor-code"
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                rows={4}
                placeholder={`Paste your ${subject} code, block steps, or pin connections here...`}
                className="w-full font-mono text-xs bg-slate-900 text-slate-100 rounded-xl p-3 border border-slate-800 focus:border-blue-600 focus:outline-none"
              />
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <button
              type="button"
              onClick={() => setShowCodeBox((prev) => !prev)}
              className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                showCodeBox
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>{showCodeBox ? 'Hide Code Box' : 'Attach Code'}</span>
            </button>

            <label htmlFor="mentor-question" className="sr-only">
              Ask your STEM question
            </label>
            <input
              id="mentor-question"
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={isLoading}
              placeholder={`Ask a ${subject} question (e.g. "How do I start this step by step?")`}
              className="flex-1 h-10 px-3.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:outline-none disabled:opacity-60"
            />

            <button
              type="submit"
              disabled={isLoading || !question.trim()}
              className="inline-flex items-center justify-center gap-2 px-5 h-10 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap shrink-0"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>{isLoading ? 'Sending...' : 'Send'}</span>
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};
