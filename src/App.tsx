/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo, useState } from 'react';
import { AiMentorPage } from './components/AiMentorPage';
import { AppShell } from './components/AppShell';
import { ArduinoProjectsPage } from './components/ArduinoProjectsPage';
import { CodingChallengesPage } from './components/CodingChallengesPage';
import { CourseTrackPage } from './components/CourseTrackPage';
import { DashboardPage } from './components/DashboardPage';
import { HomePage } from './components/HomePage';
import { ProjectDetailPage } from './components/ProjectDetailPage';
import { ProjectLibraryPage } from './components/ProjectLibraryPage';
import { StudentGalleryPage } from './components/StudentGalleryPage';
import { StudentProfilePage } from './components/StudentProfilePage';
import { SubmitProjectModal } from './components/SubmitProjectModal';
import { ARDUINO_PROJECTS } from './data/arduinoProjectsData';
import { CODING_CHALLENGES, COURSES, NAV_ITEMS, PROJECTS } from './data/roboLearnData';
import {
  calculateTotalXp,
  mergeGallerySubmissions,
  studentStorage,
  syncEarnedBadges,
  upsertQuizScoreRecord,
} from './services/storageService';
import {
  ActivityEvent,
  ChallengeResultRecord,
  GallerySubmission,
  PageId,
  PersistedStudentData,
  StudentProfile,
} from './types/platform';

function parseRouteFromPathname(pathname: string): {
  page: PageId;
  projectId: string | null;
  arduinoProjectId: string | null;
} {
  const normalized = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
  if (normalized.startsWith('/projects/')) {
    const projectId = normalized.slice('/projects/'.length);
    const exists = PROJECTS.some((p) => p.id === projectId);
    if (exists) {
      return { page: 'projects', projectId, arduinoProjectId: null };
    }
  }
  if (normalized.startsWith('/arduino/')) {
    const arduinoProjectId = normalized.slice('/arduino/'.length);
    const exists = ARDUINO_PROJECTS.some((p) => p.id === arduinoProjectId);
    if (exists) {
      return { page: 'arduino', projectId: null, arduinoProjectId };
    }
  }
  const match = NAV_ITEMS.find((item) => item.path === normalized);
  return { page: match?.id ?? 'home', projectId: null, arduinoProjectId: null };
}

function getTodayWeekdayLabel(): string {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[new Date().getDay()] ?? 'Mon';
}

function formatActivityTimestamp(): string {
  return `Today · ${new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })}`;
}

function formatDateStamp(): string {
  return new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function withActivityAndMinutes(
  prev: PersistedStudentData,
  event: Omit<ActivityEvent, 'id' | 'timestamp'>,
  minutesDelta: number
): PersistedStudentData['progress'] {
  const todayLabel = getTodayWeekdayLabel();
  const nextEvent: ActivityEvent = {
    ...event,
    id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: formatActivityTimestamp(),
  };

  return {
    ...prev.progress,
    recentActivities: [nextEvent, ...prev.progress.recentActivities].slice(0, 25),
    weeklyActivity: prev.progress.weeklyActivity.map((entry) =>
      entry.day === todayLabel
        ? { ...entry, minutes: entry.minutes + minutesDelta }
        : entry
    ),
  };
}

export default function App() {
  const initialRoute = useMemo(() => parseRouteFromPathname(window.location.pathname), []);
  const [activePage, setActivePage] = useState<PageId>(initialRoute.page);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    initialRoute.projectId
  );
  const [selectedArduinoProjectId, setSelectedArduinoProjectId] = useState<string | null>(
    initialRoute.arduinoProjectId
  );
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null);
  const [state, setState] = useState<PersistedStudentData>(() => studentStorage.load());
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [editingSubmission, setEditingSubmission] = useState<GallerySubmission | null>(null);

  const updatePersistedState = (
    updater: (prev: PersistedStudentData) => PersistedStudentData
  ) => {
    setState((prev) => syncEarnedBadges(updater(prev)));
  };

  useEffect(() => {
    studentStorage.save(state);
  }, [state]);

  // Sync with backend gallery store if available while keeping localStorage as prototype fallback
  useEffect(() => {
    let active = true;
    fetch('/api/gallery')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { items?: GallerySubmission[] | null } | null) => {
        if (!active || !data || !Array.isArray(data.items) || data.items.length === 0) {
          return;
        }
        updatePersistedState((prev) => {
          const merged = mergeGallerySubmissions(
            prev.submissions.gallerySubmissions,
            data.items!
          );
          if (merged === prev.submissions.gallerySubmissions) return prev;
          return {
            ...prev,
            submissions: {
              ...prev.submissions,
              gallerySubmissions: merged,
            },
          };
        });
      })
      .catch(() => {
        // Offline or backend unavailable: localStorage fallback remains active
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const onPopState = () => {
      const next = parseRouteFromPathname(window.location.pathname);
      setActivePage(next.page);
      setSelectedProjectId(next.projectId);
      setSelectedArduinoProjectId(next.arduinoProjectId);
      setSelectedChallengeId(null);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const selectedProject = selectedProjectId
    ? PROJECTS.find((p) => p.id === selectedProjectId) ?? null
    : null;

  const selectedArduinoProject = selectedArduinoProjectId
    ? ARDUINO_PROJECTS.find((p) => p.id === selectedArduinoProjectId) ?? null
    : null;

  useEffect(() => {
    if (selectedProject) {
      document.title = `${selectedProject.title} — RoboLearn Hub`;
      return;
    }
    if (selectedArduinoProject) {
      document.title = `${selectedArduinoProject.title} — Arduino Projects — RoboLearn Hub`;
      return;
    }
    const navItem = NAV_ITEMS.find((item) => item.id === activePage);
    document.title =
      activePage === 'home'
        ? 'RoboLearn Hub — Robotics, Coding & STEM Studio'
        : `${navItem?.pageTitle ?? 'Workspace'} — RoboLearn Hub`;
  }, [activePage, selectedProject, selectedArduinoProject]);

  const handleNavigate = (page: PageId) => {
    const target = NAV_ITEMS.find((item) => item.id === page);
    if (target && window.location.pathname !== target.path) {
      window.history.pushState({ page }, '', target.path);
    }
    setSelectedProjectId(null);
    setSelectedArduinoProjectId(null);
    setSelectedChallengeId(null);
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenProject = (projectId: string) => {
    const targetPath = `/projects/${projectId}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ page: 'projects', projectId }, '', targetPath);
    }
    setSelectedArduinoProjectId(null);
    setSelectedChallengeId(null);
    setActivePage('projects');
    setSelectedProjectId(projectId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectArduinoProject = (projectId: string | null) => {
    const targetPath = projectId ? `/arduino/${projectId}` : '/arduino';
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ page: 'arduino', arduinoProjectId: projectId }, '', targetPath);
    }
    setActivePage('arduino');
    setSelectedProjectId(null);
    setSelectedChallengeId(null);
    setSelectedArduinoProjectId(projectId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenChallenge = (challengeId: string) => {
    const targetPath = '/challenges';
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ page: 'challenges', challengeId }, '', targetPath);
    }
    setSelectedProjectId(null);
    setSelectedArduinoProjectId(null);
    setSelectedChallengeId(challengeId);
    setActivePage('challenges');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalXp = useMemo(() => calculateTotalXp(state), [state]);

  const toggleLesson = (lessonId: string) => {
    updatePersistedState((prev) => {
      const exists = prev.progress.completedLessons.includes(lessonId);
      if (exists) {
        return {
          ...prev,
          progress: {
            ...prev.progress,
            completedLessons: prev.progress.completedLessons.filter((id) => id !== lessonId),
          },
        };
      }
      const course = COURSES.find((c) => c.lessons.some((l) => l.id === lessonId));
      const lesson = course?.lessons.find((l) => l.id === lessonId);
      const nextProgress = withActivityAndMinutes(
        prev,
        {
          type: 'lesson',
          title: `Completed Lesson: ${lesson?.title ?? lessonId}`,
          subject: course?.accentLabel.replace(' Track', '') ?? 'STEM',
          pointsDelta: 50,
        },
        lesson?.durationMinutes ?? 15
      );
      return {
        ...prev,
        progress: {
          ...nextProgress,
          completedLessons: Array.from(new Set([...prev.progress.completedLessons, lessonId])),
        },
      };
    });
  };

  const toggleBookmark = (projectId: string) => {
    updatePersistedState((prev) => {
      const exists = prev.bookmarks.projectIds.includes(projectId);
      return {
        ...prev,
        bookmarks: {
          ...prev.bookmarks,
          projectIds: exists
            ? prev.bookmarks.projectIds.filter((id) => id !== projectId)
            : Array.from(new Set([...prev.bookmarks.projectIds, projectId])),
        },
      };
    });
  };

  const toggleProjectComplete = (projectId: string) => {
    updatePersistedState((prev) => {
      const exists = prev.progress.completedProjectIds.includes(projectId);
      if (exists) {
        return {
          ...prev,
          progress: {
            ...prev.progress,
            completedProjectIds: prev.progress.completedProjectIds.filter(
              (id) => id !== projectId
            ),
          },
        };
      }
      const proj = PROJECTS.find((p) => p.id === projectId);
      const nextProgress = withActivityAndMinutes(
        prev,
        {
          type: 'project',
          title: `Completed Project: ${proj?.title ?? projectId}`,
          subject: proj?.trackLabel ?? 'Robotics',
          pointsDelta: 100,
        },
        25
      );
      return {
        ...prev,
        progress: {
          ...nextProgress,
          completedProjectIds: Array.from(
            new Set([...prev.progress.completedProjectIds, projectId])
          ),
        },
      };
    });
  };

  const toggleArduinoBookmark = (projectId: string) => {
    updatePersistedState((prev) => {
      const exists = prev.bookmarks.arduinoIds.includes(projectId);
      return {
        ...prev,
        bookmarks: {
          ...prev.bookmarks,
          arduinoIds: exists
            ? prev.bookmarks.arduinoIds.filter((id) => id !== projectId)
            : Array.from(new Set([...prev.bookmarks.arduinoIds, projectId])),
        },
      };
    });
  };

  const toggleArduinoComplete = (projectId: string) => {
    updatePersistedState((prev) => {
      const exists = prev.progress.completedArduinoIds.includes(projectId);
      if (exists) {
        return {
          ...prev,
          progress: {
            ...prev.progress,
            completedArduinoIds: prev.progress.completedArduinoIds.filter(
              (id) => id !== projectId
            ),
          },
        };
      }
      const proj = ARDUINO_PROJECTS.find((p) => p.id === projectId);
      const nextProgress = withActivityAndMinutes(
        prev,
        {
          type: 'project',
          title: `Completed Arduino Project: ${proj?.title ?? projectId}`,
          subject: 'Arduino',
          pointsDelta: 75,
        },
        20
      );
      return {
        ...prev,
        progress: {
          ...nextProgress,
          completedArduinoIds: Array.from(
            new Set([...prev.progress.completedArduinoIds, projectId])
          ),
        },
      };
    });
  };

  const toggleProjectMaterial = (projectId: string, index: number) => {
    updatePersistedState((prev) => {
      const current = prev.progress.checkedMaterialsByProject[projectId] ?? [];
      const next = current.includes(index)
        ? current.filter((i) => i !== index)
        : Array.from(new Set([...current, index])).sort((a, b) => a - b);
      return {
        ...prev,
        progress: {
          ...prev.progress,
          checkedMaterialsByProject: {
            ...prev.progress.checkedMaterialsByProject,
            [projectId]: next,
          },
        },
      };
    });
  };

  const toggleProjectStep = (projectId: string, index: number) => {
    updatePersistedState((prev) => {
      const current = prev.progress.checkedStepsByProject[projectId] ?? [];
      const next = current.includes(index)
        ? current.filter((i) => i !== index)
        : Array.from(new Set([...current, index])).sort((a, b) => a - b);
      return {
        ...prev,
        progress: {
          ...prev.progress,
          checkedStepsByProject: {
            ...prev.progress.checkedStepsByProject,
            [projectId]: next,
          },
        },
      };
    });
  };

  const recordQuizScore = (
    courseId: string,
    courseTitle: string,
    score: number,
    total: number,
    pointsEarned: number
  ) => {
    const dateLabel = formatDateStamp();
    const course = COURSES.find((c) => c.id === courseId);
    updatePersistedState((prev) => {
      const nextProgress = withActivityAndMinutes(
        prev,
        {
          type: 'quiz',
          title: `Scored ${score}/${total} on ${courseTitle} Quiz`,
          subject: course?.accentLabel.replace(' Track', '') ?? 'STEM',
          pointsDelta: pointsEarned,
        },
        15
      );
      return {
        ...prev,
        progress: nextProgress,
        assessments: {
          ...prev.assessments,
          quizScores: upsertQuizScoreRecord(prev.assessments.quizScores, {
            courseId,
            courseTitle,
            score,
            total,
            pointsEarned,
            completedAt: dateLabel,
          }),
        },
      };
    });
  };

  const buildChallengeRecord = (challengeId: string): ChallengeResultRecord | null => {
    const ch = CODING_CHALLENGES.find((c) => c.id === challengeId);
    if (!ch) return null;
    return {
      challengeId: ch.id,
      title: ch.title,
      category: ch.trackLabel,
      difficulty: ch.difficulty,
      xpEarned: ch.xpReward,
      completedAt: formatDateStamp(),
    };
  };

  const solveChallenge = (challengeId: string) => {
    updatePersistedState((prev) => {
      if (prev.assessments.solvedChallengeIds.includes(challengeId)) return prev;
      const ch = CODING_CHALLENGES.find((c) => c.id === challengeId);
      const record = buildChallengeRecord(challengeId);
      const nextProgress = withActivityAndMinutes(
        prev,
        {
          type: 'challenge',
          title: `Solved Challenge: ${ch?.title ?? challengeId}`,
          subject: ch?.trackLabel ?? 'Coding',
          pointsDelta: ch?.xpReward ?? 100,
        },
        ch?.estimatedMinutes ?? 15
      );
      return {
        ...prev,
        progress: nextProgress,
        assessments: {
          ...prev.assessments,
          solvedChallengeIds: Array.from(
            new Set([...prev.assessments.solvedChallengeIds, challengeId])
          ),
          challengeResults: record
            ? [
                ...prev.assessments.challengeResults.filter(
                  (r) => r.challengeId !== challengeId
                ),
                record,
              ]
            : prev.assessments.challengeResults,
        },
      };
    });
  };

  const toggleChallengeComplete = (challengeId: string) => {
    updatePersistedState((prev) => {
      const exists = prev.assessments.solvedChallengeIds.includes(challengeId);
      if (exists) {
        return {
          ...prev,
          assessments: {
            ...prev.assessments,
            solvedChallengeIds: prev.assessments.solvedChallengeIds.filter(
              (id) => id !== challengeId
            ),
            challengeResults: prev.assessments.challengeResults.filter(
              (r) => r.challengeId !== challengeId
            ),
          },
        };
      }
      const ch = CODING_CHALLENGES.find((c) => c.id === challengeId);
      const record = buildChallengeRecord(challengeId);
      const nextProgress = withActivityAndMinutes(
        prev,
        {
          type: 'challenge',
          title: `Solved Challenge: ${ch?.title ?? challengeId}`,
          subject: ch?.trackLabel ?? 'Coding',
          pointsDelta: ch?.xpReward ?? 100,
        },
        ch?.estimatedMinutes ?? 15
      );
      return {
        ...prev,
        progress: nextProgress,
        assessments: {
          ...prev.assessments,
          solvedChallengeIds: Array.from(
            new Set([...prev.assessments.solvedChallengeIds, challengeId])
          ),
          challengeResults: record
            ? [
                ...prev.assessments.challengeResults.filter(
                  (r) => r.challengeId !== challengeId
                ),
                record,
              ]
            : prev.assessments.challengeResults,
        },
      };
    });
  };

  const saveChallengeDraft = (challengeId: string, code: string) => {
    updatePersistedState((prev) => ({
      ...prev,
      assessments: {
        ...prev.assessments,
        challengeCodeDrafts: {
          ...prev.assessments.challengeCodeDrafts,
          [challengeId]: code,
        },
      },
    }));
  };

  const toggleGalleryLike = (submissionId: string) => {
    updatePersistedState((prev) => {
      const exists = prev.submissions.likedSubmissionIds.includes(submissionId);
      return {
        ...prev,
        submissions: {
          ...prev.submissions,
          likedSubmissionIds: exists
            ? prev.submissions.likedSubmissionIds.filter((id) => id !== submissionId)
            : Array.from(new Set([...prev.submissions.likedSubmissionIds, submissionId])),
        },
      };
    });
  };

  const saveGallerySubmission = async (submission: GallerySubmission, isEdit: boolean) => {
    updatePersistedState((prev) => {
      const nextProgress = isEdit
        ? prev.progress
        : withActivityAndMinutes(
            prev,
            {
              type: 'gallery',
              title: `Submitted Gallery Project: ${submission.title}`,
              subject: submission.trackLabel,
              pointsDelta: 50,
            },
            20
          );
      const existingIndex = prev.submissions.gallerySubmissions.findIndex(
        (item) => item.id === submission.id
      );
      const nextGallery =
        existingIndex >= 0
          ? prev.submissions.gallerySubmissions.map((item) =>
              item.id === submission.id ? submission : item
            )
          : [submission, ...prev.submissions.gallerySubmissions];

      return {
        ...prev,
        progress: nextProgress,
        submissions: {
          ...prev.submissions,
          gallerySubmissions: nextGallery,
        },
      };
    });

    try {
      await fetch(isEdit ? `/api/gallery/${encodeURIComponent(submission.id)}` : '/api/gallery', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission),
      });
    } catch {
      // Fallback safely to localStorage persistence already updated above
    }

    if (!isEdit) {
      handleNavigate('gallery');
    }
  };

  const deleteGallerySubmission = async (submissionId: string) => {
    updatePersistedState((prev) => ({
      ...prev,
      submissions: {
        gallerySubmissions: prev.submissions.gallerySubmissions.filter(
          (item) => item.id !== submissionId
        ),
        likedSubmissionIds: prev.submissions.likedSubmissionIds.filter(
          (id) => id !== submissionId
        ),
      },
    }));

    try {
      await fetch(`/api/gallery/${encodeURIComponent(submissionId)}`, {
        method: 'DELETE',
      });
    } catch {
      // Fallback safely to localStorage persistence already updated above
    }
  };

  const openNewSubmissionModal = () => {
    setEditingSubmission(null);
    setSubmitModalOpen(true);
  };

  const openEditSubmissionModal = (submission: GallerySubmission) => {
    setEditingSubmission(submission);
    setSubmitModalOpen(true);
  };

  const saveProfile = (updated: StudentProfile) => {
    updatePersistedState((prev) => ({
      ...prev,
      profile: updated,
    }));
  };

  const resetDemoData = () => {
    const fresh = studentStorage.reset();
    setState(fresh);
  };

  const renderPage = () => {
    if (activePage === 'home') {
      return (
        <HomePage
          profile={state.profile}
          completedLessons={state.progress.completedLessons}
          bookmarkedProjectIds={state.bookmarks.projectIds}
          solvedChallengeIds={state.assessments.solvedChallengeIds}
          gallerySubmissions={state.submissions.gallerySubmissions}
          totalXp={totalXp}
          onNavigate={handleNavigate}
          onOpenProject={handleOpenProject}
          onToggleBookmark={toggleBookmark}
        />
      );
    }

    if (activePage === 'dashboard') {
      return (
        <DashboardPage
          profile={state.profile}
          completedLessons={state.progress.completedLessons}
          bookmarkedProjectIds={state.bookmarks.projectIds}
          bookmarkedArduinoIds={state.bookmarks.arduinoIds}
          completedProjectIds={state.progress.completedProjectIds}
          completedArduinoIds={state.progress.completedArduinoIds}
          solvedChallengeIds={state.assessments.solvedChallengeIds}
          quizHistory={state.assessments.quizScores}
          persistedBadges={state.badges.earnedBadges}
          gallerySubmissions={state.submissions.gallerySubmissions}
          recentActivities={state.progress.recentActivities}
          weeklyActivity={state.progress.weeklyActivity}
          totalXp={totalXp}
          onNavigate={handleNavigate}
          onOpenProject={handleOpenProject}
          onOpenArduinoProject={(id) => handleSelectArduinoProject(id)}
          onToggleBookmark={toggleBookmark}
          onToggleArduinoBookmark={toggleArduinoBookmark}
        />
      );
    }

    if (activePage === 'arduino') {
      const arduinoCourse = COURSES.find((c) => c.pageId === 'arduino') ?? COURSES[0];
      return (
        <ArduinoProjectsPage
          arduinoCourse={arduinoCourse}
          completedLessons={state.progress.completedLessons}
          quizHistory={state.assessments.quizScores}
          selectedProjectId={selectedArduinoProjectId}
          bookmarkedArduinoIds={state.bookmarks.arduinoIds}
          completedArduinoIds={state.progress.completedArduinoIds}
          checkedMaterialsByProject={state.progress.checkedMaterialsByProject}
          checkedStepsByProject={state.progress.checkedStepsByProject}
          onSelectProject={handleSelectArduinoProject}
          onToggleBookmark={toggleArduinoBookmark}
          onToggleCompleteProject={toggleArduinoComplete}
          onToggleMaterial={toggleProjectMaterial}
          onToggleStep={toggleProjectStep}
          onToggleLesson={toggleLesson}
          onRecordQuizScore={recordQuizScore}
          onNavigate={handleNavigate}
        />
      );
    }

    if (
      activePage === 'robotics' ||
      activePage === 'scratch' ||
      activePage === 'python' ||
      activePage === 'ai-ml'
    ) {
      const course = COURSES.find((c) => c.pageId === activePage) ?? COURSES[0];
      return (
        <CourseTrackPage
          course={course}
          completedLessons={state.progress.completedLessons}
          quizHistory={state.assessments.quizScores}
          onToggleLesson={toggleLesson}
          onRecordQuizScore={recordQuizScore}
          onNavigate={handleNavigate}
        />
      );
    }

    if (activePage === 'projects') {
      if (selectedProject) {
        return (
          <ProjectDetailPage
            project={selectedProject}
            isBookmarked={state.bookmarks.projectIds.includes(selectedProject.id)}
            isCompleted={state.progress.completedProjectIds.includes(selectedProject.id)}
            checkedMaterials={state.progress.checkedMaterialsByProject[selectedProject.id] ?? []}
            checkedSteps={state.progress.checkedStepsByProject[selectedProject.id] ?? []}
            onBack={() => handleNavigate('projects')}
            onToggleBookmark={toggleBookmark}
            onToggleComplete={toggleProjectComplete}
            onToggleMaterial={toggleProjectMaterial}
            onToggleStep={toggleProjectStep}
            onAskMentor={handleNavigate}
          />
        );
      }

      return (
        <ProjectLibraryPage
          bookmarkedProjectIds={state.bookmarks.projectIds}
          onOpenProject={handleOpenProject}
          onToggleBookmark={toggleBookmark}
        />
      );
    }

    if (activePage === 'challenges') {
      return (
        <CodingChallengesPage
          solvedChallengeIds={state.assessments.solvedChallengeIds}
          challengeCodeDrafts={state.assessments.challengeCodeDrafts}
          selectedChallengeId={selectedChallengeId}
          onSolveChallenge={solveChallenge}
          onToggleChallengeComplete={toggleChallengeComplete}
          onSaveChallengeDraft={saveChallengeDraft}
        />
      );
    }

    if (activePage === 'mentor') {
      return <AiMentorPage />;
    }

    if (activePage === 'gallery') {
      return (
        <StudentGalleryPage
          submissions={state.submissions.gallerySubmissions}
          likedSubmissionIds={state.submissions.likedSubmissionIds}
          currentStudentName={state.profile.name}
          onToggleLike={toggleGalleryLike}
          onOpenSubmitModal={openNewSubmissionModal}
          onEditSubmission={openEditSubmissionModal}
          onDeleteSubmission={(id) => void deleteGallerySubmission(id)}
        />
      );
    }

    return (
      <StudentProfilePage
        profile={state.profile}
        completedLessons={state.progress.completedLessons}
        completedProjectCount={
          state.progress.completedProjectIds.length + state.progress.completedArduinoIds.length
        }
        quizCount={state.assessments.quizScores.length}
        solvedChallengeIds={state.assessments.solvedChallengeIds}
        bookmarkedProjectIds={state.bookmarks.projectIds}
        bookmarkedArduinoIds={state.bookmarks.arduinoIds}
        earnedBadges={state.badges.earnedBadges}
        submissions={state.submissions.gallerySubmissions}
        totalXp={totalXp}
        onSaveProfile={saveProfile}
        onResetDemoData={resetDemoData}
        onOpenProject={handleOpenProject}
        onOpenArduinoProject={(id) => handleSelectArduinoProject(id)}
      />
    );
  };

  return (
    <AppShell
      activePage={activePage}
      onNavigate={handleNavigate}
      onOpenProject={handleOpenProject}
      onOpenArduinoProject={handleSelectArduinoProject}
      onOpenChallenge={handleOpenChallenge}
      onOpenSubmitModal={openNewSubmissionModal}
      profile={state.profile}
      totalXp={totalXp}
    >
      {renderPage()}

      <SubmitProjectModal
        isOpen={submitModalOpen}
        profile={state.profile}
        editingSubmission={editingSubmission}
        onClose={() => {
          setSubmitModalOpen(false);
          setEditingSubmission(null);
        }}
        onSubmit={saveGallerySubmission}
      />
    </AppShell>
  );
}
