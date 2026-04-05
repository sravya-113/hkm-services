import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order, LineItem } from './OrderApi';

interface OrderState {
  selectedOrder: Order | null;
  lineItems: LineItem[];
  totals: {
    subtotal: number;
    tax: number;
    total: number;
  };
  deliveryDetails: {
    customerId: string;
    venue: string;
    eventDate: string;
    eventTime: string;
    headcount: number;
  };
  status: Order['status'];
}

const initialState: OrderState = {
  selectedOrder: null,
  lineItems: [],
  totals: {
    subtotal: 0,
    tax: 0,
    total: 0,
  },
  deliveryDetails: {
    customerId: '',
    venue: '',
    eventDate: '',
    eventTime: '12:00',
    headcount: 50,
  },
  status: 'Draft',
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrderData: (state, action: PayloadAction<Order>) => {
      const order = action.payload;
      state.selectedOrder = order;
      state.lineItems = order.lineItems || [];
      state.status = order.status;
      state.deliveryDetails = {
        customerId: typeof order.customerId === 'object' ? order.customerId._id : order.customerId,
        venue: order.venue,
        eventDate: order.eventDate ? new Date(order.eventDate).toISOString().split('T')[0] : '',
        eventTime: order.eventDate && order.eventDate.includes('T') ? order.eventDate.split('T')[1].slice(0, 5) : '12:00',
        headcount: order.pax || 50,
      };
      // Calculate totals
      const subtotal = state.lineItems.reduce((acc, item) => acc + (item.unitPrice * item.qty), 0);
      const tax = subtotal * 0.05; // Assuming 5% GST for catering
      state.totals = {
        subtotal,
        tax,
        total: subtotal + tax,
      };
    },
    updateDeliveryField: (state, action: PayloadAction<{ field: keyof OrderState['deliveryDetails']; value: any }>) => {
      const { field, value } = action.payload;
      (state.deliveryDetails as any)[field] = value;
    },
    addLineItem: (state, action: PayloadAction<LineItem>) => {
      state.lineItems.push(action.payload);
      // Recalculate totals
      const subtotal = state.lineItems.reduce((acc, item) => acc + (item.unitPrice * item.qty), 0);
      const tax = subtotal * 0.05;
      state.totals = { subtotal, tax, total: subtotal + tax };
    },
    removeLineItem: (state, action: PayloadAction<number>) => {
      state.lineItems.splice(action.payload, 1);
      // Recalculate totals
      const subtotal = state.lineItems.reduce((acc, item) => acc + (item.unitPrice * item.qty), 0);
      const tax = subtotal * 0.05;
      state.totals = { subtotal, tax, total: subtotal + tax };
    },
    updateLineItemQty: (state, action: PayloadAction<{ index: number; qty: number }>) => {
      const { index, qty } = action.payload;
      if (state.lineItems[index]) {
        state.lineItems[index].qty = qty;
        state.lineItems[index].total = state.lineItems[index].unitPrice * qty;
      }
      // Recalculate totals
      const subtotal = state.lineItems.reduce((acc, item) => acc + (item.unitPrice * item.qty), 0);
      const tax = subtotal * 0.05;
      state.totals = { subtotal, tax, total: subtotal + tax };
    },
    setStatus: (state, action: PayloadAction<Order['status']>) => {
      state.status = action.payload;
    },
    resetOrderState: (state) => {
      return initialState;
    },
  },
});

export const {
  setOrderData,
  updateDeliveryField,
  addLineItem,
  removeLineItem,
  updateLineItemQty,
  setStatus,
  resetOrderState,
} = orderSlice.actions;

export default orderSlice.reducer;
