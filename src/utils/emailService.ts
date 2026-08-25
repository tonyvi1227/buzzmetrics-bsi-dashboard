import { LeadRecord } from '../types/leadGen';

const TARGET_EMAIL = 'tuan.vi@buzzmetrics.com';

export function getEmailSubject(lead: LeadRecord): string {
  switch (lead.variant) {
    case 'A':
      return `[BUZZMETRICS BSI LEAD] Lead mới từ ${lead.company} (${lead.fullName})`;
    case 'B':
      return `[BUZZMETRICS BSI LEAD] Lead mới từ ${lead.company} (${lead.fullName}) - Score: ${lead.leadScore}`;
    case 'C':
      return `[BUZZMETRICS BSI LEAD - FREEMIUM] Lead mới từ ${lead.company} (${lead.fullName})`;
    default:
      return `[BUZZMETRICS BSI LEAD] Lead mới từ ${lead.company} (${lead.fullName})`;
  }
}

export async function sendLeadEmailNotification(lead: LeadRecord): Promise<boolean> {
  const subject = getEmailSubject(lead);

  const payload = {
    _subject: subject,
    _captcha: 'false',
    _template: 'table',
    'Họ và tên': lead.fullName,
    'Email doanh nghiệp': lead.workEmail,
    'Số điện thoại / Zalo': lead.phone,
    'Công ty / Doanh nghiệp': lead.company,
    'Ngành hàng quan tâm': lead.categoryInterest || 'Chưa chọn',
    'Thương hiệu quan tâm': lead.brandInterest || 'Chưa nhập',
    'Mục đích / Need hiện tại': lead.actualNeed || 'General Reference',
    'Nhu cầu với dữ liệu': lead.dataNeed || '18-Month Dataset',
    'Nhu cầu khác / Ghi chú': lead.customNeedNote || 'Không có',
    'Lead Score': lead.leadScore,
    'A/B Variant': `Variant ${lead.variant}`,
    'Thời gian đăng ký': new Date(lead.createdAt).toLocaleString('vi-VN'),
  };

  console.log(`[Email Dispatch Service] Sending lead notification to ${TARGET_EMAIL}:`, payload);

  try {
    const res = await fetch(`https://formsubmit.co/ajax/${TARGET_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => null);
    console.log('[Email Dispatch Service Response]:', data);
    return true;
  } catch (e) {
    console.warn('[Email Dispatch Service Error (fallback to DB)]:', e);
    return true;
  }
}
