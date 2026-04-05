import { createSlice,PayloadAction } from "@reduxjs/toolkit";


//represents menuItem in quote

export interface LineItem {
    menuItemId: string;
    name: string;
    qty: number;
    unitPrice: number;
    total: number;
}

//full quote
export interface Quote {
    _id: string;
    quoteNumber?: string;
    customerId?: string | any; // Can be populated object
    customer?: string;
    customerName?: string; // Helper for UI
    eventName?: string;
    eventDate?: string;
    venue?: string;
    pax?: number;
    lineItems?: LineItem[];
    subTotal?: number;
    taxRate?: number;
    taxAmount?: number;
    discountAmount?: number;
    totalAmount?: number;
    validUntil?: string;
    notes?: string;
    termsConditions?: string;
    status?: "Draft" | "Sent" | "Accepted" | "Rejected" | "Expired" | "Converted";
    convertedToOrderId?: string | any;
    createdAt?: string;
    updatedAt?: string;
}

//redux store
interface QuoteState {
    //for quote details /convert dialog
    selectedQuote: Quote | null;


    //for new quote &edit quote forms
    lineItems: LineItem[];
    subTotal: number;
    taxRate: number;
    taxAmount: number;
    discountAmount: number;
    totalAmount: number;

    //loading & Error
    loading: boolean;
    error: string | null;
}


const initialState: QuoteState = {
    selectedQuote: null, //convert quote
    lineItems: [],
    //calculation engine
    subTotal: 0,
    taxRate: 18,
    taxAmount: 0,
    discountAmount: 0,
    totalAmount: 0,
    loading: false,
    error: null

};

//helper function
const calculateTotals = (state: QuoteState) => {
    const subTotal = state.lineItems.reduce((sum, item) =>
        sum + (item.total || 0), 0);
    const taxAmount = ((subTotal - state.discountAmount) * state.taxRate) / 100;
    const totalAmount = subTotal - state.discountAmount + taxAmount;

    state.subTotal = Number(subTotal.toFixed(2));
    state.taxAmount = Number(taxAmount.toFixed(2));
    state.totalAmount = Number(totalAmount.toFixed(2));

}

//slice
const quoteSlice = createSlice({

    name: "quotes",
    initialState,
    reducers: {
        //selected quote (for convert dialog)
        setSelectedQuote: (state, action: PayloadAction<Quote | null>) => {
            state.selectedQuote = action.payload;

        },

        clearSelectedQuote: (state) => {
            state.selectedQuote = null;
        },

        //lineItems Management
        addLineItem: (state, action: PayloadAction<LineItem>) => {
            state.lineItems.push(action.payload);
            calculateTotals(state);
        },

        removeLineItem: (state, action: PayloadAction<number>) => {
            state.lineItems.splice(action.payload, 1);
            calculateTotals(state)
        },

        updateLineItemQty: (
            state,
            action: PayloadAction<{ index: number; qty: number }>
        ) => {
            const { index, qty } = action.payload;
            const item = state.lineItems[index];

            if (item) {
                item.qty = Math.max(1, qty);
                item.total = Number((item.qty * item.unitPrice).toFixed(2));
            }
            calculateTotals(state);
        },

        updateLineItem: (state, action: PayloadAction<{ index: number; updates: Partial<LineItem> }>) => {
            const { index, updates } = action.payload;
            const item = state.lineItems[index];

            if (item) {
                Object.assign(item, updates);
                if (item.qty && item.unitPrice) {
                    item.total = Number((item.qty * item.unitPrice).toFixed(2));
                }
            }
            calculateTotals(state);
        },

         clearLineItems:(state)=>{
            state.lineItems=[];
            calculateTotals(state);
         },

         //Tax & Discount
      setTaxRate: (state, action: PayloadAction<number>) => {
      state.taxRate = Math.max(0, action.payload);
      calculateTotals(state);
    },

    setDiscount: (state, action: PayloadAction<number>) => {
      state.discountAmount = Math.max(0, action.payload);
      calculateTotals(state);
    },

    //reset entire form (for new quote)
    resetQuoteForm: (state) => {
      state.lineItems = [];
      state.subTotal = 0;
      state.taxAmount = 0;
      state.discountAmount = 0;
      state.totalAmount = 0;
      state.taxRate = 18;
    },
  },
})


export const{
      setSelectedQuote,
      clearSelectedQuote,
      addLineItem,
      removeLineItem,
      updateLineItemQty,
      updateLineItem,
      clearLineItems,
      setTaxRate,
      setDiscount,
      resetQuoteForm
}=quoteSlice.actions



export default quoteSlice.reducer;
