import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MenuItem } from "@shared/schema";

interface MenuUIState {
  isFormOpen: boolean;
  isDeleteDialogOpen: boolean;
  itemToEdit: MenuItem | null;
  itemToDelete: MenuItem | null;
  formData: {
    name: string;
    category: string;
    price: string;
    isVeg: string;
    description: string;
    image: string;
  };
}

const initialState: MenuUIState = {
  isFormOpen: false,
  isDeleteDialogOpen: false,
  itemToEdit: null,
  itemToDelete: null,
  formData: {
    name: "",
    category: "Main Course",
    price: "",
    isVeg: "true",
    description: "",
    image: ""
  }
};

const menuSlice = createSlice({
  name: "menuUI",
  initialState,
  reducers: {
    openAddForm: (state) => {
      state.itemToEdit = null;
      state.formData = { ...initialState.formData };
      state.isFormOpen = true;
    },
    openEditForm: (state, action: PayloadAction<MenuItem>) => {
      state.itemToEdit = action.payload;
      state.formData = {
        name: action.payload.name,
        category: action.payload.category,
        price: action.payload.price.toString(),
        isVeg: action.payload.isVeg ? action.payload.isVeg.toString() : "true",
        description: action.payload.description || "",
        image: action.payload.image || ""
      };
      state.isFormOpen = true;
    },
    closeForm: (state) => {
      state.isFormOpen = false;
      state.itemToEdit = null;
    },
    setFormData: (state, action: PayloadAction<Partial<MenuUIState["formData"]>>) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    openDeleteDialog: (state, action: PayloadAction<MenuItem>) => {
      state.itemToDelete = action.payload;
      state.isDeleteDialogOpen = true;
    },
    closeDeleteDialog: (state) => {
      state.isDeleteDialogOpen = false;
      state.itemToDelete = null;
    }
  }
});

export const { 
  openAddForm, 
  openEditForm, 
  closeForm, 
  setFormData, 
  openDeleteDialog, 
  closeDeleteDialog 
} = menuSlice.actions;

export default menuSlice.reducer;
