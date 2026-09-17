import React from 'react';
import { UserRole } from '../types';
import { 
  Building2, 
  Truck, 
  BookOpen, 
  Search, 
  HelpCircle,
  HardHat,
  TrendingUp
} from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenManualModal: (manualId?: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  setCurrentRole,
  activeTab,
  setActiveTab,
  onOpenManualModal,
  searchTerm,
  setSearchTerm
}) => {
  const isWorkspace = activeTab !== 'manual-hub' && activeTab !== 'analytics-dashboard';

  const globalLinks: { id: string; label: string; onClick: () => void; active: boolean }[] = [
    {
      id: 'nav-site',
      label: '현장 관리자',
      onClick: () => {
        setCurrentRole('SITE_MANAGER');
        setActiveTab('site-dashboard');
      },
      active: isWorkspace && currentRole === 'SITE_MANAGER'
    },
    {
      id: 'nav-supplier',
      label: '공급업체',
      onClick: () => {
        setCurrentRole('SUPPLIER');
        setActiveTab('supplier-dashboard');
      },
      active: isWorkspace && currentRole === 'SUPPLIER'
    },
    {
      id: 'nav-analytics',
      label: '효율성 차트',
      onClick: () => setActiveTab('analytics-dashboard'),
      active: activeTab === 'analytics-dashboard'
    },
    {
      id: 'nav-manual',
      label: '한글 매뉴얼',
      onClick: () => setActiveTab('manual-hub'),
      active: activeTab === 'manual-hub'
    },
    {
      id: 'nav-guide',
      label: '빠른 가이드',
      onClick: () => onOpenManualModal('man-01'),
      active: false
    }
  ];

  return (
    <header className="sticky top-0 z-30">
      {/* Global Nav Bar — #1d1d1f, 12px links, hairline bottom */}
      <nav className="bg-carbon text-frost border-b border-smoke">
        <div className="max-w-[1024px] mx-auto px-6 h-11 flex items-center justify-between gap-6">
          <button
            onClick={() => {
              setCurrentRole('SITE_MANAGER');
              setActiveTab('site-dashboard');
            }}
            className="flex items-center gap-2 text-frost cursor-pointer shrink-0"
            aria-label="CPMS 홈"
          >
            <Building2 className="w-4 h-4" />
            <span className="text-caption font-semibold tracking-tight">CPMS</span>
          </button>

          <ul className="hidden md:flex items-center gap-8">
            {globalLinks.map((l) => (
              <li key={l.id}>
                <button
                  onClick={l.onClick}
                  className={`text-caption font-normal transition-opacity cursor-pointer ${
                    l.active ? 'text-frost opacity-100' : 'text-frost opacity-80 hover:opacity-100'
                  }`}
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-5 shrink-0">
            <button
              onClick={() => setActiveTab('manual-hub')}
              className="text-frost opacity-80 hover:opacity-100 cursor-pointer"
              aria-label="검색"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={() => onOpenManualModal('man-01')}
              className="text-frost opacity-80 hover:opacity-100 cursor-pointer"
              aria-label="도움말"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Sticky Mini-Nav — white, product name 21px/600, action links 14px, hairline bottom */}
      <div className="bg-white/90 backdrop-blur-md border-b hairline">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 h-[56px] flex items-center justify-between gap-6">
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="font-display text-subheading font-semibold text-carbon truncate">
              건설 자재 조달 관리 시스템
            </span>
            <span className="text-variant text-body-sm hidden sm:inline">v2.4</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Search — 8px radius, hairline, frost fill */}
            <div className="hidden lg:block relative w-72">
              <Search className="w-4 h-4 text-mist absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="발주번호, 현장명, 자재명, 매뉴얼 검색"
                className="w-full bg-frost text-carbon text-body-sm pl-9 pr-3 py-[7px] rounded-[8px] border hairline focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-transparent transition"
              />
            </div>

            {/* Role switcher — pebble segmented track, Apple Blue selected */}
            <div className="flex items-center p-0.5 rounded-full bg-pebble">
              <button
                id="btn-role-site-manager"
                onClick={() => {
                  setCurrentRole('SITE_MANAGER');
                  setActiveTab('site-dashboard');
                }}
                className={`px-3.5 py-1.5 text-body-sm rounded-full flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isWorkspace && currentRole === 'SITE_MANAGER'
                    ? 'bg-apple-blue text-ice'
                    : 'text-carbon hover:text-onyx'
                }`}
              >
                <HardHat className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">현장 관리자</span>
              </button>
              <button
                id="btn-role-supplier"
                onClick={() => {
                  setCurrentRole('SUPPLIER');
                  setActiveTab('supplier-dashboard');
                }}
                className={`px-3.5 py-1.5 text-body-sm rounded-full flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isWorkspace && currentRole === 'SUPPLIER'
                    ? 'bg-apple-blue text-ice'
                    : 'text-carbon hover:text-onyx'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">공급업체</span>
              </button>
            </div>

            {/* Action links — 14px, link blue, underline on hover */}
            <button
              id="btn-analytics-dashboard"
              onClick={() => setActiveTab('analytics-dashboard')}
              className={`text-body-sm flex items-center gap-1 cursor-pointer ${
                activeTab === 'analytics-dashboard' ? 'text-carbon' : 'link'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">효율성 차트</span>
            </button>
            <button
              id="btn-manual-hub"
              onClick={() => setActiveTab('manual-hub')}
              className={`text-body-sm flex items-center gap-1 cursor-pointer ${
                activeTab === 'manual-hub' ? 'text-carbon' : 'link'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">한글 매뉴얼</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
