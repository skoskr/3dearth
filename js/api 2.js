// src/api.ts
export function isOk(env) {
    return env.status === "ok";
}
export function isErr(env) {
    return env.status === "error";
}
export const API_VERSION = "1.0";
/* ========= ÖRNEK CEVAPLAR (mock) ========= */
export const StrategyResponseExample = {
    version: API_VERSION,
    requestId: "uuid-strategy-123",
    timestamp: new Date().toISOString(),
    status: "ok",
    data: {
        objective: "Kalıfiyeli lead sayısını %30 artırmak",
        audience: { icp: "B2B SaaS, 11–200 kişi", regions: ["TR", "EU"] },
        channels: ["Instagram", "LinkedIn", "Etkinlik"],
        roadmap: [
            { week: 1, tasks: ["Mevcut durum analizi", "ICP refine"] },
            { week: 2, tasks: ["İçerik takvimi", "Landing sayfa revizyonu"] },
            { week: 3, tasks: ["KPI belirleme", "Deney planları"] }
        ],
        kpis: [
            { name: "Leads", target: 120, unit: "count" },
            { name: "CTR", target: 2.5, unit: "%" }
        ],
        risks: ["Organik erişim dalgalanması", "Etkinlik iptali"],
        notes: "2 haftada bir gözden geçirme"
    }
};
export const QuoteResponseExample = {
    version: API_VERSION,
    requestId: "uuid-quote-456",
    timestamp: new Date().toISOString(),
    status: "ok",
    data: {
        currency: "TRY",
        items: [
            { name: "Sosyal Medya Paketi", qty: 1, unitPrice: 25000 },
            { name: "Etkinlik Prodüksiyon", qty: 1, unitPrice: 60000 }
        ],
        discounts: [{ type: "amount", value: 5000, note: "Yeni müşteri indirimi" }],
        taxes: [{ name: "KDV", ratePct: 20 }],
        subtotal: 85000,
        totalTax: 16000,
        total: 96000,
        validityDays: 30,
        terms: "Ödeme: %50 peşin, %50 teslimde"
    }
};
export const ReportResponseExample = {
    version: API_VERSION,
    requestId: "uuid-report-789",
    timestamp: new Date().toISOString(),
    status: "ok",
    data: {
        period: { from: "2025-08-01", to: "2025-08-31" },
        channels: ["Instagram", "LinkedIn"],
        metrics: [
            { name: "Reach", value: 210000, deltaPct: 12.4 },
            { name: "Engagement Rate", value: 5.2, unit: "%", deltaPct: 0.8 }
        ],
        highlights: ["En iyi içerik: Reels #3", "Etkinlik sonrası 27 demo talebi"],
        nextActions: ["Reels’i haftada 3’e çıkar", "LinkedIn lead form A/B testi"]
    }
};
export const ErrorResponseExample = {
    version: API_VERSION,
    requestId: "uuid-any",
    timestamp: new Date().toISOString(),
    status: "error",
    error: { code: "BadRequest", message: "Eksik parametre: audience.icp" }
};
