import React, { useState, useMemo, useEffect } from 'react';
import { X, UploadCloud, FileSpreadsheet, Check, Download, AlertCircle, RefreshCw, ShieldCheck, Sparkles, Tag, Layers } from 'lucide-react';
import { parseCSVData } from '../utils/csvParser';
import { CampaignRecord } from '../types/dashboard';

interface DataImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (newRecords: CampaignRecord[], mode: 'append' | 'overwrite') => void;
  onResetToDefault: () => void;
  existingDataset: CampaignRecord[];
}

export const DataImportModal: React.FC<DataImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
  onResetToDefault,
  existingDataset,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [importMode, setImportMode] = useState<'append' | 'overwrite'>('append');
  const [file, setFile] = useState<File | null>(null);
  const [parsedPreview, setParsedPreview] = useState<CampaignRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [verificationStep, setVerificationStep] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen]);

  // Detect Existing Brands & Categories
  const existingBrandsSet = useMemo(() => {
    return new Set(existingDataset.map(d => d.brand));
  }, [existingDataset]);

  const existingCategoriesSet = useMemo(() => {
    return new Set(existingDataset.map(d => d.category));
  }, [existingDataset]);

  // Detect Newly Identified Brands & Categories in File
  const newBrandsDetected = useMemo(() => {
    const newSet = new Set<string>();
    parsedPreview.forEach(r => {
      if (!existingBrandsSet.has(r.brand)) {
        newSet.add(r.brand);
      }
    });
    return Array.from(newSet);
  }, [parsedPreview, existingBrandsSet]);

  const newCategoriesDetected = useMemo(() => {
    const newSet = new Set<string>();
    parsedPreview.forEach(r => {
      if (!existingCategoriesSet.has(r.category)) {
        newSet.add(r.category);
      }
    });
    return Array.from(newSet);
  }, [parsedPreview, existingCategoriesSet]);

  if (!isOpen) return null;

  const handleFile = (f: File) => {
    setFile(f);
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const records = parseCSVData(text);
        if (records.length === 0) {
          setError('No valid campaign data could be parsed from the CSV file. Please verify format.');
          setParsedPreview([]);
          setVerificationStep(false);
        } else {
          setParsedPreview(records);
          setVerificationStep(true);
        }
      } catch (err) {
        setError('Error encountered while parsing CSV file.');
        setParsedPreview([]);
      }
    };
    reader.readAsText(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleConfirmImport = () => {
    if (parsedPreview.length === 0) return;
    onImport(parsedPreview, importMode);
    onClose();
  };

  const handleDownloadTemplate = () => {
    const templateCSV = `Year,Month,TOPIC GỐC,TOPIC CFQU,CAMPAIGN,BSI (CFQU),Buzz Volume,Content from QU,%QU buzz/ Total Buzz,Sentiment Index,QU User,Relevancy Score,Sample for relevancy,OM,Product.RE,Activity.RE,Positive,Negative,%Earned,Owned,Paid,Earned\n2026,Jul,145000,145001,[Handhelds] BRAND_Campaign Name Test,"10,000","100,000","20,000",20.00%,1.00,"10,000",0.50,1000,100,100,100,500,0,50.00%,1000,10000,89000`;
    const blob = new Blob([templateCSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Buzzmetrics_Campaign_Template.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-xl overflow-hidden my-auto overscroll-contain">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-buzz" />
            <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wide">
              {verificationStep ? 'Dataset Verification (Final Check)' : 'Update Dashboard Dataset'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Drag & Drop Area */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition ${
              dragOver
                ? 'border-buzz bg-buzz-light dark:bg-orange-950/40'
                : 'border-slate-300 dark:border-slate-700 hover:border-buzz dark:hover:border-buzz'
            }`}
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = '.csv';
              input.onchange = (e: any) => {
                if (e.target.files?.[0]) handleFile(e.target.files[0]);
              };
              input.click();
            }}
          >
            <FileSpreadsheet className="w-9 h-9 text-buzz mx-auto mb-2" />
            <p className="text-xs font-black text-slate-800 dark:text-slate-200">
              Drag & drop monthly CSV file here or <span className="text-buzz underline">browse from computer</span>
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold mt-1">
              Supports standard Buzzmetrics 22-column CSV dataset format
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* FINAL CHECK & VERIFICATION STAGE */}
          {verificationStep && parsedPreview.length > 0 && (
            <div className="p-4 bg-orange-50/70 dark:bg-slate-800/80 border border-orange-200 dark:border-orange-900 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 dark:text-white uppercase flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-buzz" /> Data Scan Result
                </span>
                <span className="text-xs font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2.5 py-0.5 rounded-full">
                  {parsedPreview.length} Valid Campaigns
                </span>
              </div>

              {/* Check for New Brands */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-buzz" /> New Brands Detected:
                  </span>
                  <span className="font-black text-buzz">{newBrandsDetected.length} New Brands</span>
                </div>
                {newBrandsDetected.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {newBrandsDetected.map(b => (
                      <span key={b} className="px-2 py-0.5 bg-buzz text-white rounded text-[10px] font-black">
                        + {b}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500 font-semibold">All brands match existing standard dictionary.</p>
                )}
              </div>

              {/* Check for New Categories */}
              <div className="space-y-1 pt-1 border-t border-orange-200/60 dark:border-slate-700">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-buzz" /> New Categories Detected:
                  </span>
                  <span className="font-black text-buzz">{newCategoriesDetected.length} New Categories</span>
                </div>
                {newCategoriesDetected.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {newCategoriesDetected.map(c => (
                      <span key={c} className="px-2 py-0.5 bg-amber-500 text-white rounded text-[10px] font-black">
                        + {c}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500 font-semibold">All categories match existing category list.</p>
                )}
              </div>
            </div>
          )}

          {/* Import Mode Options */}
          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-700 dark:text-slate-300">
              Dataset Import Mode:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                onClick={() => setImportMode('append')}
                className={`p-3 rounded-xl border text-xs font-bold cursor-pointer transition flex items-center gap-2 ${
                  importMode === 'append'
                    ? 'border-buzz bg-buzz-light dark:bg-orange-950/60 text-buzz dark:text-orange-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="importMode"
                  checked={importMode === 'append'}
                  onChange={() => setImportMode('append')}
                  className="accent-buzz"
                />
                <div>
                  <p className="font-black">Append</p>
                  <p className="text-[10px] opacity-80">Merge new month into existing data</p>
                </div>
              </label>

              <label
                onClick={() => setImportMode('overwrite')}
                className={`p-3 rounded-xl border text-xs font-bold cursor-pointer transition flex items-center gap-2 ${
                  importMode === 'overwrite'
                    ? 'border-buzz bg-buzz-light dark:bg-orange-950/60 text-buzz dark:text-orange-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="importMode"
                  checked={importMode === 'overwrite'}
                  onChange={() => setImportMode('overwrite')}
                  className="accent-buzz"
                />
                <div>
                  <p className="font-black">Overwrite</p>
                  <p className="text-[10px] opacity-80">Replace entire active dataset</p>
                </div>
              </label>
            </div>
          </div>

          {/* Template Download & Reset buttons */}
          <div className="flex justify-between items-center pt-1">
            <button
              onClick={handleDownloadTemplate}
              className="text-xs font-bold text-buzz hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Download Template CSV
            </button>

            <button
              onClick={onResetToDefault}
              className="text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Restore Default 18-Month Dataset
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl hover:bg-slate-300 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            disabled={parsedPreview.length === 0}
            onClick={handleConfirmImport}
            className="px-5 py-2 bg-buzz text-white text-xs font-black rounded-xl hover:bg-buzz-hover transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" /> Confirm & Load Data
          </button>
        </div>
      </div>
    </div>
  );
};
