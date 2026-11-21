import React, { useMemo, useState } from 'react';
import { Bookmark, Search } from 'lucide-react';
import { PROJECTS } from '../data/roboLearnData';
import { Difficulty, ProjectCategory } from '../types/platform';
import { ResilientImage } from './ResilientImage';

interface ProjectLibraryPageProps {
  bookmarkedProjectIds: string[];
  onOpenProject: (projectId: string) => void;
  onToggleBookmark: (projectId: string) => void;
}

const CATEGORY_FILTERS: Array<{ id: 'all' | ProjectCategory; label: string }> = [
  { id: 'all', label: 'All Categories' },
  { id: 'Autonomous Rovers', label: 'Autonomous Rovers' },
  { id: 'Smart Automation', label: 'Smart Automation' },
  { id: 'Robotic Actuators', label: 'Robotic Actuators' },
  { id: 'Wireless & Voice', label: 'Wireless & Voice' },
  { id: 'Coding & AI', label: 'Coding & AI' },
];

export const ProjectLibraryPage: React.FC<ProjectLibraryPageProps> = ({
  bookmarkedProjectIds,
  onOpenProject,
  onToggleBookmark,
}) => {
  const [viewMode, setViewMode] = useState<'all' | 'bookmarked'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | ProjectCategory>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | Difficulty>('all');
  const [localSearch, setLocalSearch] = useState('');

  const filteredProjects = useMemo(() => {
    const q = localSearch.trim().toLowerCase();
    return PROJECTS.filter((project) => {
      if (viewMode === 'bookmarked' && !bookmarkedProjectIds.includes(project.id)) return false;
      if (categoryFilter !== 'all' && project.category !== categoryFilter) return false;
      if (difficultyFilter !== 'all' && project.difficulty !== difficultyFilter) return false;
      if (
        q &&
        !project.title.toLowerCase().includes(q) &&
        !project.summary.toLowerCase().includes(q) &&
        !project.category.toLowerCase().includes(q) &&
        !project.materials.some((m) => m.toLowerCase().includes(q))
      ) {
        return false;
      }
      return true;
    });
  }, [viewMode, categoryFilter, difficultyFilter, localSearch, bookmarkedProjectIds]);

  const savedCount = PROJECTS.filter((p) => bookmarkedProjectIds.includes(p.id)).length;

  return (
    <div className="space-y-6">
      {/* Header + Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
            Robotics Project Library
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Step-by-step robotics, electronics, and coding builds with wiring guides, code, and
            parts checklists.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search projects by name..."
            aria-label="Search projects by name"
            className="w-full h-10 pl-9 pr-3 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none"
          />
        </div>
      </div>

      {/* View Switcher (All Projects vs Bookmarked Projects) + Category & Difficulty Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Separate Bookmarked View Toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => setViewMode('all')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                viewMode === 'all'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Projects ({PROJECTS.length})
            </button>
            <button
              type="button"
              onClick={() => setViewMode('bookmarked')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                viewMode === 'bookmarked'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${viewMode === 'bookmarked' ? 'fill-blue-600' : ''}`} />
              <span>Bookmarked ({savedCount})</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="difficulty-filter" className="text-xs font-medium text-slate-500">
              Difficulty:
            </label>
            <select
              id="difficulty-filter"
              aria-label="Filter projects by difficulty"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value as 'all' | Difficulty)}
              className="h-9 px-3 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:border-blue-600 focus:outline-none"
            >
              <option value="all">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit">
          {CATEGORY_FILTERS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCategoryFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                categoryFilter === tab.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Grid */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-3">
          <p className="text-sm text-slate-600">
            {viewMode === 'bookmarked' && savedCount === 0
              ? 'You have no bookmarked projects yet. Click Bookmark on any build to save it here.'
              : 'No projects match the current search, category, or difficulty filter.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setViewMode('all');
              setCategoryFilter('all');
              setDifficultyFilter('all');
              setLocalSearch('');
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Show All Projects
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredProjects.map((project) => {
            const isSaved = bookmarkedProjectIds.includes(project.id);
            return (
              <div
                key={project.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col justify-between hover:border-blue-300 transition-colors"
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
                      {project.category} · {project.difficulty} · {project.duration}
                    </div>
                    <h2 className="font-display text-lg font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {project.title}
                    </h2>
                    <p className="text-sm text-slate-600 line-clamp-2">{project.summary}</p>
                  </div>
                </div>

                <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenProject(project.id)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap"
                  >
                    Open Project Guide
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleBookmark(project.id)}
                    aria-label={isSaved ? `Remove bookmark for ${project.title}` : `Bookmark ${project.title}`}
                    className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                      isSaved
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-blue-600' : ''}`} />
                    <span>{isSaved ? 'Bookmarked' : 'Bookmark'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
