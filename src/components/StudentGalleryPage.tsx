import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  GraduationCap,
  Heart,
  Pencil,
  Plus,
  Search,
  Trash2,
  User,
  Wrench,
} from 'lucide-react';
import { GallerySubmission, TrackSlug } from '../types/platform';
import { ResilientImage } from './ResilientImage';

interface StudentGalleryPageProps {
  submissions: GallerySubmission[];
  likedSubmissionIds: string[];
  currentStudentName: string;
  onToggleLike: (submissionId: string) => void;
  onOpenSubmitModal: () => void;
  onEditSubmission: (submission: GallerySubmission) => void;
  onDeleteSubmission: (submissionId: string) => void;
}

const GALLERY_FILTERS: Array<{ id: 'all' | TrackSlug; label: string }> = [
  { id: 'all', label: 'All Categories' },
  { id: 'robotics', label: 'Robotics' },
  { id: 'scratch', label: 'Scratch' },
  { id: 'python', label: 'Python' },
  { id: 'arduino', label: 'Arduino' },
  { id: 'ai-ml', label: 'AI & ML' },
];

export const StudentGalleryPage: React.FC<StudentGalleryPageProps> = ({
  submissions,
  likedSubmissionIds,
  currentStudentName,
  onToggleLike,
  onOpenSubmitModal,
  onEditSubmission,
  onDeleteSubmission,
}) => {
  const [filter, setFilter] = useState<'all' | TrackSlug>('all');
  const [ownershipFilter, setOwnershipFilter] = useState<'all' | 'mine'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const isOwnedByCurrentStudent = (item: GallerySubmission) =>
    Boolean(item.isOwner) ||
    item.studentName.trim().toLowerCase() === currentStudentName.trim().toLowerCase();

  const mySubmissionsCount = useMemo(
    () => submissions.filter(isOwnedByCurrentStudent).length,
    [submissions, currentStudentName]
  );

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return submissions.filter((s) => {
      if (ownershipFilter === 'mine' && !isOwnedByCurrentStudent(s)) return false;
      if (filter !== 'all' && s.track !== filter) return false;
      if (q) {
        const matchesTitle = s.title.toLowerCase().includes(q);
        const matchesStudent = s.studentName.toLowerCase().includes(q);
        const matchesDesc = s.description.toLowerCase().includes(q);
        const matchesTrack = s.trackLabel.toLowerCase().includes(q);
        const matchesComponents = (s.componentsUsed ?? []).some((c) =>
          c.toLowerCase().includes(q)
        );
        const matchesObjectives = (s.learningObjectives ?? []).some((o) =>
          o.toLowerCase().includes(q)
        );
        if (
          !matchesTitle &&
          !matchesStudent &&
          !matchesDesc &&
          !matchesTrack &&
          !matchesComponents &&
          !matchesObjectives
        ) {
          return false;
        }
      }
      return true;
    });
  }, [submissions, ownershipFilter, filter, searchQuery, currentStudentName]);

  const selectedSubmission = selectedSubmissionId
    ? submissions.find((s) => s.id === selectedSubmissionId) ?? null
    : null;

  // Detail View for a selected student submission
  if (selectedSubmission) {
    const isLiked = likedSubmissionIds.includes(selectedSubmission.id);
    const displayLikes = selectedSubmission.likes + (isLiked ? 1 : 0);
    const isOwner = isOwnedByCurrentStudent(selectedSubmission);
    const objectives = selectedSubmission.learningObjectives ?? [];
    const components = selectedSubmission.componentsUsed ?? [];

    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => {
              setSelectedSubmissionId(null);
              setPendingDeleteId(null);
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Student Project Gallery</span>
          </button>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => onToggleLike(selectedSubmission.id)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-lg border transition-colors tabular-nums ${
                isLiked
                  ? 'bg-rose-50 border-rose-200 text-rose-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
              <span>{displayLikes} Applause</span>
            </button>

            {isOwner && (
              <>
                <button
                  type="button"
                  onClick={() => onEditSubmission(selectedSubmission)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                  <span>Edit Project</span>
                </button>

                {pendingDeleteId === selectedSubmission.id ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        onDeleteSubmission(selectedSubmission.id);
                        setPendingDeleteId(null);
                        setSelectedSubmissionId(null);
                      }}
                      className="px-3.5 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700"
                    >
                      Confirm Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setPendingDeleteId(null)}
                      className="px-3 py-2 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setPendingDeleteId(selectedSubmission.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between gap-5">
              <div className="space-y-3">
                <div className="text-xs font-semibold text-blue-700">
                  {selectedSubmission.trackLabel} · Submitted {selectedSubmission.submittedAt}
                  {isOwner ? ' · Your Submission' : ''}
                </div>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                  {selectedSubmission.title}
                </h1>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>
                    Created by <strong className="text-slate-900">{selectedSubmission.studentName}</strong> (Age{' '}
                    {selectedSubmission.studentAge})
                  </span>
                </div>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed pt-1">
                  {selectedSubmission.description}
                </p>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-100 min-h-[240px] relative">
              <ResilientImage
                src={selectedSubmission.imageUrl}
                alt={selectedSubmission.title}
                className="w-full h-full lg:absolute lg:inset-0 object-cover"
              />
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <section className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              <h2 className="font-display text-lg font-bold text-slate-900">
                Learning Objectives
              </h2>
            </div>
            {objectives.length === 0 ? (
              <p className="text-sm text-slate-500">No learning objectives listed.</p>
            ) : (
              <ul className="space-y-2.5 text-sm text-slate-700 leading-relaxed">
                {objectives.map((obj, idx) => (
                  <li key={obj} className="flex items-start gap-2.5">
                    <span className="font-mono text-xs font-semibold text-blue-600 mt-1 tabular-nums">
                      0{idx + 1}
                    </span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Wrench className="w-5 h-5 text-blue-600" />
              <h2 className="font-display text-lg font-bold text-slate-900">
                Components Used ({components.length})
              </h2>
            </div>
            {components.length === 0 ? (
              <p className="text-sm text-slate-500">No components listed.</p>
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {components.map((comp) => (
                  <li
                    key={comp}
                    className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-800"
                  >
                    {comp}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {selectedSubmission.codeHighlight && (
          <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
            <h2 className="font-display text-lg font-bold text-slate-900">Code Highlight</h2>
            <pre className="bg-slate-900 text-slate-100 rounded-xl p-4 text-xs sm:text-sm overflow-x-auto leading-relaxed">
              <code>{selectedSubmission.codeHighlight}</code>
            </pre>
          </section>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
            Student Project Gallery
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Submit your robotics, Scratch, Python, Arduino, and AI builds or explore projects by fellow students.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenSubmitModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Submit Project</span>
        </button>
      </div>

      {/* Search + Ownership & Category Filters */}
      <section className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit">
            <button
              type="button"
              onClick={() => setOwnershipFilter('all')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap tabular-nums ${
                ownershipFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Projects ({submissions.length})
            </button>
            <button
              type="button"
              onClick={() => setOwnershipFilter('mine')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap tabular-nums ${
                ownershipFilter === 'mine'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              My Submissions ({mySubmissionsCount})
            </button>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, student, or part..."
              aria-label="Search student project gallery"
              className="w-full h-10 pl-9 pr-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit">
          {GALLERY_FILTERS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                filter === tab.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Gallery Cards */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-3">
          <p className="text-sm text-slate-600">
            No student projects match the current search or category filter.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setFilter('all');
                setOwnershipFilter('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
            >
              Reset Filters
            </button>
            <button
              type="button"
              onClick={onOpenSubmitModal}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Submit a Project
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((item) => {
            const isLiked = likedSubmissionIds.includes(item.id);
            const displayLikes = item.likes + (isLiked ? 1 : 0);
            const isOwner = isOwnedByCurrentStudent(item);
            const objectives = item.learningObjectives ?? [];
            const components = item.componentsUsed ?? [];

            return (
              <article
                key={item.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col justify-between hover:border-blue-300 transition-colors"
              >
                <div>
                  <div
                    onClick={() => setSelectedSubmissionId(item.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedSubmissionId(item.id);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    className="aspect-[16/10] bg-slate-100 overflow-hidden cursor-pointer group"
                  >
                    <ResilientImage
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                    />
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                      <span>
                        {item.trackLabel} · {item.studentName} (Age {item.studentAge}) ·{' '}
                        {item.submittedAt}
                      </span>
                      {isOwner && (
                        <span className="font-semibold text-blue-700 whitespace-nowrap">
                          Your Build
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedSubmissionId(item.id)}
                      className="font-display text-lg font-bold text-slate-900 hover:text-blue-700 transition-colors text-left"
                    >
                      {item.title}
                    </button>

                    <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>

                    <div className="text-xs text-slate-500 tabular-nums">
                      {objectives.length} learning objective{objectives.length === 1 ? '' : 's'} ·{' '}
                      {components.length} component{components.length === 1 ? '' : 's'}
                    </div>

                    {item.codeHighlight && (
                      <pre className="bg-slate-900 text-slate-100 rounded-lg p-3 text-xs overflow-x-auto">
                        <code>{item.codeHighlight}</code>
                      </pre>
                    )}
                  </div>
                </div>

                <div className="px-5 py-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedSubmissionId(item.id)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap"
                    >
                      View Details
                    </button>

                    {isOwner && (
                      <>
                        <span className="text-slate-300" aria-hidden="true">
                          |
                        </span>
                        <button
                          type="button"
                          onClick={() => onEditSubmission(item)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-blue-700"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        {pendingDeleteId === item.id ? (
                          <span className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                onDeleteSubmission(item.id);
                                setPendingDeleteId(null);
                              }}
                              className="px-2 py-1 text-[11px] font-semibold text-white bg-red-600 rounded hover:bg-red-700"
                            >
                              Confirm Delete
                            </button>
                            <button
                              type="button"
                              onClick={() => setPendingDeleteId(null)}
                              className="px-2 py-1 text-[11px] font-medium text-slate-600 bg-slate-100 rounded hover:bg-slate-200"
                            >
                              Cancel
                            </button>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setPendingDeleteId(item.id)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        )}
                      </>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleLike(item.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors tabular-nums ${
                      isLiked
                        ? 'bg-rose-50 text-rose-700'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
                    <span>{displayLikes} Applause</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
