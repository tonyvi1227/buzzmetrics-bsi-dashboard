import React from 'react';
import { X, FileSpreadsheet, Download } from 'lucide-react';
import { CampaignRecord } from '../types/dashboard';
import { exportToExcel, exportToCSV } from '../utils/exportUtils';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: CampaignRecord[];
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  const handleExportExcel = () => {
    exportToExcel(data, `Buzzmetrics_Campaign_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
    onClose();
  };

  const handleExportCSV = () => {
    exportToCSV(data, `Buzzmetrics_Campaign_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-buzz" />
            <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wide">
              Xuất Báo Cáo Phân Tích
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
            Xuất <strong className="text-buzz">{data.length} chiến dịch</strong> đang được chọn theo bộ lọc hiện tại:
          </p>

          <div className="space-y-3">
            <button
              onClick={handleExportExcel}
              className="w-full p-4 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-xs font-black transition flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                <div className="text-left">
                  <p className="text-sm">Xuất File Excel (.xlsx)</p>
                  <p className="text-[10px] font-semibold opacity-80">Format đẹp, nhiều sheet, sẵn sàng gửi báo cáo</p>
                </div>
              </div>
              <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </button>

            <button
              onClick={handleExportCSV}
              className="w-full p-4 rounded-xl border border-buzz-border dark:border-orange-800 bg-buzz-light dark:bg-orange-950/60 hover:bg-orange-100 dark:hover:bg-orange-900/60 text-buzz dark:text-orange-300 text-xs font-black transition flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="w-6 h-6" />
                <div className="text-left">
                  <p className="text-sm">Xuất File CSV (.csv)</p>
                  <p className="text-[10px] font-semibold opacity-80">Định dạng nhẹ, tương thích mở trên mọi phần mềm</p>
                </div>
              </div>
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl hover:bg-slate-300 transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
