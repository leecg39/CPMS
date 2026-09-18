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
      {/* Promo Banner — obsidian, 12px, inline blue link */}
      <div className="bg-obsidian text-frost-white text-caption text-center py-[5px] px-4">
        <span>한글 매뉴얼 패치 완료 · 발주·견적·출하·검수·송장·결제 전 공정 표준 SOP 적용.</span>{' '}
        <button
          onClick={() => onOpenManualModal('man-01')}
          className="text-halo-blue hover:underline cursor-pointer"
        >
          자세히 보기 ›
        </button>
      </div>

      {/* Top Navigation Bar — pure black pill, 12px frost links, blur on scroll */}
      <nav className="bg-pure-black/80 backdrop-blur-xl">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
          <div className="h-12 flex items-center justify-between gap-6">
            <button
              onClick={() => {
                setCurrentRole('SITE_MANAGER');
                setActiveTab('site-dashboard');
              }}
              className="flex items-center gap-2 text-frost-white cursor-pointer shrink-0"
              aria-label="CPMS 홈"
            >
              <Building2 className="w-4 h-4" strokeWidth={1.75} />
              <span className="text-caption font-semibold">CPMS</span>
            </button>

            <ul className="hidden md:flex items-center gap-8 lg:gap-10">
              {globalLinks.map((l) => (
                <li key={l.id}>
                  <button
                    onClick={l.onClick}
                    className={`text-caption transition-opacity cursor-pointer ${
                      l.active ? 'text-frost-white' : 'text-frost-white/80 hover:text-frost-white'
                    }`}
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3 shrink-0">
              {/* Search — graphite pill */}
              <div className="hidden lg:block relative w-60">
                <Search className="w-3.5 h-3.5 text-platinum absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="검색"
                  className="w-full bg-graphite text-frost-white text-caption pl-8 pr-3 py-[6px] rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-apple-blue placeholder:text-platinum [color-scheme:dark]"
                />
              </div>

              {/* Role switcher — 980px pill chips, frost selected (blue reserved for the CTA) */}
              <div className="flex items-center p-0.5 rounded-full bg-graphite">
                <button
                  id="btn-role-site-manager"
                  onClick={() => {
                    setCurrentRole('SITE_MANAGER');
                    setActiveTab('site-dashboard');
                  }}
                  className={`px-3 py-1 text-caption rounded-full flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isWorkspace && currentRole === 'SITE_MANAGER'
                      ? 'bg-frost-white text-obsidian font-semibold'
                      : 'text-frost-white/80 hover:text-frost-white'
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
                  className={`px-3 py-1 text-caption rounded-full flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isWorkspace && currentRole === 'SUPPLIER'
                      ? 'bg-frost-white text-obsidian font-semibold'
                      : 'text-frost-white/80 hover:text-frost-white'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">공급업체</span>
                </button>
              </div>

              <button
                id="btn-analytics-dashboard"
                onClick={() => setActiveTab('analytics-dashboard')}
                className={`p-1.5 rounded-full cursor-pointer transition-colors ${
                  activeTab === 'analytics-dashboard' ? 'text-frost-white bg-graphite' : 'text-frost-white/80 hover:text-frost-white'
                }`}
                aria-label="효율성 차트"
                title="효율성 차트"
              >
                <TrendingUp className="w-4 h-4" strokeWidth={1.75} />
              </button>
              <button
                id="btn-manual-hub"
                onClick={() => setActiveTab('manual-hub')}
                className={`p-1.5 rounded-full cursor-pointer transition-colors ${
                  activeTab === 'manual-hub' ? 'text-frost-white bg-graphite' : 'text-frost-white/80 hover:text-frost-white'
                }`}
                aria-label="한글 매뉴얼"
                title="한글 매뉴얼"
              >
                <BookOpen className="w-4 h-4" strokeWidth={1.75} />
              </button>
              <button
                onClick={() => onOpenManualModal('man-01')}
                className="p-1.5 rounded-full text-frost-white/80 hover:text-frost-white cursor-pointer"
                aria-label="도움말"
                title="빠른 가이드"
              >
                <HelpCircle className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </div>
        <div className="h-px bg-smoke/60" />
      </nav>
    </header>
  );
};
