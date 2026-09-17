import React from 'react';
import { UserRole } from '../types';
import { 
  Building2, 
  Truck, 
  BookOpen, 
  Search, 
  HelpCircle,
  FileCheck,
  CheckCircle2,
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
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Top Banner Notice: Korean Manual Patch Status */}
      <div className="bg-slate-900 text-slate-200 px-4 py-1.5 text-xs font-medium flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            한글 매뉴얼 패치 완료
          </span>
          <span className="hidden sm:inline text-slate-300">
            건설 조달 시스템 전 공정(발주·견적·출하·검수·송장·결제) 한국어 표준 업무 매뉴얼 및 API 가이드 적용 완료
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenManualModal('man-01')}
            className="text-amber-300 hover:text-amber-200 font-medium flex items-center gap-1 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>시스템 빠른 가이드</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & System Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-base sm:text-lg tracking-tight">
                  건설 자재 조달 관리 시스템
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-semibold uppercase">
                  CPMS v2.4
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                현장 관리자 ↔ 협력 공급업체 전 공정 원스톱 조달 플랫폼
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex items-center flex-1 max-w-xs mx-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="발주번호, 현장명, 자재명, 매뉴얼 검색..."
                className="w-full bg-slate-100 hover:bg-slate-50 focus:bg-white text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Role & Mode Switcher Buttons */}
          <div className="flex items-center gap-2">
            <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
              <button
                id="btn-role-site-manager"
                onClick={() => {
                  setCurrentRole('SITE_MANAGER');
                  setActiveTab('site-dashboard');
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  currentRole === 'SITE_MANAGER' && activeTab !== 'manual-hub'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <HardHat className="w-3.5 h-3.5" />
                <span>현장 관리자 모드</span>
              </button>

              <button
                id="btn-role-supplier"
                onClick={() => {
                  setCurrentRole('SUPPLIER');
                  setActiveTab('supplier-dashboard');
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  currentRole === 'SUPPLIER' && activeTab !== 'manual-hub'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>공급업체 모드</span>
              </button>
            </div>

            {/* Efficiency Analytics Dashboard Button */}
            <button
              id="btn-analytics-dashboard"
              onClick={() => setActiveTab('analytics-dashboard')}
              className={`px-3 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 border transition-all cursor-pointer ${
                activeTab === 'analytics-dashboard'
                  ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
                  : 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'
              }`}
            >
              <TrendingUp className={`w-4 h-4 ${activeTab === 'analytics-dashboard' ? 'text-white' : 'text-blue-600'}`} />
              <span className="hidden sm:inline">조달 효율성 차트</span>
              <span className="sm:hidden">효율성</span>
            </button>

            {/* Manual Hub Button */}
            <button
              id="btn-manual-hub"
              onClick={() => setActiveTab('manual-hub')}
              className={`px-3 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 border transition-all cursor-pointer ${
                activeTab === 'manual-hub'
                  ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                  : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>전체 한글 매뉴얼 (12종)</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
