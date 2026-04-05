import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InvoiceState {
  selectedInvoiceId: string | null;
}

const initialState: InvoiceState = {
  selectedInvoiceId: null,
};

const invoiceSlice = createSlice({
  name: "invoices",
  initialState,
  reducers: {
    setSelectedInvoice: (state, action: PayloadAction<string | null>) => {
      state.selectedInvoiceId = action.payload;
    },
    clearSelectedInvoice: (state) => {
      state.selectedInvoiceId = null;
    },
  },
});

export const { setSelectedInvoice, clearSelectedInvoice } = invoiceSlice.actions;

export default invoiceSlice.reducer;
