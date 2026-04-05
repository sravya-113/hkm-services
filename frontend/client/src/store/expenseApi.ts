import { api } from "./api";

export interface Expense {
  _id: string;
  expenseNumber: string;
  date: string;
  vendor: string;
  category: 'Raw Materials' | 'Groceries' | 'Logistics' | 'Utilities' | 'Packaging' | 'Staff Salary' | 'Rent' | 'Maintenance' | 'Others';
  amount: number;
  status: 'Paid' | 'Pending';
  reference: string;
  notes?: string;
  createdBy: { _id: string; name: string };
  createdAt: string;
}

export interface ExpenseSummary {
  totalCurrentMonth: number;
  unpaidTotal: number;
  unpaidCount: number;
  categoryBreakdown: Record<string, number>;
}

export interface ExpensesResponse {
  success: boolean;
  total: number;
  page: number;
  pages: number;
  data: Expense[];
}

export interface ExpenseSummaryResponse {
  success: boolean;
  data: ExpenseSummary;
}

export interface SingleExpenseResponse {
  success: boolean;
  data: Expense;
}

export const expenseApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getExpenses: builder.query<ExpensesResponse, { search?: string; category?: string; status?: string; fromDate?: string; toDate?: string; page?: number } | void>({
      query: (params) => ({
        url: "/expenses",
        params: params || {},
      }),
      providesTags: ["Expenses"],
    }),
    getExpenseSummary: builder.query<ExpenseSummaryResponse, void>({
      query: () => "/expenses/summary",
      providesTags: ["Expenses"],
    }),
    addExpense: builder.mutation<SingleExpenseResponse, Partial<Expense>>({
      query: (body) => ({
        url: "/expenses",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Expenses"],
    }),
    updateExpense: builder.mutation<SingleExpenseResponse, { id: string } & Partial<Expense>>({
      query: ({ id, ...body }) => ({
        url: `/expenses/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Expenses"],
    }),
    updateExpenseStatus: builder.mutation<SingleExpenseResponse, { id: string; status: 'Paid' | 'Pending' }>({
      query: ({ id, status }) => ({
        url: `/expenses/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Expenses"],
    }),
    deleteExpense: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/expenses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Expenses"],
    }),
  }),
});

export const {
  useGetExpensesQuery,
  useGetExpenseSummaryQuery,
  useAddExpenseMutation,
  useUpdateExpenseMutation,
  useUpdateExpenseStatusMutation,
  useDeleteExpenseMutation,
} = expenseApi;
