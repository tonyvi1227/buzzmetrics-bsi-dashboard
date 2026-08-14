import { LeadRecord } from '../types/leadGen';

const TARGET_EMAIL = 'tuan.vi@buzzmetrics.com';

export function getEmailSubject(lead: LeadRecord): string {
  switch (lead.variant) {
    case 'A':
      return `[BUZZMETRICS BSI LEAD - FORM GATE] Lead mới từ ${lead.company} (${lead.fullName})`;
    case 'B':
      return `[BUZZMETRICS BSI LEAD - AI CHATBOT] Lead mới từ ${lead.company} (${lead.fullName}) - Score: ${lead.leadScore}`;
    case 'C':
      return `[BUZZMETRICS BSI LEAD - FREEMIUM 3-CLICK] Lead mới từ ${lead.company} (${lead.fullName})`;
    default:
      return `[BUZZMETRICS BSI LEAD] Lead mới từ ${lead.company} (${lead.fullName})`;
  }
}

export async function sendLeadEmailNotification(lead: LeadRecord): Promise<boolean> {
  const subject = getEmailSubject(lead);

  const emailPayload = {
    to: TARGET_EMAIL,
    subject: subject,
    body: `
===========================================================
🔔 THÔNG BÁO CÓ LEAD MỚI TỪ BUZZMETRICS BSI DASHBOARD
===========================================================

• Biến thể A/B Test: Variant ${lead.variant}
• Họ và tên: ${lead.fullName}
• Email công ty: ${lead.workEmail}
• Số điện thoại / Zalo: ${lead.phone}
• Công ty / Doanh nghiệp: ${lead.company}

• Ngành hàng (Type-in): ${lead.categoryInterest}
• Thương hiệu quan tâm: ${lead.brandInterest || 'Chưa nhập'}
• Nhu cầu thực tế: ${lead.actualNeed || 'Xem data tham khảo chung'}
${lead.customNeedNote ? `• Ghi chú nhu cầu chi tiết: "${lead.customNeedNote}"` : ''}

• Đánh giá Lead Score: ${lead.leadScore}
• Thời gian đăng ký: ${new Date(lead.createdAt).toLocaleString('vi-VN')}

${lead.aiConversationSummary ? `-----------------------------------------------------------\n📝 TÓM TẮT TƯ VẤN AI CONSULTANT CHATBOT:\n"${lead.aiConversationSummary}"\n-----------------------------------------------------------` : ''}

Dữ liệu lead đã được lưu an toàn vào Supabase Cloud DB & Local Backup.
===========================================================
    `.trim(),
  };

  console.log(`[Email Dispatch Service] Sending lead notification to ${TARGET_EMAIL}:`, emailPayload);

  try {
    await fetch('https://formspree.io/f/xbjnqkyv', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: TARGET_EMAIL,
        subject: subject,
        message: emailPayload.body,
        leadDetails: lead,
      }),
    }).catch(() => {});
    return true;
  } catch (e) {
    return true;
  }
}
