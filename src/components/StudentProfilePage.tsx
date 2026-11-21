import React, { useEffect, useState } from 'react';
import { Award, Bookmark, CheckCircle2, Database, RotateCcw, Save } from 'lucide-react';
import { ARDUINO_PROJECTS } from '../data/arduinoProjectsData';
import { PROJECTS } from '../data/roboLearnData';
import {
  EarnedBadgeRecord,
  GallerySubmission,
  StudentProfile,
  TrackSlug,
} from '../types/platform';
import { ResilientImage } from './ResilientImage';

interface StudentProfilePageProps {
  profile: StudentProfile;
  completedLessons: string[];
  completedProjectCount: number;
  quizCount: number;
  solvedChallengeIds: string[];
  bookmarkedProjectIds: string[];
  bookmarkedArduinoIds: string[];
  earnedBadges: EarnedBadgeRecord[];
  submissions: GallerySubmission[];
  totalXp: number;
  onSaveProfile: (updated: StudentProfile) => void;
  onResetDemoData: () => void;
  onOpenProject: (projectId: string) => void;
  onOpenArduinoProject: (projectId: string) => void;
}

export const StudentProfilePage: React.FC<StudentProfilePageProps> = ({
  profile,
  completedLessons,
  completedProjectCount,
  quizCount,
  solvedChallengeIds,
  bookmarkedProjectIds,
  bookmarkedArduinoIds,
  earnedBadges,
  submissions,
  totalXp,
  onSaveProfile,
  onResetDemoData,
  onOpenProject,
  onOpenArduinoProject,
}) => {
  const [formState, setFormState] = useState<StudentProfile>(profile);
  const [savedNotice, setSavedNotice] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetNotice, setResetNotice] = useState(false);

  useEffect(() => {
    setFormState(profile);
  }, [profile]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formState);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleConfirmReset = () => {
    onResetDemoData();
    setConfirmReset(false);
    setResetNotice(true);
    setTimeout(() => setResetNotice(false), 3000);
  };

  const mySubmissions = submissions.filter(
    (s) => Boolean(s.isOwner) || s.studentName.toLowerCase() === profile.name.toLowerCase()
  );
  const bookmarkedBuilds = [
    ...PROJECTS.filter((p) => bookmarkedProjectIds.includes(p.id)).map((p) => ({
      id: p.id,
      kind: 'library' as const,
      title: p.title,
      meta: `${p.trackLabel} · ${p.duration}`,
    })),
    ...ARDUINO_PROJECTS.filter((a) => bookmarkedArduinoIds.includes(a.id)).map((a) => ({
      id: a.id,
      kind: 'arduino' as const,
      title: a.title,
      meta: `Arduino · ${a.estimatedTime}`,
    })),
  ];

  const milestones = [
    {
      title: 'First Rover Lesson',
      earned: completedLessons.length >= 1,
      detail: 'Complete at least 1 STEM lesson',
    },
    {
      title: 'Challenge Solver Badge',
      earned: solvedChallengeIds.length >= 1,
      detail: 'Complete your first Coding Challenge',
    },
    {
      title: 'Triple Challenge Explorer',
      earned: solvedChallengeIds.length >= 3,
      detail: `Solved ${solvedChallengeIds.length}/3 challenges toward Explorer status`,
    },
    {
      title: 'Workshop Builder',
      earned: mySubmissions.length >= 1,
      detail: 'Share a project in the Student Gallery',
    },
    {
      title: '500 XP Explorer',
      earned: totalXp >= 500,
      detail: 'Earn 500+ total XP across tracks',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
          Student Profile
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Manage your learner profile, weekly practice target, and earned milestones.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Editable Profile Form */}
        <section className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
            <div className="w-16 h-16 rounded-full overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
              <ResilientImage
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900">{profile.name}</h2>
              <div className="text-xs text-slate-500 tabular-nums">
                {profile.grade} · Age {profile.age} · {totalXp} XP
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="prof-name" className="block text-xs font-semibold text-slate-700 mb-1">
                  Display Name
                </label>
                <input
                  id="prof-name"
                  type="text"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="prof-age" className="block text-xs font-semibold text-slate-700 mb-1">
                  Age (8–16)
                </label>
                <input
                  id="prof-age"
                  type="number"
                  min={8}
                  max={16}
                  value={formState.age}
                  onChange={(e) =>
                    setFormState({ ...formState, age: Math.min(16, Math.max(8, Number(e.target.value) || 8)) })
                  }
                  className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg tabular-nums focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="prof-grade" className="block text-xs font-semibold text-slate-700 mb-1">
                  Grade Level
                </label>
                <input
                  id="prof-grade"
                  type="text"
                  value={formState.grade}
                  onChange={(e) => setFormState({ ...formState, grade: e.target.value })}
                  className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="prof-track" className="block text-xs font-semibold text-slate-700 mb-1">
                  Favorite STEM Track
                </label>
                <select
                  id="prof-track"
                  value={formState.favoriteTrack}
                  onChange={(e) =>
                    setFormState({ ...formState, favoriteTrack: e.target.value as TrackSlug })
                  }
                  className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-blue-600 focus:outline-none"
                >
                  <option value="robotics">Robotics</option>
                  <option value="scratch">Scratch</option>
                  <option value="python">Python</option>
                  <option value="arduino">Arduino</option>
                  <option value="ai-ml">AI &amp; ML</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="prof-goal" className="block text-xs font-semibold text-slate-700 mb-1">
                Weekly Practice Goal (minutes)
              </label>
              <input
                id="prof-goal"
                type="number"
                min={30}
                max={600}
                step={15}
                value={formState.weeklyGoalMinutes}
                onChange={(e) =>
                  setFormState({ ...formState, weeklyGoalMinutes: Number(e.target.value) || 120 })
                }
                className="w-full sm:w-48 h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg tabular-nums focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="prof-bio" className="block text-xs font-semibold text-slate-700 mb-1">
                Maker Bio
              </label>
              <textarea
                id="prof-bio"
                rows={3}
                value={formState.bio}
                onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              {savedNotice ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Profile saved</span>
                </span>
              ) : (
                <span />
              )}

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </section>

        {/* Right Column: Milestones & Saved Builds */}
        <div className="lg:col-span-5 space-y-6">
          <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              <h2 className="font-display text-lg font-bold text-slate-900">
                Achievement Milestones
              </h2>
            </div>

            <div className="divide-y divide-slate-100">
              {milestones.map((m) => (
                <div key={m.title} className="py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{m.title}</div>
                    <div className="text-xs text-slate-500">{m.detail}</div>
                  </div>
                  <span
                    className={`text-xs font-semibold whitespace-nowrap ${
                      m.earned ? 'text-emerald-700' : 'text-slate-400'
                    }`}
                  >
                    {m.earned ? 'Unlocked' : 'Locked'}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-slate-700" />
              <h2 className="font-display text-lg font-bold text-slate-900">
                Bookmarked Builds ({bookmarkedBuilds.length})
              </h2>
            </div>

            {bookmarkedBuilds.length === 0 ? (
              <p className="text-xs text-slate-500">
                Save builds from the Project Library or Arduino Projects for quick access here.
              </p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {bookmarkedBuilds.map((p) => (
                  <li key={`${p.kind}-${p.id}`} className="py-2.5 first:pt-0 last:pb-0">
                    <button
                      type="button"
                      onClick={() =>
                        p.kind === 'arduino'
                          ? onOpenArduinoProject(p.id)
                          : onOpenProject(p.id)
                      }
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 text-left"
                    >
                      {p.title}
                    </button>
                    <div className="text-xs text-slate-500">{p.meta}</div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Settings & Persistent Storage Controls */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-slate-700" />
                <h2 className="font-display text-lg font-bold text-slate-900">
                  Data &amp; Demo Settings
                </h2>
              </div>
              <span className="text-xs font-medium text-slate-500">Saved locally</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Your learning progress, completed lessons, projects, quiz scores, challenge results,
              bookmarks, badges, and gallery submissions persist automatically across refreshes.
            </p>

            <div className="grid grid-cols-3 gap-2 text-center bg-slate-50 border border-slate-200 rounded-xl p-3 tabular-nums">
              <div>
                <div className="text-sm font-bold text-slate-900">
                  {completedLessons.length + completedProjectCount}
                </div>
                <div className="text-[11px] text-slate-500">Lessons &amp; Projects</div>
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">
                  {quizCount + solvedChallengeIds.length}
                </div>
                <div className="text-[11px] text-slate-500">Quizzes &amp; Tasks</div>
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">{earnedBadges.length}</div>
                <div className="text-[11px] text-slate-500">Badges Saved</div>
              </div>
            </div>

            {resetNotice && (
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                <CheckCircle2 className="w-4 h-4" />
                <span>Demo data restored to defaults</span>
              </div>
            )}

            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo Data</span>
              </button>
            ) : (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-2.5">
                <p className="text-xs text-red-900 font-medium">
                  Restore initial demo progress, quizzes, badges, and gallery projects?
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleConfirmReset}
                    className="flex-1 px-3 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                  >
                    Confirm Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};
