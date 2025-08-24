export type ApiStatus = "ok" | "error";
export interface ApiEnvelopeOk<T> {
    version: string;
    requestId: string;
    timestamp: string;
    status: "ok";
    data: T;
}
export interface ApiEnvelopeErr {
    version: string;
    requestId: string;
    timestamp: string;
    status: "error";
    error: {
        code: string;
        message: string;
        details?: unknown;
    };
}
export type ApiEnvelope<T> = ApiEnvelopeOk<T> | ApiEnvelopeErr;
export interface StrategyData {
    objective: string;
    audience?: {
        icp?: string;
        regions?: string[];
    };
    channels: string[];
    roadmap: {
        week: number;
        tasks: string[];
    }[];
    kpis?: {
        name: string;
        target: number;
        unit?: string;
    }[];
    risks?: string[];
    notes?: string;
}
export interface QuoteItem {
    name: string;
    qty: number;
    unitPrice: number;
}
export interface QuoteData {
    currency: "TRY" | "USD" | "EUR";
    items: QuoteItem[];
    discounts?: {
        type: "amount" | "percent";
        value: number;
        note?: string;
    }[];
    taxes?: {
        name: string;
        ratePct: number;
    }[];
    subtotal: number;
    totalTax?: number;
    total: number;
    validityDays?: number;
    terms?: string;
}
export interface ReportData {
    period: {
        from: string;
        to: string;
    };
    channels?: string[];
    metrics: {
        name: string;
        value: number;
        unit?: string;
        deltaPct?: number;
    }[];
    highlights?: string[];
    nextActions?: string[];
}
export declare function isOk<T>(env: ApiEnvelope<T>): env is ApiEnvelopeOk<T>;
export declare function isErr<T>(env: ApiEnvelope<T>): env is ApiEnvelopeErr;
export declare const API_VERSION = "1.0";
export declare const StrategyResponseExample: ApiEnvelope<StrategyData>;
export declare const QuoteResponseExample: ApiEnvelope<QuoteData>;
export declare const ReportResponseExample: ApiEnvelope<ReportData>;
export declare const ErrorResponseExample: ApiEnvelope<never>;
