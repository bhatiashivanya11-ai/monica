import { ARDUINO_PROJECTS } from '../data/arduinoProjectsData';
import {
  CODING_CHALLENGES,
  COURSES,
  INITIAL_GALLERY_SUBMISSIONS,
  INITIAL_PROFILE,
  PROJECTS,
  WEEKLY_ACTIVITY_MINUTES,
} from '../data/roboLearnData';
import {
  ActivityEvent,
  ChallengeResultRecord,
  CoreBadgeStatus,
  EarnedBadgeRecord,
  GallerySubmission,
  PersistedStudentData,
  QuizScoreRecord,
  StudentProfile,
  TrackSlug,
  WeeklyActivityDay,
} from '../types/platform';

export const STUDENT_STORAGE_KEY = 'robolearn_hub_state_v2';
export const MENTOR_STORAGE_KEY = 'robolearn_hub_mentor_v1';
export const STUDENT_SCHEMA_VERSION = 2;

const VALID_LESSON_IDS = new Set(COURSES.flatMap((c) => c.lessons.map((l) => l.id)));
const VALID_PROJECT_IDS = new Set(PROJECTS.map((p) => p.id));
const VALID_ARDUINO_IDS = new Set(ARDUINO_PROJECTS.map((p) => p.id));
const VALID_CHALLENGE_IDS = new Set(CODING_CHALLENGES.map((c) => c.id));
const VALID_COURSE_IDS = new Set(COURSES.map((c) => c.id));
const VALID_TRACKS = new Set<TrackSlug>(['robotics', 'scratch', 'python', 'arduino', 'ai-ml']);
const WEEKDAY_ORDER = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface StudentStorageRepository {
  load(): PersistedStudentData;
  save(data: PersistedStudentData): PersistedStudentData;
  reset(): PersistedStudentData;
}

export const INITIAL_ACTIVITIES: ActivityEvent[] = [
  {
    id: 'act-seed-1',
    type: 'project',
    title: 'Completed Arduino Project: LED Blinking',
    subject: 'Arduino',
    pointsDelta: 75,
    timestamp: 'Today · 10:15 AM',
  },
  {
    id: 'act-seed-2',
    type: 'quiz',
    title: 'Scored 9/10 on Scratch Visual Logic & Game Physics Quiz',
    subject: 'Scratch',
    pointsDelta: 275,
    timestamp: 'Nov 19, 2026',
  },
  {
    id: 'act-seed-3',
    type: 'challenge',
    title: 'Solved Challenge: Print Your Name',
    subject: 'Python',
    pointsDelta: 100,
    timestamp: 'Nov 18, 2026',
  },
  {
    id: 'act-seed-4',
    type: 'lesson',
    title: 'Completed Lesson: Variables & Input Basics',
    subject: 'Python',
    pointsDelta: 50,
    timestamp: 'Nov 17, 2026',
  },
  {
    id: 'act-seed-5',
    type: 'lesson',
    title: 'Completed Lesson: Ultrasonic Echolocation (HC-SR04)',
    subject: 'Robotics',
    pointsDelta: 50,
    timestamp: 'Nov 16, 2026',
  },
];

function formatDateBadgeLabel(): string {
  return new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function dedupeStrings(raw: unknown, validSet?: Set<string>, legacyAlias?: (id: string) => string): string[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const result: string[] = [];
  for (const item of raw) {
    if (typeof item !== 'string' && typeof item !== 'number') continue;
    const rawId = String(item).trim();
    if (!rawId) continue;
    const normalized = legacyAlias ? legacyAlias(rawId) : rawId;
    if (validSet && !validSet.has(normalized)) continue;
    if (!seen.has(normalized)) {
      seen.add(normalized);
      result.push(normalized);
    }
  }
  return result;
}

function sanitizeProfile(raw: unknown): StudentProfile {
  if (!raw || typeof raw !== 'object') {
    return { ...INITIAL_PROFILE };
  }
  const obj = raw as Partial<StudentProfile>;
  const ageNum = typeof obj.age === 'number' && Number.isFinite(obj.age) ? obj.age : INITIAL_PROFILE.age;
  const goalNum =
    typeof obj.weeklyGoalMinutes === 'number' && Number.isFinite(obj.weeklyGoalMinutes)
      ? obj.weeklyGoalMinutes
      : INITIAL_PROFILE.weeklyGoalMinutes;

  return {
    name:
      typeof obj.name === 'string' && obj.name.trim().length > 0
        ? obj.name.trim().slice(0, 60)
        : INITIAL_PROFILE.name,
    age: Math.min(16, Math.max(8, Math.round(ageNum))),
    grade:
      typeof obj.grade === 'string' && obj.grade.trim().length > 0
        ? obj.grade.trim().slice(0, 40)
        : INITIAL_PROFILE.grade,
    bio:
      typeof obj.bio === 'string'
        ? obj.bio.trim().slice(0, 300)
        : INITIAL_PROFILE.bio,
    favoriteTrack:
      typeof obj.favoriteTrack === 'string' && VALID_TRACKS.has(obj.favoriteTrack as TrackSlug)
        ? (obj.favoriteTrack as TrackSlug)
        : INITIAL_PROFILE.favoriteTrack,
    avatarUrl:
      typeof obj.avatarUrl === 'string' && obj.avatarUrl.trim().length > 0
        ? obj.avatarUrl
        : INITIAL_PROFILE.avatarUrl,
    weeklyGoalMinutes: Math.min(600, Math.max(30, Math.round(goalNum))),
  };
}

function sanitizeIndexMap(raw: unknown): Record<string, number[]> {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const result: Record<string, number[]> = {};
  for (const [key, val] of Object.entries(raw as Record<string, unknown>)) {
    if (!Array.isArray(val)) continue;
    const uniqueNums = Array.from(
      new Set(
        val
          .filter((n): n is number => typeof n === 'number' && Number.isInteger(n) && n >= 0)
      )
    ).sort((a, b) => a - b);
    if (uniqueNums.length > 0) {
      result[key] = uniqueNums;
    }
  }
  return result;
}

function sanitizeStringMap(raw: unknown): Record<string, string> {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const result: Record<string, string> = {};
  for (const [key, val] of Object.entries(raw as Record<string, unknown>)) {
    if (VALID_CHALLENGE_IDS.has(key) && typeof val === 'string') {
      result[key] = val;
    }
  }
  return result;
}

function sanitizeWeeklyActivity(raw: unknown): WeeklyActivityDay[] {
  const defaultsByDay = new Map(WEEKLY_ACTIVITY_MINUTES.map((d) => [d.day, d.minutes]));
  if (!Array.isArray(raw)) {
    return WEEKLY_ACTIVITY_MINUTES.map((d) => ({ ...d }));
  }

  const incomingByDay = new Map<string, number>();
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const entry = item as Partial<WeeklyActivityDay>;
    if (typeof entry.day === 'string' && typeof entry.minutes === 'number' && Number.isFinite(entry.minutes)) {
      incomingByDay.set(entry.day, Math.max(0, Math.round(entry.minutes)));
    }
  }

  return WEEKDAY_ORDER.map((day) => ({
    day,
    minutes: incomingByDay.get(day) ?? defaultsByDay.get(day) ?? 0,
  }));
}

function sanitizeActivities(raw: unknown): ActivityEvent[] {
  if (!Array.isArray(raw)) return INITIAL_ACTIVITIES.map((a) => ({ ...a }));
  const seenIds = new Set<string>();
  const validTypes = new Set<ActivityEvent['type']>([
    'lesson',
    'quiz',
    'challenge',
    'project',
    'gallery',
  ]);
  const cleaned: ActivityEvent[] = [];

  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const entry = item as Partial<ActivityEvent>;
    const id = typeof entry.id === 'string' && entry.id.trim() ? entry.id.trim() : '';
    const title = typeof entry.title === 'string' && entry.title.trim() ? entry.title.trim() : '';
    if (!id || !title || seenIds.has(id)) continue;
    seenIds.add(id);
    cleaned.push({
      id,
      type: entry.type && validTypes.has(entry.type) ? entry.type : 'lesson',
      title,
      subject: typeof entry.subject === 'string' && entry.subject.trim() ? entry.subject.trim() : 'STEM',
      pointsDelta:
        typeof entry.pointsDelta === 'number' && Number.isFinite(entry.pointsDelta)
          ? Math.max(0, Math.round(entry.pointsDelta))
          : 0,
      timestamp:
        typeof entry.timestamp === 'string' && entry.timestamp.trim()
          ? entry.timestamp.trim()
          : 'Today',
    });
  }

  return cleaned.slice(0, 25);
}

export function sanitizeQuizScores(raw: unknown): QuizScoreRecord[] {
  if (!Array.isArray(raw)) return [];
  const byCourse = new Map<string, QuizScoreRecord>();

  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const entry = item as Partial<QuizScoreRecord>;
    if (typeof entry.courseId !== 'string' || !VALID_COURSE_IDS.has(entry.courseId)) continue;

    const course = COURSES.find((c) => c.id === entry.courseId);
    const total =
      typeof entry.total === 'number' && Number.isFinite(entry.total) && entry.total > 0
        ? Math.round(entry.total)
        : course?.quiz.length ?? 10;
    const score =
      typeof entry.score === 'number' && Number.isFinite(entry.score)
        ? Math.min(total, Math.max(0, Math.round(entry.score)))
        : 0;
    const fallbackPoints = score * 25 + (score >= Math.ceil(total * 0.8) ? 50 : 0);
    const pointsEarned =
      typeof entry.pointsEarned === 'number' && Number.isFinite(entry.pointsEarned)
        ? Math.max(0, Math.round(entry.pointsEarned))
        : fallbackPoints;

    const normalized: QuizScoreRecord = {
      courseId: entry.courseId,
      courseTitle:
        typeof entry.courseTitle === 'string' && entry.courseTitle.trim()
          ? entry.courseTitle.trim()
          : course?.title ?? entry.courseId,
      score,
      total,
      pointsEarned,
      completedAt:
        typeof entry.completedAt === 'string' && entry.completedAt.trim()
          ? entry.completedAt.trim()
          : formatDateBadgeLabel(),
    };

    const existing = byCourse.get(normalized.courseId);
    if (!existing) {
      byCourse.set(normalized.courseId, normalized);
    } else {
      const existingPct = existing.score / existing.total;
      const nextPct = normalized.score / normalized.total;
      if (nextPct >= existingPct) {
        byCourse.set(normalized.courseId, {
          ...normalized,
          pointsEarned: Math.max(existing.pointsEarned, normalized.pointsEarned),
        });
      }
    }
  }

  return Array.from(byCourse.values());
}

export function upsertQuizScoreRecord(
  current: QuizScoreRecord[],
  incoming: QuizScoreRecord
): QuizScoreRecord[] {
  const existing = current.find((q) => q.courseId === incoming.courseId);
  const others = current.filter((q) => q.courseId !== incoming.courseId);

  if (!existing) {
    return [incoming, ...others];
  }

  const keepBestScore =
    incoming.score / incoming.total >= existing.score / existing.total
      ? incoming.score
      : existing.score;
  const keepBestTotal =
    incoming.score / incoming.total >= existing.score / existing.total
      ? incoming.total
      : existing.total;

  const updated: QuizScoreRecord = {
    courseId: incoming.courseId,
    courseTitle: incoming.courseTitle,
    score: keepBestScore,
    total: keepBestTotal,
    pointsEarned: Math.max(existing.pointsEarned, incoming.pointsEarned),
    completedAt: incoming.completedAt,
  };

  return [updated, ...others];
}

function sanitizeChallengeResults(
  rawResults: unknown,
  rawSolvedIds: unknown
): { solvedChallengeIds: string[]; challengeResults: ChallengeResultRecord[] } {
  const byId = new Map<string, ChallengeResultRecord>();

  if (Array.isArray(rawResults)) {
    for (const item of rawResults) {
      if (!item || typeof item !== 'object') continue;
      const entry = item as Partial<ChallengeResultRecord>;
      const cid = entry.challengeId === 'chal-1' ? 'py-print-name' : entry.challengeId;
      if (typeof cid !== 'string' || !VALID_CHALLENGE_IDS.has(cid)) continue;
      const def = CODING_CHALLENGES.find((c) => c.id === cid);
      if (!def || byId.has(cid)) continue;
      byId.set(cid, {
        challengeId: cid,
        title: def.title,
        category: def.trackLabel,
        difficulty: def.difficulty,
        xpEarned:
          typeof entry.xpEarned === 'number' && Number.isFinite(entry.xpEarned)
            ? Math.max(0, Math.round(entry.xpEarned))
            : def.xpReward,
        completedAt:
          typeof entry.completedAt === 'string' && entry.completedAt.trim()
            ? entry.completedAt.trim()
            : formatDateBadgeLabel(),
      });
    }
  }

  const extraIds = dedupeStrings(rawSolvedIds, VALID_CHALLENGE_IDS, (id) =>
    id === 'chal-1' ? 'py-print-name' : id
  );
  for (const cid of extraIds) {
    if (byId.has(cid)) continue;
    const def = CODING_CHALLENGES.find((c) => c.id === cid);
    if (!def) continue;
    byId.set(cid, {
      challengeId: cid,
      title: def.title,
      category: def.trackLabel,
      difficulty: def.difficulty,
      xpEarned: def.xpReward,
      completedAt: formatDateBadgeLabel(),
    });
  }

  const challengeResults = Array.from(byId.values());
  return {
    solvedChallengeIds: challengeResults.map((r) => r.challengeId),
    challengeResults,
  };
}

export function sanitizeGallerySubmissions(raw: unknown): GallerySubmission[] {
  if (!Array.isArray(raw)) {
    return INITIAL_GALLERY_SUBMISSIONS.map((s) => ({ ...s }));
  }

  const seedById = new Map(INITIAL_GALLERY_SUBMISSIONS.map((item) => [item.id, item]));
  const seenIds = new Set<string>();
  const cleaned: GallerySubmission[] = [];

  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const entry = item as Partial<GallerySubmission>;
    const id = typeof entry.id === 'string' && entry.id.trim() ? entry.id.trim() : '';
    if (!id || seenIds.has(id)) continue;
    seenIds.add(id);

    const seed = seedById.get(id);
    const track =
      typeof entry.track === 'string' && VALID_TRACKS.has(entry.track as TrackSlug)
        ? (entry.track as TrackSlug)
        : seed?.track ?? 'robotics';

    cleaned.push({
      id,
      title:
        typeof entry.title === 'string' && entry.title.trim()
          ? entry.title.trim()
          : seed?.title ?? 'Untitled Build',
      studentName:
        typeof entry.studentName === 'string' && entry.studentName.trim()
          ? entry.studentName.trim()
          : seed?.studentName ?? 'Student',
      studentAge:
        typeof entry.studentAge === 'number' && Number.isFinite(entry.studentAge)
          ? Math.min(18, Math.max(6, Math.round(entry.studentAge)))
          : seed?.studentAge ?? 13,
      track,
      trackLabel:
        typeof entry.trackLabel === 'string' && entry.trackLabel.trim()
          ? entry.trackLabel.trim()
          : seed?.trackLabel ?? 'Robotics',
      description:
        typeof entry.description === 'string'
          ? entry.description
          : seed?.description ?? '',
      learningObjectives: Array.isArray(entry.learningObjectives)
        ? entry.learningObjectives.map(String).filter(Boolean)
        : seed?.learningObjectives ?? [],
      componentsUsed: Array.isArray(entry.componentsUsed)
        ? entry.componentsUsed.map(String).filter(Boolean)
        : seed?.componentsUsed ?? [],
      imageUrl:
        typeof entry.imageUrl === 'string'
          ? entry.imageUrl
          : seed?.imageUrl ?? '',
      likes:
        typeof entry.likes === 'number' && Number.isFinite(entry.likes)
          ? Math.max(0, Math.round(entry.likes))
          : seed?.likes ?? 1,
      submittedAt:
        typeof entry.submittedAt === 'string' && entry.submittedAt.trim()
          ? entry.submittedAt.trim()
          : seed?.submittedAt ?? 'Just now',
      codeHighlight: entry.codeHighlight ?? seed?.codeHighlight,
      isOwner: entry.isOwner ?? seed?.isOwner,
    });
  }

  return cleaned.length > 0 ? cleaned : INITIAL_GALLERY_SUBMISSIONS.map((s) => ({ ...s }));
}

export function mergeGallerySubmissions(
  localItems: GallerySubmission[],
  remoteItems: GallerySubmission[]
): GallerySubmission[] {
  const existingIds = new Set(localItems.map((item) => item.id));
  const unseenRemote = remoteItems.filter((item) => item?.id && !existingIds.has(item.id));
  if (unseenRemote.length === 0) return localItems;
  return sanitizeGallerySubmissions([...unseenRemote, ...localItems]);
}

export function calculateTotalXp(data: PersistedStudentData): number {
  const lessonXp = data.progress.completedLessons.length * 50;
  const challengeXp = data.assessments.challengeResults.reduce(
    (acc, item) => acc + item.xpEarned,
    0
  );
  const quizXp = data.assessments.quizScores.reduce(
    (acc, q) => acc + (q.pointsEarned ?? q.score * 25),
    0
  );
  const arduinoXp = data.progress.completedArduinoIds.length * 75;
  const libraryProjectXp = data.progress.completedProjectIds.length * 100;
  const ownedGalleryXp =
    data.submissions.gallerySubmissions.filter(
      (s) =>
        Boolean(s.isOwner) ||
        s.studentName.trim().toLowerCase() === data.profile.name.trim().toLowerCase()
    ).length * 50;

  return (
    lessonXp +
    challengeXp +
    quizXp +
    arduinoXp +
    libraryProjectXp +
    ownedGalleryXp
  );
}

export function computeCoreBadgeStatuses(params: {
  profileName: string;
  completedLessons: string[];
  quizScores: QuizScoreRecord[];
  solvedChallengeIds: string[];
  completedProjectIds: string[];
  completedArduinoIds: string[];
  gallerySubmissions: GallerySubmission[];
  totalXp: number;
  persistedBadges?: EarnedBadgeRecord[];
}): CoreBadgeStatus[] {
  const {
    profileName,
    completedLessons,
    quizScores,
    solvedChallengeIds,
    completedProjectIds,
    completedArduinoIds,
    gallerySubmissions,
    totalXp,
    persistedBadges = [],
  } = params;

  const earnedById = new Map(persistedBadges.map((b) => [b.id, b]));
  const ownedGalleryCount = gallerySubmissions.filter(
    (s) =>
      Boolean(s.isOwner) ||
      s.studentName.trim().toLowerCase() === profileName.trim().toLowerCase()
  ).length;

  const hasTrackLesson = (prefix: string) =>
    completedLessons.some((id) => id.startsWith(prefix));
  const hasTrackQuiz = (courseId: string) =>
    quizScores.some((q) => q.courseId === courseId);
  const hasTrackChallenge = (track: string) =>
    solvedChallengeIds.some((id) => {
      const ch = CODING_CHALLENGES.find((c) => c.id === id);
      return ch?.track === track;
    });

  const roboticsDone =
    hasTrackLesson('rob-') ||
    hasTrackQuiz('course-robotics-101') ||
    hasTrackChallenge('robotics') ||
    completedProjectIds.some((id) =>
      PROJECTS.some((p) => p.id === id && p.track === 'robotics')
    );

  const pythonDone =
    hasTrackLesson('py-') ||
    hasTrackQuiz('course-python-101') ||
    hasTrackChallenge('python');

  const arduinoDone =
    hasTrackLesson('ard-') ||
    hasTrackQuiz('course-arduino-101') ||
    completedArduinoIds.length > 0;

  const scratchDone =
    hasTrackLesson('scr-') ||
    hasTrackQuiz('course-scratch-101') ||
    hasTrackChallenge('scratch') ||
    gallerySubmissions.some(
      (g) =>
        (Boolean(g.isOwner) || g.studentName.trim().toLowerCase() === profileName.trim().toLowerCase()) &&
        g.track === 'scratch'
    );

  const aiDone =
    hasTrackLesson('ai-') ||
    hasTrackQuiz('course-ai-101') ||
    gallerySubmissions.some(
      (g) =>
        (Boolean(g.isOwner) || g.studentName.trim().toLowerCase() === profileName.trim().toLowerCase()) &&
        g.track === 'ai-ml'
    );

  const activeSubjectCount = [
    roboticsDone,
    pythonDone,
    arduinoDone,
    scratchDone,
    aiDone,
  ].filter(Boolean).length;

  const stemInnovatorEarned =
    totalXp >= 500 && (activeSubjectCount >= 3 || ownedGalleryCount >= 1);

  return [
    {
      id: 'badge-robotics-explorer',
      name: 'Robotics Explorer',
      description: 'Complete a Robotics lesson, challenge, or rover project.',
      earned: roboticsDone,
      earnedAt: earnedById.get('badge-robotics-explorer')?.earnedAt,
      progressText: roboticsDone ? 'Unlocked' : 'Try a Robotics lesson or rover build',
    },
    {
      id: 'badge-python-beginner',
      name: 'Python Beginner',
      description: 'Complete a Python lesson, quiz, or Python challenge.',
      earned: pythonDone,
      earnedAt: earnedById.get('badge-python-beginner')?.earnedAt,
      progressText: pythonDone ? 'Unlocked' : 'Solve Print Your Name or a Python lesson',
    },
    {
      id: 'badge-arduino-builder',
      name: 'Arduino Builder',
      description: 'Complete an Arduino project, lesson, or circuit quiz.',
      earned: arduinoDone,
      earnedAt: earnedById.get('badge-arduino-builder')?.earnedAt,
      progressText: arduinoDone ? 'Unlocked' : 'Build LED Blinking or complete a lesson',
    },
    {
      id: 'badge-scratch-creator',
      name: 'Scratch Creator',
      description: 'Complete a Scratch lesson, quiz, challenge, or game.',
      earned: scratchDone,
      earnedAt: earnedById.get('badge-scratch-creator')?.earnedAt,
      progressText: scratchDone ? 'Unlocked' : 'Finish a Scratch quiz or challenge',
    },
    {
      id: 'badge-ai-explorer',
      name: 'AI Explorer',
      description: 'Complete an AI & Machine Learning lesson or quiz.',
      earned: aiDone,
      earnedAt: earnedById.get('badge-ai-explorer')?.earnedAt,
      progressText: aiDone ? 'Unlocked' : 'Complete an AI & ML lesson or quiz',
    },
    {
      id: 'badge-stem-innovator',
      name: 'STEM Innovator',
      description: 'Earn 500+ points across 3+ subjects or publish a gallery build.',
      earned: stemInnovatorEarned,
      earnedAt: earnedById.get('badge-stem-innovator')?.earnedAt,
      progressText: stemInnovatorEarned
        ? 'Unlocked'
        : `${Math.min(500, totalXp)}/500 XP · ${activeSubjectCount}/3 subjects`,
    },
  ];
}

export function syncEarnedBadges(data: PersistedStudentData): PersistedStudentData {
  const existingById = new Map(data.badges.earnedBadges.map((b) => [b.id, b]));
  const totalXp = calculateTotalXp(data);
  const today = formatDateBadgeLabel();

  const coreStatuses = computeCoreBadgeStatuses({
    profileName: data.profile.name,
    completedLessons: data.progress.completedLessons,
    quizScores: data.assessments.quizScores,
    solvedChallengeIds: data.assessments.solvedChallengeIds,
    completedProjectIds: data.progress.completedProjectIds,
    completedArduinoIds: data.progress.completedArduinoIds,
    gallerySubmissions: data.submissions.gallerySubmissions,
    totalXp,
    persistedBadges: data.badges.earnedBadges,
  });

  const nextBadgesById = new Map<string, EarnedBadgeRecord>();

  for (const status of coreStatuses) {
    if (!status.earned) continue;
    const prev = existingById.get(status.id);
    nextBadgesById.set(status.id, {
      id: status.id,
      name: status.name,
      category: 'core',
      description: status.description,
      earnedAt: prev?.earnedAt ?? today,
    });
  }

  for (const cid of data.assessments.solvedChallengeIds) {
    const ch = CODING_CHALLENGES.find((c) => c.id === cid);
    if (!ch) continue;
    const badgeId = `badge-challenge-${ch.id}`;
    const prev = existingById.get(badgeId);
    nextBadgesById.set(badgeId, {
      id: badgeId,
      name: ch.badgeTitle,
      category: 'challenge',
      description: `Solved ${ch.trackLabel} challenge: ${ch.title}`,
      earnedAt: prev?.earnedAt ?? today,
    });
  }

  return {
    ...data,
    badges: {
      earnedBadges: Array.from(nextBadgesById.values()),
    },
  };
}

export function createDefaultStudentData(): PersistedStudentData {
  const defaultQuizScores: QuizScoreRecord[] = [
    {
      courseId: 'course-scratch-101',
      courseTitle: 'Scratch Visual Logic & Game Physics',
      score: 9,
      total: 10,
      pointsEarned: 275,
      completedAt: 'Nov 19, 2026',
    },
  ];

  const { solvedChallengeIds, challengeResults } = sanitizeChallengeResults(
    [
      {
        challengeId: 'py-print-name',
        completedAt: 'Nov 18, 2026',
      },
    ],
    ['py-print-name']
  );

  const base: PersistedStudentData = {
    version: STUDENT_SCHEMA_VERSION,
    updatedAt: new Date().toISOString(),
    profile: { ...INITIAL_PROFILE },
    progress: {
      completedLessons: ['rob-1', 'rob-2', 'scr-1', 'py-1'],
      completedProjectIds: [],
      completedArduinoIds: ['ard-led-blinking'],
      checkedMaterialsByProject: {},
      checkedStepsByProject: {},
      weeklyActivity: WEEKLY_ACTIVITY_MINUTES.map((d) => ({ ...d })),
      recentActivities: INITIAL_ACTIVITIES.map((a) => ({ ...a })),
    },
    bookmarks: {
      projectIds: ['proj-obstacle-avoiding-robot', 'proj-smart-dustbin'],
      arduinoIds: ['ard-ultrasonic-distance'],
    },
    assessments: {
      quizScores: defaultQuizScores,
      solvedChallengeIds,
      challengeResults,
      challengeCodeDrafts: {},
    },
    badges: {
      earnedBadges: [],
    },
    submissions: {
      gallerySubmissions: INITIAL_GALLERY_SUBMISSIONS.map((s) => ({ ...s })),
      likedSubmissionIds: ['gal-1'],
    },
  };

  return syncEarnedBadges(base);
}

/**
 * Hydrates either structured v2 data or legacy flat v2 localStorage payloads,
 * deduplicating records and gracefully recovering from missing/invalid fields.
 */
export function hydrateStudentData(rawInput: unknown): PersistedStudentData {
  const fallback = createDefaultStudentData();
  if (!rawInput || typeof rawInput !== 'object' || Array.isArray(rawInput)) {
    return fallback;
  }

  const raw = rawInput as Record<string, unknown>;
  const isStructured =
    raw.progress &&
    typeof raw.progress === 'object' &&
    raw.bookmarks &&
    typeof raw.bookmarks === 'object' &&
    raw.assessments &&
    typeof raw.assessments === 'object';

  const progressObj = isStructured ? (raw.progress as Record<string, unknown>) : raw;
  const bookmarksObj = isStructured ? (raw.bookmarks as Record<string, unknown>) : raw;
  const assessmentsObj = isStructured ? (raw.assessments as Record<string, unknown>) : raw;
  const badgesObj =
    raw.badges && typeof raw.badges === 'object'
      ? (raw.badges as Record<string, unknown>)
      : raw;
  const submissionsObj =
    raw.submissions && typeof raw.submissions === 'object'
      ? (raw.submissions as Record<string, unknown>)
      : raw;

  const hasLessonArray = Array.isArray(progressObj.completedLessons);
  const completedLessons = hasLessonArray
    ? dedupeStrings(progressObj.completedLessons, VALID_LESSON_IDS)
    : fallback.progress.completedLessons;

  const completedProjectIds = Array.isArray(progressObj.completedProjectIds)
    ? dedupeStrings(progressObj.completedProjectIds, VALID_PROJECT_IDS)
    : fallback.progress.completedProjectIds;

  const completedArduinoIds = Array.isArray(progressObj.completedArduinoIds)
    ? dedupeStrings(progressObj.completedArduinoIds, VALID_ARDUINO_IDS)
    : fallback.progress.completedArduinoIds;

  const rawProjectBookmarks = isStructured
    ? bookmarksObj.projectIds
    : raw.bookmarkedProjectIds;
  const rawArduinoBookmarks = isStructured
    ? bookmarksObj.arduinoIds
    : raw.bookmarkedArduinoIds;

  const projectIds = Array.isArray(rawProjectBookmarks)
    ? dedupeStrings(rawProjectBookmarks, VALID_PROJECT_IDS)
    : fallback.bookmarks.projectIds;

  const arduinoIds = Array.isArray(rawArduinoBookmarks)
    ? dedupeStrings(rawArduinoBookmarks, VALID_ARDUINO_IDS)
    : fallback.bookmarks.arduinoIds;

  const rawQuizArr = isStructured ? assessmentsObj.quizScores : raw.quizHistory;
  const quizScores = Array.isArray(rawQuizArr)
    ? sanitizeQuizScores(rawQuizArr)
    : fallback.assessments.quizScores;

  const hasChallenges =
    Array.isArray(assessmentsObj.challengeResults) ||
    Array.isArray(assessmentsObj.solvedChallengeIds);
  const { solvedChallengeIds, challengeResults } = hasChallenges
    ? sanitizeChallengeResults(assessmentsObj.challengeResults, assessmentsObj.solvedChallengeIds)
    : {
        solvedChallengeIds: fallback.assessments.solvedChallengeIds,
        challengeResults: fallback.assessments.challengeResults,
      };

  const persistedBadgeSeeds: EarnedBadgeRecord[] = Array.isArray(badgesObj.earnedBadges)
    ? badgesObj.earnedBadges
        .filter((b): b is Partial<EarnedBadgeRecord> => Boolean(b && typeof b === 'object'))
        .filter((b) => typeof b.id === 'string' && typeof b.name === 'string')
        .map((b) => ({
          id: b.id!,
          name: b.name!,
          category: b.category === 'challenge' ? 'challenge' : 'core',
          description: typeof b.description === 'string' ? b.description : '',
          earnedAt:
            typeof b.earnedAt === 'string' && b.earnedAt.trim()
              ? b.earnedAt.trim()
              : formatDateBadgeLabel(),
        }))
    : [];

  const hydrated: PersistedStudentData = {
    version: STUDENT_SCHEMA_VERSION,
    updatedAt:
      typeof raw.updatedAt === 'string' && raw.updatedAt.trim()
        ? raw.updatedAt
        : new Date().toISOString(),
    profile: sanitizeProfile(raw.profile),
    progress: {
      completedLessons,
      completedProjectIds,
      completedArduinoIds,
      checkedMaterialsByProject: sanitizeIndexMap(progressObj.checkedMaterialsByProject),
      checkedStepsByProject: sanitizeIndexMap(progressObj.checkedStepsByProject),
      weeklyActivity: sanitizeWeeklyActivity(progressObj.weeklyActivity),
      recentActivities: Array.isArray(progressObj.recentActivities)
        ? sanitizeActivities(progressObj.recentActivities)
        : fallback.progress.recentActivities,
    },
    bookmarks: {
      projectIds,
      arduinoIds,
    },
    assessments: {
      quizScores,
      solvedChallengeIds,
      challengeResults,
      challengeCodeDrafts: sanitizeStringMap(assessmentsObj.challengeCodeDrafts),
    },
    badges: {
      earnedBadges: persistedBadgeSeeds,
    },
    submissions: {
      gallerySubmissions: Array.isArray(submissionsObj.gallerySubmissions)
        ? sanitizeGallerySubmissions(submissionsObj.gallerySubmissions)
        : fallback.submissions.gallerySubmissions,
      likedSubmissionIds: Array.isArray(submissionsObj.likedSubmissionIds)
        ? dedupeStrings(submissionsObj.likedSubmissionIds)
        : fallback.submissions.likedSubmissionIds,
    },
  };

  return syncEarnedBadges(hydrated);
}

function getBrowserStorage(): StorageLike | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
  } catch {
    return null;
  }
  return null;
}

export function createLocalStorageRepository(
  customStorage?: StorageLike | null
): StudentStorageRepository {
  const resolveStorage = () =>
    customStorage !== undefined ? customStorage : getBrowserStorage();

  return {
    load(): PersistedStudentData {
      const storage = resolveStorage();
      if (!storage) return createDefaultStudentData();
      try {
        const raw = storage.getItem(STUDENT_STORAGE_KEY);
        if (!raw) {
          const initial = createDefaultStudentData();
          storage.setItem(STUDENT_STORAGE_KEY, JSON.stringify(initial));
          return initial;
        }
        const parsed: unknown = JSON.parse(raw);
        return hydrateStudentData(parsed);
      } catch {
        const recovered = createDefaultStudentData();
        try {
          storage.setItem(STUDENT_STORAGE_KEY, JSON.stringify(recovered));
        } catch {
          // Ignore write failures in restricted environments
        }
        return recovered;
      }
    },

    save(data: PersistedStudentData): PersistedStudentData {
      const deduplicated: PersistedStudentData = {
        ...data,
        version: STUDENT_SCHEMA_VERSION,
        updatedAt: new Date().toISOString(),
        progress: {
          ...data.progress,
          completedLessons: dedupeStrings(data.progress.completedLessons, VALID_LESSON_IDS),
          completedProjectIds: dedupeStrings(data.progress.completedProjectIds, VALID_PROJECT_IDS),
          completedArduinoIds: dedupeStrings(data.progress.completedArduinoIds, VALID_ARDUINO_IDS),
        },
        bookmarks: {
          projectIds: dedupeStrings(data.bookmarks.projectIds, VALID_PROJECT_IDS),
          arduinoIds: dedupeStrings(data.bookmarks.arduinoIds, VALID_ARDUINO_IDS),
        },
        submissions: {
          ...data.submissions,
          likedSubmissionIds: dedupeStrings(data.submissions.likedSubmissionIds),
        },
      };
      const normalized = syncEarnedBadges(deduplicated);
      const storage = resolveStorage();
      if (storage) {
        try {
          storage.setItem(STUDENT_STORAGE_KEY, JSON.stringify(normalized));
        } catch {
          // Gracefully ignore storage quota errors
        }
      }
      return normalized;
    },

    reset(): PersistedStudentData {
      const fresh = createDefaultStudentData();
      const storage = resolveStorage();
      if (storage) {
        try {
          storage.removeItem(STUDENT_STORAGE_KEY);
          storage.removeItem(MENTOR_STORAGE_KEY);
          storage.removeItem('robolearn_mentor_session_v1');
          storage.setItem(STUDENT_STORAGE_KEY, JSON.stringify(fresh));
        } catch {
          // Ignore storage errors gracefully
        }
      }
      return fresh;
    },
  };
}

export const studentStorage = createLocalStorageRepository();
