import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { 
  openAddForm, 
  openEditForm, 
  closeForm, 
  setFormData, 
  openDeleteDialog, 
  closeDeleteDialog 
} from "@/store/menuSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Loader2, 
  ImageIcon, 
  AlertTriangle,
  ChevronRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import { 
  useGetMenuQuery, 
  useCreateMenuItemMutation, 
  useUpdateMenuItemMutation, 
  useDeleteMenuItemMutation 
} from "@/store/menuApi";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const CATEGORIES = ["Main Course", "Starters", "Rice", "Breads", "Desserts", "Sides", "Beverages"];

export default function MenuPage() {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Main Course");
  
  // Redux UI State
  const { 
    isFormOpen, 
    isDeleteDialogOpen, 
    itemToEdit, 
    itemToDelete, 
    formData 
  } = useSelector((state: RootState) => state.menuUI);

  // RTK Query
  const { data: menu = [], isLoading } = useGetMenuQuery();
  const [createItem, { isLoading: isCreating }] = useCreateMenuItemMutation();
  const [updateItem, { isLoading: isUpdating }] = useUpdateMenuItemMutation();
  const [deleteItem, { isLoading: isDeleting }] = useDeleteMenuItemMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      toast.error("Please fill Name and Price");
      return;
    }

    try {
      const payload = {
        ...formData,
        price: formData.price.toString(),
        isVeg: "true"
      };

      if (itemToEdit) {
        await updateItem({ id: itemToEdit.id, data: payload }).unwrap();
        toast.success("Item updated successfully");
      } else {
        await createItem(payload).unwrap();
        toast.success("New item added to menu");
      }
      dispatch(closeForm());
    } catch (err: any) {
      toast.error(err.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteItem(itemToDelete.id).unwrap();
      toast.success("Item removed from menu");
      dispatch(closeDeleteDialog());
    } catch (err: any) {
      toast.error("Failed to delete item");
    }
  };

  const filteredMenu = menu.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12 font-sans antialiased text-gray-900 px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#5a141e]">Menu Management</h1>
          <p className="text-sm font-medium text-gray-500 mt-0.5">Define dishes, pricing, and visual presentation.</p>
        </div>
        <Button 
          onClick={() => dispatch(openAddForm())}
          className="bg-[#5a141e] hover:bg-[#4a1018] text-white font-medium h-10 px-5 rounded-lg shadow-sm flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Item
        </Button>
      </div>

      {/* Tabs Design */}
      <Tabs defaultValue="Main Course" value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-gray-100 pb-2">
          <TabsList className="bg-transparent h-auto p-0 gap-8 flex-wrap justify-start">
            {CATEGORIES.map(cat => (
              <TabsTrigger 
                key={cat} 
                value={cat}
                className="bg-transparent border-b-2 border-transparent data-[state=active]:border-[#5a141e] data-[state=active]:text-[#5a141e] rounded-none px-0 pb-3 text-sm font-semibold text-gray-400 data-[state=active]:shadow-none transition-all"
              >
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search dishes..."
              className="pl-9 bg-white border-gray-200 text-sm focus:ring-1 focus:ring-[#5a141e] focus:border-[#5a141e] rounded-lg h-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
             <Loader2 className="h-8 w-8 text-[#5a141e] animate-spin" />
             <p className="text-sm font-medium text-gray-400">Syncing Menu...</p>
          </div>
        ) : (
          <TabsContent value={selectedCategory} className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMenu.filter(i => i.category === selectedCategory).map((item) => (
                <Card key={item.id} className="overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 group flex flex-col bg-white rounded-xl">
                  <div className="aspect-[4/3] bg-gray-50 relative overflow-hidden">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 p-8 text-center">
                        <ImageIcon className="h-10 w-10 mb-2 opacity-20" />
                        <span className="text-[10px] uppercase font-bold tracking-widest opacity-40">{item.name}</span>
                      </div>
                    )}
                    
                    <div className="absolute top-3 left-3">
                      <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border shadow-sm bg-emerald-50 text-emerald-700 border-emerald-100">
                        Satvik Veg
                      </Badge>
                    </div>

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                       <Button 
                         onClick={() => dispatch(openEditForm(item))}
                         size="icon" 
                         variant="secondary" 
                         className="h-10 w-10 rounded-full shadow-lg hover:bg-white"
                       >
                         <Edit2 className="h-4 w-4 text-[#5a141e]" />
                       </Button>
                       <Button 
                         onClick={() => dispatch(openDeleteDialog(item))}
                         size="icon" 
                         variant="destructive" 
                         className="h-10 w-10 rounded-full shadow-lg"
                       >
                         <Trash2 className="h-4 w-4" />
                       </Button>
                    </div>
                  </div>
                  
                  <CardContent className="p-5 flex-1 flex flex-col gap-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-gray-900 group-hover:text-[#5a141e] transition-colors leading-tight">
                        {item.name}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-2 mt-1 min-h-[32px]">
                      {item.description || "No description provided for this Satvik specialty."}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-lg font-black text-[#5a141e]">₹{Number(item.price).toLocaleString()}</div>
                      <ChevronRight className="h-4 w-4 text-gray-300 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              ))}
              
               <Card 
                onClick={() => dispatch(openAddForm())}
                className="overflow-hidden border-dashed border-2 border-gray-100 hover:border-[#5a141e]/30 transition-all flex flex-col items-center justify-center text-gray-400 aspect-[4/3] sm:aspect-auto sm:h-full min-h-[280px] cursor-pointer hover:bg-gray-50 group rounded-xl"
               >
                  <div className="flex flex-col items-center gap-2 group-hover:scale-110 transition-transform">
                    <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-[#5a141e]/5 group-hover:border-[#5a141e]/10">
                      <Plus className="h-6 w-6 text-gray-300 group-hover:text-[#5a141e]" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest">Define New Item</span>
                  </div>
               </Card>
            </div>
          </TabsContent>
        )}
      </Tabs>

      {/* Add / Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={(open) => !open && dispatch(closeForm())}>
        <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden rounded-2xl border-none shadow-2xl font-sans">
          <DialogHeader className="px-8 pt-8 pb-6 bg-[#5a141e] text-white">
            <DialogTitle className="text-xl font-bold tracking-tight">
              {itemToEdit ? "Update Menu Item" : "New Recipe Definition"}
            </DialogTitle>
            <DialogDescription className="text-[#f8d7da] font-medium text-xs uppercase tracking-widest mt-1">
              {itemToEdit ? "Modifying existing catalog entry" : "Adding to the Satvik experience"}
            </DialogDescription>
          </DialogHeader>
          <div className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="grid gap-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Item Name *</label>
                <Input 
                  value={formData.name} 
                  onChange={e => dispatch(setFormData({ name: e.target.value }))} 
                  placeholder="e.g. Paneer Butter Masala" 
                  className="h-11 bg-gray-50 border-gray-200 focus:bg-white focus:ring-1 focus:ring-[#5a141e] rounded-lg font-semibold"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</label>
                  <Select value={formData.category} onValueChange={val => dispatch(setFormData({ category: val }))}>
                    <SelectTrigger className="h-11 bg-gray-50 border-gray-200 rounded-lg font-semibold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Price (₹) *</label>
                  <Input 
                    type="number" 
                    value={formData.price} 
                    onChange={e => dispatch(setFormData({ price: e.target.value }))} 
                    placeholder="0.00" 
                    className="h-11 bg-gray-50 border-gray-200 rounded-lg font-semibold"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Product Description</label>
                <Input 
                  value={formData.description} 
                  onChange={e => dispatch(setFormData({ description: e.target.value }))} 
                  placeholder="Small description for orders..." 
                  className="h-11 bg-gray-50 border-gray-200 rounded-lg font-semibold"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Presentation Image URL</label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                  <Input 
                    value={formData.image} 
                    onChange={e => dispatch(setFormData({ image: e.target.value }))} 
                    placeholder="https://..." 
                    className="h-11 pl-10 bg-gray-50 border-gray-200 rounded-lg font-semibold"
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="px-8 pb-8 flex sm:justify-between items-center bg-gray-50/50 pt-6">
            <Button variant="ghost" onClick={() => dispatch(closeForm())} className="text-gray-500 font-bold text-xs uppercase tracking-widest">Cancel</Button>
            <Button 
              type="button" 
              onClick={handleSubmit}
              disabled={isCreating || isUpdating}
              className="bg-[#5a141e] hover:bg-[#4a1018] text-white px-8 h-11 rounded-lg font-bold"
            >
              {(isCreating || isUpdating) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {itemToEdit ? "Update Changes" : "Confirm Addition"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={(open) => !open && dispatch(closeDeleteDialog())}>
        <AlertDialogContent className="rounded-2xl border-none shadow-2xl p-8 font-sans antialiased text-gray-900">
          <AlertDialogHeader>
            <div className="h-12 w-12 rounded-full bg-rose-50 flex items-center justify-center mb-4">
              <AlertTriangle className="h-6 w-6 text-rose-600" />
            </div>
            <AlertDialogTitle className="text-xl font-bold tracking-tight">Remove from Menu?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500 font-medium">
              You are about to remove <span className="font-bold text-[#5a141e]">"{itemToDelete?.name}"</span>. This will hide it from new orders but preserve historical data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8">
            <AlertDialogCancel className="border-gray-200 text-gray-500 font-bold text-xs uppercase tracking-widest rounded-lg h-11">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => { e.preventDefault(); handleDelete(); }}
              disabled={isDeleting}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold h-11 px-8 rounded-lg"
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Item
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

