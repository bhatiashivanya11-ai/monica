import React from 'react';
import {
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Flame,
  FolderKanban,
  GraduationCap,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { COURSES, HERO_LAB_IMAGE, PROJECTS } from '../data/roboLearnData';
import { GallerySubmission, PageId, StudentProfile } from '../types/platform';
import { ResilientImage } from './ResilientImage';

interface HomePageProps {
  profile: StudentProfile;
  completedLessons: string[];
  bookmarkedProjectIds: string[];
  solvedChallengeIds: string[];
  gallerySubmissions: GallerySubmission[];
  totalXp: number;
  onNavigate: (page: PageId) => void;
  onOpenProject: (projectId: string) => void;
  onToggleBookmark: (projectId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  profile,
  completedLessons,
  bookmarkedProjectIds,
  solvedChallengeIds,
  gallerySubmissions,
  totalXp,
  onNavigate,
  onOpenProject,
  onToggleBookmark,
}) => {
  const totalLessonsCount = COURSES.reduce((acc, c) => acc + c.lessons.length, 0);

  return (
    <div className="space-y-10">
      {/* Hero Section (Split 2-Column with Balanced Stretch) */}
      <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <div className="text-xs font-semibold text-blue-700 tracking-wide">
                Ages 8–16 · Robotics, Code &amp; Hardware Lab
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.65rem] font-bold tracking-tight text-slate-900 leading-[1.12] text-balance max-w-2xl">
                Build real robots, code games, and train smart systems.
              </h1>
              <p className="text-base text-slate-600 leading-relaxed max-w-xl">
                Welcome back, {profile.name.split(' ')[0]}. Pick up your current rover module,
                solve today&apos;s coding challenge, or test your circuits with the AI Coding
                Mentor.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('dashboard')}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0"
              >
                <span>Open Student Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('robotics')}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0"
              >
                <span>Explore Robotics Track</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full bg-slate-100">
            <ResilientImage
              src={HERO_LAB_IMAGE}
              alt="Students working with wheeled robotics rover and block coding laptop"
              className="w-full h-full lg:absolute lg:inset-0 object-cover"
            />
          </div>
        </div>
      </section>

      {/* 4-Column Full-Width KPI Strip */}
      <section aria-label="Learning summary" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-start justify-between gap-3">
          <div>
            <div className="text-xs font-medium text-slate-500">Lessons Completed</div>
            <div className="mt-1 text-2xl font-bold text-slate-900 tabular-nums">
              {completedLessons.length}
              <span className="text-sm font-medium text-slate-400"> / {totalLessonsCount}</span>
            </div>
          </div>
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-start justify-between gap-3">
          <div>
            <div className="text-xs font-medium text-slate-500">Active Streak</div>
            <div className="mt-1 text-2xl font-bold text-slate-900 tabular-nums">6 Days</div>
          </div>
          <Flame className="w-5 h-5 text-amber-600 shrink-0" />
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-start justify-between gap-3">
          <div>
            <div className="text-xs font-medium text-slate-500">Total XP Earned</div>
            <div className="mt-1 text-2xl font-bold text-slate-900 tabular-nums">{totalXp} XP</div>
          </div>
          <Trophy className="w-5 h-5 text-blue-600 shrink-0" />
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-start justify-between gap-3">
          <div>
            <div className="text-xs font-medium text-slate-500">Challenges &amp; Saved</div>
            <div className="mt-1 text-2xl font-bold text-slate-900 tabular-nums">
              {solvedChallengeIds.length} · {bookmarkedProjectIds.length}
            </div>
          </div>
          <Bookmark className="w-5 h-5 text-slate-600 shrink-0" />
        </div>
      </section>

      {/* Learning Tracks Grid */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900">
              Core STEM Learning Tracks
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Step-by-step guided modules with interactive hardware sandboxes and quizzes.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('challenges')}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 whitespace-nowrap"
          >
            <span>Practice Coding Challenges</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {COURSES.map((course) => {
            const doneCount = course.lessons.filter((l) =>
              completedLessons.includes(l.id)
            ).length;
            const pct = Math.round((doneCount / course.lessons.length) * 100);

            return (
              <div
                key={course.id}
                onClick={() => onNavigate(course.pageId)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onNavigate(course.pageId);
                  }
                }}
                role="button"
                tabIndex={0}
                className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-blue-300 transition-colors cursor-pointer flex flex-col focus-visible:outline-2 focus-visible:outline-blue-600"
              >
                <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
                  <ResilientImage
                    src={course.imageUrl}
                    alt={course.imageAlt}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <div className="text-xs text-slate-500">
                      {course.accentLabel} · {course.ageRange} · {course.difficulty}
                    </div>
                    <h3 className="font-display text-lg font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-2">{course.subtitle}</p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs text-slate-600 tabular-nums">
                      <span>
                        {doneCount} of {course.lessons.length} lessons
                      </span>
                      <span className="font-semibold text-slate-900">{pct}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* AI Coding Mentor Spotlight Card */}
          <div
            onClick={() => onNavigate('mentor')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onNavigate('mentor');
              }
            }}
            role="button"
            tabIndex={0}
            className="bg-slate-900 text-white rounded-xl p-6 flex flex-col justify-between gap-6 cursor-pointer hover:bg-slate-800 transition-colors focus-visible:outline-2 focus-visible:outline-blue-400"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-medium text-blue-300">
                <Sparkles className="w-4 h-4" />
                <span>24/7 Guided Help</span>
              </div>
              <h3 className="font-display text-xl font-bold text-white">
                Stuck on a bug or sensor wiring?
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Ask the AI Coding Mentor to review your Python script, explain Arduino PWM pins, or
                help debug your Scratch game logic step by step.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-white">
              <span>Ask AI Coding Mentor</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Hands-On Projects */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900">
              Featured Workshop Projects
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Hands-on builds with parts lists, wiring steps, and starter code.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('projects')}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 whitespace-nowrap"
          >
            <span>View Full Project Library</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PROJECTS.slice(0, 3).map((project) => {
            const isSaved = bookmarkedProjectIds.includes(project.id);
            return (
              <div
                key={project.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col justify-between"
              >
                <div
                  onClick={() => onOpenProject(project.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onOpenProject(project.id);
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
                    <div className="text-xs text-slate-500">
                      {project.trackLabel} · {project.difficulty} · {project.duration}
                    </div>
                    <h3 className="font-display text-lg font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-2">{project.summary}</p>
                  </div>
                </div>

                <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenProject(project.id)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap"
                  >
                    Open Build Guide
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleBookmark(project.id)}
                    aria-label={isSaved ? 'Remove bookmark' : 'Bookmark project'}
                    className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                      isSaved
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-blue-600' : ''}`} />
                    <span>{isSaved ? 'Saved' : 'Save'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Community Gallery Preview */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <span>Student Showcase · {gallerySubmissions.length} Published Builds</span>
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
            See what other young engineers built this week
          </h2>
          <p className="text-sm text-slate-600">
            Browse hallway rovers, classroom moisture monitors, and AI block sorters shared by
            students aged 8–16, or submit your own build.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('gallery')}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-900 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0"
        >
          <FolderKanban className="w-4 h-4" />
          <span>Browse Student Gallery</span>
        </button>
      </section>
    </div>
  );
};
