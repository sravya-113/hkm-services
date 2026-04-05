import { useState } from "react";
import { 
  useGetReportSummaryQuery, 
  useGetAccountBalancesQuery, 
  useGetGstSummaryQuery, 
  useGetExpenseBreakdownQuery 
} from "@/store/reportsApi";
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Printer, 
  Download, 
  ArrowUpRight, 
  ArrowDownRight, 
  Receipt,
  FileText,
  AlertCircle,
  Loader2,
  Calendar,
  ChevronDown,
  Percent
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function Reports() {
  const [period, setPeriod] = useState("month");
  const [isGstModalOpen, setIsGstModalOpen] = useState(false);

  // RTK Query calls
  const { data: summaryRes, isLoading: summaryLoading } = useGetReportSummaryQuery({ period });
  const { data: accountsRes, isLoading: accountsLoading } = useGetAccountBalancesQuery();
  const { data: gstRes, isLoading: gstLoading } = useGetGstSummaryQuery();
  const { data: expensesRes, isLoading: expensesLoading } = useGetExpenseBreakdownQuery();

  const summary = summaryRes?.data;
  const accounts = accountsRes?.data;
  const gst = gstRes?.data;
  const expenses = expensesRes?.data || [];

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    if (!summary) return;
    const csvContent = [
      ["Metric", "Value"],
      ["Total Income", summary.totalIncome],
      ["Total Expenses", summary.totalExpenses],
      ["Net Profit", summary.netProfit],
      ["Profit Margin", `${summary.profitMargin}%`],
      ["", ""],
      ["Account Balances", ""],
      ["Receivable Total", accounts?.receivable.total || 0],
      ["Receivable Current", accounts?.receivable.current || 0],
      ["Receivable Overdue", accounts?.receivable.overdue || 0],
      ["Payable Total", accounts?.payable.total || 0],
      ["", ""],
      ["GST Summary", ""],
      ["Output GST", gst?.outputGst || 0],
      ["ITC", gst?.itc || 0],
      ["GST Payable", gst?.payable || 0]
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Financial_Report_${period}.csv`;
    a.click();
    toast.success("Financial report exported successfully");
  };

  const isLoading = summaryLoading || accountsLoading || gstLoading || expensesLoading;

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#5A141E]" />
      </div>
    );
  }

  return (
    <div className="space-y-10 p-0 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-[#5A141E] tracking-tight">Financial Reports</h1>
          <p className="text-slate-500 mt-2 font-medium">Deep analytics and accounting summaries.</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40 h-10 border-slate-200 rounded-lg shadow-sm font-semibold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="last_month">Last Month</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            className="h-10 border-slate-200 font-bold px-4 rounded-lg shadow-sm"
            onClick={handlePrint}
          >
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
          <Button 
            className="h-10 bg-[#5A141E] text-white hover:bg-[#4A1018] font-bold px-4 rounded-lg shadow-md"
            onClick={handleExport}
          >
            <Download className="mr-2 h-4 w-4" /> Export All
          </Button>
        </div>
      </div>

      {/* Summary Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="border-none bg-[#FDF2F4] rounded-3xl overflow-hidden shadow-none transition-transform hover:scale-[1.02]">
          <CardContent className="p-10">
            <p className="text-[#5A141E]/60 font-bold text-xs uppercase tracking-widest mb-2">Total Income</p>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black text-[#5A141E]">
                ₹{(summary?.totalIncome || 0).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-4">
              <div className="p-1 bg-emerald-100 rounded-full">
                <ArrowUpRight className="h-3 w-3 text-emerald-600" />
              </div>
              <span className="text-emerald-600 font-bold text-xs">{summary?.incomeChange} from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-100 bg-white rounded-3xl overflow-hidden shadow-sm transition-transform hover:scale-[1.02]">
          <CardContent className="p-10">
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-2">Total Expenses</p>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black text-[#5A141E]">
                ₹{(summary?.totalExpenses || 0).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-4">
               <div className="p-1 bg-amber-100 rounded-full">
                <ArrowUpRight className="h-3 w-3 text-amber-600" />
              </div>
              <span className="text-amber-600 font-bold text-xs">{summary?.expenseChange} from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-[#F3FAF5] rounded-3xl overflow-hidden shadow-none transition-transform hover:scale-[1.02]">
          <CardContent className="p-10">
            <p className="text-emerald-600/60 font-bold text-xs uppercase tracking-widest mb-2">Net Profit</p>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black text-emerald-700">
                ₹{(summary?.netProfit || 0).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-4">
               <Badge className="bg-emerald-100 text-emerald-700 border-none font-bold shadow-none px-2 rounded-md">
                 {summary?.profitMargin}% Profit Margin
               </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Account Balances */}
        <Card className="border border-slate-100 bg-white rounded-3xl shadow-sm">
          <CardHeader className="px-10 pt-10 pb-4 border-none">
            <CardTitle className="text-lg font-bold text-[#5A141E] flex items-center gap-3">
               <div className="p-2 bg-[#5A141E]/10 rounded-xl">
                <Wallet className="h-5 w-5 text-[#5A141E]" />
               </div>
               Account Balances
            </CardTitle>
          </CardHeader>
          <CardContent className="px-10 pb-10 space-y-12 pt-4">
            {/* Receivable */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm font-bold text-slate-700">Accounts Receivable (Owed to you)</p>
                </div>
                <p className="text-xl font-black text-[#5A141E]">
                  ₹{(accounts?.receivable.total || 0).toLocaleString('en-IN')}
                </p>
              </div>
              <Progress value={75} className="h-4 bg-slate-100 [&>div]:bg-[#5A141E] rounded-full" />
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                <span className="text-slate-400">Current: ₹{(accounts?.receivable.current || 0).toLocaleString()}</span>
                <span className="text-rose-400">Overdue: ₹{(accounts?.receivable.overdue || 0).toLocaleString()}</span>
              </div>
            </div>

            {/* Payable */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm font-bold text-slate-700">Accounts Payable (You owe)</p>
                </div>
                <p className="text-xl font-black text-[#5A141E]">
                  ₹{(accounts?.payable.total || 0).toLocaleString('en-IN')}
                </p>
              </div>
              <Progress value={35} className="h-4 bg-slate-100 [&>div]:bg-amber-500 rounded-full" />
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                <span className="text-slate-400">Current: ₹{(accounts?.payable.current || 0).toLocaleString()}</span>
                <span className="text-rose-400">Overdue: ₹{(accounts?.payable.overdue || 0).toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* GST Summary */}
        <Card className="border border-slate-100 bg-white rounded-3xl shadow-sm">
          <CardHeader className="px-10 pt-10 pb-4 border-none">
            <CardTitle className="text-lg font-bold text-[#5A141E] flex items-center gap-3">
               <div className="p-2 bg-[#5A141E]/10 rounded-xl">
                <Receipt className="h-5 w-5 text-[#5A141E]" />
               </div>
               GST Summary (Estimated)
            </CardTitle>
          </CardHeader>
          <CardContent className="px-10 pb-10 pt-4 space-y-6">
             <div className="p-5 bg-slate-50 rounded-2xl flex items-center justify-between transition-all hover:bg-slate-100">
               <span className="text-sm font-bold text-slate-600">Output GST (Collected)</span>
               <span className="text-lg font-black text-[#5A141E]">
                 ₹{(gst?.outputGst || 0).toLocaleString()}
               </span>
             </div>
             <div className="p-5 bg-slate-50 rounded-2xl flex items-center justify-between transition-all hover:bg-slate-100">
               <span className="text-sm font-bold text-slate-600">Input Tax Credit (ITC)</span>
               <span className="text-lg font-black text-emerald-600">
                 ₹{(gst?.itc || 0).toLocaleString()}
               </span>
             </div>
             
             <div className="p-8 border border-[#5A141E]/10 bg-[#FDF1F2]/30 rounded-3xl flex items-center justify-between mt-4">
                <span className="text-md font-black text-[#5A141E]">Estimated GST Payable</span>
                <span className="text-3xl font-black text-[#5A141E]">
                   ₹{(gst?.payable || 0).toLocaleString()}
                </span>
             </div>

              <Button 
                variant="outline" 
                className="w-full h-14 border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-100 mt-4 transition-all hover:text-[#5A141E] hover:border-[#5A141E]/30 group"
                onClick={() => setIsGstModalOpen(true)}
              >
                View Detailed GSTR-3B
                <ArrowUpRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-all" />
              </Button>
          </CardContent>
        </Card>
      </div>

      {/* GST Details Modal */}
      <Dialog open={isGstModalOpen} onOpenChange={setIsGstModalOpen}>
        <DialogContent className="sm:max-w-[700px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
           <div className="bg-[#5A141E] p-8 text-white">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black flex items-center gap-3">
                   <Receipt className="h-6 w-6 text-white/50" />
                   GSTR-3B Detailed Summary
                </DialogTitle>
                <DialogDescription className="text-white/60 font-medium">
                   Reconciliation for {period === 'month' ? 'Current Month' : 'Last Month'}
                </DialogDescription>
              </DialogHeader>
           </div>
           
           <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto">
              {/* Output GST Section */}
              <div className="space-y-4">
                 <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <ArrowUpRight className="h-4 w-4 text-rose-500" /> Output GST (Sales)
                 </h3>
                 <Table>
                    <TableHeader>
                       <TableRow className="border-slate-100 hover:bg-transparent">
                          <TableHead className="text-[10px] font-bold text-slate-400">Nature of Supply</TableHead>
                          <TableHead className="text-right text-[10px] font-bold text-slate-400">Taxable Value</TableHead>
                          <TableHead className="text-right text-[10px] font-bold text-slate-400">GST (5%)</TableHead>
                       </TableRow>
                    </TableHeader>
                    <TableBody>
                       <TableRow className="border-slate-50">
                          <TableCell className="text-xs font-bold text-slate-700">Outward Taxable Supplies</TableCell>
                          <TableCell className="text-right text-xs font-mono">₹{(gst?.outputGst ? gst.outputGst * 20 : 0).toLocaleString()}</TableCell>
                          <TableCell className="text-right text-xs font-black text-[#5A141E]">₹{(gst?.outputGst || 0).toLocaleString()}</TableCell>
                       </TableRow>
                    </TableBody>
                 </Table>
              </div>

              {/* Input GST Section */}
              <div className="space-y-4">
                 <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <ArrowDownRight className="h-4 w-4 text-emerald-500" /> Input Tax Credit (ITC)
                 </h3>
                 <Table>
                    <TableHeader>
                       <TableRow className="border-slate-100 hover:bg-transparent">
                          <TableHead className="text-[10px] font-bold text-slate-400">Description</TableHead>
                          <TableHead className="text-right text-[10px] font-bold text-slate-400">Taxable Value</TableHead>
                          <TableHead className="text-right text-[10px] font-bold text-slate-400">ITC (5%)</TableHead>
                       </TableRow>
                    </TableHeader>
                    <TableBody>
                       <TableRow className="border-slate-50">
                          <TableCell className="text-xs font-bold text-slate-700">All other ITC (Inward Supplies)</TableCell>
                          <TableCell className="text-right text-xs font-mono">₹{(gst?.itc ? gst.itc * 20 : 0).toLocaleString()}</TableCell>
                          <TableCell className="text-right text-xs font-black text-emerald-600">₹{(gst?.itc || 0).toLocaleString()}</TableCell>
                       </TableRow>
                    </TableBody>
                 </Table>
              </div>

              {/* Final Summary */}
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 grid grid-cols-3 gap-4">
                 <div className="text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Total Output</p>
                    <p className="text-md font-black text-[#5A141E]">₹{(gst?.outputGst || 0).toLocaleString()}</p>
                 </div>
                 <div className="text-center border-x border-slate-200">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Total ITC</p>
                    <p className="text-md font-black text-emerald-600">₹{(gst?.itc || 0).toLocaleString()}</p>
                 </div>
                 <div className="text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Net Payable</p>
                    <p className="text-md font-black text-[#5A141E]">₹{(gst?.payable || 0).toLocaleString()}</p>
                 </div>
              </div>
           </div>

           <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setIsGstModalOpen(false)} className="rounded-xl font-bold text-slate-500">Close</Button>
              <Button className="bg-[#5A141E] text-white rounded-xl font-bold shadow-lg" onClick={() => window.print()}>
                 <Printer className="mr-2 h-4 w-4" /> Download Statement
              </Button>
           </div>
        </DialogContent>
      </Dialog>

      {/* Expense Categories */}
      <Card className="border border-slate-100 bg-white rounded-3xl shadow-sm mb-10">
        <CardHeader className="px-10 pt-10 pb-8 border-none">
          <CardTitle className="text-lg font-bold text-[#5A141E] flex items-center gap-3 underline decoration-[#5A141E]/10 underline-offset-8">
             <ArrowDownRight className="h-5 w-5 text-rose-600" /> Expense Category Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="px-10 pb-12 space-y-10 pt-4">
          {expenses.length > 0 ? expenses.map((item, index) => {
            const maxValue = Math.max(...expenses.map(e => e.amount));
            const percentage = (item.amount / maxValue) * 100;
            return (
              <div key={item.category} className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-700">{item.category}</span>
                   <span className="text-lg font-black text-slate-900">
                    ₹{item.amount.toLocaleString()}
                  </span>
                </div>
                <Progress 
                  value={percentage} 
                  className={cn(
                    "h-3 bg-slate-50 rounded-full overflow-hidden",
                    index === 0 ? " [&>div]:bg-[#5A141E]" : " [&>div]:bg-slate-300"
                  )} 
                />
              </div>
            );
          }) : (
            <div className="py-20 text-center text-slate-400 italic">
               No categorization data available for this period.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
