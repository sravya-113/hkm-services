import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Customer, Address } from './customerApi';

interface CustomerState {
  isModalOpen: boolean;
  editingId: string | null;
  formData: Customer;
}

const initialFormData: Customer = {
  name: '',
  email: '',
  phone: '',
  company: '',
  address: {
    street: '',
    city: '',
    state: '',
    pincode: '',
  },
  notes: '',
  gstin: '',
  customerType: 'individual',
  tags: [],
  totalOrders: 0,
  outstandingBalance: 0,
};

const initialState: CustomerState = {
  isModalOpen: false,
  editingId: null,
  formData: { ...initialFormData },
};

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    openCreateModal: (state) => {
      state.isModalOpen = true;
      state.editingId = null;
      state.formData = { ...initialFormData };
    },
    openEditModal: (state, action: PayloadAction<Customer>) => {
      state.isModalOpen = true;
      state.editingId = action.payload._id || null;
      state.formData = { 
        ...action.payload,
        address: action.payload.address || { ...initialFormData.address },
      };
    },
    closeModal: (state) => {
      state.isModalOpen = false;
      state.editingId = null;
      state.formData = { ...initialFormData };
    },
    updateFormField: (state, action: PayloadAction<{ field: keyof Customer; value: any }>) => {
      const { field, value } = action.payload;
      (state.formData as any)[field] = value;
    },
    updateAddressField: (state, action: PayloadAction<{ field: keyof Address; value: string }>) => {
      const { field, value } = action.payload;
      if (state.formData.address) {
        state.formData.address[field] = value;
      }
    },
  },
});

export const { 
  openCreateModal, 
  openEditModal, 
  closeModal, 
  updateFormField,
  updateAddressField 
} = customerSlice.actions;
export default customerSlice.reducer;

