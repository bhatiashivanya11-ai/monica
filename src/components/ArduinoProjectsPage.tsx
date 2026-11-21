import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  Bookmark,
  Check,
  CheckCircle2,
  CheckSquare,
  Code2,
  Copy,
  Cpu,
  MessageSquareCode,
  Search,
  ShieldAlert,
  Square,
  Wrench,
} from 'lucide-react';
import { ARDUINO_PROJECTS } from '../data/arduinoProjectsData';
import {
  ArduinoCategory,
  ArduinoProjectItem,
  CourseItem,
  PageId,
  QuizScoreRecord,
} from '../types/platform';
import { CourseTrackPage } from './CourseTrackPage';
import { ResilientImage } from './ResilientImage';

interface ArduinoProjectsPageProps {
  arduinoCourse: CourseItem;
  completedLessons: string[];
  quizHistory: QuizScoreRecord[];
  selectedProjectId: string | null;
  bookmarkedArduinoIds: string[];
  completedArduinoIds: string[];
  checkedMaterialsByProject: Record<string, number[]>;
  checkedStepsByProject: Record<string, number[]>;
  onSelectProject: (projectId: string | null) => void;
  onToggleBookmark: (projectId: string) => void;
  onToggleCompleteProject: (projectId: string) => void;
  onToggleMaterial: (projectId: string, index: number) => void;
  onToggleStep: (projectId: string, index: number) => void;
  onToggleLesson: (lessonId: string) => void;
  onRecordQuizScore: (
    courseId: string,
    courseTitle: string,
    score: number,
    total: number,
    pointsEarned: number
  ) => void;
  onNavigate: (page: PageId) => void;
}

const CATEGORY_FILTERS: Array<{ id: 'all' | ArduinoCategory; label: string }> = [
  { id: 'all', label: 'All Categories' },
  { id: 'LED & Timing', label: 'LED & Timing' },
  { id: 'Sensors & Measurement', label: 'Sensors & Measurement' },
  { id: 'Automation & IoT', label: 'Automation & IoT' },
  { id: 'Robotics & Control', label: 'Robotics & Control' },
];

function renderCodeInline(text: string): React.ReactNode {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code
          key={idx}
          className="px-1.5 py-0.5 mx-0.5 rounded bg-slate-100 text-slate-900 font-mono text-xs"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

export const ArduinoProjectsPage: React.FC<ArduinoProjectsPageProps> = ({
  arduinoCourse,
  completedLessons,
  quizHistory,
  selectedProjectId,
  bookmarkedArduinoIds,
  completedArduinoIds,
  checkedMaterialsByProject,
  checkedStepsByProject,
  onSelectProject,
  onToggleBookmark,
  onToggleCompleteProject,
  onToggleMaterial,
  onToggleStep,
  onToggleLesson,
  onRecordQuizScore,
  onNavigate,
}) => {
  const [sectionTab, setSectionTab] = useState<'projects' | 'course'>('projects');
  const [viewMode, setViewMode] = useState<'all' | 'bookmarked' | 'completed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | ArduinoCategory>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'Beginner' | 'Intermediate' | 'Advanced'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    if (selectedProjectId) {
      setSectionTab('projects');
    }
  }, [selectedProjectId]);

  const selectedProject: ArduinoProjectItem | null = selectedProjectId
    ? ARDUINO_PROJECTS.find((p) => p.id === selectedProjectId) ?? null
    : null;

  const filteredProjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return ARDUINO_PROJECTS.filter((project) => {
      if (viewMode === 'bookmarked' && !bookmarkedArduinoIds.includes(project.id)) return false;
      if (viewMode === 'completed' && !completedArduinoIds.includes(project.id)) return false;
      if (categoryFilter !== 'all' && project.category !== categoryFilter) return false;
      if (difficultyFilter !== 'all' && project.difficulty !== difficultyFilter) return false;
      if (
        q &&
        !project.title.toLowerCase().includes(q) &&
        !project.summary.toLowerCase().includes(q) &&
        !project.category.toLowerCase().includes(q) &&
        !project.components.some((c) => c.toLowerCase().includes(q))
      ) {
        return false;
      }
      return true;
    });
  }, [
    viewMode,
    categoryFilter,
    difficultyFilter,
    searchQuery,
    bookmarkedArduinoIds,
    completedArduinoIds,
  ]);

  const completedCount = ARDUINO_PROJECTS.filter((p) =>
    completedArduinoIds.includes(p.id)
  ).length;
  const bookmarkedCount = ARDUINO_PROJECTS.filter((p) =>
    bookmarkedArduinoIds.includes(p.id)
  ).length;
  const completionPct = Math.round((completedCount / ARDUINO_PROJECTS.length) * 100);

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      setCopiedCode(false);
    }
  };

  // Detail View when a specific Arduino project is opened
  if (selectedProject && sectionTab === 'projects') {
    const isBookmarked = bookmarkedArduinoIds.includes(selectedProject.id);
    const isCompleted = completedArduinoIds.includes(selectedProject.id);
    const checkedMaterials = checkedMaterialsByProject[selectedProject.id] ?? [];
    const checkedSteps = checkedStepsByProject[selectedProject.id] ?? [];

    return (
      <div className="space-y-8">
        {/* Top Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => onSelectProject(null)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Arduino Projects</span>
          </button>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => onToggleBookmark(selectedProject.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg border transition-colors whitespace-nowrap ${
                isBookmarked
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-blue-600' : ''}`} />
              <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleCompleteProject(selectedProject.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg border transition-colors whitespace-nowrap ${
                isCompleted
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isCompleted ? 'Completed' : 'Mark as Completed'}</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('mentor')}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              <MessageSquareCode className="w-4 h-4" />
              <span>Ask AI Mentor</span>
            </button>
          </div>
        </div>

        {/* Hero Summary Card */}
        <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between gap-6">
              <div className="space-y-3">
                <div className="text-xs font-semibold text-blue-700">
                  Arduino · {selectedProject.category} · {selectedProject.difficulty} ·{' '}
                  {selectedProject.estimatedTime}
                </div>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                  {selectedProject.title}
                </h1>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {selectedProject.summary}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                <div>
                  <div className="text-xs text-slate-500">Difficulty</div>
                  <div className="text-sm font-semibold text-slate-900 mt-0.5">
                    {selectedProject.difficulty}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Estimated Time</div>
                  <div className="text-sm font-semibold text-slate-900 mt-0.5 tabular-nums">
                    {selectedProject.estimatedTime}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Build Progress</div>
                  <div className="text-sm font-semibold text-slate-900 mt-0.5 tabular-nums">
                    {checkedSteps.length} / {selectedProject.steps.length} steps
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-100 min-h-[220px] relative">
              <ResilientImage
                src={selectedProject.imageUrl}
                alt={selectedProject.imageAlt}
                className="w-full h-full lg:absolute lg:inset-0 object-cover"
              />
            </div>
          </div>
        </section>

        {/* Safety Instructions + Components Checklist */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <section className="lg:col-span-5 bg-amber-50/70 border border-amber-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-700" />
              <h2 className="font-display text-lg font-bold text-slate-900">
                Safety Instructions
              </h2>
            </div>
            <ul className="space-y-3 text-sm text-slate-800 leading-relaxed">
              {selectedProject.safetyInstructions.map((rule) => (
                <li key={rule} className="flex items-start gap-2.5">
                  <span className="text-amber-700 font-bold mt-0.5">•</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-blue-600" />
                <h2 className="font-display text-lg font-bold text-slate-900">
                  Components Checklist
                </h2>
              </div>
              <span className="text-xs font-semibold text-slate-600 tabular-nums">
                {checkedMaterials.length} / {selectedProject.components.length} checked
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {selectedProject.components.map((item, idx) => {
                const checked = checkedMaterials.includes(idx);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => onToggleMaterial(selectedProject.id, idx)}
                    className={`flex items-start gap-2.5 p-3 rounded-lg border text-left transition-colors ${
                      checked
                        ? 'bg-emerald-50/70 border-emerald-200 text-slate-600'
                        : 'bg-slate-50/60 border-slate-200 text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    {checked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                    )}
                    <span className={`text-xs sm:text-sm ${checked ? 'line-through text-slate-500' : ''}`}>
                      {item}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* Circuit Connections Table */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-600" />
            <h2 className="font-display text-lg font-bold text-slate-900">
              Circuit Connections
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs text-slate-500">
                  <th className="py-2.5 pr-4 font-semibold">Component / Part</th>
                  <th className="py-2.5 px-4 font-semibold">Module Pin</th>
                  <th className="py-2.5 px-4 font-semibold">Arduino Pin</th>
                  <th className="py-2.5 pl-4 font-semibold">Wiring Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {selectedProject.circuitConnections.map((conn) => (
                  <tr key={conn.component} className="hover:bg-slate-50/60">
                    <td className="py-3 pr-4 font-semibold text-slate-900 whitespace-nowrap">
                      {conn.component}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-slate-700 whitespace-nowrap">
                      {conn.signalPin}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs font-semibold text-blue-700 whitespace-nowrap">
                      {conn.controllerPin}
                    </td>
                    <td className="py-3 pl-4 text-xs sm:text-sm text-slate-600">{conn.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Step-by-Step Instructions */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900">
                Step-by-Step Instructions
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Check off each step as you wire and test your Arduino circuit.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-600 tabular-nums">
              {checkedSteps.length} of {selectedProject.steps.length} done
            </span>
          </div>

          <div className="space-y-3">
            {selectedProject.steps.map((step, idx) => {
              const done = checkedSteps.includes(idx);
              return (
                <button
                  key={step}
                  type="button"
                  onClick={() => onToggleStep(selectedProject.id, idx)}
                  className={`w-full flex items-start gap-4 p-4 rounded-xl border text-left transition-colors ${
                    done
                      ? 'bg-emerald-50/60 border-emerald-200'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold tabular-nums shrink-0 ${
                      done ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span
                    className={`text-sm leading-relaxed pt-0.5 ${
                      done ? 'line-through text-slate-500' : 'text-slate-800'
                    }`}
                  >
                    {step}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Formatted Arduino Code + Explanation of the Code */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <section className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-blue-600" />
                <h2 className="font-display text-lg font-bold text-slate-900">
                  Arduino Code (C++)
                </h2>
              </div>
              <button
                type="button"
                onClick={() => void handleCopyCode(selectedProject.arduinoCode)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>

            <pre className="bg-slate-900 text-slate-100 rounded-xl p-4 text-xs sm:text-sm overflow-x-auto leading-relaxed">
              <code>{selectedProject.arduinoCode}</code>
            </pre>
          </section>

          <section className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h2 className="font-display text-lg font-bold text-slate-900">
              Explanation of the Code
            </h2>
            <ol className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
              {selectedProject.codeExplanation.map((line, idx) => (
                <li key={line} className="flex items-start gap-2.5">
                  <span className="font-mono text-xs font-semibold text-blue-600 mt-0.5 tabular-nums">
                    0{idx + 1}
                  </span>
                  <span>{renderCodeInline(line)}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* Troubleshooting Tips */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h2 className="font-display text-lg font-bold text-slate-900">
              Troubleshooting Tips
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedProject.troubleshootingTips.map((tip) => (
              <div
                key={tip.issue}
                className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1.5"
              >
                <div className="text-sm font-semibold text-slate-900">{tip.issue}</div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {tip.solution}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Switcher: Arduino Projects Hub vs Arduino Track Lessons & Quiz */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
            Arduino Projects
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Hands-on Arduino Uno builds with circuit wiring, C++ code explanations, safety rules, and progress tracking.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit shrink-0">
          <button
            type="button"
            onClick={() => setSectionTab('projects')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              sectionTab === 'projects'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Projects ({ARDUINO_PROJECTS.length})
          </button>
          <button
            type="button"
            onClick={() => setSectionTab('course')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              sectionTab === 'course'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Lessons &amp; Quiz ({arduinoCourse.quiz.length})
          </button>
        </div>
      </div>

      {sectionTab === 'course' ? (
        <CourseTrackPage
          course={arduinoCourse}
          completedLessons={completedLessons}
          quizHistory={quizHistory}
          onToggleLesson={onToggleLesson}
          onRecordQuizScore={onRecordQuizScore}
          onNavigate={onNavigate}
        />
      ) : (
        <>
          {/* Completion Progress Banner & Search */}
          <section className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="flex-1 space-y-2 max-w-xl">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 tabular-nums">
                <span>
                  Arduino Build Progress: {completedCount} of {ARDUINO_PROJECTS.length} Completed ({completionPct}%)
                </span>
                <span className="text-blue-700">{bookmarkedCount} Bookmarked</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
            </div>

            <div className="relative w-full lg:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Arduino projects or parts..."
                aria-label="Search Arduino projects"
                className="w-full h-10 pl-9 pr-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>
          </section>

          {/* Filters: View Mode + Difficulty + Category */}
          <section className="bg-white border border-slate-200 rounded-xl p-3 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setViewMode('all')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                    viewMode === 'all'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All ({ARDUINO_PROJECTS.length})
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('bookmarked')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                    viewMode === 'bookmarked'
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Bookmark
                    className={`w-3.5 h-3.5 ${viewMode === 'bookmarked' ? 'fill-blue-600' : ''}`}
                  />
                  <span>Bookmarked ({bookmarkedCount})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('completed')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                    viewMode === 'completed'
                      ? 'bg-white text-emerald-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Completed ({completedCount})</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="arduino-difficulty-filter" className="text-xs font-medium text-slate-500">
                  Difficulty:
                </label>
                <select
                  id="arduino-difficulty-filter"
                  aria-label="Filter Arduino projects by difficulty"
                  value={difficultyFilter}
                  onChange={(e) =>
                    setDifficultyFilter(
                      e.target.value as 'all' | 'Beginner' | 'Intermediate' | 'Advanced'
                    )
                  }
                  className="h-9 px-3 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:border-blue-600 focus:outline-none"
                >
                  <option value="all">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit">
              {CATEGORY_FILTERS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setCategoryFilter(tab.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                    categoryFilter === tab.id
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </section>

          {/* Arduino Project Cards Grid */}
          {filteredProjects.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-3">
              <p className="text-sm text-slate-600">
                No Arduino projects match the selected search or filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setViewMode('all');
                  setCategoryFilter('all');
                  setDifficultyFilter('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Show All Arduino Projects
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredProjects.map((project) => {
                const isSaved = bookmarkedArduinoIds.includes(project.id);
                const isDone = completedArduinoIds.includes(project.id);

                return (
                  <div
                    key={project.id}
                    className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col justify-between hover:border-blue-300 transition-colors"
                  >
                    <div
                      onClick={() => onSelectProject(project.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onSelectProject(project.id);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      className="cursor-pointer group flex-1"
                    >
                      <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
                        <ResilientImage
                          src={project.imageUrl}
                          alt={project.imageAlt}
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                        />
                      </div>
                      <div className="p-5 space-y-2">
                        <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                          <span className="truncate">
                            {project.category} · {project.difficulty} · {project.estimatedTime}
                          </span>
                          {isDone && (
                            <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 shrink-0">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Done</span>
                            </span>
                          )}
                        </div>
                        <h2 className="font-display text-lg font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                          {project.title}
                        </h2>
                        <p className="text-sm text-slate-600 line-clamp-2">{project.summary}</p>
                        <div className="text-xs text-slate-500 pt-1 tabular-nums">
                          {project.components.length} components · {project.steps.length} steps
                        </div>
                      </div>
                    </div>

                    <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => onSelectProject(project.id)}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap"
                      >
                        Open Project
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onToggleCompleteProject(project.id)}
                          aria-label={
                            isDone
                              ? `Mark ${project.title} incomplete`
                              : `Mark ${project.title} completed`
                          }
                          className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                            isDone
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{isDone ? 'Completed' : 'Complete'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onToggleBookmark(project.id)}
                          aria-label={
                            isSaved
                              ? `Remove bookmark for ${project.title}`
                              : `Bookmark ${project.title}`
                          }
                          className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                            isSaved
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-blue-600' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};
