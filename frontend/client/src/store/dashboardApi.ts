import { api } from "./api";

// ─── Operations Hub (existing) ───────────────────────────────────────────────

export interface DashboardSummary {
  todayOrders: {
    count: number;
    change: number;
  };
  pendingCollection: number;
  activeQuotes: number;
  totalCustomers: number;
}

export interface TodayWorkItem {
  id: string;
  orderNumber: string;
  customerName: string;
  itemsCount: number;
  value: number;
  status: string;
}

export interface PrepItem {
  id: string;
  customerName: string;
  status: string;
}

export interface ForecastItem {
  id: string;
  date: string;
  orderNumber: string;
  customerName: string;
  itemsCount: number;
  value: number;
  status: string;
}

export interface DashboardData {
  summary: DashboardSummary;
  todayWorkList: TodayWorkItem[];
  tomorrowPrep: PrepItem[];
  nextWeekForecast: ForecastItem[];
}

// ─── Financial Dashboard (new) ────────────────────────────────────────────────

export interface FinancialSummary {
  totalRevenue: number;
  totalOrders: number;
  pendingPayments: number;
  totalExpenses: number;
}

export interface RecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  eventName: string;
  date: string;
  amount: number;
  status: string;
  paymentStatus: string;
}

export interface RecentPayment {
  id: string;
  transactionId: string;
  customerName: string;
  method: string;
  amount: number;
  status: string;
  date: string;
}

export interface FinancialDashboardData {
  summary: FinancialSummary;
  recentOrders: RecentOrder[];
  recentPayments: RecentPayment[];
}

// ─── RTK API ──────────────────────────────────────────────────────────────────

export const dashboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<{ success: boolean; data: DashboardData }, void>({
      query: () => "/dashboard/summary",
      providesTags: ["Orders", "Invoices", "Quotes", "Customers"],
    }),

    getDashboardFinancial: builder.query<{ success: boolean; data: FinancialDashboardData }, void>({
      query: () => "/dashboard/financial",
      providesTags: ["Orders", "Invoices", "Payments", "Expenses"],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetDashboardFinancialQuery,
} = dashboardApi;
