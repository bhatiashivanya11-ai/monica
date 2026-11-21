import React, { useEffect, useMemo, useState } from 'react';
import {
  Award,
  CheckCircle2,
  Circle,
  Clock,
  HelpCircle,
  ListChecks,
  Play,
  RotateCcw,
  Target,
  Trophy,
} from 'lucide-react';
import { CODING_CHALLENGES } from '../data/roboLearnData';
import { ChallengeCategory, CodingChallenge, Difficulty } from '../types/platform';

interface CodingChallengesPageProps {
  solvedChallengeIds: string[];
  challengeCodeDrafts: Record<string, string>;
  selectedChallengeId?: string | null;
  onSolveChallenge: (challengeId: string) => void;
  onToggleChallengeComplete: (challengeId: string) => void;
  onSaveChallengeDraft: (challengeId: string, code: string) => void;
}

const CATEGORY_FILTERS: Array<{ id: 'All' | ChallengeCategory; label: string }> = [
  { id: 'All', label: 'All Categories' },
  { id: 'Python', label: 'Python' },
  { id: 'Scratch', label: 'Scratch' },
  { id: 'Robotics', label: 'Robotics' },
];

const DIFFICULTY_FILTERS: Array<{ id: 'All' | Difficulty; label: string }> = [
  { id: 'All', label: 'All Levels' },
  { id: 'Beginner', label: 'Beginner' },
  { id: 'Intermediate', label: 'Intermediate' },
  { id: 'Advanced', label: 'Advanced' },
];

export const CodingChallengesPage: React.FC<CodingChallengesPageProps> = ({
  solvedChallengeIds,
  challengeCodeDrafts,
  selectedChallengeId,
  onSolveChallenge,
  onToggleChallengeComplete,
  onSaveChallengeDraft,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<'All' | ChallengeCategory>('All');
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | Difficulty>('All');
  const [activeChallengeId, setActiveChallengeId] = useState<string>(
    selectedChallengeId ?? CODING_CHALLENGES[0].id
  );
  const [feedback, setFeedback] = useState<{ passed: boolean; message: string } | null>(null);
  const [showHints, setShowHints] = useState(false);

  useEffect(() => {
    if (selectedChallengeId && CODING_CHALLENGES.some((c) => c.id === selectedChallengeId)) {
      setCategoryFilter('All');
      setDifficultyFilter('All');
      setActiveChallengeId(selectedChallengeId);
      setFeedback(null);
      setShowHints(false);
    }
  }, [selectedChallengeId]);

  const visibleChallenges = useMemo(() => {
    return CODING_CHALLENGES.filter((c) => {
      const matchesCat = categoryFilter === 'All' || c.trackLabel === categoryFilter;
      const matchesDiff = difficultyFilter === 'All' || c.difficulty === difficultyFilter;
      return matchesCat && matchesDiff;
    });
  }, [categoryFilter, difficultyFilter]);

  const activeChallenge: CodingChallenge =
    visibleChallenges.find((c) => c.id === activeChallengeId) ??
    visibleChallenges[0] ??
    CODING_CHALLENGES.find((c) => c.id === activeChallengeId) ??
    CODING_CHALLENGES[0];

  const isCurrentSolved = solvedChallengeIds.includes(activeChallenge.id);
  const currentCode = challengeCodeDrafts[activeChallenge.id] ?? activeChallenge.starterCode;

  const totalEarnedChallengeXp = useMemo(() => {
    return CODING_CHALLENGES.reduce((sum, ch) => {
      return sum + (solvedChallengeIds.includes(ch.id) ? ch.xpReward : 0);
    }, 0);
  }, [solvedChallengeIds]);

  const completionPct = Math.round(
    (solvedChallengeIds.length / CODING_CHALLENGES.length) * 100
  );

  const categoryProgress = useMemo(() => {
    const categories: ChallengeCategory[] = ['Python', 'Scratch', 'Robotics'];
    return categories.map((cat) => {
      const items = CODING_CHALLENGES.filter((c) => c.trackLabel === cat);
      const done = items.filter((c) => solvedChallengeIds.includes(c.id)).length;
      return {
        category: cat,
        done,
        total: items.length,
        pct: Math.round((done / items.length) * 100),
        mastered: done === items.length,
      };
    });
  }, [solvedChallengeIds]);

  const unlockedBadges = useMemo(() => {
    const challengeBadges = CODING_CHALLENGES.filter((c) =>
      solvedChallengeIds.includes(c.id)
    ).map((c) => ({
      id: c.id,
      title: c.badgeTitle,
      source: c.trackLabel,
    }));

    const masteryBadges = categoryProgress
      .filter((cp) => cp.mastered)
      .map((cp) => ({
        id: `master-${cp.category}`,
        title: `${cp.category} Track Champion`,
        source: 'Mastery',
      }));

    return [...masteryBadges, ...challengeBadges];
  }, [solvedChallengeIds, categoryProgress]);

  const handleSelectChallenge = (challenge: CodingChallenge) => {
    setActiveChallengeId(challenge.id);
    setFeedback(null);
    setShowHints(false);
  };

  const handleCategoryChange = (nextCategory: 'All' | ChallengeCategory) => {
    setCategoryFilter(nextCategory);
    setFeedback(null);
    setShowHints(false);
  };

  const handleDifficultyChange = (nextDifficulty: 'All' | Difficulty) => {
    setDifficultyFilter(nextDifficulty);
    setFeedback(null);
    setShowHints(false);
  };

  const handleCheckSolution = () => {
    const normalized = currentCode.toLowerCase();
    const missing = activeChallenge.expectedKeywords.filter(
      (kw) => !normalized.includes(kw.toLowerCase())
    );

    if (currentCode.trim() === activeChallenge.starterCode.trim()) {
      setFeedback({
        passed: false,
        message: 'Modify the starter code first before running your check.',
      });
      return;
    }

    if (missing.length === 0) {
      onSolveChallenge(activeChallenge.id);
      setFeedback({
        passed: true,
        message: `All checks passed! +${activeChallenge.xpReward} XP and "${activeChallenge.badgeTitle}" unlocked.`,
      });
    } else {
      setFeedback({
        passed: false,
        message: `Not quite yet — make sure your solution includes logic for: ${missing.join(', ')}.`,
      });
    }
  };

  const handleReset = () => {
    onSaveChallengeDraft(activeChallenge.id, activeChallenge.starterCode);
    setFeedback(null);
  };

  const handleRevealSolution = () => {
    onSaveChallengeDraft(activeChallenge.id, activeChallenge.sampleSolution);
    setFeedback(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header & Overall Progress Summary */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
            Coding Challenges
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Practice Python, Scratch, and Robotics challenges across Beginner, Intermediate, and Advanced levels.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-700 tabular-nums">
          <span className="inline-flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-600" />
            <span>
              {solvedChallengeIds.length} / {CODING_CHALLENGES.length} Completed ({completionPct}%)
            </span>
          </span>
          <span className="text-blue-700">+{totalEarnedChallengeXp} Challenge XP</span>
        </div>
      </div>

      {/* Progress Tracking & Badges Strip */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Track Breakdown Progress */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-sm font-bold text-slate-900">
              Challenge Progress by Category
            </h2>
            <span className="text-xs text-slate-500 tabular-nums">
              Overall: {completionPct}% complete
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {categoryProgress.map((item) => (
              <div key={item.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs tabular-nums">
                  <span className="font-semibold text-slate-800">{item.category}</span>
                  <span className="text-slate-500">
                    {item.done}/{item.total}
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      item.mastered ? 'bg-emerald-600' : 'bg-blue-600'
                    }`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Unlocked Challenge Badges */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600" />
              <h2 className="font-display text-sm font-bold text-slate-900">
                Earned Challenge Badges
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-500 tabular-nums">
              {unlockedBadges.length} unlocked
            </span>
          </div>

          {unlockedBadges.length === 0 ? (
            <p className="text-xs text-slate-500">
              Complete any Python, Scratch, or Robotics challenge to unlock your first badge.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {unlockedBadges.slice(0, 5).map((badge) => (
                <div
                  key={badge.id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-xs font-medium text-blue-900"
                >
                  <Award className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>{badge.title}</span>
                </div>
              ))}
              {unlockedBadges.length > 5 && (
                <span className="text-xs font-medium text-slate-500 self-center tabular-nums">
                  +{unlockedBadges.length - 5} more
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Category & Difficulty Filters */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit">
          {CATEGORY_FILTERS.map((tab) => {
            const count =
              tab.id === 'All'
                ? CODING_CHALLENGES.length
                : CODING_CHALLENGES.filter((c) => c.trackLabel === tab.id).length;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleCategoryChange(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap tabular-nums ${
                  categoryFilter === tab.id
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Difficulty Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit">
          {DIFFICULTY_FILTERS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleDifficultyChange(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                difficultyFilter === tab.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Main Workspace: Challenge Cards + Challenge Runner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Challenge Cards List */}
        <div className="lg:col-span-5 space-y-3">
          {visibleChallenges.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-6 text-center space-y-3">
              <p className="text-sm text-slate-600">
                No challenges match {categoryFilter} · {difficultyFilter}.
              </p>
              <button
                type="button"
                onClick={() => {
                  setCategoryFilter('All');
                  setDifficultyFilter('All');
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Show All Challenges
              </button>
            </div>
          ) : (
            visibleChallenges.map((challenge) => {
              const isSolved = solvedChallengeIds.includes(challenge.id);
              const isSelected = activeChallenge.id === challenge.id;

              return (
                <button
                  key={challenge.id}
                  type="button"
                  onClick={() => handleSelectChallenge(challenge)}
                  className={`w-full text-left p-4 rounded-xl border transition-colors ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-500'
                      : 'bg-white border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-medium text-slate-500 tabular-nums">
                        {challenge.trackLabel} · {challenge.difficulty} · {challenge.xpReward} XP
                      </div>
                      <h2 className="font-display text-base font-bold text-slate-900 mt-1">
                        {challenge.title}
                      </h2>
                    </div>
                    {isSolved ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 shrink-0 whitespace-nowrap">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Completed</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 shrink-0 whitespace-nowrap">
                        <Circle className="w-4 h-4" />
                        <span>Open</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">{challenge.prompt}</p>
                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 tabular-nums">
                    <span className="inline-flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-blue-600" />
                      <span>Badge: {challenge.badgeTitle}</span>
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{challenge.estimatedMinutes} min</span>
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Active Challenge Detail & Editor */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          {/* Header & Mark Completed Control */}
          <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="space-y-1">
              <div className="text-xs font-medium text-blue-700 tabular-nums">
                {activeChallenge.trackLabel} · {activeChallenge.difficulty} ·{' '}
                {activeChallenge.estimatedMinutes} min · +{activeChallenge.xpReward} XP
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                {activeChallenge.title}
              </h2>
              <div className="text-xs text-slate-500 inline-flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-blue-600" />
                <span>Reward Badge: {activeChallenge.badgeTitle}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowHints((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>
                  {showHints
                    ? 'Hide Hints'
                    : `Hints (${activeChallenge.hints.length})`}
                </span>
              </button>

              <button
                type="button"
                onClick={() => onToggleChallengeComplete(activeChallenge.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  isCurrentSolved
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isCurrentSolved ? 'Completed' : 'Mark as Completed'}</span>
              </button>
            </div>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed">{activeChallenge.prompt}</p>

          {/* Learning Objectives & Step-by-Step Instructions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <Target className="w-4 h-4 text-blue-600" />
                <span>Learning Objectives</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700 leading-relaxed">
                {activeChallenge.learningObjectives.map((obj) => (
                  <li key={obj} className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <ListChecks className="w-4 h-4 text-blue-600" />
                <span>Challenge Instructions</span>
              </div>
              <ol className="space-y-1.5 text-xs text-slate-700 leading-relaxed">
                {activeChallenge.instructions.map((step, idx) => (
                  <li key={step} className="flex items-start gap-2">
                    <span className="font-semibold text-slate-900 tabular-nums shrink-0">
                      {idx + 1}.
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Expandable Hints Panel */}
          {showHints && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
              <div className="text-xs font-bold text-blue-950">Helpful Hints</div>
              <ul className="space-y-1.5 text-xs text-blue-900 leading-relaxed">
                {activeChallenge.hints.map((hintItem, idx) => (
                  <li key={hintItem} className="flex items-start gap-2">
                    <span className="font-semibold tabular-nums">#{idx + 1}</span>
                    <span>{hintItem}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Code / Logic Workspace */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="challenge-editor"
                className="block text-xs font-semibold text-slate-500"
              >
                Your Solution ({activeChallenge.codeLanguage})
              </label>
              <span className="text-xs text-slate-400">
                Edit starter code and click Check Solution, or Mark as Completed after building
              </span>
            </div>
            <textarea
              id="challenge-editor"
              value={currentCode}
              onChange={(e) => onSaveChallengeDraft(activeChallenge.id, e.target.value)}
              rows={9}
              spellCheck={false}
              className="w-full font-mono text-xs sm:text-sm bg-slate-900 text-slate-100 rounded-xl p-4 border border-slate-800 focus:border-blue-500 focus:outline-none leading-relaxed"
            />
          </div>

          {feedback && (
            <div
              className={`rounded-lg p-3 text-xs font-medium border ${
                feedback.passed
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              {feedback.message}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
              <button
                type="button"
                onClick={handleRevealSolution}
                className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                Load Example Solution
              </button>
            </div>

            <button
              type="button"
              onClick={handleCheckSolution}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Play className="w-4 h-4" />
              <span>Check Solution</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
