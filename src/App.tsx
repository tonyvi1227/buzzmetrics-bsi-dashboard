import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { CampaignRecord, BenchmarkMetrics, CategoryBenchmark } from './types/dashboard';
import { getStoredCampaigns, saveStoredCampaigns, resetStoredCampaigns } from './utils/storage';
import { fetchCampaignsFromSupabase, uploadCampaignsToSupabase, getSupabaseCredentials } from './utils/supabaseClient';
import { useSmartFilters, ALL_OPTION } from './hooks/useSmartFilters';
import { ABVariant } from './types/leadGen';
import {
  isUserUnlocked,
  getAssignedVariant,
  getClickCount,
  incrementClickCount,
} from './utils/abTestingEngine';

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
import { DataImportModal } from './components/DataImportModal';
import { ExportModal } from './components/ExportModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';
import { Footer } from './components/Footer';

// Celeb Dataset, Hooks & Components
import { celebDataset } from './data/celebDataset';
import { useCelebSmartFilters } from './hooks/useCelebSmartFilters';
import { CelebBenchmarkPanel } from './components/celeb/CelebBenchmarkPanel';
import { CelebFilterBar } from './components/celeb/CelebFilterBar';
import { CelebTable } from './components/celeb/CelebTable';
import { CelebMatrixChart } from './components/celeb/CelebMatrixChart';
import { CelebConsistencyChart } from './components/celeb/CelebConsistencyChart';
import { CelebCategoryChart } from './components/celeb/CelebCategoryChart';
import { CelebDetailModal } from './components/celeb/CelebDetailModal';
import { AggregatedCelebRecord } from './types/celeb';

// A/B Testing & Lead Gen Components
import { GatedOverlay } from './components/GatedOverlay';
import { LeadFormModal } from './components/LeadFormModal';
import { AIChatbotModal } from './components/AIChatbotModal';
import { InternalUnlockModal } from './components/InternalUnlockModal';
import { AdminABTestPanel } from './components/AdminABTestPanel';
import { DevABToolbar } from './components/DevABToolbar';

const DashboardContent: React.FC = () => {
  const [dataset, setDataset] = useState<CampaignRecord[]>(() => getStoredCampaigns());
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignRecord | null>(null);
  const [selectedCeleb, setSelectedCeleb] = useState<AggregatedCelebRecord | null>(null);

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  // A/B Testing & Gated Lead Capture States
  const [isUnlocked, setIsUnlocked] = useState(() => isUserUnlocked());
  const [assignedVariant, setAssignedVariant] = useState<ABVariant>(() => getAssignedVariant());
  const [clickCount, setClickCount] = useState(() => getClickCount());

  // Advanced Charts state: Auto-hidden for Variant C when locked
  const [isAdvancedChartsExpanded, setIsAdvancedChartsExpanded] = useState<boolean>(() => {
    if (!isUserUnlocked() && getAssignedVariant() === 'C') {
      return false;
    }
    return true;
  });

  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isAIChatModalOpen, setIsAIChatModalOpen] = useState(false);
  const [isInternalModalOpen, setIsInternalModalOpen] = useState(false);

  const { isAdmin } = useAdmin();

  const [activeTab, setActiveTab] = useState<'campaigns' | 'celebs'>('campaigns');

  const handleTabChange = (tab: 'campaigns' | 'celebs') => {
    setActiveTab(tab);
  };

  // Trigger Gate Modal depending on assigned Variant
  const triggerGateModal = () => {
    if (isUnlocked) return;
    if (assignedVariant === 'B') {
      setIsAIChatModalOpen(true);
    } else {
      setIsLeadModalOpen(true);
    }
  };

  // Generic Interaction Handler per Variant UX Rules:
  // - Variant A & B: Any interaction (filter change, details click) pops up Gate Modal immediately!
  // - Variant C: Allows exactly 3 interactions (filter change or details click). On 3rd interaction, pops up Gate Modal!
  const handleInteraction = (actionCallback: () => void) => {
    if (isUnlocked) {
      actionCallback();
      return;
    }

    if (assignedVariant === 'A' || assignedVariant === 'B') {
      triggerGateModal();
      return;
    }

    if (assignedVariant === 'C') {
      if (clickCount >= 3) {
        triggerGateModal();
        return;
      }

      const c = incrementClickCount();
      setClickCount(c);
      actionCallback();

      if (c >= 3) {
        triggerGateModal();
      }
    }
  };

  // Advanced Charts Bar Click: Clicking to view advanced charts when locked pops up Gate Modal immediately!
  const handleAdvancedChartsClick = () => {
    if (!isUnlocked) {
      triggerGateModal();
      return;
    }
    setIsAdvancedChartsExpanded(prev => !prev);
  };

  // Fetch Supabase data on mount if credentials exist
  useEffect(() => {
    const creds = getSupabaseCredentials();
    if (creds.url && creds.anonKey) {
      fetchCampaignsFromSupabase().then(cloudData => {
        if (cloudData && cloudData.length > 0) {
          setDataset(cloudData);
          saveStoredCampaigns(cloudData);
        }
      });
    }
  }, []);

  // Smart Filters for Campaign Dataset
  const {
    filters: campaignFilters,
    updateFilter: updateCampaignFilter,
    resetFilters: resetCampaignFilters,
    availableYears: availableCampaignYears,
    availableMonths: availableCampaignMonths,
    availableCategories: availableCampaignCategories,
    availableCampaignTypes,
    filteredData: filteredCampaignData,
  } = useSmartFilters(dataset);

  // Smart Filters for Celeb Dataset
  const {
    filters: celebFilters,
    updateFilter: updateCelebFilter,
    resetFilters: resetCelebFilters,
    availableYears: availableCelebYears,
    availableMonths: availableCelebMonths,
    availableCategories: availableCelebCategories,
    aggregatedCelebs: filteredCelebData,
    benchmarkMetrics: celebBenchmark,
  } = useCelebSmartFilters(celebDataset);

  // Compute Overall Benchmark Metrics for Campaigns
  const overallBenchmark: BenchmarkMetrics = useMemo(() => {
    const total = filteredCampaignData.length;
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

    const buzzArr = filteredCampaignData.map(d => d.buzzVolume);
    const avgBuzz = buzzArr.reduce((a, b) => a + b, 0) / total;
    const minBuzz = Math.min(...buzzArr);
    const maxBuzz = Math.max(...buzzArr);

    const avgContentQU = filteredCampaignData.reduce((a, b) => a + b.contentQU, 0) / total;
    const avgQUUser = filteredCampaignData.reduce((a, b) => a + b.quUser, 0) / total;
    const avgBSI = filteredCampaignData.reduce((a, b) => a + b.bsi, 0) / total;
    const avgSentiment = filteredCampaignData.reduce((a, b) => a + b.sentiment, 0) / total;
    const avgRelevancy = filteredCampaignData.reduce((a, b) => a + b.relevancy, 0) / total;
    const avgEarnedPct = filteredCampaignData.reduce((a, b) => a + b.earnedPct, 0) / total;

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
  }, [filteredCampaignData]);

  // Compute Specific Category Benchmark for Campaigns
  const categoryBenchmark: CategoryBenchmark | null = useMemo(() => {
    if (campaignFilters.category === ALL_OPTION) return null;
    const categoryRecords = filteredCampaignData.filter(d => d.category === campaignFilters.category);
    const count = categoryRecords.length;
    if (count === 0) return null;

    return {
      category: campaignFilters.category,
      totalCampaigns: count,
      avgBuzz: categoryRecords.reduce((a, b) => a + b.buzzVolume, 0) / count,
      avgBSI: categoryRecords.reduce((a, b) => a + b.bsi, 0) / count,
      avgContentQU: categoryRecords.reduce((a, b) => a + b.contentQU, 0) / count,
      avgQUUser: categoryRecords.reduce((a, b) => a + b.quUser, 0) / count,
      avgSentiment: categoryRecords.reduce((a, b) => a + b.sentiment, 0) / count,
      avgRelevancy: categoryRecords.reduce((a, b) => a + b.relevancy, 0) / count,
      avgEarnedPct: categoryRecords.reduce((a, b) => a + b.earnedPct, 0) / count,
    };
  }, [filteredCampaignData, campaignFilters.category]);

  // Handle Import Click
  const handleOpenImportClick = () => {
    if (isAdmin) {
      setIsImportModalOpen(true);
    } else {
      setIsAdminModalOpen(true);
    }
  };

  const handleImportData = async (newRecords: CampaignRecord[], mode: 'append' | 'overwrite') => {
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
      await uploadCampaignsToSupabase(updatedDataset, mode);
    }
  };

  const handleResetToDefault = () => {
    const defaults = resetStoredCampaigns();
    setDataset(defaults);
    resetCampaignFilters();
    setIsImportModalOpen(false);
  };

  const handleSupabaseConnected = async () => {
    const cloudData = await fetchCampaignsFromSupabase();
    if (cloudData && cloudData.length > 0) {
      setDataset(cloudData);
      saveStoredCampaigns(cloudData);
    }
  };

  const shouldGateSection = !isUnlocked && (assignedVariant !== 'C' || clickCount >= 3);

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-[1600px] mx-auto font-sans">
      {/* Dev A/B Testing Toolbar - ONLY SHOWN AFTER ADMIN PASSWORD LOGIN */}
      {isAdmin && (
        <DevABToolbar
          currentVariant={assignedVariant}
          isUnlocked={isUnlocked}
          onUpdateState={(v, u) => {
            setAssignedVariant(v);
            setIsUnlocked(u);
            setClickCount(getClickCount());
            if (!u && v === 'C') {
              setIsAdvancedChartsExpanded(false);
            } else {
              setIsAdvancedChartsExpanded(true);
            }
          }}
        />
      )}

      {/* Header Bar */}
      <Header
        onOpenImport={handleOpenImportClick}
        onOpenExport={() => setIsExportModalOpen(true)}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onOpenContactModal={triggerGateModal}
      />

      {/* Admin Panel for A/B Testing & Leads Management */}
      {isAdmin && <AdminABTestPanel />}

      {/* ========================================================================= */}
      {/* TAB 1: CAMPAIGNS DASHBOARD */}
      {/* ========================================================================= */}
      {activeTab === 'campaigns' && (
        <div className="space-y-6 animate-fadeIn">
          {/* FREE TEASER LAYER 1: Overall Benchmark Panel (9 KPI Cards) */}
          <BenchmarkPanel metrics={overallBenchmark} />
          
          {/* FILTER BAR WITH VARIANT UX RULES */}
          <FilterBar
            filters={campaignFilters}
            onUpdateFilter={(key, val) => {
              handleInteraction(() => updateCampaignFilter(key, val));
            }}
            onResetFilters={() => {
              handleInteraction(() => resetCampaignFilters());
            }}
            availableYears={availableCampaignYears}
            availableMonths={availableCampaignMonths}
            availableCategories={availableCampaignCategories}
            availableCampaignTypes={availableCampaignTypes}
            filteredCount={filteredCampaignData.length}
            isUnlocked={isUnlocked}
          />

          <CategoryBenchmarkPanel
            categoryBenchmark={categoryBenchmark}
            selectedCategoryName={campaignFilters.category}
          />

          {/* FREE TEASER LAYER 2: Top Brands Table, Timeline Chart & Channel Share */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <TopBrandsTable data={filteredCampaignData} />
            <div className="md:col-span-2 xl:col-span-1">
              <TimelineComboChart data={filteredCampaignData} />
            </div>
            <ChannelShareChart data={filteredCampaignData} />
          </div>

          {/* SINGLE UNIFIED GATED CONTAINER COVERING BOTH ADVANCED CHARTS & CAMPAIGN TABLE */}
          <div className="relative rounded-3xl overflow-hidden min-h-[350px]">
            <div className={shouldGateSection ? 'space-y-6 pointer-events-none select-none filter blur-md opacity-50' : 'space-y-6'}>
              {/* Section 1: Biểu Đồ Phân Tích Chuyên Sâu */}
              <div>
                <button
                  onClick={handleAdvancedChartsClick}
                  className="w-full glass-card p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-buzz dark:hover:border-buzz transition flex items-center justify-between shadow-sm cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-buzz-light dark:bg-orange-950/60 text-buzz border border-buzz-border dark:border-orange-800 group-hover:bg-buzz group-hover:text-white transition">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wide">
                        BIỂU ĐỒ PHÂN TÍCH CHUYÊN SÂU
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 font-black text-xs text-buzz whitespace-nowrap">
                    <span>{isAdvancedChartsExpanded ? 'Thu gọn' : 'Mở rộng'}</span>
                    {isAdvancedChartsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isAdvancedChartsExpanded && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 animate-fadeIn">
                    <BrandMatrixChart data={filteredCampaignData} />
                    <CategoryComparisonChart data={filteredCampaignData} />
                    <CampaignTypeChart data={filteredCampaignData} />
                  </div>
                )}
              </div>

              {/* Section 2: Bảng Chi Tiết Chiến Dịch */}
              <CampaignTable
                data={filteredCampaignData}
                onSelectCampaign={(campaign) => {
                  handleInteraction(() => setSelectedCampaign(campaign));
                }}
              />
            </div>

            {/* ONE SINGLE FLOATING CTA LOCK BOX OVER ENTIRE CONTINUOUS GATED BLOCK */}
            {shouldGateSection && (
              <GatedOverlay
                variant={assignedVariant}
                onOpenGateModal={triggerGateModal}
                clickCount={clickCount}
              />
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CELEBRITIES (NGHỆ SĨ) DASHBOARD */}
      {/* ========================================================================= */}
      {activeTab === 'celebs' && (
        <div className="space-y-6 animate-fadeIn">
          {/* FREE TEASER LAYER 1: Celeb Benchmark Panel */}
          <CelebBenchmarkPanel metrics={celebBenchmark} />

          {/* CELEB FILTER BAR WITH VARIANT UX RULES */}
          <CelebFilterBar
            filters={celebFilters}
            updateFilter={(key, val) => {
              handleInteraction(() => updateCelebFilter(key, val));
            }}
            resetFilters={() => {
              handleInteraction(() => resetCelebFilters());
            }}
            availableYears={availableCelebYears}
            availableMonths={availableCelebMonths}
            availableCategories={availableCelebCategories}
            totalResults={filteredCelebData.length}
          />

          {/* GATED CONTINUOUS CONTAINER FOR CELEB CHARTS & TABLE */}
          <div className="relative rounded-3xl overflow-hidden min-h-[350px]">
            <div className={shouldGateSection ? 'space-y-6 pointer-events-none select-none filter blur-md opacity-50' : 'space-y-6'}>
              {/* Celeb Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <CelebMatrixChart celebs={filteredCelebData} />
                <CelebConsistencyChart celebs={filteredCelebData} />
                <CelebCategoryChart celebs={filteredCelebData} />
              </div>

              {/* Celeb Table */}
              <CelebTable
                data={filteredCelebData}
                onSelectCeleb={(celeb) => {
                  handleInteraction(() => setSelectedCeleb(celeb));
                }}
                onExport={() => setIsExportModalOpen(true)}
              />
            </div>

            {/* ONE SINGLE FLOATING CTA LOCK BOX OVER ENTIRE CONTINUOUS GATED BLOCK */}
            {shouldGateSection && (
              <GatedOverlay
                variant={assignedVariant}
                onOpenGateModal={triggerGateModal}
                clickCount={clickCount}
              />
            )}
          </div>
        </div>
      )}

      {/* Modals & Drawers */}
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
        onImport={handleImportData}
        onResetToDefault={handleResetToDefault}
        existingDataset={dataset}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        data={filteredCampaignData}
      />

      <SupabaseConfigModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onConnected={handleSupabaseConnected}
      />

      {/* A/B Testing & Lead Capture Modals */}
      <LeadFormModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        onSuccess={() => setIsUnlocked(true)}
        variant={assignedVariant}
      />

      <AIChatbotModal
        isOpen={isAIChatModalOpen}
        onClose={() => setIsAIChatModalOpen(false)}
        onSuccess={() => setIsUnlocked(true)}
      />

      <InternalUnlockModal
        isOpen={isInternalModalOpen}
        onClose={() => setIsInternalModalOpen(false)}
        onSuccess={() => setIsUnlocked(true)}
      />

      {/* Footer */}
      <Footer
        onOpenInternalUnlock={() => setIsInternalModalOpen(true)}
        totalRecordsCount={activeTab === 'campaigns' ? dataset.length : celebDataset.length}
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
