export type Language = 'vi' | 'en';

export interface Translations {
  nav: {
    subtitle: string;
    signupUnlock: string;
    unlockFull: string;
    unlocked: string;
    updateData: string;
    exportData: string;
    campaignsTab: string;
    celebsTab: string;
  };
  bsiIntro: {
    title: string;
    pillarsBadge: string;
    introLead: string;
    introTail: string;
    learnMore: string;
    exploreBtn: string;
    hideBtn: string;
    pillars: Array<{
      num: string;
      name: string;
      desc: string;
    }>;
  };
  campaignFilters: {
    title: string;
    desc: string;
    from: string;
    to: string;
    twDoanShown: string;
    twDoanShow: string;
    top10Only: (count: number) => string;
    allCampaigns: (count: number) => string;
    reset: string;
    categoryLabel: string;
    allCategories: string;
    typeLabel: string;
    allTypes: string;
    typeLaunch: string;
    typeLaunchShort: string;
    typeSponsor: string;
    typePromotion: string;
    typeCsr: string;
    typeThematic: string;
    typeThematicShort: string;
    searchLabel: string;
    searchPlaceholder: string;
  };
  campaignBenchmarks: {
    title: string;
    scope: (count: number) => string;
    totalCampaigns: string;
    totalCampaignsTooltip: string;
    avgBuzz: string;
    avgBuzzTooltip: (min: string, max: string) => string;
    avgBsi: string;
    avgBsiTooltip: string;
    avgCfqu: string;
    avgCfquTooltip: string;
    avgQu: string;
    avgQuTooltip: string;
    avgSentiment: string;
    avgSentimentTooltip: string;
    avgRelevancy: string;
    avgRelevancyTooltip: string;
    avgEarned: string;
    avgEarnedTooltip: string;
    cfquBuzzRatio: string;
    cfquBuzzRatioTooltip: string;
  };
  categoryBenchmark: {
    title: (name: string) => string;
    subtitle: string;
    countBadge: (count: number) => string;
    colCategory: string;
    colCampaigns: string;
    colAvgBuzz: string;
    colAvgBsi: string;
    colAvgCfqu: string;
    colAvgQu: string;
    colAvgSentiment: string;
    colAvgRelevancy: string;
    colAvgEarned: string;
  };
  brandMatrix: {
    title: string;
    subtitle: (avgX: string, avgY: string) => string;
    brandsBadge: (count: number) => string;
    tooltipTitle: string;
    tooltipContent: string;
    axisX: string;
    axisY: string;
  };
  campaignTypeChart: {
    title: string;
    centerText: string;
    tooltipTitle: string;
    tooltipContent: string;
    launch: string;
    sponsor: string;
    promotion: string;
    csr: string;
    thematic: string;
  };
  channelShareChart: {
    title: string;
    tooltipTitle: string;
    tooltipContent: string;
  };
  timelineChart: {
    title: string;
    tooltipTitle: string;
    tooltipContent: string;
    labelBuzz: string;
    labelCfqu: string;
  };
  categoryComparisonChart: {
    title: string;
  };
  topBrandsTable: {
    title: string;
    tooltipTitle: string;
    tooltipContent: string;
    colBrand: string;
    colTotalBsi: string;
    colAvgBsi: string;
    colCampaignCount: string;
    colAppearances: string;
    colAvgRank: string;
    colAction: string;
    btnExplore: string;
  };
  campaignTable: {
    title: string;
    subtitle: string;
    tooltipTitle: string;
    tooltipContent: string;
    pageInfo: (page: number, total: number, count: number) => string;
    exportCsv: string;
    colDate: string;
    colBrand: string;
    colCategory: string;
    colCampaign: string;
    colType: string;
    colBuzz: string;
    colBsi: string;
    colCfqu: string;
    colQu: string;
    colSentiment: string;
    colRelevancy: string;
    colEarned: string;
  };
  celebHighlights: {
    peakBsi: string;
    peakBsiBadge: string;
    peakAt: (month: string, year: string) => string;
    mostConsistent: string;
    mostConsistentBadge: string;
    appearancesCount: (count: number) => string;
    avgRank: (rank: number) => string;
    highestAvgBsi: string;
    highestAvgBsiBadge: string;
    totalBsi: (total: string) => string;
    highestQu: string;
    highestQuBadge: string;
    audienceHighImpact: string;
  };
  celebBenchmarks: {
    title: string;
    scope: (count: number) => string;
    totalCelebs: string;
    totalCelebsTooltip: string;
    avgBuzz: string;
    avgBuzzTooltip: string;
    avgBsi: string;
    avgBsiTooltip: string;
    avgCfqu: string;
    avgCfquTooltip: string;
    avgQu: string;
    avgQuTooltip: string;
    avgSentiment: string;
    avgSentimentTooltip: string;
    avgRelevancy: string;
    avgRelevancyTooltip: string;
    cfquBuzzRatio: string;
    cfquBuzzRatioTooltip: string;
  };
  celebFilters: {
    title: string;
    subtitle: string;
    from: string;
    to: string;
    profession: string;
    allProfessions: string;
    searchName: string;
    searchPlaceholder: string;
    resetFilters: string;
    top10Monthly: (count: number) => string;
    allCelebs: (count: number) => string;
  };
  celebTable: {
    title: string;
    subtitle: string;
    tooltipTitle: string;
    tooltipContent: string;
    exportCsv: string;
    colRank: string;
    colName: string;
    colCategory: string;
    colAppearances: string;
    colAvgRank: string;
    colAvgBsi: string;
    colAvgBuzz: string;
    colAvgQu: string;
    colAvgSentiment: string;
    colAvgRelevancy: string;
    colAction: string;
    btnView: string;
    pageInfo: (start: number, end: number, total: number) => string;
  };
  celebCategories: Record<string, string>;
  floatingPreview: {
    title: string;
    interactiveMode: string;
    limitReached: string;
    leftBadge: (remaining: number, total: number) => string;
    usageHint: string;
    limitHint: string;
    unlockUnlimited: string;
    signupUnlock: string;
    haveCode: string;
    minimizedRemaining: (remaining: number, total: number) => string;
    minimizedLimit: string;
  };
  teaserSection: {
    title: string;
    badge: string;
    unlockBtn: string;
    card1Title: string;
    card1Desc: string;
    card2Title: string;
    card2Desc: string;
    card3Title: string;
    card3Desc: string;
  };
  advancedChartsToolbar: {
    title: string;
    expand: string;
    collapse: string;
  };
  gatedOverlay: {
    title: string;
    defaultDesc: string;
    limitReachedDesc: string;
    submittedDesc: string;
    unlockFullRegistered: string;
    signupFullReport: string;
    havePasscode: string;
  };
  leadForm: {
    title: string;
    subtitle: string;
    sec1Title: string;
    fullName: string;
    fullNamePlaceholder: string;
    phone: string;
    phonePlaceholder: string;
    workEmail: string;
    workEmailPlaceholder: string;
    corporateDomainHint: string;
    company: string;
    companyPlaceholder: string;
    sec2Title: string;
    industryCategory: string;
    targetBrand: string;
    targetBrandPlaceholder: string;
    otherCategoryPlaceholder: string;
    sec3Title: string;
    currentNeedTitle: string;
    needs: Record<string, string>;
    dataReqTitle: string;
    dataReqs: Record<string, string>;
    additionalNotesTitle: string;
    additionalNotesPlaceholder: string;
    submitBtn: string;
    submittingBtn: string;
    successTitle: string;
    successDesc: string;
    gotItBtn: string;
    errorRequired: string;
    errorEmailDomain: string;
  };
  campaignDetail: {
    vsIndustryAvg: string;
    atIndustryAvg: string;
    compareWithAvg: (category: string) => string;
    radarViewBtn: string;
    tableViewBtn: string;
    campaignsInCategory: (count: number) => string;
    radarSubtitle: string;
    colMetric: string;
    colThisCampaign: string;
    colIndustryAvg: (category: string) => string;
    colDiff: string;
    channelDistTitle: string;
    earnedMediaTitle: string;
    paidMediaTitle: string;
    ownedMediaTitle: string;
  };
  celebDetail: {
    appearancesCount: (count: number) => string;
    avgRankBadge: (rank: number, best: number) => string;
    historicalTrendTitle: (count: number) => string;
    tableTitle: string;
    colTimeline: string;
    colMonthRank: string;
    colBsi: string;
    colBuzz: string;
    colContentQu: string;
    colQuUser: string;
    colSentiment: string;
    colRelevance: string;
  };
  exportModal: {
    title: string;
    exportScope: (count: number) => string;
    excelTitle: string;
    excelDesc: string;
    csvTitle: string;
    csvDesc: string;
    closeBtn: string;
  };
  celebCharts: {
    matrixTitle: string;
    matrixBadge: string;
    matrixTooltipTitle: string;
    matrixTooltipContent: string;
    categoryShareTitle: string;
    categoryShareBadge: string;
    categoryShareTooltipTitle: string;
    categoryShareTooltipContent: string;
    consistencyTitle: string;
    consistencyBadge: string;
    consistencyTooltipTitle: string;
    consistencyTooltipContent: string;
    consistencyYAxis: string;
    noData: string;
  };
  footer: {
    hotline: string;
    direct: string;
    datasetScope: (count: number) => string;
  };
  modals: {
    unlockTitle: string;
    unlockSubtitle: string;
    unlockCodeLabel: string;
    unlockCodePlaceholder: string;
    unlockSubmitBtn: string;
    unlockSuccessTitle: string;
    unlockSuccessDesc: string;
    unlockError: string;
    leadFormTitle: string;
    exportTitle: string;
    close: string;
  };
}

export const translations: Record<Language, Translations> = {
  vi: {
    nav: {
      subtitle: 'Thông tin chi tiết từ các Chiến dịch & Người có ảnh hưởng nổi bật trên mạng xã hội',
      signupUnlock: 'Đăng ký nhận báo cáo chuyên sâu',
      unlockFull: 'Mở khóa bản đầy đủ',
      unlocked: 'Đã mở khóa',
      updateData: 'Cập nhật dữ liệu',
      exportData: 'Xuất dữ liệu',
      campaignsTab: 'Top Campaign Benchmark',
      celebsTab: 'Top Influencers Benchmark',
    },
    bsiIntro: {
      title: 'TIÊU CHUẨN BSI TOP10',
      pillarsBadge: '6 Trụ cột đo lường',
      introLead: 'Chỉ số BSI — Buzzmetrics Social Index là chỉ số giúp đánh giá hiệu quả của các chiến dịch/sự kiện/người nổi tiếng trên mạng xã hội một cách toàn diện. Thông qua Bảng xếp hạng BSI Top10, Buzzmetrics sẽ cho bạn biết những chiến dịch/sự kiện/người nổi tiếng nào đang tạo ra tác động thực sự và tích cực đối với cộng đồng mạng.',
      introTail: '',
      learnMore: 'Tìm hiểu thêm về BSI Top10',
      exploreBtn: 'Xem 6 trụ cột đo lường',
      hideBtn: 'Thu gọn 6 trụ cột',
      pillars: [
        {
          num: '01',
          name: 'BUZZ VOLUME',
          desc: 'Tổng lượng thảo luận của chiến dịch/sự kiện/người nổi tiếng trên các kênh social media.',
        },
        {
          num: '02',
          name: 'QUALIFIED USERS (QU)',
          desc: 'Số lượng người dùng chất lượng thực sự tham gia thảo luận, đã loại bỏ spam và tài khoản ảo.',
        },
        {
          num: '03',
          name: 'CONTENT FROM QUALIFIED USERS (CFQU)',
          desc: 'Lượng thảo luận được tạo ra bởi người dùng chất lượng, thể hiện sự quan tâm thực tế.',
        },
        {
          num: '04',
          name: 'SENTIMENT SCORE TỪ QU',
          desc: 'Chỉ số sắc thái cảm xúc của người dùng chất lượng, phản ánh mức độ yêu thích thương hiệu.',
        },
        {
          num: '05',
          name: 'RELEVANCE SCORE TỪ QU',
          desc: 'Tỷ lệ thảo luận có nội dung thực sự liên quan đến chiến dịch và thông điệp cốt lõi.',
        },
        {
          num: '06',
          name: 'EARNED MEDIA TỪ QU',
          desc: 'Lượng thảo luận tự nhiên do cộng đồng tạo ra và lan tỏa mà không cần thúc đẩy trả phí.',
        },
      ],
    },
    campaignFilters: {
      title: 'BỘ LỌC THÔNG MINH',
      desc: 'Lọc theo Khoảng thời gian (Từ ... Đến ...) ➔ Ngành hàng ➔ Loại chiến dịch ➔ Từ khóa Thương hiệu',
      from: 'TỪ .....',
      to: 'ĐẾN .....',
      twDoanShown: 'TW Đoàn: Đang hiện',
      twDoanShow: 'Hiện TW Đoàn',
      top10Only: (count: number) => `Top 10 theo tháng (${count} Chiến dịch)`,
      allCampaigns: (count: number) => `Toàn bộ ${count} Chiến dịch`,
      reset: 'Đặt lại',
      categoryLabel: 'NGÀNH HÀNG',
      allCategories: 'Tất cả ngành hàng',
      typeLabel: 'LOẠI CHIẾN DỊCH',
      allTypes: 'Tất cả loại chiến dịch',
      typeLaunch: 'Ra mắt SP & Tái định vị',
      typeLaunchShort: 'Ra mắt SP',
      typeSponsor: 'Tài trợ & Sự kiện',
      typePromotion: 'Khuyến mại',
      typeCsr: 'CSR & Bền vững',
      typeThematic: 'Thematic & Định vị',
      typeThematicShort: 'Thematic',
      searchLabel: 'TÌM THƯƠNG HIỆU / CHIẾN DỊCH',
      searchPlaceholder: 'Tìm Thương hiệu / Tên chiến dịch...',
    },
    campaignBenchmarks: {
      title: 'TOP CAMPAIGN BENCHMARK (PHẠM VI BỘ LỌC HIỆN TẠI)',
      scope: (count: number) => `Phạm vi: ${count} Chiến dịch`,
      totalCampaigns: 'Tổng chiến dịch',
      totalCampaignsTooltip: 'Tổng số chiến dịch phù hợp với tiêu chí lọc hiện tại.',
      avgBuzz: 'AVG Buzz Vol',
      avgBuzzTooltip: (min: string, max: string) => `Lượng thảo luận trung bình mỗi chiến dịch trong kỳ lọc. Thấp nhất: ${min} | Cao nhất: ${max}`,
      avgBsi: 'AVG BSI Score',
      avgBsiTooltip: 'Điểm sức khỏe thương hiệu BSI trung bình của các chiến dịch được chọn.',
      avgCfqu: 'AVG CFQU',
      avgCfquTooltip: 'Lượng thảo luận trung bình từ người dùng chất lượng (Content from Qualified Users).',
      avgQu: 'Average QU',
      avgQuTooltip: 'Số lượng người dùng chất lượng thực sự tham gia thảo luận trung bình (Qualified Users).',
      avgSentiment: 'AVG Sentiment',
      avgSentimentTooltip: 'Chỉ số cảm xúc trung bình của các chiến dịch được chọn.',
      avgRelevancy: 'AVG Relevancy',
      avgRelevancyTooltip: 'Mức độ liên quan trung bình của thảo luận tới thương hiệu/thông điệp chiến dịch.',
      avgEarned: 'AVG Earned %',
      avgEarnedTooltip: 'Tỷ lệ thảo luận lan tỏa tự nhiên (Earned Media) trung bình do cộng đồng tạo ra.',
      cfquBuzzRatio: '% CFQU / BUZZ',
      cfquBuzzRatioTooltip: 'Tỷ lệ phần trăm thảo luận từ người dùng chất lượng (CFQU) trên tổng lượng thảo luận (Buzz Volume).',
    },
    categoryBenchmark: {
      title: (name: string) => `Bảng chuẩn đối sánh ngành chuyên biệt: ${name}`,
      subtitle: 'Các chỉ số chuẩn và mức cơ sở hiệu quả riêng theo từng ngành',
      countBadge: (count: number) => `${count} Chiến dịch trong ngành`,
      colCategory: 'Ngành hàng',
      colCampaigns: 'Số chiến dịch',
      colAvgBuzz: 'Avg Buzz Vol',
      colAvgBsi: 'Avg BSI Score',
      colAvgCfqu: 'Avg CFQU',
      colAvgQu: 'Avg QU',
      colAvgSentiment: 'Avg Sentiment',
      colAvgRelevancy: 'Avg Relevancy',
      colAvgEarned: 'Avg % Earned',
    },
    brandMatrix: {
      title: 'BRAND POSITIONING MATRIX',
      subtitle: (avgX: string, avgY: string) => `Giá trị trung bình: AVG Buzz = ${avgX} | AVG BSI = ${avgY}`,
      brandsBadge: (count: number) => `${count} THƯƠNG HIỆU`,
      tooltipTitle: 'Brand Positioning Matrix',
      tooltipContent: 'Ma trận phân tán chia các thương hiệu thành 4 phân khúc hiệu quả dựa trên giá trị trung bình thống kê của Lượng thảo luận (Trục X) và Điểm BSI (Trục Y).',
      axisX: 'AVG Buzz Volume (K)',
      axisY: 'AVG BSI Score',
    },
    campaignTypeChart: {
      title: 'PHÂN BỔ THEO LOẠI CHIẾN DỊCH',
      centerText: 'CHIẾN DỊCH',
      tooltipTitle: 'Phân bổ theo loại chiến dịch',
      tooltipContent: 'Tỷ trọng số lượng chiến dịch theo từng loại hình: Ra mắt SP, Tài trợ/Sự kiện, Khuyến mại, CSR, Thematic.',
      launch: 'Ra mắt SP',
      sponsor: 'Tài trợ & Sự kiện',
      promotion: 'Khuyến mại',
      csr: 'CSR & Bền vững',
      thematic: 'Thematic',
    },
    channelShareChart: {
      title: 'TỶ TRỌNG KÊNH PHÂN PHỐI',
      tooltipTitle: 'Media Channel Share (Paid, Owned, Earned)',
      tooltipContent: 'Tỷ lệ thảo luận phân bổ trên 3 kênh: Trả phí (Paid), Kênh sở hữu (Owned) và Lan tỏa tự nhiên (Earned).',
    },
    timelineChart: {
      title: 'XU HƯỚNG BUZZ & % CFQU 18 THÁNG',
      tooltipTitle: 'Xu hướng thời gian (Buzz Volume & % CFQU)',
      tooltipContent: 'Diễn biến tổng thảo luận hàng tháng và tỷ lệ % thảo luận sạch từ người dùng chất lượng qua 18 tháng.',
      labelBuzz: 'Buzz Vol (Triệu)',
      labelCfqu: '% CFQU',
    },
    categoryComparisonChart: {
      title: 'SO SÁNH BSI GIỮA CÁC NGÀNH HÀNG',
    },
    topBrandsTable: {
      title: 'TOP THƯƠNG HIỆU HÀNG ĐẦU BSI',
      tooltipTitle: 'Top Performing Brands',
      tooltipContent: 'Bảng xếp hạng các thương hiệu có tổng điểm BSI cao nhất qua các kỳ chiến dịch.',
      colBrand: 'THƯƠNG HIỆU',
      colTotalBsi: 'TỔNG BSI',
      colAvgBsi: 'ĐIỂM BSI TB',
      colCampaignCount: 'SỐ CHIẾN DỊCH',
      colAppearances: 'SỐ THÁNG TOP 10',
      colAvgRank: 'THỨ HẠNG TB',
      colAction: 'CHI TIẾT',
      btnExplore: 'Xem',
    },
    campaignTable: {
      title: 'BẢNG CHI TIẾT HIỆU QUẢ CHIẾN DỊCH',
      subtitle: 'Nhấp vào bất kỳ dòng nào để xem phân tích chuyên sâu & biểu đồ radar benchmark.',
      tooltipTitle: 'Campaign Detail Performance Table',
      tooltipContent: 'Cơ sở dữ liệu chi tiết toàn bộ chiến dịch với các chỉ số đo lường Buzz, BSI, Sentiment, Relevancy và phân bổ kênh. Nhấp để xem chi tiết.',
      pageInfo: (page: number, total: number, count: number) => `Trang ${page} / ${total} (${count} chiến dịch)`,
      exportCsv: 'Xuất CSV',
      colDate: 'THỜI GIAN',
      colBrand: 'THƯƠNG HIỆU',
      colCategory: 'NGÀNH HÀNG',
      colCampaign: 'TÊN CHIẾN DỊCH',
      colType: 'LOẠI',
      colBuzz: 'BUZZ VOL',
      colBsi: 'BSI SCORE',
      colCfqu: 'CONTENT QU',
      colQu: 'QU USER',
      colSentiment: 'SENTIMENT',
      colRelevancy: 'RELEVANCY',
      colEarned: 'EARNED MEDIA %',
    },
    celebHighlights: {
      peakBsi: 'ĐIỂM BSI THÁNG CAO NHẤT',
      peakBsiBadge: 'Kỷ lục Top 1',
      peakAt: (month: string, year: string) => `Kỷ lục: ${month}/${year}`,
      mostConsistent: 'GÓP MẶT TOP10 NHIỀU NHẤT',
      mostConsistentBadge: 'Phong độ bền bỉ',
      appearancesCount: (count: number) => `${count} Tháng trong Top 10`,
      avgRank: (rank: number) => `Thứ hạng TB: #${rank}`,
      highestAvgBsi: 'ĐIỂM BSI TRUNG BÌNH CAO NHẤT',
      highestAvgBsiBadge: 'Top AVG BSI',
      totalBsi: (total: string) => `Tổng BSI: ${total}`,
      highestQu: 'THU HÚT QU CAO NHẤT',
      highestQuBadge: 'Tương tác thực cao',
      audienceHighImpact: 'Đối tượng: Tác động lớn',
    },
    celebBenchmarks: {
      title: 'TOP INFLUENCERS BENCHMARK (PHẠM VI BỘ LỌC HIỆN TẠI)',
      scope: (count: number) => `Phạm vi: ${count} Influencers`,
      totalCelebs: 'Số lượng Influencers',
      totalCelebsTooltip: 'Số lượng Influencers xuất hiện ít nhất một lần trong Top 10 BSI trong kỳ lọc.',
      avgBuzz: 'AVG Buzz Vol',
      avgBuzzTooltip: 'Tổng số bài đăng, bình luận và lượt chia sẻ liên quan đến Influencers.',
      avgBsi: 'AVG BSI Score',
      avgBsiTooltip: 'BSI = Buzz Volume * Sentiment Index * Content QU * Qualified User * Relevance Score.',
      avgCfqu: 'AVG CFQU',
      avgCfquTooltip: 'Lượng thảo luận thực chất chứa nội dung liên quan (Content QU).',
      avgQu: 'Average QU',
      avgQuTooltip: 'Số lượng người dùng chất lượng thực sự tham gia thảo luận về Influencers.',
      avgSentiment: 'AVG Sentiment',
      avgSentimentTooltip: 'Chỉ số cảm xúc trung bình (-1 đến 1). Mức >= 0.9 thể hiện cảm tình tích cực áp đảo.',
      avgRelevancy: 'AVG Relevancy',
      avgRelevancyTooltip: 'Tỷ lệ thảo luận trực tiếp nhắc đến Influencers.',
      cfquBuzzRatio: '% CFQU / BUZZ',
      cfquBuzzRatioTooltip: 'Tỷ lệ chất lượng = (Content QU / Buzz Volume) * 100%.',
    },
    celebFilters: {
      title: 'BỘ LỌC THÔNG MINH INFLUENCERS',
      subtitle: 'Lọc theo Khoảng thời gian (Từ ... Đến ...) ➔ Lĩnh vực ➔ Tìm tên Influencers',
      from: 'TỪ .....',
      to: 'ĐẾN .....',
      profession: 'LĨNH VỰC HOẠT ĐỘNG',
      allProfessions: 'Tất cả lĩnh vực',
      searchName: 'TÌM TÊN INFLUENCERS',
      searchPlaceholder: 'Tìm tên Influencers...',
      resetFilters: 'Đặt lại',
      top10Monthly: (count: number) => `Chỉ Top 10 BSI (${count} lượt)`,
      allCelebs: (count: number) => `Toàn bộ ${count} lượt`,
    },
    celebTable: {
      title: 'BẢNG HIỆU QUẢ INFLUENCERS CHI TIẾT',
      subtitle: 'Nhấp vào bất kỳ dòng nào để xem chi tiết lịch sử xếp hạng và các chiến dịch liên quan.',
      tooltipTitle: 'Bảng xếp hạng hiệu quả Influencers',
      tooltipContent: 'Cơ sở dữ liệu tổng hợp hiệu quả theo từng Influencer. Nhấp vào dòng để xem chi tiết xu hướng BSI hàng tháng, độ tiếp cận và phân tích tương tác.',
      exportCsv: 'Xuất CSV',
      colRank: '#',
      colName: 'INFLUENCERS / KOL',
      colCategory: 'LĨNH VỰC',
      colAppearances: 'SỐ LẦN VÀO TOP 10',
      colAvgRank: 'THỨ HẠNG TB TOP 10',
      colAvgBsi: 'AVG BSI SCORE',
      colAvgBuzz: 'AVG BUZZ VOL',
      colAvgQu: 'QUALIFIED USER (QU)',
      colAvgSentiment: 'AVG SENTIMENT',
      colAvgRelevancy: 'AVG RELEVANCE',
      colAction: 'CHI TIẾT',
      btnView: 'Xem',
      pageInfo: (start: number, end: number, total: number) => `Hiển thị ${start} - ${end} trên tổng số ${total} Influencers`,
    },
    celebCategories: {
      'Actor & Film': 'Diễn viên & Điện ảnh',
      'Beauty & Model': 'Sắc đẹp & Người mẫu',
      'Creator': 'Nhà sáng tạo nội dung',
      'Music': 'Âm nhạc',
      'Others': 'Khác',
      'Sports': 'Thể thao',
      'Games': 'Games',
      'TV & MC': 'Truyền hình & MC',
    },
    floatingPreview: {
      title: 'BẢN TRẢI NGHIỆM',
      interactiveMode: '',
      limitReached: 'Đã hết lượt dùng thử',
      leftBadge: (remaining: number, total: number) => `CÒN ${remaining}/${total} LƯỢT`,
      usageHint: 'Mỗi thao tác lọc hoặc mở rộng biểu đồ tính là 1 lượt dùng thử.',
      limitHint: 'Bạn đã sử dụng hết 5 lượt dùng thử. Đăng ký để mở khóa toàn bộ báo cáo!',
      unlockUnlimited: 'Mở khóa toàn bộ báo cáo',
      signupUnlock: 'Đăng ký nhận quyền truy cập',
      haveCode: 'Đã có Mã truy cập? Nhập tại đây',
      minimizedRemaining: (remaining: number, total: number) => `Dùng thử: Còn ${remaining}/${total} lượt`,
      minimizedLimit: 'Đã hết lượt dùng thử (0/5)',
    },
    teaserSection: {
      title: 'Những tính năng sẽ có ở Báo cáo chuyên sâu',
      badge: 'Phân tích chuyên sâu',
      unlockBtn: 'Mở khóa toàn bộ dữ liệu',
      card1Title: 'Đo lường ROI & Đánh giá sau chiến dịch',
      card1Desc: 'Đối chuẩn sức khỏe chiến dịch với Top 10 dẫn đầu ngành hàng và đánh giá mức độ lan tỏa tự nhiên thực chất (% Earned Media so với Paid Media).',
      card2Title: 'Xu hướng Ngành hàng & Đối thủ',
      card2Desc: 'Theo dõi biến động đa ngành hàng, phân tích thị phần thảo luận và chẩn đoán các yếu tố thúc đẩy cảm xúc người dùng.',
      card3Title: 'Bức tranh Người nổi tiếng hàng đầu',
      card3Desc: 'Phân tích Người nổi tiếng & Người có ảnh hưởng với độ liên quan (Relevancy) đã xác thực, chỉ số cảm xúc tích cực và độ cộng hưởng thực từ công chúng.',
    },
    advancedChartsToolbar: {
      title: 'BIỂU ĐỒ PHÂN TÍCH CHUYÊN SÂU',
      expand: 'Mở rộng',
      collapse: 'Thu gọn',
    },
    gatedOverlay: {
      title: 'MỞ KHÓA BÁO CÁO CHIẾN DỊCH BSI',
      defaultDesc: 'Đăng ký để mở khóa phân tích chuyên sâu, đối chuẩn đối thủ cạnh tranh và báo cáo xếp hạng BSI hàng tháng.',
      limitReachedDesc: 'Bạn đã dùng hết 5 lượt dùng thử miễn phí. Đăng ký ngay để Buzzmetrics cấp quyền truy cập toàn bộ không giới hạn!',
      submittedDesc: 'Đội ngũ Buzzmetrics đã tiếp nhận đăng ký của bạn. Nếu bạn đã nhận được Mã truy cập, vui lòng nhấp bên dưới để mở khóa.',
      unlockFullRegistered: 'MỞ KHÓA BẢN ĐẦY ĐỦ (Đã đăng ký)',
      signupFullReport: 'ĐĂNG KÝ ĐỂ MỞ KHÓA TOÀN BỘ BÁO CÁO',
      havePasscode: 'Đã có Mã truy cập? Nhập tại đây',
    },
    leadForm: {
      title: 'Đăng ký nhận báo cáo chuyên sâu Chiến dịch BSI',
      subtitle: 'Gửi thông tin dự án của bạn để đội ngũ Buzzmetrics xác thực và cấp quyền truy cập phân tích đầy đủ.',
      sec1Title: '1. THÔNG TIN LIÊN HỆ (*)',
      fullName: 'HỌ VÀ TÊN (*)',
      fullNamePlaceholder: 'VD: Nguyễn Văn A',
      phone: 'SỐ ĐIỆN THOẠI / ZALO (*)',
      phonePlaceholder: '09x xxx xxx',
      workEmail: 'EMAIL CÔNG VIỆC (*)',
      workEmailPlaceholder: 'name@company.com',
      corporateDomainHint: 'Email doanh nghiệp (không dùng @gmail, @yahoo)',
      company: 'CÔNG TY / THƯƠNG HIỆU (*)',
      companyPlaceholder: 'VD: Unilever, Vinamilk...',
      sec2Title: '2. NGÀNH HÀNG & THƯƠNG HIỆU QUAN TÂM (*)',
      industryCategory: 'NGÀNH HÀNG (*)',
      targetBrand: 'THƯƠNG HIỆU MỤC TIÊU',
      targetBrandPlaceholder: 'VD: Heineken, Samsung...',
      otherCategoryPlaceholder: 'Vui lòng ghi rõ ngành hàng của bạn...',
      sec3Title: '3. NHU CẦU DỰ ÁN & MỤC TIÊU DỮ LIỆU (*)',
      currentNeedTitle: 'MỤC ĐÍCH / NHU CẦU HIỆN TẠI (*)',
      needs: {
        'General Data Benchmark Reference': 'Tham khảo chuẩn chỉ số chung (Benchmark) ngành hàng',
        'Upcoming Campaign / Product Launch Planning': 'Lập kế hoạch cho Chiến dịch / Ra mắt sản phẩm sắp tới',
        'Competitor BSI & Sentiment Benchmarking': 'Đối chuẩn BSI & Cảm xúc với đối thủ cạnh tranh',
        'Post-Campaign Performance & ROI Evaluation': 'Đánh giá hiệu quả sau chiến dịch & đo lường ROI',
      },
      dataReqTitle: 'YÊU CẦU VỀ DỮ LIỆU (*)',
      dataReqs: {
        'Full 18-Month BSI Benchmark Data Access': 'Bộ dữ liệu Benchmark BSI 18 tháng',
        'Category Deep-Dive & Advanced Spider Radar': 'Phân tích ngành sâu & Biểu đồ Radar đa chiều',
        'Top Influencer Landscape & KOL Vetting': 'Bức tranh Người ảnh hưởng & Đánh giá KOLs',
        'Tailored Custom Social Listening Report': 'Báo cáo Lắng nghe Mạng xã hội chuyên biệt theo yêu cầu',
      },
      additionalNotesTitle: 'YÊU CẦU BỔ SUNG / GHI CHÚ',
      additionalNotesPlaceholder: 'Ghi rõ mục tiêu chiến dịch, phạm vi hoặc thời gian dự kiến...',
      submitBtn: 'GỬI ĐĂNG KÝ NHẬN QUYỀN TRUY CẬP',
      submittingBtn: 'Đang gửi thông tin đăng ký...',
      successTitle: 'ĐĂNG KÝ THÀNH CÔNG!',
      successDesc: 'Cảm ơn bạn đã quan tâm! Đội ngũ Phát triển Khách hàng của Buzzmetrics đã tiếp nhận thông tin và sẽ liên hệ qua Điện thoại/Email để xác thực và cấp Mã truy cập trong thời gian sớm nhất.',
      gotItBtn: 'ĐÃ HIỂU',
      errorRequired: 'Vui lòng điền đầy đủ các thông tin liên hệ bắt buộc (*).',
      errorEmailDomain: 'Vui lòng sử dụng email công việc/doanh nghiệp chính thức. Tên miền email cá nhân (@gmail, @yahoo, @outlook...) không được chấp nhận.',
    },
    campaignDetail: {
      vsIndustryAvg: 'so với TB ngành',
      atIndustryAvg: 'Ngang mức TB ngành',
      compareWithAvg: (category: string) => `SO SÁNH VỚI MỨC TRUNG BÌNH NGÀNH ${category.toUpperCase()}`,
      radarViewBtn: 'Biểu đồ Radar đa chiều',
      tableViewBtn: 'Bảng dữ liệu chi tiết',
      campaignsInCategory: (count: number) => `${count} Chiến dịch trong ngành`,
      radarSubtitle: 'So sánh % Earned, Relevancy, CFQU, QU & Sentiment của chiến dịch (Màu cam) với mức chuẩn 100 của ngành (Xanh đậm).',
      colMetric: 'Chỉ số phân tích',
      colThisCampaign: 'Chiến dịch này',
      colIndustryAvg: (category: string) => `Mức TB ngành (${category})`,
      colDiff: 'Chênh lệch (so với TB)',
      channelDistTitle: 'PHÂN BỔ THEO KÊNH TRUYỀN THÔNG (MEDIA BREAKDOWN)',
      earnedMediaTitle: 'Earned Media (Thảo luận tự nhiên)',
      paidMediaTitle: 'Paid Media (Thảo luận trả phí / Tài trợ)',
      ownedMediaTitle: 'Owned Media (Kênh chính thức thương hiệu)',
    },
    celebDetail: {
      appearancesCount: (count: number) => `Góp mặt Top 10 BSI: ${count} Tháng`,
      avgRankBadge: (rank: number, best: number) => `Hạng TB: #${rank} (Cao nhất: #${best})`,
      historicalTrendTitle: (count: number) => `XU HƯỚNG BSI THEO THỜI GIAN (${count} Tháng lọt Top 10)`,
      tableTitle: 'Chi tiết hiệu quả BSI theo từng tháng',
      colTimeline: 'Thời gian',
      colMonthRank: 'Thứ hạng tháng',
      colBsi: 'Điểm BSI',
      colBuzz: 'Buzz Volume',
      colContentQu: 'Content QU',
      colQuUser: 'Người dùng chất lượng (QU)',
      colSentiment: 'Chỉ số cảm xúc',
      colRelevance: 'Độ liên quan',
    },
    exportModal: {
      title: 'Xuất dữ liệu báo cáo',
      exportScope: (count: number) => `Xuất ${count} chiến dịch phù hợp với bộ lọc hiện tại:`,
      excelTitle: 'Xuất file Excel (.xlsx)',
      excelDesc: 'Bảng tính định dạng chuyên nghiệp đầy đủ dữ liệu',
      csvTitle: 'Xuất file CSV (.csv)',
      csvDesc: 'Định dạng dữ liệu bảng raw gọn nhẹ',
      closeBtn: 'Đóng',
    },
    celebCharts: {
      matrixTitle: 'INFLUENCERS POSITIONING MATRIX',
      matrixBadge: 'POSITIONING MATRIX',
      matrixTooltipTitle: 'Ma trận định vị Influencers',
      matrixTooltipContent: 'Phân tích 4 chiều: Trục X = Thứ hạng trung bình (càng sang phải càng gần #1); Trục Y = Điểm BSI trung bình; Kích thước bong bóng = Tổng số tháng lọt Top 10; Màu sắc = Lĩnh vực.',
      categoryShareTitle: 'TỶ TRỌNG INFLUENCERS THEO LĨNH VỰC',
      categoryShareBadge: 'TỶ TRỌNG LĨNH VỰC',
      categoryShareTooltipTitle: 'Phân bố theo lĩnh vực',
      categoryShareTooltipContent: 'Tỷ lệ phần trăm và số lượng Influencers lọt Top 10 BSI theo từng lĩnh vực.',
      consistencyTitle: 'INFLUENCERS CÓ PHONG ĐỘ BỀN BỈ NHẤT',
      consistencyBadge: 'TÍNH BỀN BỈ THỨ HẠNG',
      consistencyTooltipTitle: 'Tính bền bỉ thứ hạng',
      consistencyTooltipContent: 'Top những Influencers duy trì vị trí trong BSI Top 10 bền bỉ nhất trong giai đoạn được lọc.',
      consistencyYAxis: 'Số tháng lọt Top 10 BSI',
      noData: 'Không có dữ liệu cho bộ lọc này',
    },
    footer: {
      hotline: 'Hotline: (+84) 91 904 0201',
      direct: 'Tư vấn trực tiếp: (+84) 909 267 338',
      datasetScope: (count: number) => `Phạm vi dữ liệu: T1/2025 – T6/2026 (18 Tháng) • Tổng số bản ghi: ${count}`,
    },
    modals: {
      unlockTitle: 'Mở khóa bản đầy đủ',
      unlockSubtitle: 'Nhập mã truy cập để mở khóa toàn bộ dữ liệu Dashboard',
      unlockCodeLabel: 'MÃ TRUY CẬP / PASSCODE',
      unlockCodePlaceholder: 'Nhập mã passcode...',
      unlockSubmitBtn: 'Mở khóa Dashboard',
      unlockSuccessTitle: 'TRUY CẬP ĐƯỢC CHẤP THUẬN!',
      unlockSuccessDesc: 'Đã mở khóa phiên bản Dashboard đầy đủ thành công.',
      unlockError: 'Mã passcode không hợp lệ. Vui lòng kiểm tra lại.',
      leadFormTitle: 'Đăng ký nhận báo cáo chuyên sâu & tư vấn ngành',
      exportTitle: 'Xuất dữ liệu báo cáo',
      close: 'Đóng',
    },
  },
  en: {
    nav: {
      subtitle: 'Insights from most prominent Campaigns & Influencers on social media',
      signupUnlock: 'Sign up to Unlock Insights',
      unlockFull: 'Unlock Full Version',
      unlocked: 'Unlocked',
      updateData: 'Update Data',
      exportData: 'Export',
      campaignsTab: 'Top Campaign Benchmark',
      celebsTab: 'Top Influencers Benchmark',
    },
    bsiIntro: {
      title: 'ABOUT BSI TOP10',
      pillarsBadge: '6 Measurement Pillars',
      introLead: 'The BSI — Buzzmetrics Social Index is an indicator that helps assess the effectiveness of social media campaigns/events/influencers in a comprehensive way. With BSI Top10 Ranking, Buzzmetrics will tell you which campaigns/events/influencers are making a real impact and making a positive impact for the online community.',
      introTail: '',
      learnMore: 'Learn more about BSI Top10',
      exploreBtn: 'Explore 6 Pillars',
      hideBtn: 'Hide 6 Pillars',
      pillars: [
        {
          num: '01',
          name: 'BUZZ VOLUME',
          desc: 'Total discussion volume, measuring the overall noise level and social buzz scale of the campaign across platforms.',
        },
        {
          num: '02',
          name: 'QUALIFIED USERS (QU)',
          desc: 'Total volume of authentic, high-quality users actively engaging in discussions, filtering out spam and bots.',
        },
        {
          num: '03',
          name: 'CONTENT FROM QUALIFIED USERS (CFQU)',
          desc: 'Discussion volume generated specifically by qualified users focused on brand messages and product features (CFQU).',
        },
        {
          num: '04',
          name: 'SENTIMENT SCORE FROM QU',
          desc: 'Net emotional perception index calculated strictly across qualified users, reflecting genuine brand affinity.',
        },
        {
          num: '05',
          name: 'RELEVANCE SCORE FROM QU',
          desc: 'Proportion of discussions genuinely relevant to the campaign core message and key brand attributes.',
        },
        {
          num: '06',
          name: 'EARNED MEDIA FROM QU',
          desc: 'Spontaneous, organic discussions created by qualified users without brand-paid distribution push.',
        },
      ],
    },
    campaignFilters: {
      title: 'SMART CASCADING FILTERS',
      desc: 'Filter by Date Range (From ... To ...) ➔ Category ➔ Campaign Type ➔ Brand Keyword',
      from: 'FROM (START)',
      to: 'TO (END)',
      twDoanShown: 'TW Đoàn: Shown',
      twDoanShow: 'Show TW Đoàn',
      top10Only: (count: number) => `Top 10 Monthly (${count} Campaigns)`,
      allCampaigns: (count: number) => `All ${count} Campaigns`,
      reset: 'Reset',
      categoryLabel: 'CATEGORY',
      allCategories: 'All Categories',
      typeLabel: 'CAMPAIGN TYPE',
      allTypes: 'All Campaign Types',
      typeLaunch: 'Product Launch & Rebranding',
      typeLaunchShort: 'Product Launch',
      typeSponsor: 'Sponsor & Event',
      typePromotion: 'Promotion',
      typeCsr: 'CSR & Sustainability',
      typeThematic: 'Thematic & Brand Building',
      typeThematicShort: 'Thematic',
      searchLabel: 'SEARCH BRAND / CAMPAIGN',
      searchPlaceholder: 'Search Brand/Campaign...',
    },
    campaignBenchmarks: {
      title: 'TOP CAMPAIGN BENCHMARK (CURRENT FILTER SCOPE)',
      scope: (count: number) => `Scope: ${count} Campaigns`,
      totalCampaigns: 'Total Campaigns',
      totalCampaignsTooltip: 'Total number of campaigns matching the current filter criteria.',
      avgBuzz: 'AVG Buzz Vol',
      avgBuzzTooltip: (min: string, max: string) => `Average total social discussions per campaign in dataset. Min: ${min} | Max: ${max}`,
      avgBsi: 'AVG BSI Score',
      avgBsiTooltip: 'Average Buzzmetrics Social Index (BSI) overall brand health score across selected campaigns.',
      avgCfqu: 'AVG CFQU',
      avgCfquTooltip: 'Content from Qualified Users - Average discussions/posts generated by real, high-quality users.',
      avgQu: 'Average QU',
      avgQuTooltip: 'Qualified Users - Average number of genuine unique users participating in discussions.',
      avgSentiment: 'AVG Sentiment',
      avgSentimentTooltip: 'Average Sentiment Index score across selected campaigns.',
      avgRelevancy: 'AVG Relevancy',
      avgRelevancyTooltip: 'Average relevance score of discussions to the brand/campaign message.',
      avgEarned: 'AVG Earned %',
      avgEarnedTooltip: 'Average percentage of organic viral discussions (Earned Media) generated by the community.',
      cfquBuzzRatio: '% CFQU / BUZZ',
      cfquBuzzRatioTooltip: 'Percentage of discussions from qualified users (CFQU) over total buzz volume.',
    },
    categoryBenchmark: {
      title: (name: string) => `Industry Benchmark: ${name}`,
      subtitle: 'Industry-specific performance baseline metrics',
      countBadge: (count: number) => `${count} Campaigns in Category`,
      colCategory: 'Category',
      colCampaigns: 'Campaigns',
      colAvgBuzz: 'Avg Buzz Vol',
      colAvgBsi: 'Avg BSI Score',
      colAvgCfqu: 'Avg CFQU',
      colAvgQu: 'Avg QU',
      colAvgSentiment: 'Avg Sentiment',
      colAvgRelevancy: 'Avg Relevancy',
      colAvgEarned: 'Avg % Earned',
    },
    brandMatrix: {
      title: 'BRAND POSITIONING MATRIX',
      subtitle: (avgX: string, avgY: string) => `Average Baseline: AVG Buzz = ${avgX} | AVG BSI = ${avgY}`,
      brandsBadge: (count: number) => `${count} BRANDS`,
      tooltipTitle: 'Brand Positioning Matrix',
      tooltipContent: 'Scatter matrix dividing brands into 4 performance quadrants based on statistical averages of Buzz Volume (X-axis) and BSI Score (Y-axis).',
      axisX: 'AVG Buzz Volume (K)',
      axisY: 'AVG BSI Score',
    },
    campaignTypeChart: {
      title: 'DISTRIBUTION BY CAMPAIGN TYPE',
      centerText: 'CAMPAIGNS',
      tooltipTitle: 'Campaign Type Distribution',
      tooltipContent: 'Breakdown of campaign count by strategic type: Product Launch, Sponsorship/Event, Promotion, CSR, Thematic.',
      launch: 'Product Launch',
      sponsor: 'Sponsor & Event',
      promotion: 'Promotion',
      csr: 'CSR & Sustainability',
      thematic: 'Thematic',
    },
    channelShareChart: {
      title: 'MEDIA CHANNEL DISTRIBUTION',
      tooltipTitle: 'Media Channel Share (Paid, Owned, Earned)',
      tooltipContent: 'Discussion volume distributed across 3 channels: Paid, Owned brand channels, and spontaneous Earned Media.',
    },
    timelineChart: {
      title: '18-MONTH BUZZ & % CFQU TREND',
      tooltipTitle: '18-Month Timeline Trend',
      tooltipContent: 'Monthly total buzz volume and genuine discussion percentage (% CFQU) over 18 months.',
      labelBuzz: 'Buzz Vol (M)',
      labelCfqu: '% CFQU',
    },
    categoryComparisonChart: {
      title: 'CATEGORY BSI COMPARISON',
    },
    topBrandsTable: {
      title: 'TOP PERFORMING BRANDS IN BSI',
      tooltipTitle: 'Top Performing Brands',
      tooltipContent: 'Top brands ranking based on cumulative BSI score and consistency across monitored campaigns.',
      colBrand: 'BRAND',
      colTotalBsi: 'TOTAL BSI',
      colAvgBsi: 'AVG BSI',
      colCampaignCount: 'CAMPAIGNS',
      colAppearances: 'TOP 10 MONTHS',
      colAvgRank: 'AVG RANK',
      colAction: 'ACTION',
      btnExplore: 'Explore',
    },
    campaignTable: {
      title: 'DETAILED CAMPAIGN PERFORMANCE TABLE',
      subtitle: 'Click on any campaign row to inspect deep-dive radar benchmark and full channel breakdown.',
      tooltipTitle: 'Detailed Campaign Performance Ranking',
      tooltipContent: 'Comprehensive campaign database. Click any row to inspect deep-dive spider radar benchmark against category average.',
      pageInfo: (page: number, total: number, count: number) => `Showing page ${page} of ${total} (${count} campaigns)`,
      exportCsv: 'Export CSV',
      colDate: 'TIMELINE',
      colBrand: 'BRAND',
      colCategory: 'CATEGORY',
      colCampaign: 'CAMPAIGN NAME',
      colType: 'TYPE',
      colBuzz: 'BUZZ VOL',
      colBsi: 'BSI SCORE',
      colCfqu: 'CFQU',
      colQu: 'QU',
      colSentiment: 'SENTIMENT',
      colRelevancy: 'RELEVANCE',
      colEarned: 'EARNED %',
    },
    celebHighlights: {
      peakBsi: 'PEAK SINGLE BSI SCORE',
      peakBsiBadge: 'Record BSI',
      peakAt: (month: string, year: string) => `Peak at M${month}/${year}`,
      mostConsistent: 'MOST TOP 10 APPEARANCES',
      mostConsistentBadge: 'High Consistency',
      appearancesCount: (count: number) => `${count} Months in Top 10`,
      avgRank: (rank: number) => `Avg Rank: #${rank}`,
      highestAvgBsi: 'HIGHEST AVG BSI SCORE',
      highestAvgBsiBadge: 'Top AVG BSI',
      totalBsi: (total: string) => `Total: ${total}`,
      highestQu: 'HIGHEST QUALIFIED USER (QU)',
      highestQuBadge: 'Top Reach',
      audienceHighImpact: 'Audience: High Impact',
    },
    celebBenchmarks: {
      title: 'TOP INFLUENCERS BENCHMARK (CURRENT FILTER SCOPE)',
      scope: (count: number) => `Scope: ${count} Influencers`,
      totalCelebs: 'Total Influencers',
      totalCelebsTooltip: 'Total count of unique influencers entering the Top 10 BSI during the filtered period.',
      avgBuzz: 'AVG Buzz Vol',
      avgBuzzTooltip: 'Average discussion volume across tracked influencers.',
      avgBsi: 'AVG BSI Score',
      avgBsiTooltip: 'BSI = Buzz Volume * Sentiment Index * Content QU * Qualified User * Relevance Score.',
      avgCfqu: 'AVG CFQU',
      avgCfquTooltip: 'Content from Qualified Users - Average discussions containing relevant messages.',
      avgQu: 'Average QU',
      avgQuTooltip: 'Average number of genuine unique users actively generating discussions.',
      avgSentiment: 'AVG Sentiment',
      avgSentimentTooltip: 'Average Sentiment Index score (-1 to 1). Scores >= 0.9 indicate overwhelmingly positive feedback.',
      avgRelevancy: 'AVG Relevancy',
      avgRelevancyTooltip: 'Average proportion of discussions directly focused on the influencer.',
      cfquBuzzRatio: '% CFQU / BUZZ',
      cfquBuzzRatioTooltip: 'Discussion quality ratio = (Content QU / Buzz Volume) * 100%.',
    },
    celebFilters: {
      title: 'SMART INFLUENCERS FILTERS',
      subtitle: 'Filter by Date Range (From ... To ...) ➔ Category ➔ Influencer Keyword',
      from: 'FROM (START)',
      to: 'TO (END)',
      profession: 'CATEGORY',
      allProfessions: 'All Categories',
      searchName: 'SEARCH INFLUENCER NAME',
      searchPlaceholder: 'Search Influencer Name...',
      resetFilters: 'Reset',
      top10Monthly: (count: number) => `Top 10 BSI Only (${count} Entries)`,
      allCelebs: (count: number) => `All ${count} Entries`,
    },
    celebTable: {
      title: 'INFLUENCERS PERFORMANCE DETAIL TABLE',
      subtitle: 'Click any row to open influencer deep-dive analysis & benchmark spider radar.',
      tooltipTitle: 'Influencer BSI Performance Table',
      tooltipContent: 'Aggregated performance database grouped by individual influencers. Click any row to inspect historical monthly BSI trends, audience reach, and engagement breakdown.',
      exportCsv: 'Export CSV',
      colRank: '#',
      colName: 'INFLUENCER / KOL',
      colCategory: 'CATEGORY',
      colAppearances: 'TOP 10 APPEARANCES',
      colAvgRank: 'AVG TOP 10 RANK',
      colAvgBsi: 'AVG BSI SCORE',
      colAvgBuzz: 'AVG BUZZ VOL',
      colAvgQu: 'QUALIFIED USER (QU)',
      colAvgSentiment: 'AVG SENTIMENT',
      colAvgRelevancy: 'AVG RELEVANCE',
      colAction: 'ACTION',
      btnView: 'View',
      pageInfo: (start: number, end: number, total: number) => `Showing ${start} - ${end} of ${total} influencers`,
    },
    celebCategories: {
      'Actor & Film': 'Actor & Film',
      'Beauty & Model': 'Beauty & Model',
      'Creator': 'Creator',
      'Music': 'Music',
      'Others': 'Others',
      'Sports': 'Sports',
      'Games': 'Games',
      'TV & MC': 'TV & MC',
    },
    floatingPreview: {
      title: 'PREVIEW VERSION',
      interactiveMode: '',
      limitReached: 'Action limit reached',
      leftBadge: (remaining: number, total: number) => `${remaining}/${total} LEFT`,
      usageHint: 'Each filter selection or chart expansion uses 1 free action.',
      limitHint: 'You have used all 5 free actions. Sign up to unlock full report!',
      unlockUnlimited: 'Unlock Unlimited Insights',
      signupUnlock: 'Sign up to Unlock Insights',
      haveCode: 'Already have an Access Code? Enter here',
      minimizedRemaining: (remaining: number, total: number) => `Free: ${remaining}/${total} Actions Left`,
      minimizedLimit: 'Preview Limit Reached (0/5)',
    },
    teaserSection: {
      title: 'FEATURES AVAILABLE IN DEEP-DIVE REPORT',
      badge: 'Premium Insights',
      unlockBtn: 'Unlock Full Dataset',
      card1Title: 'Campaign ROI & Post-Audit',
      card1Desc: 'Benchmark campaign health vs. Top 10 category leaders and evaluate authentic virality (% Earned Media vs. Paid distribution).',
      card2Title: 'Competitor & Category Trends',
      card2Desc: 'Track multi-industry shift patterns, analyze category discussion shares, and diagnose underlying sentiment drivers.',
      card3Title: 'Understanding Top Influencer Landscape',
      card3Desc: 'Analyze prominent Celebrities & Influencers with verified Relevancy, positive Sentiment Index, and genuine audience resonance.',
    },
    advancedChartsToolbar: {
      title: 'ADVANCED DEEP-DIVE ANALYTICS CHARTS',
      expand: 'Expand',
      collapse: 'Collapse',
    },
    gatedOverlay: {
      title: 'UNLOCK BSI CAMPAIGN REPORT',
      defaultDesc: 'Sign up to unlock advanced analytics, competitor benchmarks, and monthly BSI ranking reports.',
      limitReachedDesc: 'You have reached the 5-action free preview limit. Sign up now for Buzzmetrics to grant full unlimited access!',
      submittedDesc: 'The Buzzmetrics team has received your registration. If you have been provided with an Access Passcode, click below to unlock.',
      unlockFullRegistered: 'UNLOCK FULL VERSION (Registered)',
      signupFullReport: 'SIGN UP TO UNLOCK FULL REPORT',
      havePasscode: 'Already have an Access Code? Enter here',
    },
    leadForm: {
      title: 'Register to unlock BSI Campaign Insights',
      subtitle: 'Submit your project details for the Buzzmetrics team to verify and grant access to full analytics.',
      sec1Title: '1. CONTACT INFORMATION (*)',
      fullName: 'FULL NAME (*)',
      fullNamePlaceholder: 'e.g. Nguyen Van A',
      phone: 'PHONE / ZALO (*)',
      phonePlaceholder: '+84 90x xxx xxx',
      workEmail: 'WORK EMAIL (*)',
      workEmailPlaceholder: 'name@company.com',
      corporateDomainHint: 'Corporate domain (no @gmail, @yahoo)',
      company: 'COMPANY / BRAND (*)',
      companyPlaceholder: 'e.g. Unilever, Vinamilk...',
      sec2Title: '2. INDUSTRY & BRAND OF INTEREST (*)',
      industryCategory: 'INDUSTRY / CATEGORY (*)',
      targetBrand: 'TARGET BRAND',
      targetBrandPlaceholder: 'e.g. Heineken, Samsung...',
      otherCategoryPlaceholder: 'Please specify your industry category...',
      sec3Title: '3. PROJECT NEED & DATA OBJECTIVE (*)',
      currentNeedTitle: 'CURRENT NEED / PURPOSE (*)',
      needs: {
        'General Data Benchmark Reference': 'General Data Benchmark Reference',
        'Upcoming Campaign / Product Launch Planning': 'Upcoming Campaign / Product Launch Planning',
        'Competitor BSI & Sentiment Benchmarking': 'Competitor BSI & Sentiment Benchmarking',
        'Post-Campaign Performance & ROI Evaluation': 'Post-Campaign Performance & ROI Evaluation',
      },
      dataReqTitle: 'DATA REQUIREMENT (*)',
      dataReqs: {
        'Full 18-Month BSI Benchmark Data Access': '18-Month BSI Dataset',
        'Category Deep-Dive & Advanced Spider Radar': 'Category & Radar Deep-Dive',
        'Top Influencer Landscape & KOL Vetting': 'Influencer / KOL Landscape',
        'Tailored Custom Social Listening Report': 'Custom Social Listening',
      },
      additionalNotesTitle: 'ADDITIONAL REQUIREMENTS / NOTES',
      additionalNotesPlaceholder: 'Enter specific campaign objectives, scope, or timeline...',
      submitBtn: 'SUBMIT REGISTRATION FOR ACCESS',
      submittingBtn: 'Submitting Registration...',
      successTitle: 'REGISTRATION SUBMITTED SUCCESSFULLY!',
      successDesc: 'Thank you for your interest! The Buzzmetrics Business Development team has received your project details and will contact you via Phone/Email to verify and grant your Access Passcode shortly.',
      gotItBtn: '✓ GOT IT',
      errorRequired: 'Please fill in all required contact information (*).',
      errorEmailDomain: 'Please use your official Work/Company email. Personal email domains (@gmail, @yahoo, @outlook, etc.) are not accepted.',
    },
    campaignDetail: {
      vsIndustryAvg: 'vs Industry Avg',
      atIndustryAvg: 'At Industry Avg',
      compareWithAvg: (category: string) => `COMPARE WITH ${category.toUpperCase()} INDUSTRY AVERAGE`,
      radarViewBtn: 'Spider Radar Chart',
      tableViewBtn: 'Detailed Table',
      campaignsInCategory: (count: number) => `${count} Campaigns in Category`,
      radarSubtitle: 'Comparing % Earned, Relevancy, CFQU, QU & Sentiment (Orange) vs 100 Baseline Industry Avg (Dark Blue).',
      colMetric: 'Analysis Metric',
      colThisCampaign: 'This Campaign',
      colIndustryAvg: (category: string) => `Industry Avg (${category})`,
      colDiff: 'Difference (vs Avg)',
      channelDistTitle: 'CHANNEL DISTRIBUTION (MEDIA BREAKDOWN)',
      earnedMediaTitle: 'Earned Media (Organic Discussions)',
      paidMediaTitle: 'Paid Media (Sponsored Buzz)',
      ownedMediaTitle: 'Owned Media (Brand Channels)',
    },
    celebDetail: {
      appearancesCount: (count: number) => `Top 10 BSI Appearances: ${count} Months`,
      avgRankBadge: (rank: number, best: number) => `Avg Rank: #${rank} (Best: #${best})`,
      historicalTrendTitle: (count: number) => `HISTORICAL BSI TREND OVER TIME (${count} Monthly Appearances)`,
      tableTitle: 'Monthly BSI Performance Breakdown',
      colTimeline: 'Timeline',
      colMonthRank: 'Monthly Rank',
      colBsi: 'BSI Score',
      colBuzz: 'Buzz Volume',
      colContentQu: 'Content QU',
      colQuUser: 'Qualified User (QU)',
      colSentiment: 'Sentiment',
      colRelevance: 'Relevance',
    },
    exportModal: {
      title: 'Export Analytics Report',
      exportScope: (count: number) => `Export ${count} campaigns matching current filter criteria:`,
      excelTitle: 'Export Excel File (.xlsx)',
      excelDesc: 'Full multi-sheet formatted workbook',
      csvTitle: 'Export CSV File (.csv)',
      csvDesc: 'Lightweight raw tabular data format',
      closeBtn: 'Close',
    },
    celebCharts: {
      matrixTitle: 'INFLUENCERS POSITIONING MATRIX',
      matrixBadge: 'POSITIONING MATRIX',
      matrixTooltipTitle: 'Influencers Positioning Matrix',
      matrixTooltipContent: '4-dimensional analysis: X-axis = Average Rank (further right is closer to #1); Y-axis = Average BSI Score; Bubble Size = Total Top 10 Months; Color = Profession.',
      categoryShareTitle: 'INFLUENCERS SHARE BY PROFESSION',
      categoryShareBadge: 'CATEGORY SHARE',
      categoryShareTooltipTitle: 'Profession Distribution',
      categoryShareTooltipContent: 'Percentage share and count of influencers entering the Top 10 BSI across professions.',
      consistencyTitle: 'MOST CONSISTENT INFLUENCERS',
      consistencyBadge: 'RANKING CONSISTENCY',
      consistencyTooltipTitle: 'Ranking Consistency',
      consistencyTooltipContent: 'Top influencers with the highest consistency maintaining their positions in the BSI Top 10 rankings across the filtered period.',
      consistencyYAxis: 'Top 10 BSI Appearances (Months)',
      noData: 'No data available for this filter',
    },
    footer: {
      hotline: 'Hotline: (+84) 91 904 0201',
      direct: 'Direct: (+84) 909 267 338',
      datasetScope: (count: number) => `Dataset Scope: Jan 2025 – Jun 2026 (18 Months) • Total Records: ${count}`,
    },
    modals: {
      unlockTitle: 'Unlock Full Version',
      unlockSubtitle: 'Input your code to unlock Full Dashboard',
      unlockCodeLabel: 'ACCESS CODE / PASSCODE',
      unlockCodePlaceholder: 'Enter passcode...',
      unlockSubmitBtn: 'Unlock Dashboard',
      unlockSuccessTitle: 'ACCESS GRANTED!',
      unlockSuccessDesc: 'Full Dashboard version unlocked successfully.',
      unlockError: 'Invalid passcode. Please check and try again.',
      leadFormTitle: 'Sign up to Unlock Insights & Industry Deep Dives',
      exportTitle: 'Export Data Report',
      close: 'Close',
    },
  },
};
