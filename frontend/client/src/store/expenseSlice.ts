import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { format } from "date-fns";

interface ExpenseFormData {
  vendor: string;
  category: string;
  amount: string;
  status: 'Paid' | 'Pending';
  reference: string;
  notes: string;
  date: string;
}

interface ExpenseState {
  isSidebarOpen: boolean;
  editingId: string | null;
  formData: ExpenseFormData;
}

const initialFormData: ExpenseFormData = {
  vendor: "",
  category: "Groceries",
  amount: "",
  status: "Paid",
  reference: "",
  notes: "",
  date: format(new Date(), "yyyy-MM-dd")
};

const initialState: ExpenseState = {
  isSidebarOpen: false,
  editingId: null,
  formData: initialFormData,
};

const expenseSlice = createSlice({
  name: "expense",
  initialState,
  reducers: {
    openExpenseSidebar: (state, action: PayloadAction<{ editingId?: string; data?: ExpenseFormData } | undefined>) => {
      state.isSidebarOpen = true;
      if (action.payload?.editingId) {
        state.editingId = action.payload.editingId;
        state.formData = action.payload.data || initialFormData;
      } else {
        state.editingId = null;
        state.formData = initialFormData;
      }
    },
    closeExpenseSidebar: (state) => {
      state.isSidebarOpen = false;
      state.editingId = null;
      state.formData = initialFormData;
    },
    updateExpenseFormData: (state, action: PayloadAction<Partial<ExpenseFormData>>) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    resetExpenseFormData: (state) => {
      state.formData = initialFormData;
    },
  },
});

export const {
  openExpenseSidebar,
  closeExpenseSidebar,
  updateExpenseFormData,
  resetExpenseFormData,
} = expenseSlice.actions;

export default expenseSlice.reducer;
