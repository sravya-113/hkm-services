import { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { 
  useGetExpensesQuery, 
  useGetExpenseSummaryQuery,
  useAddExpenseMutation,
  useDeleteExpenseMutation,
  useUpdateExpenseMutation,
  useUpdateExpenseStatusMutation 
} from "@/store/expenseApi";
import { 
  openExpenseSidebar, 
  closeExpenseSidebar, 
  updateExpenseFormData 
} from "@/store/expenseSlice";
import { 
  Plus, 
  Search, 
  Filter,
  Download, 
  IndianRupee, 
  History, 
  CheckCircle2, 
  FileSpreadsheet,
  Loader2,
  MoreVertical,
  Trash2,
  ShoppingBag,
  FileText,
  PieChart as PieChartIcon,
  X,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  'Raw Materials', 'Groceries', 'Logistics', 'Utilities', 
  'Packaging', 'Staff Salary', 'Rent', 'Maintenance', 'Others'
];

const COLORS = ['#5A141E', '#912635', '#C44D58', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4D3CF'];

export default function Expenses() {
  const dispatch = useDispatch();
  const { isSidebarOpen, editingId, formData } = useSelector((state: RootState) => state.expenseUI);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: response, isLoading } = useGetExpensesQuery();
  const { data: summaryResponse } = useGetExpenseSummaryQuery();
  const [addExpense, { isLoading: isCreating }] = useAddExpenseMutation();
  const [updateExpense, { isLoading: isUpdating }] = useUpdateExpenseMutation();
  const [updateStatus] = useUpdateExpenseStatusMutation();
  const [deleteExpense] = useDeleteExpenseMutation();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid": return "bg-emerald-500 text-white hover:bg-emerald-600";
      case "Pending": return "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100";
      default: return "bg-slate-100 text-slate-600";
    }
  };

  const getCategoryColor = (category: string) => {
    const index = CATEGORIES.indexOf(category);
    return index !== -1 ? COLORS[index % COLORS.length] : "#CBD5E1";
  };

  const expenses = useMemo(() => {
    let data = response?.data || [];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      data = data.filter(e => 
        (e.vendor || "").toLowerCase().includes(term) || 
        (e.expenseNumber || "").toLowerCase().includes(term) ||
        (e.reference && e.reference.toLowerCase().includes(term))
      );
    }
    if (categoryFilter !== "all") {
      data = data.filter(e => e.category === categoryFilter);
    }
    if (statusFilter !== "all") {
      data = data.filter(e => e.status === statusFilter);
    }
    return data;
  }, [response, searchTerm, categoryFilter, statusFilter]);

  const summary = summaryResponse?.data;
  const isSubmitLoading = isCreating || isUpdating;

  const handleEditClick = (expense: any) => {
    dispatch(openExpenseSidebar({
      editingId: expense._id,
      data: {
        vendor: expense.vendor,
        category: expense.category,
        amount: String(expense.amount),
        status: expense.status,
        reference: expense.reference || "",
        notes: expense.notes || "",
        date: format(parseISO(expense.date), "yyyy-MM-dd")
      }
    }));
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "Paid" ? "Pending" : "Paid";
    try {
      await updateStatus({ id, status: nextStatus }).unwrap();
      toast.success(`Status updated to ${nextStatus}`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update status");
    }
  };

  const handleSaveExpense = async () => {
    if (!formData.vendor || !formData.amount || !formData.date) {
      toast.error("Please fill required fields");
      return;
    }
    try {
      const payload = { ...formData, category: formData.category as any, amount: Number(formData.amount) };
      if (editingId) {
        await updateExpense({ id: editingId, ...payload }).unwrap();
        toast.success("Expense updated");
      } else {
        await addExpense(payload).unwrap();
        toast.success("Expense recorded");
      }
      dispatch(closeExpenseSidebar());
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await deleteExpense(id).unwrap();
      toast.success("Deleted successfully");
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const handleExportCSV = () => {
    if (expenses.length === 0) return;
    const headers = ["Date,Expense ID,Vendor,Category,Reference,Amount,Status"];
    const rows = expenses.map(e => `${format(parseISO(e.date), "dd MMM yyyy")},${e.expenseNumber},${e.vendor},${e.category},${e.reference || "N/A"},${e.amount},${e.status}`);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "expenses_report.csv");
    document.body.appendChild(link);
    link.click();
  };

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#5a141e]">Expenses</h1>
          <p className="text-muted-foreground mt-1 text-sm">Track purchases, vendor payments, and operational costs.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="h-9 border-slate-200 text-slate-800 font-medium px-4" onClick={handleExportCSV}>
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button size="sm" className="h-9 bg-[#5a141e] hover:bg-[#4a1018] text-white font-bold px-4" onClick={() => dispatch(openExpenseSidebar())}>
            <Plus className="mr-2 h-4 w-4" /> Record Expense
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-slate-100 shadow-sm rounded-xl bg-[#F8F4F5] border-none">
          <CardContent className="p-6 flex items-center gap-4">
             <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center text-[#5a141e] shadow-sm">
                <IndianRupee size={22} />
             </div>
             <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">Total Expenses ({format(new Date(), "MMM")})</p>
                <p className="text-2xl font-bold text-[#5a141e] tabular-nums">
                  ₹{(summary?.totalCurrentMonth || 0).toLocaleString('en-IN')}
                </p>
             </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm rounded-xl bg-white border">
          <CardContent className="p-6 flex items-center gap-4">
             <div className="h-12 w-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 border border-amber-100 shadow-sm">
                <History size={22} />
             </div>
             <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">Unpaid Bills</p>
                <p className="text-2xl font-bold text-amber-700 tabular-nums">
                  ₹{(summary?.unpaidTotal || 0).toLocaleString('en-IN')}
                </p>
             </div>
          </CardContent>
        </Card>
      </div>

      {/* Table Section */}
      <Card className="border-slate-100 shadow-sm rounded-xl bg-white overflow-hidden">
        <div className="p-6 border-b flex items-center justify-between gap-4">
           <h2 className="text-lg font-bold text-[#5a141e]">Expense Records</h2>
           <div className="flex items-center gap-3">
              <div className="relative w-64 md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Search vendors or ID..." 
                  className="pl-9 h-9 border-slate-200 text-sm placeholder:text-slate-400"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" className="h-9 w-9 border-slate-200 text-slate-400">
                <Filter className="h-4 w-4" />
              </Button>
           </div>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 border-slate-100 h-12">
              <TableHead className="px-6 text-[11px] font-bold text-slate-400 uppercase tracking-tight">Date</TableHead>
              <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">Expense ID</TableHead>
              <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">Vendor</TableHead>
              <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">Category</TableHead>
              <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">Reference</TableHead>
              <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">Amount</TableHead>
              <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">Status</TableHead>
              <TableHead className="px-6 text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-40 text-center py-10 text-slate-400">
                  No records to display
                </TableCell>
              </TableRow>
            ) : (
              expenses.map((expense) => (
                <TableRow key={expense._id} className="hover:bg-slate-50/50 h-16 border-b border-slate-50 group">
                  <TableCell className="px-6 text-xs text-slate-500">
                    {format(parseISO(expense.date), "dd MMM yyyy")}
                  </TableCell>
                  <TableCell className="font-medium text-slate-400 text-xs">
                    {expense.expenseNumber}
                  </TableCell>
                  <TableCell className="font-bold text-slate-800">
                    {expense.vendor}
                  </TableCell>
                  <TableCell className="text-slate-400 text-xs">
                    {expense.category}
                  </TableCell>
                  <TableCell className="text-slate-400 text-xs font-mono">
                    {expense.reference}
                  </TableCell>
                  <TableCell className="font-bold text-slate-900">
                    ₹{(expense.amount || 0).toLocaleString('en-IN')}
                  </TableCell>
                  <TableCell>
                    <button 
                       onClick={() => handleToggleStatus(expense._id, expense.status)}
                       className={cn(
                        "px-3 py-1 rounded-md text-[10px] font-bold transition-all border",
                        expense.status === "Paid" 
                          ? "bg-emerald-500 text-white border-emerald-500" 
                          : "bg-white text-amber-500 border-amber-200"
                      )}
                    >
                      {expense.status}
                    </button>
                  </TableCell>
                  <TableCell className="px-6 text-right">
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300">
                              <MoreVertical className="h-4 w-4" />
                           </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                           <DropdownMenuItem onClick={() => handleEditClick(expense)}>
                              Edit Record
                           </DropdownMenuItem>
                           <DropdownMenuItem className="text-rose-600" onClick={() => handleDelete(expense._id)}>
                              Delete
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Record Sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={(open) => !open && dispatch(closeExpenseSidebar())}>
        <SheetContent className="sm:max-w-[450px]">
          <SheetHeader className="pb-6 border-b">
            <SheetTitle>{editingId ? "Edit Expense" : "Record Expense"}</SheetTitle>
          </SheetHeader>
          <div className="grid gap-6 py-8">
            <div className="grid gap-2">
              <Label className="text-xs font-bold text-slate-400">Vendor Name</Label>
              <Input 
                value={formData.vendor}
                onChange={e => dispatch(updateExpenseFormData({vendor: e.target.value}))}
                className="h-10 border-slate-200"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="text-xs font-bold text-slate-400">Date</Label>
                <Input 
                  type="date"
                  value={formData.date}
                  onChange={e => dispatch(updateExpenseFormData({date: e.target.value}))}
                  className="h-10 border-slate-200"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-xs font-bold text-slate-400">Amount (₹)</Label>
                <Input 
                  type="number"
                  value={formData.amount}
                  onChange={e => dispatch(updateExpenseFormData({amount: e.target.value}))}
                  className="h-10 border-slate-200 font-bold"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="text-xs font-bold text-slate-400">Category</Label>
                <Select value={formData.category} onValueChange={v => dispatch(updateExpenseFormData({category: v}))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label className="text-xs font-bold text-slate-400">Status</Label>
                <Select value={formData.status} onValueChange={v => dispatch(updateExpenseFormData({status: v as any}))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label className="text-xs font-bold text-slate-400">Reference</Label>
              <Input 
                value={formData.reference}
                onChange={e => dispatch(updateExpenseFormData({reference: e.target.value}))}
                placeholder="e.g. UPI-99881"
                className="h-10 border-slate-200"
              />
            </div>
          </div>
          <div className="mt-8">
            <Button className="w-full h-11 bg-[#5a141e] text-white font-bold" onClick={handleSaveExpense} disabled={isSubmitLoading}>
               {isSubmitLoading ? <Loader2 className="animate-spin h-4 w-4" /> : (editingId ? "Update Record" : "Save Record")}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
