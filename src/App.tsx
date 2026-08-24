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
  MAX_FREE_CLICKS,
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
import { TopCelebHighlightCards } from './components/celeb/TopCelebHighlightCards';
import { AggregatedCelebRecord } from './types/celeb';

// A/B Testing & Lead Gen Components
import { GatedOverlay } from './components/GatedOverlay';
import { LeadFormModal } from './components/LeadFormModal';
import { AIChatbotModal } from './components/AIChatbotModal';
import { InternalUnlockModal } from './components/InternalUnlockModal';
import { AdminABTestPanel } from './components/AdminABTestPanel';
import { DevABToolbar } from './components/DevABToolbar';
import { DevPasswordModal } from './components/DevPasswordModal';
import { FloatingPreviewBox } from './components/FloatingPreviewBox';

const DashboardContent: React.FC = () => {
  const [dataset, setDataset] = useState<CampaignRecord[]>(() => getStoredCampaigns());
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignRecord | null>(null);
  const [selectedCeleb, setSelectedCeleb] = useState<AggregatedCelebRecord | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  // A/B Testing & Gated Lead Capture States
  const [isUnlocked, setIsUnlocked] = useState(() => isUserUnlocked());
  const [assignedVariant, setAssignedVariant] = useState<ABVariant>(() => getAssignedVariant());
  const [clickCount, setClickCount] = useState(() => getClickCount());

  // Advanced Charts state: Defaults to collapsed (hidden) for all users
  const [isAdvancedChartsExpanded, setIsAdvancedChartsExpanded] = useState<boolean>(false);

  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isAIChatModalOpen, setIsAIChatModalOpen] = useState(false);
  const [isInternalModalOpen, setIsInternalModalOpen] = useState(false);

  const { isAdmin } = useAdmin();

  const [activeTab, setActiveTab] = useState<'campaigns' | 'celebs'>('campaigns');

  const handleTabChange = (tab: 'campaigns' | 'celebs') => {
    setActiveTab(tab);
  };

  // Trigger Gate Modal
  const triggerGateModal = () => {
    setIsLeadModalOpen(true);
  };

  // Filter interaction handler:
  // - Variant A: Free filtering, modal only opens when clicking buttons or locked items.
  // - Variant C: Counts down 5 free actions. On 5th action, opens Gate Modal.
  const handleFilterChange = (actionCallback: () => void) => {
    if (isUnlocked || assignedVariant === 'A') {
      actionCallback();
      return;
    }

    if (assignedVariant === 'C') {
      if (clickCount >= MAX_FREE_CLICKS) {
        triggerGateModal();
        return;
      }

      const c = incrementClickCount();
      setClickCount(c);
      actionCallback();

      if (c >= MAX_FREE_CLICKS) {
        triggerGateModal();
      }
    }
  };

  // Details / locked row click handler:
  const handleDetailsClick = (actionCallback: () => void) => {
    if (isUnlocked) {
      actionCallback();
      return;
    }

    if (assignedVariant === 'A') {
      triggerGateModal();
      return;
    }

    if (assignedVariant === 'C') {
      if (clickCount >= MAX_FREE_CLICKS) {
        triggerGateModal();
        return;
      }

      const c = incrementClickCount();
      setClickCount(c);
      actionCallback();

      if (c >= MAX_FREE_CLICKS) {
        triggerGateModal();
      }
    }
  };

  // Advanced Charts Bar Click: Expanding charts in Variant C uses 1 free preview action!
  const handleAdvancedChartsClick = () => {
    if (isUnlocked) {
      setIsAdvancedChartsExpanded(prev => !prev);
      return;
    }

    if (assignedVariant === 'A') {
      triggerGateModal();
      return;
    }

    if (assignedVariant === 'C') {
      if (!isAdvancedChartsExpanded) {
        if (clickCount >= MAX_FREE_CLICKS) {
          triggerGateModal();
          return;
        }
        const c = incrementClickCount();
        setClickCount(c);
        setIsAdvancedChartsExpanded(true);
        if (c >= MAX_FREE_CLICKS) {
          triggerGateModal();
        }
      } else {
        setIsAdvancedChartsExpanded(false);
      }
    }
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
    availableCategories: availableCelebCategories,
    aggregatedCelebs: filteredCelebData,
    benchmarkMetrics: celebBenchmark,
    topCelebHighlights,
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

  const handleResetData = () => {
    const initial = resetStoredCampaigns();
    setDataset(initial);
  };

  // Dev Hidden Password & Auth State
  const [isDevPasswordOpen, setIsDevPasswordOpen] = useState(false);
  const [isDevAuthed, setIsDevAuthed] = useState<boolean>(() => {
    return localStorage.getItem('buzz_dev_authed') === 'true';
  });
  const [showDevToolbar, setShowDevToolbar] = useState<boolean>(() => {
    return localStorage.getItem('buzz_dev_authed') === 'true' || window.location.search.includes('dev=true');
  });

  const handleOpenDevClick = () => {
    if (isDevAuthed || isAdmin) {
      setShowDevToolbar(prev => !prev);
    } else {
      setIsDevPasswordOpen(true);
    }
  };

  const handleDevPasswordSuccess = () => {
    setIsDevAuthed(true);
    setIsDevPasswordOpen(false);
    setShowDevToolbar(true);
  };

  // Dynamic iFrame Auto-Resizing postMessage to Eliminate Inner Scrollbars & Scroll Lag in Webflow
  useEffect(() => {
    const sendHeight = () => {
      const height = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
        document.documentElement.offsetHeight
      );
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'BSI_DASHBOARD_RESIZE', height }, '*');
      }
    };

    sendHeight();
    const observer = new ResizeObserver(sendHeight);
    observer.observe(document.body);

    const timeout = setTimeout(sendHeight, 500);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, [activeTab, isAdvancedChartsExpanded, isUnlocked, showDevToolbar]);

  // Gating evaluation:
  // - Variant A: Always blurred & gated when locked (!isUnlocked).
  // - Variant C: Explorable for first 5 actions, blurred & gated on 5th action.
  const shouldGateSection = !isUnlocked && (assignedVariant !== 'C' || clickCount >= MAX_FREE_CLICKS);

  return (
    <div className="min-h-screen p-2.5 sm:p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto font-sans relative">

      {/* Header Bar */}
      <Header
        onOpenImport={handleOpenImportClick}
        onOpenExport={() => setIsExportModalOpen(true)}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onOpenContactModal={triggerGateModal}
        onOpenUnlockModal={() => setIsInternalModalOpen(true)}
        isUnlocked={isUnlocked}
        variant={assignedVariant}
        clickCount={clickCount}
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
              handleFilterChange(() => updateCampaignFilter(key, val));
            }}
            onResetFilters={() => {
              handleFilterChange(() => resetCampaignFilters());
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
            <TopBrandsTable data={filteredCampaignData} isUnlocked={isUnlocked || isAdmin} />
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
                        ADVANCED DEEP-DIVE ANALYTICS CHARTS
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 font-black text-xs text-buzz whitespace-nowrap">
                    <span>{isAdvancedChartsExpanded ? 'Collapse' : 'Expand'}</span>
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
                  handleDetailsClick(() => setSelectedCampaign(campaign));
                }}
              />
            </div>

            {/* ONE SINGLE FLOATING CTA LOCK BOX OVER ENTIRE CONTINUOUS GATED BLOCK */}
            {shouldGateSection && (
              <GatedOverlay
                variant={assignedVariant}
                onOpenGateModal={triggerGateModal}
                onUnlockNow={() => setIsUnlocked(true)}
                onOpenPasscodeModal={() => setIsInternalModalOpen(true)}
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

          {/* CELEB FILTER BAR WITH DATE RANGE */}
          <CelebFilterBar
            filters={celebFilters}
            updateFilter={(key, val) => {
              handleFilterChange(() => updateCelebFilter(key, val));
            }}
            resetFilters={() => {
              handleFilterChange(() => resetCelebFilters());
            }}
            availableYears={availableCelebYears}
            availableCategories={availableCelebCategories}
            totalResults={filteredCelebData.length}
            isUnlocked={isUnlocked}
          />

          {/* FREE TEASER LAYER 2: 4 Top Celeb Highlight Cards */}
          <TopCelebHighlightCards
            highlights={topCelebHighlights}
            onSelectCelebName={(name) => {
              const matched = filteredCelebData.find(c => c.celebName.toLowerCase() === name.toLowerCase());
              if (matched) {
                handleDetailsClick(() => setSelectedCeleb(matched));
              }
            }}
          />

          {/* GATED SECTION: CELEB CHARTS & CELEB TABLE (LOCKED UNTIL PASSCODE / REGISTRATION) */}
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
                  handleDetailsClick(() => setSelectedCeleb(celeb));
                }}
                onExport={() => setIsExportModalOpen(true)}
              />
            </div>

            {/* ONE SINGLE FLOATING CTA LOCK BOX OVER ENTIRE CONTINUOUS GATED BLOCK */}
            {shouldGateSection && (
              <GatedOverlay
                variant={assignedVariant}
                onOpenGateModal={triggerGateModal}
                onUnlockNow={() => setIsUnlocked(true)}
                onOpenPasscodeModal={() => setIsInternalModalOpen(true)}
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

      <DataImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportData}
        onResetToDefault={handleResetData}
        existingDataset={dataset}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        data={filteredCampaignData}
      />

      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onSuccess={() => setIsImportModalOpen(true)}
      />

      <SupabaseConfigModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onConnected={() => {
          fetchCampaignsFromSupabase().then(cloudData => {
            if (cloudData && cloudData.length > 0) {
              setDataset(cloudData);
              saveStoredCampaigns(cloudData);
            }
          });
        }}
      />

      {/* A/B Testing Lead Capture Modals */}
      <LeadFormModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        variant={assignedVariant}
        onSuccess={() => {
          setIsUnlocked(true);
          setIsLeadModalOpen(false);
        }}
      />

      <AIChatbotModal
        isOpen={isAIChatModalOpen}
        onClose={() => setIsAIChatModalOpen(false)}
        onSuccess={() => {
          setIsUnlocked(true);
          setIsAIChatModalOpen(false);
        }}
      />

      <InternalUnlockModal
        isOpen={isInternalModalOpen}
        onClose={() => setIsInternalModalOpen(false)}
        onSuccess={(isDev) => {
          setIsUnlocked(true);
          if (isDev) {
            setIsDevAuthed(true);
            setShowDevToolbar(true);
          }
        }}
      />

      <DevPasswordModal
        isOpen={isDevPasswordOpen}
        onClose={() => setIsDevPasswordOpen(false)}
        onSuccess={handleDevPasswordSuccess}
      />

      {/* Footer Section with Hidden Dev Trigger */}
      <Footer
        onOpenDevPassword={handleOpenDevClick}
        isDevAuthed={isDevAuthed || isAdmin}
        totalRecordsCount={dataset.length}
      />

      {/* Variant C Floating Live 5-Action Preview Box (Floating Bottom-Right Widget) */}
      {!isUnlocked && assignedVariant === 'C' && !showDevToolbar && (
        <FloatingPreviewBox
          clickCount={clickCount}
          onOpenContactModal={triggerGateModal}
          onOpenUnlockModal={() => setIsInternalModalOpen(true)}
        />
      )}

      {/* Dev Floating Toolbar - Revealed only with Dev Password */}
      {showDevToolbar && (
        <div className="fixed bottom-3 right-3 z-50 animate-bounce-subtle max-w-[95vw]">
          <DevABToolbar
            currentVariant={assignedVariant}
            isUnlocked={isUnlocked}
            onUpdateState={(newVariant, newUnlocked) => {
              setAssignedVariant(newVariant);
              setIsUnlocked(newUnlocked);
              setClickCount(0);
            }}
            onOpenImport={() => setIsImportModalOpen(true)}
          />
        </div>
      )}
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
