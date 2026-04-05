import { api } from "./api";

export interface ReportSummary {
  totalIncome: number;
  incomeChange: string;
  totalExpenses: number;
  expenseChange: string;
  netProfit: number;
  profitMargin: string;
}

export interface AccountBalances {
  receivable: {
    total: number;
    current: number;
    overdue: number;
  };
  payable: {
    total: number;
    current: number;
    overdue: number;
  };
}

export interface GstSummary {
  outputGst: number;
  itc: number;
  payable: number;
}

export interface ExpenseBreakdownItem {
  category: string;
  amount: number;
  percentage: number;
}

export const reportsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getReportSummary: builder.query<{ success: boolean; data: ReportSummary }, { period: string }>({
      query: (params) => ({
        url: "/reports/summary",
        params,
      }),
      providesTags: ["Reports"],
    }),
    getAccountBalances: builder.query<{ success: boolean; data: AccountBalances }, void>({
      query: () => "/reports/accounts",
      providesTags: ["Reports"],
    }),
    getGstSummary: builder.query<{ success: boolean; data: GstSummary }, void>({
      query: () => "/reports/gst",
      providesTags: ["Reports"],
    }),
    getExpenseBreakdown: builder.query<{ success: boolean; data: ExpenseBreakdownItem[] }, void>({
      query: () => "/reports/expenses-breakdown",
      providesTags: ["Reports"],
    }),
  }),
});

export const {
  useGetReportSummaryQuery,
  useGetAccountBalancesQuery,
  useGetGstSummaryQuery,
  useGetExpenseBreakdownQuery,
} = reportsApi;
