import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Circle,
  Play,
  Sliders,
} from 'lucide-react';
import { CourseItem, PageId, QuizScoreRecord } from '../types/platform';
import { ResilientImage } from './ResilientImage';
import { TrackQuizRunner } from './TrackQuizRunner';

interface CourseTrackPageProps {
  course: CourseItem;
  completedLessons: string[];
  quizHistory: QuizScoreRecord[];
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

export const CourseTrackPage: React.FC<CourseTrackPageProps> = ({
  course,
  completedLessons,
  quizHistory,
  onToggleLesson,
  onRecordQuizScore,
  onNavigate,
}) => {
  const [selectedLessonId, setSelectedLessonId] = useState<string>(course.lessons[0]?.id ?? '');
  const [activeTab, setActiveTab] = useState<'lessons' | 'quiz'>('lessons');

  // Interactive Track Simulator State (tailored per track)
  const [simParamA, setSimParamA] = useState<number>(35);
  const [simParamB, setSimParamB] = useState<number>(80);

  useEffect(() => {
    setSelectedLessonId(course.lessons[0]?.id ?? '');
    setActiveTab('lessons');
    if (course.track === 'robotics') {
      setSimParamA(28);
      setSimParamB(170);
    } else if (course.track === 'scratch') {
      setSimParamA(40);
      setSimParamB(14);
    } else if (course.track === 'python') {
      setSimParamA(24);
      setSimParamB(85);
    } else if (course.track === 'arduino') {
      setSimParamA(180);
      setSimParamB(90);
    } else {
      setSimParamA(82);
      setSimParamB(80);
    }
  }, [course]);

  const activeLesson =
    course.lessons.find((l) => l.id === selectedLessonId) ?? course.lessons[0];

  const completedInCourse = course.lessons.filter((l) =>
    completedLessons.includes(l.id)
  ).length;
  const progressPct = Math.round((completedInCourse / course.lessons.length) * 100);

  const courseQuizAttempts = quizHistory.filter((q) => q.courseId === course.id);
  const previousBest = courseQuizAttempts.reduce<QuizScoreRecord | undefined>((best, cur) => {
    if (!best) return cur;
    return cur.score / cur.total > best.score / best.total ? cur : best;
  }, undefined);

  const renderTrackSandbox = () => {
    if (course.track === 'robotics') {
      const stopped = simParamA < 20;
      return (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900">
                Interactive Sandbox: Ultrasonic Rover Stop Guard
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Adjust obstacle distance and motor PWM speed to test differential-drive safety rules.
              </p>
            </div>
            <span
              className={`text-xs font-semibold tabular-nums ${
                stopped ? 'text-amber-700' : 'text-emerald-700'
              }`}
            >
              {stopped ? '▲ OBSTACLE DETECTED · TURNING' : '● PATH CLEAR · CRUISING'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7 bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-slate-600">
                <span>ROVER FRONT</span>
                <span>DISTANCE: {simParamA} cm</span>
                <span>WALL</span>
              </div>
              <div className="relative h-12 bg-white border border-slate-200 rounded-lg flex items-center px-4 overflow-hidden">
                <div className="w-10 h-7 bg-blue-600 rounded flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                  BOT
                </div>
                <div
                  className="h-0.5 bg-blue-400 transition-all"
                  style={{ width: `${Math.min(72, Math.max(8, simParamA * 0.9))}%` }}
                />
                <div className="ml-auto w-3 h-9 bg-slate-800 rounded-sm shrink-0" />
              </div>
              <div className="text-xs text-slate-600 font-mono bg-white border border-slate-200 rounded-lg p-3">
                {stopped
                  ? `if (distance < 20) -> stopMotors(); turnRight(); // Triggered at ${simParamA} cm`
                  : `else -> driveForward(${simParamB}); // Safe cruise speed ${simParamB}/255 PWM`}
              </div>
            </div>

            <div className="md:col-span-5 space-y-4">
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1.5 tabular-nums">
                  <label htmlFor="rob-dist">Obstacle Distance</label>
                  <span>{simParamA} cm</span>
                </div>
                <input
                  id="rob-dist"
                  type="range"
                  min={5}
                  max={80}
                  value={simParamA}
                  onChange={(e) => setSimParamA(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1.5 tabular-nums">
                  <label htmlFor="rob-speed">Motor Speed (PWM)</label>
                  <span>{simParamB} / 255</span>
                </div>
                <input
                  id="rob-speed"
                  type="range"
                  min={80}
                  max={255}
                  value={simParamB}
                  onChange={(e) => setSimParamB(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (course.track === 'arduino') {
      return (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900">
                Interactive Sandbox: PWM LED &amp; Servo Angle Controller
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Simulate analogWrite() brightness on pin ~9 and Servo.write() angle on pin 6.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-600 tabular-nums">
              Pin ~9: {simParamA} PWM · Pin 6: {simParamB}°
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-6 bg-slate-50 border border-slate-200 rounded-xl p-5 flex items-center justify-around gap-6">
              <div className="flex flex-col items-center gap-2">
                <div
                  className="w-12 h-12 rounded-full border-2 border-amber-500 transition-all"
                  style={{
                    backgroundColor: `rgba(245, 158, 11, ${Math.max(0.08, simParamA / 255)})`,
                  }}
                />
                <span className="text-xs font-medium text-slate-700 tabular-nums">
                  LED ({Math.round((simParamA / 255) * 100)}%)
                </span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full border border-slate-300 bg-white flex items-center justify-center relative">
                  <div
                    className="w-1 h-7 bg-blue-600 origin-bottom rounded-full transition-transform"
                    style={{
                      transform: `translateY(-6px) rotate(${simParamB - 90}deg)`,
                    }}
                  />
                </div>
                <span className="text-xs font-medium text-slate-700 tabular-nums">
                  Servo Arm ({simParamB}°)
                </span>
              </div>
            </div>

            <div className="md:col-span-6 space-y-4">
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1.5 tabular-nums">
                  <label htmlFor="ard-pwm">LED Brightness (analogWrite)</label>
                  <span>{simParamA} / 255</span>
                </div>
                <input
                  id="ard-pwm"
                  type="range"
                  min={0}
                  max={255}
                  value={simParamA}
                  onChange={(e) => setSimParamA(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1.5 tabular-nums">
                  <label htmlFor="ard-servo">Servo Angle (gripper.write)</label>
                  <span>{simParamB}°</span>
                </div>
                <input
                  id="ard-servo"
                  type="range"
                  min={0}
                  max={180}
                  value={simParamB}
                  onChange={(e) => setSimParamB(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (course.track === 'ai-ml') {
      const confident = simParamA >= simParamB;
      return (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900">
                Interactive Sandbox: Confidence Threshold Gate
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Test when a sorting arm acts automatically versus holding uncertain blocks for review.
              </p>
            </div>
            <span
              className={`text-xs font-semibold tabular-nums ${
                confident ? 'text-emerald-700' : 'text-amber-700'
              }`}
            >
              {confident ? '● AUTO-SORT ACCEPTED' : '▲ LOW CONFIDENCE · HOLD FOR REVIEW'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1.5 tabular-nums">
                <label htmlFor="ai-score">Model Prediction Confidence</label>
                <span>{(simParamA / 100).toFixed(2)}</span>
              </div>
              <input
                id="ai-score"
                type="range"
                min={20}
                max={99}
                value={simParamA}
                onChange={(e) => setSimParamA(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1.5 tabular-nums">
                <label htmlFor="ai-thresh">Required Safety Threshold</label>
                <span>{(simParamB / 100).toFixed(2)}</span>
              </div>
              <input
                id="ai-thresh"
                type="range"
                min={50}
                max={95}
                value={simParamB}
                onChange={(e) => setSimParamB(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>
          </div>
        </div>
      );
    }

    // Scratch & Python sandbox
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            <h2 className="font-display text-lg font-bold text-slate-900">
              {course.track === 'scratch'
                ? 'Interactive Sandbox: Sprite Position & Jump Velocity'
                : 'Interactive Sandbox: Python Rover Telemetry Evaluator'}
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-600 tabular-nums">
            {course.track === 'scratch'
              ? `x: ${simParamA}, yVelocity: ${simParamB}`
              : `distance: ${simParamA}cm · battery: ${simParamB}%`}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1.5 tabular-nums">
                <label htmlFor="code-param-a">
                  {course.track === 'scratch' ? 'Sprite X Position' : 'Measured Distance (cm)'}
                </label>
                <span>{simParamA}</span>
              </div>
              <input
                id="code-param-a"
                type="range"
                min={course.track === 'scratch' ? -200 : 5}
                max={course.track === 'scratch' ? 200 : 80}
                value={simParamA}
                onChange={(e) => setSimParamA(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1.5 tabular-nums">
                <label htmlFor="code-param-b">
                  {course.track === 'scratch' ? 'Jump Velocity' : 'Battery Level (%)'}
                </label>
                <span>{simParamB}</span>
              </div>
              <input
                id="code-param-b"
                type="range"
                min={course.track === 'scratch' ? 4 : 10}
                max={course.track === 'scratch' ? 25 : 100}
                value={simParamB}
                onChange={(e) => setSimParamB(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>
          </div>

          <div className="bg-slate-900 text-slate-100 rounded-xl p-4 font-mono text-xs space-y-1.5">
            {course.track === 'scratch' ? (
              <>
                <div className="text-slate-400">Scratch Stage Preview (480 × 360)</div>
                <div>go to x: ({simParamA}) y: (-120)</div>
                <div>set [yVelocity] to ({simParamB})</div>
                <div className="text-emerald-400">
                  Peak jump height ≈ {Math.round((simParamB * simParamB) / 2)} px
                </div>
              </>
            ) : (
              <>
                <div className="text-slate-400">Python Output Preview</div>
                <div>choose_action({simParamA}) → &quot;{simParamA < 15 ? 'STOP_AND_TURN' : simParamA < 35 ? 'SLOW_DOWN' : 'CRUISE'}&quot;</div>
                <div className={simParamB < 25 ? 'text-amber-400' : 'text-emerald-400'}>
                  battery_status = {simParamB < 25 ? '"LOW_RETURN_TO_DOCK"' : '"NOMINAL"'}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Course Header */}
      <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-8 p-6 sm:p-8 flex flex-col justify-between gap-5">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-blue-700">
                {course.accentLabel} · {course.ageRange} · {course.difficulty} ·{' '}
                {course.estimatedHours} hrs
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                {course.title}
              </h1>
              <p className="text-sm sm:text-base text-slate-600 max-w-2xl">{course.subtitle}</p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-4 min-w-[220px] flex-1 max-w-sm">
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-slate-700 tabular-nums whitespace-nowrap">
                  {completedInCourse}/{course.lessons.length} Lessons ({progressPct}%)
                </span>
              </div>

              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setActiveTab('lessons')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                    activeTab === 'lessons'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Lessons ({course.lessons.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('quiz')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                    activeTab === 'quiz'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Track Quiz ({course.quiz.length})
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-slate-100 min-h-[200px] relative">
            <ResilientImage
              src={course.imageUrl}
              alt={course.imageAlt}
              className="w-full h-full lg:absolute lg:inset-0 object-cover"
            />
          </div>
        </div>
      </section>

      {/* Interactive Sandbox */}
      {renderTrackSandbox()}

      {/* Lessons Tab vs Quiz Tab */}
      {activeTab === 'lessons' ? (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Lesson Navigation List */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-4 space-y-2 h-fit">
            <div className="px-2 py-1 text-xs font-semibold text-slate-500">
              Module Curriculum
            </div>
            {course.lessons.map((lesson) => {
              const isDone = completedLessons.includes(lesson.id);
              const isSelected = activeLesson?.id === lesson.id;
              return (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={() => setSelectedLessonId(lesson.id)}
                  className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors ${
                    isSelected
                      ? 'bg-blue-50 text-blue-900'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-300 mt-0.5 shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold leading-snug">{lesson.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5 tabular-nums">
                      {lesson.durationMinutes} min · {isDone ? 'Completed' : 'Ready'}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Lesson Workspace */}
          {activeLesson && (
            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-xs text-slate-500 tabular-nums">
                    {course.accentLabel} · {activeLesson.durationMinutes} min read &amp; practice
                  </div>
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                    {activeLesson.title}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => onToggleLesson(activeLesson.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    completedLessons.includes(activeLesson.id)
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {completedLessons.includes(activeLesson.id)
                      ? 'Lesson Completed'
                      : 'Mark Complete (+50 XP)'}
                  </span>
                </button>
              </div>

              <p className="text-base text-slate-700 leading-relaxed">{activeLesson.summary}</p>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1.5">
                <div className="text-xs font-semibold text-slate-500">Key Engineering Idea</div>
                <p className="text-sm text-slate-800 leading-relaxed">{activeLesson.keyConcept}</p>
              </div>

              {activeLesson.codePreview && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-500">
                    Starter Code Pattern ({activeLesson.codeLanguage})
                  </div>
                  <pre className="bg-slate-900 text-slate-100 rounded-xl p-4 text-xs sm:text-sm overflow-x-auto leading-relaxed">
                    <code>{activeLesson.codePreview}</code>
                  </pre>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => onNavigate('mentor')}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1.5"
                >
                  <span>Ask AI Coding Mentor about this lesson</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('quiz')}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Take Track Quiz</span>
                </button>
              </div>
            </div>
          )}
        </section>
      ) : (
        <TrackQuizRunner
          courseId={course.id}
          courseTitle={course.title}
          trackLabel={course.accentLabel}
          questions={course.quiz}
          previousBest={previousBest}
          onCompleteQuiz={onRecordQuizScore}
          onBackToLessons={() => setActiveTab('lessons')}
        />
      )}
    </div>
  );
};
