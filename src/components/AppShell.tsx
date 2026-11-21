import React, { useMemo, useState } from 'react';
import {
  Bot,
  Blocks,
  BookOpen,
  Code2,
  Compass,
  Cpu,
  FolderKanban,
  Home,
  LayoutDashboard,
  Menu,
  MessageSquareCode,
  Plus,
  Search,
  Sparkles,
  Trophy,
  User,
  Users,
  X,
} from 'lucide-react';
import { ARDUINO_PROJECTS } from '../data/arduinoProjectsData';
import { CODING_CHALLENGES, COURSES, NAV_ITEMS, PROJECTS } from '../data/roboLearnData';
import { PageId, StudentProfile } from '../types/platform';
import { ResilientImage } from './ResilientImage';

interface AppShellProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  onOpenProject: (projectId: string) => void;
  onOpenArduinoProject: (projectId: string) => void;
  onOpenChallenge: (challengeId: string) => void;
  onOpenSubmitModal: () => void;
  profile: StudentProfile;
  totalXp: number;
  children: React.ReactNode;
}

const PAGE_ICONS: Record<PageId, React.ComponentType<{ className?: string }>> = {
  home: Home,
  dashboard: LayoutDashboard,
  robotics: Bot,
  scratch: Blocks,
  python: Code2,
  arduino: Cpu,
  'ai-ml': Sparkles,
  projects: FolderKanban,
  challenges: Trophy,
  mentor: MessageSquareCode,
  gallery: Users,
  profile: User,
};

export const AppShell: React.FC<AppShellProps> = ({
  activePage,
  onNavigate,
  onOpenProject,
  onOpenArduinoProject,
  onOpenChallenge,
  onOpenSubmitModal,
  profile,
  totalXp,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const activeNav = NAV_ITEMS.find((item) => item.id === activePage);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    const courseHits = COURSES.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.subtitle.toLowerCase().includes(q) ||
        c.track.toLowerCase().includes(q)
    ).map((c) => ({
      id: c.id,
      title: c.title,
      kind: 'Course',
      meta: c.accentLabel,
      action: () => onNavigate(c.pageId),
    }));

    const projectHits = PROJECTS.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.trackLabel.toLowerCase().includes(q)
    ).map((p) => ({
      id: p.id,
      title: p.title,
      kind: 'Project',
      meta: `${p.trackLabel} · ${p.difficulty}`,
      action: () => onOpenProject(p.id),
    }));

    const challengeHits = CODING_CHALLENGES.filter(
      (ch) =>
        ch.title.toLowerCase().includes(q) ||
        ch.prompt.toLowerCase().includes(q) ||
        ch.trackLabel.toLowerCase().includes(q)
    ).map((ch) => ({
      id: ch.id,
      title: ch.title,
      kind: 'Challenge',
      meta: `${ch.trackLabel} · ${ch.xpReward} XP`,
      action: () => onOpenChallenge(ch.id),
    }));

    const arduinoHits = ARDUINO_PROJECTS.filter(
      (ap) =>
        ap.title.toLowerCase().includes(q) ||
        ap.summary.toLowerCase().includes(q) ||
        ap.category.toLowerCase().includes(q)
    ).map((ap) => ({
      id: ap.id,
      title: ap.title,
      kind: 'Arduino Project',
      meta: `${ap.category} · ${ap.difficulty}`,
      action: () => onOpenArduinoProject(ap.id),
    }));

    return [...courseHits, ...arduinoHits, ...projectHits, ...challengeHits].slice(0, 8);
  }, [searchQuery, onNavigate, onOpenProject, onOpenArduinoProject, onOpenChallenge]);

  const handleNavClick = (page: PageId) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  const groups: Array<'Overview' | 'Learning Tracks' | 'Studio & Community'> = [
    'Overview',
    'Learning Tracks',
    'Studio & Community',
  ];

  const TOP_NAV_IDS: PageId[] = ['home', 'dashboard', 'projects', 'mentor'];
  const topNavItems = NAV_ITEMS.filter((item) => TOP_NAV_IDS.includes(item.id));

  const renderSidebarLinks = () => (
    <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
      {groups.map((group) => (
        <div key={group}>
          <div className="px-3 mb-2 text-xs font-semibold text-slate-400 tracking-wide">
            {group}
          </div>
          <nav className="space-y-1" aria-label={group}>
            {NAV_ITEMS.filter((item) => item.group === group).map((item) => {
              const Icon = PAGE_ICONS[item.id];
              const isActive = activePage === item.id;
              return (
                <a
                  key={item.id}
                  href={item.path}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.id);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left focus-visible:outline-2 focus-visible:outline-blue-600 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 font-medium hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-blue-600' : 'text-slate-400'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </a>
              );
            })}
          </nav>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-slate-200 z-30">
        <div className="h-16 flex items-center gap-2.5 px-6 border-b border-slate-200 shrink-0">
          <Compass className="w-6 h-6 text-blue-600 shrink-0" />
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('home');
            }}
            className="font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-blue-600"
          >
            RoboLearn Hub
          </a>
        </div>

        {renderSidebarLinks()}

        <div className="p-4 border-t border-slate-200 shrink-0">
          <a
            href="/profile"
            aria-current={activePage === 'profile' ? 'page' : undefined}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('profile');
            }}
            className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors text-left focus-visible:outline-2 focus-visible:outline-blue-600 ${
              activePage === 'profile'
                ? 'bg-blue-50 text-blue-700'
                : 'hover:bg-slate-50'
            }`}
          >
            <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
              <ResilientImage
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div
                className={`text-sm font-semibold truncate ${
                  activePage === 'profile' ? 'text-blue-700' : 'text-slate-900'
                }`}
              >
                {profile.name}
              </div>
              <div className="text-xs text-slate-500 tabular-nums truncate">
                {profile.grade} · {totalXp} XP
              </div>
            </div>
          </a>
        </div>
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Slide-Over Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-72 bg-white border-r border-slate-200 z-50 flex flex-col transition-transform duration-200 lg:hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Mobile Navigation"
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2.5">
            <Compass className="w-5 h-5 text-blue-600" />
            <span className="font-display text-lg font-bold text-slate-900 whitespace-nowrap">
              RoboLearn Hub
            </span>
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {renderSidebarLinks()}
      </aside>

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Top Header Bar (Clean 3-zone structure) */}
        <header className="sticky top-0 z-20 h-16 bg-white/95 backdrop-blur border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 sm:gap-6">
          {/* Zone 1: Menu toggle (mobile) + Page Context + Top Nav Quick Links */}
          <div className="flex items-center gap-4 min-w-0 shrink-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('home');
              }}
              className="lg:hidden font-display text-base font-bold text-slate-900 whitespace-nowrap"
            >
              RoboLearn Hub
            </a>
            <div className="hidden lg:flex items-center gap-2 text-sm text-slate-500 whitespace-nowrap">
              <BookOpen className="w-4 h-4 text-slate-400" />
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('home');
                }}
                className="hover:text-slate-900 transition-colors"
              >
                Workspace
              </a>
              <span aria-hidden="true">/</span>
              <span className="font-semibold text-slate-900">
                {activeNav?.pageTitle ?? 'Home'}
              </span>
            </div>

            <nav className="hidden xl:flex items-center gap-1 pl-2 border-l border-slate-200" aria-label="Top navigation">
              {topNavItems.map((item) => {
                const isActive = activePage === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.path}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.id);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-blue-600 ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-slate-600 font-medium hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>
          </div>

          {/* Zone 2: Live Global Search */}
          <div className="relative flex-1 max-w-xs sm:max-w-sm">
            <label htmlFor="global-search" className="sr-only">
              Search courses, projects, and challenges
            </label>
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="global-search"
              type="search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchFocused(true);
              }}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 180)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setSearchFocused(false);
                }
              }}
              placeholder="Search robotics, Scratch, Python, Arduino..."
              className="w-full h-10 pl-9 pr-3 text-sm bg-slate-100 border border-transparent rounded-lg text-slate-900 placeholder:text-slate-500 focus:bg-white focus:border-blue-600 focus:outline-none transition-colors"
            />

            {searchFocused && searchQuery.trim().length > 0 && (
              <div className="absolute left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 sm:right-0 w-[min(92vw,24rem)] sm:w-auto mt-2 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-50">
                {searchResults.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-slate-500">
                    No matching courses, projects, or challenges found for "{searchQuery}".
                  </div>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {searchResults.map((hit) => (
                      <li key={`${hit.kind}-${hit.id}`}>
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            hit.action();
                            setSearchQuery('');
                            setSearchFocused(false);
                          }}
                          className="w-full px-4 py-2.5 text-left hover:bg-slate-50 flex items-center justify-between gap-3 transition-colors"
                        >
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-slate-900 truncate">
                              {hit.title}
                            </div>
                            <div className="text-xs text-slate-500 truncate">
                              {hit.kind} · {hit.meta}
                            </div>
                          </div>
                          <span className="text-xs font-medium text-blue-600 whitespace-nowrap shrink-0">
                            Open
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Zone 3: Single Primary Action */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={onOpenSubmitModal}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Submit Project</span>
              <span className="sm:hidden">Submit</span>
            </button>
          </div>
        </header>

        {/* Main Scrollable Page Viewport */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </main>

        {/* Quiet Footer */}
        <footer className="border-t border-slate-200 bg-white px-4 sm:px-6 lg:px-8 py-5">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500">
            <span>RoboLearn Hub · Interactive STEM Learning Studio for Ages 8–16</span>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              {(['projects', 'mentor', 'gallery', 'profile'] as PageId[]).map((footerPageId) => {
                const navItem = NAV_ITEMS.find((item) => item.id === footerPageId);
                if (!navItem) return null;
                const isActive = activePage === navItem.id;
                return (
                  <a
                    key={navItem.id}
                    href={navItem.path}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(navItem.id);
                    }}
                    className={`transition-colors whitespace-nowrap ${
                      isActive ? 'text-blue-700 font-semibold' : 'hover:text-slate-900'
                    }`}
                  >
                    {navItem.pageTitle}
                  </a>
                );
              })}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
