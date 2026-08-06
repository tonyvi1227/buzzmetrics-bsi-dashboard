import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, ChevronDown, ChevronUp, Database } from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { CampaignRecord, BenchmarkMetrics, CategoryBenchmark } from './types/dashboard';
import { getStoredCampaigns, saveStoredCampaigns, resetStoredCampaigns } from './utils/storage';
import { fetchCampaignsFromSupabase, uploadCampaignsToSupabase, getSupabaseCredentials } from './utils/supabaseClient';
import { useSmartFilters, ALL_OPTION } from './hooks/useSmartFilters';
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
import { DataImportModal } from './components/DataImportModal';
import { ExportModal } from './components/ExportModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';

const DashboardContent: React.FC = () => {
  const [dataset, setDataset] = useState<CampaignRecord[]>(() => getStoredCampaigns());
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignRecord | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isAdvancedChartsExpanded, setIsAdvancedChartsExpanded] = useState(false);
  const [isCloudSynced, setIsCloudSynced] = useState(false);

  const { isAdmin } = useAdmin();

  // On App Mount: Attempt to fetch live data from Supabase Cloud DB if connected
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

  // Compute Overall Benchmark Metrics for filtered dataset
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

  // Compute Specific Category Benchmark Panel when a category filter is selected
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

  // Handle Import Action (requires Admin check)
  const handleOpenImportClick = () => {
    if (isAdmin) {
      setIsImportModalOpen(true);
    } else {
      setIsAdminModalOpen(true);
    }
  };

  // Handle Importing New Data (Append or Overwrite)
  const handleImportData = async (newRecords: CampaignRecord[], mode: 'append' | 'overwrite') => {
    let updatedDataset: CampaignRecord[] = [];

    if (mode === 'overwrite') {
      updatedDataset = newRecords;
    } else {
      const existingKeys = new Set(
        dataset.map(d => `${d.year}_${d.month}_${d.brand}_${d.campaign}`)
      );

      const uniqueNew = newRecords.filter(
        r => !existingKeys.has(`${r.year}_${r.month}_${r.brand}_${r.campaign}`)
      );

      updatedDataset = [...dataset, ...uniqueNew];
    }

    setDataset(updatedDataset);
    saveStoredCampaigns(updatedDataset);

    // Sync to Supabase Cloud if connected
    const creds = getSupabaseCredentials();
    if (creds.url && creds.anonKey) {
      const success = await uploadCampaignsToSupabase(updatedDataset, mode);
      if (success) {
        setIsCloudSynced(true);
      }
    }
  };

  // Reset Data to Initial Default 18-month Dataset
  const handleResetToDefault = () => {
    const defaults = resetStoredCampaigns();
    setDataset(defaults);
    resetFilters();
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
    <div className="min-h-screen p-4 md:p-8 max-w-[1600px] mx-auto">
      {/* Header Bar */}
      <Header
        onResetFilters={resetFilters}
        onOpenImport={handleOpenImportClick}
        onOpenExport={() => setIsExportModalOpen(true)}
        totalRecordsCount={dataset.length}
      />

      {/* Cloud Sync Status Indicator */}
      <div className="mb-4 flex items-center justify-between gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 px-1">
        <div className="flex items-center gap-2">
          <Database className={`w-4 h-4 ${isCloudSynced ? 'text-emerald-500' : 'text-slate-400'}`} />
          <span>Trạng thái kết nối Cloud: <strong className={isCloudSynced ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}>{isCloudSynced ? 'Đã đồng bộ Supabase Cloud DB' : 'Chưa kết nối (Đang chạy dữ liệu Nội bộ / Browser)'}</strong></span>
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

      {/* 1. Overall Dynamic Benchmark Panel */}
      <BenchmarkPanel metrics={overallBenchmark} />

      {/* 2. Interactive Smart Filter Bar */}
      <FilterBar
        filters={filters}
        onUpdateFilter={updateFilter}
        availableYears={availableYears}
        availableMonths={availableMonths}
        availableCategories={availableCategories}
        availableCampaignTypes={availableCampaignTypes}
        filteredCount={filteredData.length}
      />

      {/* 3. Category Benchmark Panel (Displays when a category is selected) */}
      <CategoryBenchmarkPanel
        categoryBenchmark={categoryBenchmark}
        selectedCategoryName={filters.category}
      />

      {/* 4. Core Charts & Leaderboard Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
        <TopBrandsTable data={filteredData} />
        <div className="md:col-span-2 xl:col-span-1">
          <TimelineComboChart data={filteredData} />
        </div>
        <ChannelShareChart data={filteredData} />
      </div>

      {/* 5. Collapsible Expandable Advanced Analytics Charts Section */}
      <div className="mb-6">
        <button
          onClick={() => setIsAdvancedChartsExpanded(prev => !prev)}
          className="w-full glass-card p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-buzz dark:hover:border-buzz transition flex items-center justify-between shadow-sm cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-buzz-light dark:bg-orange-950/60 text-buzz border border-buzz-border dark:border-orange-800 group-hover:bg-buzz group-hover:text-white transition">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-left">
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
                Biểu Đồ Phân Tích Chuyên Sâu (Ma Trận Vị Thế, QU Ngành & Tỷ Lệ Loại Campaign)
                <span className="text-[10px] font-black bg-orange-100 dark:bg-orange-950 text-buzz dark:text-orange-300 border border-orange-300 dark:border-orange-800 px-2 py-0.5 rounded-full">
                  +3 Advanced Charts
                </span>
              </h3>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                {isAdvancedChartsExpanded
                  ? 'Bấm để ẩn 3 biểu đồ phân tích chuyên sâu'
                  : 'Bấm để mở rộng xem Ma trận BSI vs Buzz, Content QU theo ngành & Tỷ lệ loại campaign'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-black text-xs text-buzz">
            <span>{isAdvancedChartsExpanded ? 'Thu gọn' : 'Mở rộng'}</span>
            {isAdvancedChartsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {isAdvancedChartsExpanded && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4 animate-fadeIn">
            <BrandMatrixChart data={filteredData} />
            <CategoryComparisonChart data={filteredData} />
            <CampaignTypeChart data={filteredData} />
          </div>
        )}
      </div>

      {/* 6. Detailed Campaign List Table */}
      <CampaignTable
        data={filteredData}
        onSelectCampaign={(campaign) => setSelectedCampaign(campaign)}
      />

      {/* Modals & Drawers */}
      <CampaignDetailModal
        campaign={selectedCampaign}
        allData={dataset}
        onClose={() => setSelectedCampaign(null)}
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
        onImport={handleImportData}
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
