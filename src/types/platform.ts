export type PageId =
  | 'home'
  | 'dashboard'
  | 'robotics'
  | 'scratch'
  | 'python'
  | 'arduino'
  | 'ai-ml'
  | 'projects'
  | 'challenges'
  | 'mentor'
  | 'gallery'
  | 'profile';

export type TrackSlug = 'robotics' | 'scratch' | 'python' | 'arduino' | 'ai-ml';

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LessonItem {
  id: string;
  title: string;
  durationMinutes: number;
  summary: string;
  keyConcept: string;
  codePreview?: string;
  codeLanguage?: string;
}

export interface CourseItem {
  id: string;
  track: TrackSlug;
  pageId: PageId;
  title: string;
  subtitle: string;
  ageRange: string;
  difficulty: Difficulty;
  estimatedHours: number;
  imageUrl: string;
  imageAlt: string;
  accentLabel: string;
  lessons: LessonItem[];
  quiz: QuizQuestion[];
}

export type ProjectCategory =
  | 'Autonomous Rovers'
  | 'Smart Automation'
  | 'Robotic Actuators'
  | 'Wireless & Voice'
  | 'Coding & AI';

export interface CircuitConnection {
  component: string;
  signalPin: string;
  controllerPin: string;
  notes: string;
}

export interface TroubleshootingTip {
  issue: string;
  solution: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  track: TrackSlug;
  trackLabel: string;
  category: ProjectCategory;
  difficulty: Difficulty;
  ageRange: string;
  duration: string;
  summary: string;
  imageUrl: string;
  imageAlt: string;
  learningObjectives: string[];
  materials: string[];
  circuitConnections: CircuitConnection[];
  steps: string[];
  starterCode: string;
  codeLanguage: string;
  troubleshootingTips: TroubleshootingTip[];
}

export type ArduinoCategory =
  | 'LED & Timing'
  | 'Sensors & Measurement'
  | 'Automation & IoT'
  | 'Robotics & Control';

export interface ArduinoProjectItem {
  id: string;
  title: string;
  category: ArduinoCategory;
  difficulty: Difficulty;
  estimatedTime: string;
  summary: string;
  imageUrl: string;
  imageAlt: string;
  components: string[];
  circuitConnections: CircuitConnection[];
  arduinoCode: string;
  codeExplanation: string[];
  steps: string[];
  troubleshootingTips: TroubleshootingTip[];
  safetyInstructions: string[];
}

export type ChallengeCategory = 'Python' | 'Scratch' | 'Robotics';

export interface CodingChallenge {
  id: string;
  title: string;
  track: TrackSlug;
  trackLabel: ChallengeCategory;
  difficulty: Difficulty;
  estimatedMinutes: number;
  xpReward: number;
  badgeTitle: string;
  prompt: string;
  learningObjectives: string[];
  instructions: string[];
  starterCode: string;
  codeLanguage: string;
  expectedKeywords: string[];
  hints: string[];
  sampleSolution: string;
}

export interface GallerySubmission {
  id: string;
  title: string;
  studentName: string;
  studentAge: number;
  track: TrackSlug;
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

export interface QuizScoreRecord {
  courseId: string;
  courseTitle: string;
  score: number;
  total: number;
  pointsEarned: number;
  completedAt: string;
}

export interface StudentProfile {
  name: string;
  age: number;
  grade: string;
  bio: string;
  favoriteTrack: TrackSlug;
  avatarUrl: string;
  weeklyGoalMinutes: number;
}

export interface MentorMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface WeeklyActivityDay {
  day: string;
  minutes: number;
}

export interface ActivityEvent {
  id: string;
  type: 'lesson' | 'quiz' | 'challenge' | 'project' | 'gallery';
  title: string;
  subject: string;
  pointsDelta: number;
  timestamp: string;
}

export interface EarnedBadgeRecord {
  id: string;
  name: string;
  category: 'core' | 'challenge';
  description: string;
  earnedAt: string;
}

export interface CoreBadgeStatus {
  id: string;
  name: string;
  description: string;
  earned: boolean;
  earnedAt?: string;
  progressText: string;
}

export interface ChallengeResultRecord {
  challengeId: string;
  title: string;
  category: ChallengeCategory;
  difficulty: Difficulty;
  xpEarned: number;
  completedAt: string;
}

export interface PersistedStudentData {
  version: number;
  updatedAt: string;
  profile: StudentProfile;
  progress: {
    completedLessons: string[];
    completedProjectIds: string[];
    completedArduinoIds: string[];
    checkedMaterialsByProject: Record<string, number[]>;
    checkedStepsByProject: Record<string, number[]>;
    weeklyActivity: WeeklyActivityDay[];
    recentActivities: ActivityEvent[];
  };
  bookmarks: {
    projectIds: string[];
    arduinoIds: string[];
  };
  assessments: {
    quizScores: QuizScoreRecord[];
    solvedChallengeIds: string[];
    challengeResults: ChallengeResultRecord[];
    challengeCodeDrafts: Record<string, string>;
  };
  badges: {
    earnedBadges: EarnedBadgeRecord[];
  };
  submissions: {
    gallerySubmissions: GallerySubmission[];
    likedSubmissionIds: string[];
  };
}
