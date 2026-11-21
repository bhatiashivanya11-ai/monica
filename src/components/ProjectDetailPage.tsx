import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  Bookmark,
  Check,
  CheckCircle2,
  CheckSquare,
  Copy,
  Cpu,
  GraduationCap,
  MessageSquareCode,
  Square,
  Wrench,
} from 'lucide-react';
import { PageId, ProjectItem } from '../types/platform';
import { ResilientImage } from './ResilientImage';

interface ProjectDetailPageProps {
  project: ProjectItem;
  isBookmarked: boolean;
  isCompleted: boolean;
  checkedMaterials: number[];
  checkedSteps: number[];
  onBack: () => void;
  onToggleBookmark: (projectId: string) => void;
  onToggleComplete: (projectId: string) => void;
  onToggleMaterial: (projectId: string, index: number) => void;
  onToggleStep: (projectId: string, index: number) => void;
  onAskMentor: (page: PageId) => void;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({
  project,
  isBookmarked,
  isCompleted,
  checkedMaterials,
  checkedSteps,
  onBack,
  onToggleBookmark,
  onToggleComplete,
  onToggleMaterial,
  onToggleStep,
  onAskMentor,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(project.starterCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      setCopiedCode(false);
    }
  };

  const materialsGathered = checkedMaterials.length;
  const stepsCompleted = checkedSteps.length;

  return (
    <div className="space-y-8">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Project Library</span>
        </button>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => onToggleBookmark(project.id)}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg border transition-colors whitespace-nowrap ${
              isBookmarked
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-blue-600' : ''}`} />
            <span>{isBookmarked ? 'Bookmarked' : 'Bookmark Project'}</span>
          </button>

          <button
            type="button"
            onClick={() => onToggleComplete(project.id)}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg border transition-colors whitespace-nowrap ${
              isCompleted
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompleted ? 'Completed (+100 XP)' : 'Mark Completed'}</span>
          </button>

          <button
            type="button"
            onClick={() => onAskMentor('mentor')}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            <MessageSquareCode className="w-4 h-4" />
            <span>Ask AI Mentor</span>
          </button>
        </div>
      </div>

      {/* Hero Overview Card */}
      <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between gap-6">
            <div className="space-y-3">
              <div className="text-xs font-semibold text-blue-700">
                {project.category} · {project.difficulty} · {project.duration} · {project.ageRange}
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                {project.title}
              </h1>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {project.summary}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
              <div>
                <div className="text-xs text-slate-500">Difficulty</div>
                <div className="text-sm font-semibold text-slate-900 mt-0.5">
                  {project.difficulty}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Est. Time</div>
                <div className="text-sm font-semibold text-slate-900 mt-0.5 tabular-nums">
                  {project.duration}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Build Progress</div>
                <div className="text-sm font-semibold text-slate-900 mt-0.5 tabular-nums">
                  {stepsCompleted} / {project.steps.length} steps
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-100 min-h-[240px] relative">
            <ResilientImage
              src={project.imageUrl}
              alt={project.imageAlt}
              className="w-full h-full lg:absolute lg:inset-0 object-cover"
            />
          </div>
        </div>
      </section>

      {/* Learning Objectives & Components Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            <h2 className="font-display text-lg font-bold text-slate-900">
              Learning Objectives
            </h2>
          </div>
          <ul className="space-y-3 text-sm text-slate-700 leading-relaxed">
            {project.learningObjectives.map((obj, idx) => (
              <li key={obj} className="flex items-start gap-2.5">
                <span className="font-mono text-xs font-semibold text-blue-600 mt-1 tabular-nums">
                  0{idx + 1}
                </span>
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Wrench className="w-5 h-5 text-blue-600" />
              <h2 className="font-display text-lg font-bold text-slate-900">
                Components Required Checklist
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-600 tabular-nums">
              {materialsGathered} / {project.materials.length} gathered
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {project.materials.map((item, idx) => {
              const checked = checkedMaterials.includes(idx);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => onToggleMaterial(project.id, idx)}
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

      {/* Circuit Connections Table (when applicable) */}
      {project.circuitConnections.length > 0 && (
        <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-600" />
            <h2 className="font-display text-lg font-bold text-slate-900">
              Circuit Connection Instructions
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs text-slate-500">
                  <th className="py-2.5 pr-4 font-semibold">Module / Part</th>
                  <th className="py-2.5 px-4 font-semibold">Module Pin</th>
                  <th className="py-2.5 px-4 font-semibold">Controller Pin</th>
                  <th className="py-2.5 pl-4 font-semibold">Wiring Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {project.circuitConnections.map((conn) => (
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
                    <td className="py-3 pl-4 text-xs sm:text-sm text-slate-600">
                      {conn.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Step-by-Step Instructions */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-bold text-slate-900">
              Step-by-Step Build Instructions
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any step as you finish it on your workbench to track progress.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-600 tabular-nums">
            {stepsCompleted} of {project.steps.length} done
          </span>
        </div>

        <div className="space-y-3">
          {project.steps.map((step, idx) => {
            const done = checkedSteps.includes(idx);
            return (
              <button
                key={step}
                type="button"
                onClick={() => onToggleStep(project.id, idx)}
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

      {/* Sample Code & Troubleshooting Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-lg font-bold text-slate-900">
              Sample Code ({project.codeLanguage})
            </h2>
            <button
              type="button"
              onClick={handleCopyCode}
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
            <code>{project.starterCode}</code>
          </pre>
        </section>

        <section className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h2 className="font-display text-lg font-bold text-slate-900">
              Troubleshooting Tips
            </h2>
          </div>

          <div className="divide-y divide-slate-100">
            {project.troubleshootingTips.map((tip) => (
              <div key={tip.issue} className="py-3.5 first:pt-0 last:pb-0 space-y-1.5">
                <div className="text-sm font-semibold text-slate-900">{tip.issue}</div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {tip.solution}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
