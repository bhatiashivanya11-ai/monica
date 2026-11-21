import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  RotateCcw,
  Trophy,
  XCircle,
} from 'lucide-react';
import { QuizQuestion, QuizScoreRecord } from '../types/platform';

interface TrackQuizRunnerProps {
  courseId: string;
  courseTitle: string;
  trackLabel: string;
  questions: QuizQuestion[];
  previousBest?: QuizScoreRecord;
  onCompleteQuiz: (
    courseId: string,
    courseTitle: string,
    score: number,
    total: number,
    pointsEarned: number
  ) => void;
  onBackToLessons: () => void;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export const TrackQuizRunner: React.FC<TrackQuizRunnerProps> = ({
  courseId,
  courseTitle,
  trackLabel,
  questions,
  previousBest,
  onCompleteQuiz,
  onBackToLessons,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submittedCurrent, setSubmittedCurrent] = useState(false);
  const [answersByQuestionId, setAnswersByQuestionId] = useState<Record<string, number>>({});
  const [completed, setCompleted] = useState(false);

  // Reset quiz runner cleanly when switching between learning tracks
  useEffect(() => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setSubmittedCurrent(false);
    setAnswersByQuestionId({});
    setCompleted(false);
  }, [courseId]);

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];

  const runningScore = questions.reduce((acc, q) => {
    const picked = answersByQuestionId[q.id];
    return acc + (picked === q.correctIndex ? 1 : 0);
  }, 0);

  const handleSubmitAnswer = () => {
    if (selectedOption === null || submittedCurrent || !currentQuestion) return;
    setAnswersByQuestionId((prev) => ({
      ...prev,
      [currentQuestion.id]: selectedOption,
    }));
    setSubmittedCurrent(true);
  };

  const handleNextQuestion = () => {
    if (!submittedCurrent) return;
    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setSubmittedCurrent(false);
    } else {
      const finalScore = questions.reduce((acc, q) => {
        return acc + (answersByQuestionId[q.id] === q.correctIndex ? 1 : 0);
      }, 0);
      const pointsEarned = finalScore * 25 + (finalScore >= Math.ceil(totalQuestions * 0.8) ? 50 : 0);
      setCompleted(true);
      onCompleteQuiz(courseId, courseTitle, finalScore, totalQuestions, pointsEarned);
    }
  };

  const handleRetake = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setSubmittedCurrent(false);
    setAnswersByQuestionId({});
    setCompleted(false);
  };

  if (!currentQuestion) return null;

  // Results Screen
  if (completed) {
    const finalPct = Math.round((runningScore / totalQuestions) * 100);
    const pointsEarned =
      runningScore * 25 + (runningScore >= Math.ceil(totalQuestions * 0.8) ? 50 : 0);

    return (
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-8">
        {/* Summary Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-blue-700">
              {trackLabel} · Quiz Complete
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
              You scored {runningScore} out of {totalQuestions} ({finalPct}%)
            </h2>
            <p className="text-sm text-slate-600">
              {finalPct >= 80
                ? 'Excellent mastery! You earned the 80%+ bonus and saved your score to your Dashboard.'
                : 'Good effort! Review the explanations below and retake anytime to boost your score.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-right">
              <div className="text-xs text-blue-700 font-medium">Points Earned</div>
              <div className="text-xl font-bold text-blue-900 tabular-nums">
                +{pointsEarned} XP
              </div>
            </div>
            <button
              type="button"
              onClick={handleRetake}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Quiz</span>
            </button>
            <button
              type="button"
              onClick={onBackToLessons}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap"
            >
              <BookOpen className="w-4 h-4" />
              <span>Back to Lessons</span>
            </button>
          </div>
        </div>

        {/* Full Answer Review & Explanations */}
        <div className="space-y-4">
          <h3 className="font-display text-lg font-bold text-slate-900">
            Answer Review &amp; Explanations
          </h3>

          <div className="space-y-3">
            {questions.map((q, idx) => {
              const studentPick = answersByQuestionId[q.id];
              const isCorrect = studentPick === q.correctIndex;
              return (
                <div
                  key={q.id}
                  className={`rounded-xl border p-4 sm:p-5 space-y-2.5 ${
                    isCorrect
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-red-50/40 border-red-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-sm font-semibold text-slate-900">
                      <span className="tabular-nums mr-1.5">{idx + 1}.</span>
                      {q.question}
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold whitespace-nowrap shrink-0 ${
                        isCorrect ? 'text-emerald-700' : 'text-red-700'
                      }`}
                    >
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Correct</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" />
                          <span>Incorrect</span>
                        </>
                      )}
                    </span>
                  </div>

                  <div className="text-xs space-y-1 text-slate-700">
                    <div>
                      <span className="font-semibold">Your answer: </span>
                      <span>
                        {studentPick !== undefined ? q.options[studentPick] : 'No answer'}
                      </span>
                    </div>
                    {!isCorrect && (
                      <div>
                        <span className="font-semibold text-emerald-800">Correct answer: </span>
                        <span className="text-emerald-900 font-medium">
                          {q.options[q.correctIndex]}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-slate-600 bg-white/90 border border-slate-200 rounded-lg p-3">
                    <span className="font-semibold text-slate-900">Explanation: </span>
                    {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // Active Question View
  const progressPercent = Math.round(
    ((currentIndex + (submittedCurrent ? 1 : 0)) / totalQuestions) * 100
  );
  const isCurrentCorrect =
    submittedCurrent && selectedOption === currentQuestion.correctIndex;

  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
      {/* Header & Progress Bar */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold text-blue-700">
              {trackLabel} Quiz
              {previousBest
                ? ` · Best Recorded: ${previousBest.score}/${previousBest.total}`
                : ''}
            </div>
            <h2 className="font-display text-xl font-bold text-slate-900 mt-0.5 tabular-nums">
              Question {currentIndex + 1} of {totalQuestions}
            </h2>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-700 tabular-nums">
            <span className="inline-flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-600" />
              <span>
                Score: {runningScore} / {currentIndex + (submittedCurrent ? 1 : 0)}
              </span>
            </span>
            <span className="text-slate-500">{progressPercent}% complete</span>
          </div>
        </div>

        <div
          className="h-2 w-full bg-slate-100 rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-200"
            style={{ width: `${Math.max(5, progressPercent)}%` }}
          />
        </div>
      </div>

      {/* Question Prompt */}
      <div className="pt-2 space-y-4">
        <h3 className="font-display text-lg sm:text-xl font-semibold text-slate-900 leading-snug">
          {currentQuestion.question}
        </h3>

        {/* Four Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Answer options">
          {currentQuestion.options.map((option, optIdx) => {
            const isSelected = selectedOption === optIdx;
            const isCorrectOpt = optIdx === currentQuestion.correctIndex;

            let cardStyle =
              'border-slate-200 bg-white text-slate-800 hover:border-blue-300 hover:bg-slate-50';
            if (!submittedCurrent && isSelected) {
              cardStyle = 'border-blue-600 bg-blue-50 text-blue-950 font-medium';
            } else if (submittedCurrent && isCorrectOpt) {
              cardStyle = 'border-emerald-600 bg-emerald-50 text-emerald-950 font-medium';
            } else if (submittedCurrent && isSelected && !isCorrectOpt) {
              cardStyle = 'border-red-500 bg-red-50 text-red-950';
            }

            return (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={isSelected}
                disabled={submittedCurrent}
                onClick={() => setSelectedOption(optIdx)}
                className={`p-4 rounded-xl border text-left text-sm transition-colors flex items-start gap-3 ${cardStyle}`}
              >
                <span
                  className={`w-6 h-6 rounded-md text-xs font-bold flex items-center justify-center shrink-0 ${
                    !submittedCurrent && isSelected
                      ? 'bg-blue-600 text-white'
                      : submittedCurrent && isCorrectOpt
                      ? 'bg-emerald-600 text-white'
                      : submittedCurrent && isSelected && !isCorrectOpt
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {OPTION_LETTERS[optIdx]}
                </span>
                <span className="leading-snug pt-0.5">{option}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Immediate Feedback + Explanation after submission */}
      {submittedCurrent && (
        <div
          className={`rounded-xl border p-4 space-y-1.5 ${
            isCurrentCorrect
              ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
              : 'bg-red-50 border-red-200 text-red-950'
          }`}
        >
          <div className="flex items-center gap-2 text-sm font-bold">
            {isCurrentCorrect ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Correct!</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-red-700" />
                <span>
                  Incorrect — Correct Answer: {OPTION_LETTERS[currentQuestion.correctIndex]}.{' '}
                  {currentQuestion.options[currentQuestion.correctIndex]}
                </span>
              </>
            )}
          </div>
          <p className="text-xs sm:text-sm leading-relaxed opacity-90">
            {currentQuestion.explanation}
          </p>
        </div>
      )}

      {/* Action Footer */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
        <span className="text-xs text-slate-500">
          {submittedCurrent
            ? 'Review the explanation, then continue.'
            : 'Select one option and submit your answer.'}
        </span>

        {!submittedCurrent ? (
          <button
            type="button"
            disabled={selectedOption === null}
            onClick={handleSubmitAnswer}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Submit Answer
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNextQuestion}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span>
              {currentIndex + 1 < totalQuestions ? 'Next Question' : 'See Final Results'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </section>
  );
};
