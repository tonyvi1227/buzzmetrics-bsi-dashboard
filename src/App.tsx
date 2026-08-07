import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, ChevronDown, ChevronUp, Database } from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { CampaignRecord, BenchmarkMetrics, CategoryBenchmark } from './types/dashboard';
import { AggregatedCelebRecord, CelebRecord, CelebBenchmarkMetrics } from './types/celeb';

import {
  getStoredCampaigns,
  saveStoredCampaigns,
  resetStoredCampaigns,
  getStoredCelebs,
  saveStoredCelebs,
  resetStoredCelebs,
} from './utils/storage';

import { fetchCampaignsFromSupabase, uploadCampaignsToSupabase, getSupabaseCredentials } from './utils/supabaseClient';
import { useSmartFilters, ALL_OPTION } from './hooks/useSmartFilters';
import { useCelebSmartFilters } from './hooks/useCelebSmartFilters';

// Campaign Components
import { Header } from './components/Header';
import { BenchmarkPanel } from './components/BenchmarkPanel';
import { CategoryBenchmarkPanel } from './components/CategoryBenchmarkPanel';
import { FilterBar } from './components/FilterBar';
import { TopBrandsTable } from './components/TopBrandsTable';
import { TimelineComboChart } from './components/TimelineComboChart';
import { ChannelShareChart } from './components/ChannelShareChart';
import { BrandMatrixChart } from './components/BrandMatrixChart';
import { CategoryComparisonChart } from './components/CategoryComparisonChart';
import { CampaignTypeChart } from './components/CampaignTypeChart';
import { CampaignTable } from './components/CampaignTable';
import { CampaignDetailModal } from './components/CampaignDetailModal';

// Celeb Components
import { CelebFilterBar } from './components/celeb/CelebFilterBar';
import { CelebBenchmarkPanel } from './components/celeb/CelebBenchmarkPanel';
import { CelebMatrixChart } from './components/celeb/CelebMatrixChart';
import { CelebConsistencyChart } from './components/celeb/CelebConsistencyChart';
import { CelebCategoryChart } from './components/celeb/CelebCategoryChart';
import { CelebTable } from './components/celeb/CelebTable';
import { CelebDetailModal } from './components/celeb/CelebDetailModal';

import { DataImportModal } from './components/DataImportModal';
import { ExportModal } from './components/ExportModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';
import { Footer } from './components/Footer';

const DashboardContent: React.FC = () => {
  // Determine initial tab from URL path (URL Routing for Netlify: /celeb vs /campaign)
  const getInitialTab = (): 'campaigns' | 'celebs' => {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('celeb')) return 'celebs';
    return 'campaigns';
  };

  const [activeTab, setActiveTab] = useState<'campaigns' | 'celebs'>(getInitialTab);

  // Sync tab changes with browser URL & history popstate
  const handleTabChange = (tab: 'campaigns' | 'celebs') => {
    setActiveTab(tab);
    const targetPath = tab === 'celebs' ? '/celeb' : '/campaign';
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ tab }, '', targetPath);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('celeb')) {
        setActiveTab('celebs');
      } else {
        setActiveTab('campaigns');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Isolated Dataset States for Campaigns & Celebs
  const [dataset, setDataset] = useState<CampaignRecord[]>(() => getStoredCampaigns());
  const [celebsData, setCelebsData] = useState<CelebRecord[]>(() => getStoredCelebs());

  const [selectedCampaign, setSelectedCampaign] = useState<CampaignRecord | null>(null);
  const [selectedCeleb, setSelectedCeleb] = useState<AggregatedCelebRecord | null>(null);

  // Modals & UI States
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isAdvancedChartsExpanded, setIsAdvancedChartsExpanded] = useState(true);
  const [isCloudSynced, setIsCloudSynced] = useState(false);

  const { isAdmin } = useAdmin();

  // On App Mount: Fetch live data from Supabase if credentials present
  useEffect(() => {
    const creds = getSupabaseCredentials();
    if (creds.url && creds.anonKey) {
      fetchCampaignsFromSupabase().then(cloudData => {
        if (cloudData && cloudData.length > 0) {
          setDataset(cloudData);
          saveStoredCampaigns(cloudData);
          setIsCloudSynced(true);
        }
      });
    }
  }, []);

  // Campaign Filters
  const {
    filters,
    updateFilter,
    resetFilters,
    availableYears,
    availableMonths,
    availableCategories,
    availableCampaignTypes,
    filteredData,
  } = useSmartFilters(dataset);

  // Celeb Filters
  const {
    filters: celebFilters,
    updateFilter: updateCelebFilter,
    resetFilters: resetCelebFilters,
    availableYears: celebAvailableYears,
    availableMonths: celebAvailableMonths,
    availableCategories: celebAvailableCategories,
    filteredMonthlyRecords,
    aggregatedCelebs,
  } = useCelebSmartFilters(celebsData);

  // Compute Overall Benchmark Metrics for Campaigns
  const overallBenchmark: BenchmarkMetrics = useMemo(() => {
    const total = filteredData.length;
    if (total === 0) {
      return {
        totalCount: 0,
        avgBuzz: 0,
        minBuzz: 0,
        maxBuzz: 0,
        avgContentQU: 0,
        avgQUUser: 0,
        avgBSI: 0,
        avgSentiment: 0,
        avgRelevancy: 0,
        avgEarnedPct: 0,
      };
    }

    const buzzArr = filteredData.map(d => d.buzzVolume);
    const avgBuzz = buzzArr.reduce((a, b) => a + b, 0) / total;
    const minBuzz = Math.min(...buzzArr);
    const maxBuzz = Math.max(...buzzArr);

    const avgContentQU = filteredData.reduce((a, b) => a + b.contentQU, 0) / total;
    const avgQUUser = filteredData.reduce((a, b) => a + b.quUser, 0) / total;
    const avgBSI = filteredData.reduce((a, b) => a + b.bsi, 0) / total;
    const avgSentiment = filteredData.reduce((a, b) => a + b.sentiment, 0) / total;
    const avgRelevancy = filteredData.reduce((a, b) => a + b.relevancy, 0) / total;
    const avgEarnedPct = filteredData.reduce((a, b) => a + b.earnedPct, 0) / total;

    return {
      totalCount: total,
      avgBuzz,
      minBuzz,
      maxBuzz,
      avgContentQU,
      avgQUUser,
      avgBSI,
      avgSentiment,
      avgRelevancy,
      avgEarnedPct,
    };
  }, [filteredData]);

  // Compute Specific Category Benchmark for Campaigns
  const categoryBenchmark: CategoryBenchmark | null = useMemo(() => {
    if (filters.category === ALL_OPTION) return null;
    const categoryRecords = filteredData.filter(d => d.category === filters.category);
    const count = categoryRecords.length;
    if (count === 0) return null;

    return {
      category: filters.category,
      totalCampaigns: count,
      avgBuzz: categoryRecords.reduce((a, b) => a + b.buzzVolume, 0) / count,
      avgBSI: categoryRecords.reduce((a, b) => a + b.bsi, 0) / count,
      avgContentQU: categoryRecords.reduce((a, b) => a + b.contentQU, 0) / count,
      avgQUUser: categoryRecords.reduce((a, b) => a + b.quUser, 0) / count,
      avgSentiment: categoryRecords.reduce((a, b) => a + b.sentiment, 0) / count,
      avgRelevancy: categoryRecords.reduce((a, b) => a + b.relevancy, 0) / count,
      avgEarnedPct: categoryRecords.reduce((a, b) => a + b.earnedPct, 0) / count,
    };
  }, [filteredData, filters.category]);

  // Compute Celeb Benchmark Metrics from Aggregated List
  const celebBenchmark: CelebBenchmarkMetrics = useMemo(() => {
    const total = aggregatedCelebs.length;
    if (total === 0) {
      return {
        totalCount: 0,
        topCeleb: 'N/A',
        topBsi: 0,
        avgBsi: 0,
        avgBuzz: 0,
        avgContentQU: 0,
        avgQuUser: 0,
        avgSentiment: 0,
        avgRelevancy: 0,
      };
    }

    const sortedByBsi = [...aggregatedCelebs].sort((a, b) => b.avgBsi - a.avgBsi);
    const topCeleb = sortedByBsi[0];

    const avgBsi = aggregatedCelebs.reduce((a, b) => a + b.avgBsi, 0) / total;
    const avgBuzz = aggregatedCelebs.reduce((a, b) => a + b.avgBuzz, 0) / total;
    const avgContentQU = aggregatedCelebs.reduce((a, b) => a + b.avgContentQU, 0) / total;
    const avgQuUser = aggregatedCelebs.reduce((a, b) => a + b.avgQuUser, 0) / total;
    const avgSentiment = aggregatedCelebs.reduce((a, b) => a + b.avgSentiment, 0) / total;
    const avgRelevancy = aggregatedCelebs.reduce((a, b) => a + b.avgRelevancy, 0) / total;

    return {
      totalCount: total,
      topCeleb: topCeleb ? topCeleb.celebName : 'N/A',
      topBsi: topCeleb ? topCeleb.avgBsi : 0,
      avgBsi,
      avgBuzz,
      avgContentQU,
      avgQuUser,
      avgSentiment,
      avgRelevancy,
    };
  }, [aggregatedCelebs]);

  // Handle Import Click
  const handleOpenImportClick = () => {
    if (isAdmin) {
      setIsImportModalOpen(true);
    } else {
      setIsAdminModalOpen(true);
    }
  };

  // Isolated Import Handlers for Campaigns vs Celebs
  const handleImportCampaignData = async (newRecords: CampaignRecord[], mode: 'append' | 'overwrite') => {
    let updatedDataset: CampaignRecord[] = [];
    if (mode === 'overwrite') {
      updatedDataset = newRecords;
    } else {
      const existingKeys = new Set(dataset.map(d => `${d.year}_${d.month}_${d.brand}_${d.campaign}`));
      const uniqueNew = newRecords.filter(r => !existingKeys.has(`${r.year}_${r.month}_${r.brand}_${r.campaign}`));
      updatedDataset = [...dataset, ...uniqueNew];
    }
    setDataset(updatedDataset);
    saveStoredCampaigns(updatedDataset);

    const creds = getSupabaseCredentials();
    if (creds.url && creds.anonKey) {
      const success = await uploadCampaignsToSupabase(updatedDataset, mode);
      if (success) setIsCloudSynced(true);
    }
  };

  const handleResetToDefault = () => {
    if (activeTab === 'campaigns') {
      const defaults = resetStoredCampaigns();
      setDataset(defaults);
      resetFilters();
    } else {
      const defaults = resetStoredCelebs();
      setCelebsData(defaults);
      resetCelebFilters();
    }
    setIsImportModalOpen(false);
  };

  const handleSupabaseConnected = async () => {
    const cloudData = await fetchCampaignsFromSupabase();
    if (cloudData && cloudData.length > 0) {
      setDataset(cloudData);
      saveStoredCampaigns(cloudData);
      setIsCloudSynced(true);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-[1600px] mx-auto font-sans">
      {/* Header Bar with URL Path Tab Navigation */}
      <Header
        onResetFilters={activeTab === 'campaigns' ? resetFilters : resetCelebFilters}
        onOpenImport={handleOpenImportClick}
        onOpenExport={() => setIsExportModalOpen(true)}
        totalRecordsCount={activeTab === 'campaigns' ? dataset.length : celebsData.length}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {/* Cloud Sync Status Indicator */}
      <div className="mb-4 flex items-center justify-between gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 px-1">
        <div className="flex items-center gap-2">
          <Database className={`w-4 h-4 ${isCloudSynced ? 'text-emerald-500' : 'text-slate-400'}`} />
          <span>
            Trạng thái kết nối Cloud:{' '}
            <strong className={isCloudSynced ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}>
              {isCloudSynced ? 'Đã đồng bộ Supabase Cloud DB' : 'Chưa kết nối (Đang chạy dữ liệu Kho Nội Bộ / LocalStorage)'}
            </strong>
          </span>
        </div>
        {isAdmin && (
          <button
            onClick={() => setIsSupabaseModalOpen(true)}
            className="text-buzz hover:underline font-black flex items-center gap-1"
          >
            Cấu hình Supabase Cloud DB
          </button>
        )}
      </div>

      {/* TAB 1: CAMPAIGNS DASHBOARD (URL: /campaign) */}
      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          <BenchmarkPanel metrics={overallBenchmark} />
          
          <FilterBar
            filters={filters}
            onUpdateFilter={updateFilter}
            availableYears={availableYears}
            availableMonths={availableMonths}
            availableCategories={availableCategories}
            availableCampaignTypes={availableCampaignTypes}
            filteredCount={filteredData.length}
          />

          <CategoryBenchmarkPanel
            categoryBenchmark={categoryBenchmark}
            selectedCategoryName={filters.category}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <TopBrandsTable data={filteredData} />
            <div className="md:col-span-2 xl:col-span-1">
              <TimelineComboChart data={filteredData} />
            </div>
            <ChannelShareChart data={filteredData} />
          </div>

          <div>
            <button
              onClick={() => setIsAdvancedChartsExpanded(prev => !prev)}
              className="w-full glass-card p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-buzz dark:hover:border-buzz transition flex items-center justify-between shadow-sm cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-buzz-light dark:bg-orange-950/60 text-buzz border border-buzz-border dark:border-orange-800 group-hover:bg-buzz group-hover:text-white transition">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-2 flex-wrap">
                    BIỂU ĐỒ PHÂN TÍCH CHUYÊN SÂU CAMPAIGNS
                    <span className="whitespace-nowrap inline-flex items-center justify-center flex-shrink-0 text-[10px] font-black bg-orange-100 dark:bg-orange-950 text-buzz dark:text-orange-300 border border-orange-300 dark:border-orange-800 px-2.5 py-0.5 rounded-full">
                      +3 ADVANCED CHARTS
                    </span>
                  </h3>
                  <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    {isAdvancedChartsExpanded ? 'Bấm để ẩn 3 biểu đồ phân tích chuyên sâu' : 'Bấm để mở rộng xem Ma trận BSI vs Buzz, Content QU & Loại campaign'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 font-black text-xs text-buzz whitespace-nowrap">
                <span>{isAdvancedChartsExpanded ? 'Thu gọn' : 'Mở rộng'}</span>
                {isAdvancedChartsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {isAdvancedChartsExpanded && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 animate-fadeIn">
                <BrandMatrixChart data={filteredData} />
                <CategoryComparisonChart data={filteredData} />
                <CampaignTypeChart data={filteredData} />
              </div>
            )}
          </div>

          <CampaignTable
            data={filteredData}
            onSelectCampaign={(campaign) => setSelectedCampaign(campaign)}
          />
        </div>
      )}

      {/* TAB 2: CELEBRITIES DASHBOARD (URL: /celeb) */}
      {activeTab === 'celebs' && (
        <div className="space-y-6 animate-fadeIn">
          {/* 1. Celeb Benchmark Panel */}
          <CelebBenchmarkPanel metrics={celebBenchmark} />

          {/* 2. Unified Single Celeb Filter Bar */}
          <CelebFilterBar
            filters={celebFilters}
            updateFilter={updateCelebFilter}
            resetFilters={resetCelebFilters}
            availableYears={celebAvailableYears}
            availableMonths={celebAvailableMonths}
            availableCategories={celebAvailableCategories}
            totalResults={aggregatedCelebs.length}
          />

          {/* 3. Core Celeb Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CelebMatrixChart celebs={aggregatedCelebs} />
            </div>
            <div>
              <CelebCategoryChart celebs={aggregatedCelebs} />
            </div>
          </div>

          {/* 4. Consistency Chart */}
          <CelebConsistencyChart celebs={aggregatedCelebs} />

          {/* 5. Celeb Leaderboard Table */}
          <CelebTable
            data={aggregatedCelebs}
            onSelectCeleb={(celeb) => setSelectedCeleb(celeb)}
            onExport={() => setIsExportModalOpen(true)}
          />
        </div>
      )}

      {/* Modals */}
      <CampaignDetailModal
        campaign={selectedCampaign}
        allData={dataset}
        onClose={() => setSelectedCampaign(null)}
      />

      <CelebDetailModal
        celeb={selectedCeleb}
        onClose={() => setSelectedCeleb(null)}
      />

      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onSuccess={() => {
          setIsAdminModalOpen(false);
          setIsImportModalOpen(true);
        }}
      />

      <DataImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportCampaignData}
        onResetToDefault={handleResetToDefault}
        existingDataset={dataset}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        data={filteredData}
      />

      <SupabaseConfigModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onConnected={handleSupabaseConnected}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AdminProvider>
        <DashboardContent />
      </AdminProvider>
    </ThemeProvider>
  );
}

export default App;
