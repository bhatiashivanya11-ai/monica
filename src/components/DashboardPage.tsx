import React, { useMemo } from 'react';
import {
  Activity,
  ArrowRight,
  Award,
  Bookmark,
  BookOpen,
  CheckCircle2,
  Clock,
  Compass,
  Flame,
  FolderCheck,
  GraduationCap,
  Lock,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { ARDUINO_PROJECTS } from '../data/arduinoProjectsData';
import { CODING_CHALLENGES, COURSES, PROJECTS } from '../data/roboLearnData';
import { computeCoreBadgeStatuses } from '../services/storageService';
import {
  ActivityEvent,
  CoreBadgeStatus,
  EarnedBadgeRecord,
  GallerySubmission,
  PageId,
  QuizScoreRecord,
  StudentProfile,
  WeeklyActivityDay,
} from '../types/platform';
import { ResilientImage } from './ResilientImage';

interface DashboardPageProps {
  profile: StudentProfile;
  completedLessons: string[];
  bookmarkedProjectIds: string[];
  bookmarkedArduinoIds: string[];
  completedProjectIds: string[];
  completedArduinoIds: string[];
  solvedChallengeIds: string[];
  quizHistory: QuizScoreRecord[];
  persistedBadges: EarnedBadgeRecord[];
  gallerySubmissions: GallerySubmission[];
  recentActivities: ActivityEvent[];
  weeklyActivity: WeeklyActivityDay[];
  totalXp: number;
  onNavigate: (page: PageId) => void;
  onOpenProject: (projectId: string) => void;
  onOpenArduinoProject: (projectId: string) => void;
  onToggleBookmark: (projectId: string) => void;
  onToggleArduinoBookmark: (projectId: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  profile,
  completedLessons,
  bookmarkedProjectIds,
  bookmarkedArduinoIds,
  completedProjectIds,
  completedArduinoIds,
  solvedChallengeIds,
  quizHistory,
  persistedBadges,
  gallerySubmissions,
  recentActivities,
  weeklyActivity,
  totalXp,
  onNavigate,
  onOpenProject,
  onOpenArduinoProject,
  onToggleBookmark,
  onToggleArduinoBookmark,
}) => {
  const totalLessons = COURSES.reduce((acc, c) => acc + c.lessons.length, 0);
  const overallPercent = Math.round((completedLessons.length / totalLessons) * 100);

  const avgCourseCompletionPct = useMemo(() => {
    const sumPct = COURSES.reduce((acc, course) => {
      const done = course.lessons.filter((l) => completedLessons.includes(l.id)).length;
      return acc + (done / course.lessons.length) * 100;
    }, 0);
    return Math.round(sumPct / COURSES.length);
  }, [completedLessons]);

  const avgQuizScore =
    quizHistory.length > 0
      ? Math.round(
          (quizHistory.reduce((acc, q) => acc + q.score / q.total, 0) / quizHistory.length) * 100
        )
      : 0;

  const uniqueCompletedQuizTracks = new Set(quizHistory.map((q) => q.courseId)).size;
  const totalQuizPoints = quizHistory.reduce(
    (acc, q) => acc + (q.pointsEarned ?? q.score * 25),
    0
  );

  const ownedGalleryCount = gallerySubmissions.filter(
    (s) =>
      Boolean(s.isOwner) ||
      s.studentName.trim().toLowerCase() === profile.name.trim().toLowerCase()
  ).length;

  const totalProjectsAvailable = PROJECTS.length + ARDUINO_PROJECTS.length;
  const totalProjectsCompleted =
    completedProjectIds.length + completedArduinoIds.length + ownedGalleryCount;

  const totalWeeklyMinutes = weeklyActivity.reduce((acc, d) => acc + d.minutes, 0);
  const maxDayMinutes = Math.max(...weeklyActivity.map((d) => d.minutes), 60);

  // Dynamically compute & sync the 6 core RoboLearn Hub badges from stored student progress
  const badges: CoreBadgeStatus[] = useMemo(() => {
    return computeCoreBadgeStatuses({
      profileName: profile.name,
      completedLessons,
      quizScores: quizHistory,
      solvedChallengeIds,
      completedProjectIds,
      completedArduinoIds,
      gallerySubmissions,
      totalXp,
      persistedBadges,
    });
  }, [
    profile.name,
    completedLessons,
    quizHistory,
    solvedChallengeIds,
    completedProjectIds,
    completedArduinoIds,
    gallerySubmissions,
    totalXp,
    persistedBadges,
  ]);

  const earnedBadgesCount = badges.filter((b) => b.earned).length;

  // Combined bookmarked projects from Project Library and Arduino Projects
  const bookmarkedEntries = useMemo(() => {
    const libraryItems = PROJECTS.filter((p) => bookmarkedProjectIds.includes(p.id)).map((p) => ({
      id: p.id,
      kind: 'library' as const,
      title: p.title,
      meta: `${p.trackLabel} · ${p.duration}`,
      imageUrl: p.imageUrl,
      imageAlt: p.imageAlt,
    }));
    const arduinoItems = ARDUINO_PROJECTS.filter((ap) =>
      bookmarkedArduinoIds.includes(ap.id)
    ).map((ap) => ({
      id: ap.id,
      kind: 'arduino' as const,
      title: ap.title,
      meta: `Arduino · ${ap.estimatedTime}`,
      imageUrl: ap.imageUrl,
      imageAlt: ap.imageAlt,
    }));
    return [...libraryItems, ...arduinoItems];
  }, [bookmarkedProjectIds, bookmarkedArduinoIds]);

  // Dynamically recommend 3 uncompleted projects aligned with favorite track & next steps
  const recommendedProjects = useMemo(() => {
    const candidates = [
      ...PROJECTS.filter((p) => !completedProjectIds.includes(p.id)).map((p) => ({
        id: p.id,
        kind: 'library' as const,
        title: p.title,
        track: p.track,
        label: p.trackLabel,
        difficulty: p.difficulty,
        duration: p.duration,
        summary: p.summary,
        imageUrl: p.imageUrl,
        imageAlt: p.imageAlt,
      })),
      ...ARDUINO_PROJECTS.filter((ap) => !completedArduinoIds.includes(ap.id)).map((ap) => ({
        id: ap.id,
        kind: 'arduino' as const,
        title: ap.title,
        track: 'arduino' as const,
        label: 'Arduino',
        difficulty: ap.difficulty,
        duration: ap.estimatedTime,
        summary: ap.summary,
        imageUrl: ap.imageUrl,
        imageAlt: ap.imageAlt,
      })),
    ];

    return candidates
      .sort((a, b) => {
        const aFav = a.track === profile.favoriteTrack ? 0 : 1;
        const bFav = b.track === profile.favoriteTrack ? 0 : 1;
        if (aFav !== bFav) return aFav - bFav;
        const diffRank = { Beginner: 0, Intermediate: 1, Advanced: 2 };
        return diffRank[a.difficulty] - diffRank[b.difficulty];
      })
      .slice(0, 3);
  }, [completedProjectIds, completedArduinoIds, profile.favoriteTrack]);

  // Recommend the first course that is not yet 100% finished
  const nextCourse =
    COURSES.find((c) => c.lessons.some((l) => !completedLessons.includes(l.id))) ?? COURSES[0];

  return (
    <div className="space-y-8">
      {/* Student Header Banner */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
            <ResilientImage
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">
              {profile.grade} · Age {profile.age} · Explorer Level{' '}
              {Math.max(1, Math.floor(totalXp / 250) + 1)}
            </div>
            <h1 className="font-display text-2xl font-bold text-slate-900 mt-0.5">
              {profile.name}&apos;s Learning Dashboard
            </h1>
            <p className="text-sm text-slate-600 mt-1 tabular-nums">
              Weekly goal: {totalWeeklyMinutes} / {profile.weeklyGoalMinutes} minutes completed
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate(nextCourse.pageId)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            <span>Resume: {nextCourse.accentLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onNavigate('profile')}
            className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap"
          >
            Edit Profile
          </button>
        </div>
      </section>

      {/* 6-Card Live Progress KPI Grid */}
      <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Courses Enrolled</span>
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">
            {COURSES.length}
          </div>
          <div className="mt-1 text-xs text-slate-500 tabular-nums">
            {avgCourseCompletionPct}% avg completion
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Lessons Done</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">
            {completedLessons.length} / {totalLessons}
          </div>
          <div className="mt-1 text-xs text-slate-500 tabular-nums">
            {overallPercent}% overall progress
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Projects Done</span>
            <FolderCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">
            {totalProjectsCompleted}
          </div>
          <div className="mt-1 text-xs text-slate-500 tabular-nums">
            {completedArduinoIds.length + completedProjectIds.length}/{totalProjectsAvailable} guides · {ownedGalleryCount} gallery
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Coding Challenges</span>
            <Flame className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">
            {solvedChallengeIds.length} / {CODING_CHALLENGES.length}
          </div>
          <div className="mt-1 text-xs text-slate-500 tabular-nums">
            {Math.round((solvedChallengeIds.length / CODING_CHALLENGES.length) * 100)}% solved
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Quiz Scores</span>
            <GraduationCap className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">
            {quizHistory.length > 0 ? `${avgQuizScore}%` : '—'}
          </div>
          <div className="mt-1 text-xs text-slate-500 tabular-nums">
            {uniqueCompletedQuizTracks}/{COURSES.length} tracks · +{totalQuizPoints} XP
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Coding Points</span>
            <Trophy className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">
            {totalXp} XP
          </div>
          <div className="mt-1 text-xs text-slate-500 tabular-nums">
            {earnedBadgesCount} / {badges.length} badges earned
          </div>
        </div>
      </section>

      {/* Main Two-Column Grid: Learning Progress by Subject + Weekly Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Track Progress List */}
        <section className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-lg font-bold text-slate-900">
              Learning Progress by Subject
            </h2>
            <span className="text-xs text-slate-500 tabular-nums">
              {COURSES.length} Enrolled Courses
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {COURSES.map((course) => {
              const done = course.lessons.filter((l) => completedLessons.includes(l.id)).length;
              const pct = Math.round((done / course.lessons.length) * 100);
              const bestQuiz = quizHistory
                .filter((q) => q.courseId === course.id)
                .reduce<QuizScoreRecord | undefined>((best, cur) => {
                  if (!best) return cur;
                  return cur.score / cur.total > best.score / best.total ? cur : best;
                }, undefined);

              const subjectChallenges = CODING_CHALLENGES.filter(
                (c) => c.track === course.track
              );
              const subjectChallengesSolved = subjectChallenges.filter((c) =>
                solvedChallengeIds.includes(c.id)
              ).length;

              return (
                <div key={course.id} className="py-4 first:pt-0 last:pb-0 space-y-2.5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <button
                        type="button"
                        onClick={() => onNavigate(course.pageId)}
                        className="w-full block text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors text-left truncate"
                      >
                        {course.title}
                      </button>
                      <div className="text-xs text-slate-500 tabular-nums">
                        {course.accentLabel} · {done}/{course.lessons.length} lessons ({pct}%) ·{' '}
                        {bestQuiz
                          ? `Best Quiz: ${bestQuiz.score}/${bestQuiz.total}`
                          : 'Quiz not taken'}
                        {subjectChallenges.length > 0
                          ? ` · Challenges: ${subjectChallengesSolved}/${subjectChallenges.length}`
                          : ''}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onNavigate(course.pageId)}
                      className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors whitespace-nowrap shrink-0"
                    >
                      {pct === 100 ? 'Review' : 'Continue'}
                    </button>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        pct === 100 ? 'bg-emerald-600' : 'bg-blue-600'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Weekly Activity Chart */}
        <section className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between gap-6">
          <div>
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-display text-lg font-bold text-slate-900">
                Weekly Activity Chart
              </h2>
              <Clock className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Updates automatically as you finish lessons, quizzes, challenges, and hardware builds.
            </p>
          </div>

          <div className="flex items-end justify-between gap-3 h-48 pt-4 border-b border-slate-200 pb-2">
            {weeklyActivity.map((item) => {
              const barPct = Math.max(10, Math.round((item.minutes / maxDayMinutes) * 100));
              return (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-xs font-medium text-slate-600 tabular-nums">
                    {item.minutes}m
                  </span>
                  <div className="w-full max-w-[34px] bg-slate-100 rounded-t-md h-32 flex items-end overflow-hidden">
                    <div
                      className="w-full bg-blue-600 rounded-t-md transition-all"
                      style={{ height: `${barPct}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-500">{item.day}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600 tabular-nums">
            <span>
              Total: {totalWeeklyMinutes} min · Daily avg: {Math.round(totalWeeklyMinutes / 7)} min
            </span>
            <button
              type="button"
              onClick={() => onNavigate('challenges')}
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Add today&apos;s practice
            </button>
          </div>
        </section>
      </div>

      {/* Earned Badges Section */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            <h2 className="font-display text-lg font-bold text-slate-900">Earned Badges</h2>
          </div>
          <span className="text-xs font-semibold text-slate-600 tabular-nums">
            {earnedBadgesCount} of {badges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.name}
              className={`rounded-xl border p-4 flex items-start gap-3 transition-colors ${
                badge.earned
                  ? 'bg-blue-50/50 border-blue-200'
                  : 'bg-slate-50/70 border-slate-200 opacity-85'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  badge.earned ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
                }`}
              >
                {badge.earned ? (
                  <Award className="w-5 h-5" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm font-bold text-slate-900 truncate">{badge.name}</div>
                  <span
                    className={`text-[11px] font-semibold whitespace-nowrap ${
                      badge.earned ? 'text-emerald-700' : 'text-slate-500'
                    }`}
                  >
                    {badge.earned ? 'Earned' : 'Locked'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 leading-snug">{badge.description}</p>
                <div className="text-[11px] font-medium text-blue-700 mt-1.5 tabular-nums">
                  {badge.earned && badge.earnedAt
                    ? `Unlocked · ${badge.earnedAt}`
                    : badge.progressText}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recommended Projects & Recent Student Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recommended Projects */}
        <section className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-blue-600" />
              <h2 className="font-display text-lg font-bold text-slate-900">
                Recommended Projects
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('projects')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap"
            >
              Explore All Builds
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {recommendedProjects.map((proj) => (
              <button
                key={`${proj.kind}-${proj.id}`}
                type="button"
                onClick={() =>
                  proj.kind === 'arduino'
                    ? onOpenArduinoProject(proj.id)
                    : onOpenProject(proj.id)
                }
                className="text-left rounded-xl border border-slate-200 overflow-hidden hover:border-blue-300 transition-colors flex flex-col justify-between group"
              >
                <div>
                  <div className="aspect-[16/10] bg-slate-100 overflow-hidden">
                    <ResilientImage
                      src={proj.imageUrl}
                      alt={proj.imageAlt}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                    />
                  </div>
                  <div className="p-3.5 space-y-1">
                    <div className="text-[11px] font-medium text-blue-700">
                      {proj.label} · {proj.difficulty}
                    </div>
                    <div className="text-sm font-bold text-slate-900 group-hover:text-blue-700 line-clamp-1">
                      {proj.title}
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2">{proj.summary}</p>
                  </div>
                </div>
                <div className="px-3.5 py-2 border-t border-slate-100 text-xs font-semibold text-slate-600 flex items-center justify-between">
                  <span>{proj.duration}</span>
                  <span className="text-blue-600">Open</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Recent Student Activities */}
        <section className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <h2 className="font-display text-lg font-bold text-slate-900">
                Recent Student Activities
              </h2>
            </div>
            <span className="text-xs text-slate-500 tabular-nums">
              {recentActivities.length} logged
            </span>
          </div>

          {recentActivities.length === 0 ? (
            <p className="text-sm text-slate-500 py-6 text-center">
              Complete a lesson, quiz, challenge, or project to see your activity timeline here.
            </p>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentActivities.slice(0, 6).map((act) => (
                <div
                  key={act.id}
                  className="py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900 truncate">
                      {act.title}
                    </div>
                    <div className="text-xs text-slate-500">
                      {act.subject} · {act.timestamp}
                    </div>
                  </div>
                  {act.pointsDelta > 0 && (
                    <span className="text-xs font-semibold text-emerald-700 tabular-nums whitespace-nowrap shrink-0">
                      +{act.pointsDelta} XP
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Bottom Row: Saved Projects & Quiz Score History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Bookmarked Projects */}
        <section className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-lg font-bold text-slate-900">
              Saved &amp; Bookmarked Projects
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('projects')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap"
            >
              Browse All
            </button>
          </div>

          {bookmarkedEntries.length === 0 ? (
            <div className="py-8 text-center space-y-3">
              <p className="text-sm text-slate-500">
                You haven&apos;t bookmarked any workshop builds yet.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('projects')}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Explore Project Library
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {bookmarkedEntries.map((project) => (
                <div
                  key={`${project.kind}-${project.id}`}
                  className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                >
                  <button
                    type="button"
                    onClick={() =>
                      project.kind === 'arduino'
                        ? onOpenArduinoProject(project.id)
                        : onOpenProject(project.id)
                    }
                    className="flex items-center gap-3 min-w-0 text-left group"
                  >
                    <div className="w-12 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                      <ResilientImage
                        src={project.imageUrl}
                        alt={project.imageAlt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 truncate">
                        {project.title}
                      </div>
                      <div className="text-xs text-slate-500">{project.meta}</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      project.kind === 'arduino'
                        ? onToggleArduinoBookmark(project.id)
                        : onToggleBookmark(project.id)
                    }
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-md shrink-0"
                    aria-label={`Remove ${project.title} from bookmarks`}
                  >
                    <Bookmark className="w-4 h-4 fill-blue-600" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Quiz Score History */}
        <section className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h2 className="font-display text-lg font-bold text-slate-900">Quiz Score History</h2>
            </div>
            <span className="text-xs text-slate-500 tabular-nums">
              {quizHistory.length} recorded
            </span>
          </div>

          {quizHistory.length === 0 ? (
            <div className="py-8 text-center space-y-3">
              <p className="text-sm text-slate-500">
                Complete a track quiz in Robotics, Scratch, Python, Arduino, or AI to record your
                score.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('robotics')}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Start Robotics Quiz
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs text-slate-500">
                    <th className="py-2 pr-3 font-medium">Track Assessment</th>
                    <th className="py-2 px-3 font-medium text-right">Score</th>
                    <th className="py-2 px-3 font-medium text-right">Points</th>
                    <th className="py-2 pl-3 font-medium text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {quizHistory.map((item, idx) => (
                    <tr key={`${item.courseId}-${idx}`}>
                      <td className="py-2.5 pr-3 font-medium text-slate-900">
                        {item.courseTitle}
                      </td>
                      <td className="py-2.5 px-3 text-right font-semibold tabular-nums text-emerald-700">
                        {item.score}/{item.total} ({Math.round((item.score / item.total) * 100)}%)
                      </td>
                      <td className="py-2.5 px-3 text-right text-xs font-semibold tabular-nums text-blue-700 whitespace-nowrap">
                        +{item.pointsEarned ?? item.score * 25} XP
                      </td>
                      <td className="py-2.5 pl-3 text-right text-xs text-slate-500 tabular-nums whitespace-nowrap">
                        {item.completedAt}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
