import { useState } from "react";
import { Link } from "wouter";
import { 
  useGetInvoicesQuery 
} from "@/store/invoiceApi";
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Printer, 
  ExternalLink,
  Loader2,
  AlertCircle,
  CreditCard,
  Smartphone,
  Wallet,
  Building2
} from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreatePaymentMutation } from "@/store/paymentApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { 
  exportInvoicesToCSV, 
  exportSingleInvoiceToPDF,
  exportInvoicesToPDF 
} from "@/lib/exportInvoices";
import { toast } from "sonner";

export default function Invoices() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: response, isLoading, error } = useGetInvoicesQuery(undefined, {
    pollingInterval: 30000,
    refetchOnFocus: true,
    refetchOnReconnect: true
  });

  const invoices = response?.data || [];

  const filteredInvoices = invoices.filter(inv => {
    const custName = inv.customerId?.name || inv.customerName || "";
    const orderNum = inv.orderId?.orderNumber || inv.orderNumber || "";
    
    return (
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      custName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orderNum.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const [createPayment, { isLoading: isCreatingPayment }] = useCreatePaymentMutation();
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<any>("UPI");
  const [paymentRef, setPaymentRef] = useState("");

  const handleOpenPaymentModal = (invoice: any) => {
    setSelectedInvoice(invoice);
    setPaymentAmount(invoice.balance || 0);
    setPaymentMethod("UPI");
    setPaymentRef("");
  };

  const handleAddPayment = async () => {
    if (!selectedInvoice) return;
    
    try {
      await createPayment({
        orderId: selectedInvoice.orderId?._id,
        invoiceId: selectedInvoice._id,
        amount: paymentAmount,
        method: paymentMethod,
        reference: paymentRef || "Direct Payment"
      }).unwrap();

      toast.success(`Payment of ₹${paymentAmount} recorded for ${selectedInvoice.invoiceNumber}`);
      setSelectedInvoice(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to record payment");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Paid":
        return <Badge className="bg-emerald-500 hover:bg-emerald-600">Paid</Badge>;
      case "Partially Paid":
        return <Badge className="bg-amber-500 hover:bg-amber-600 text-white">Partially Paid</Badge>;
      case "Sent":
        return <Badge variant="secondary" className="bg-slate-200 text-slate-700 hover:bg-slate-300">Sent</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-[60vh] items-center justify-center text-center gap-4">
        <AlertCircle className="h-12 w-12 text-destructive opacity-20" />
        <h2 className="text-xl font-semibold">Failed to load invoices</h2>
        <p className="text-muted-foreground">Please try again later or contact support.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Invoices</h1>
          <p className="text-muted-foreground mt-1">Manage billing and GST compliant invoices.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="shadow-sm">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
          <Button 
            className="shadow-md bg-emerald-600 hover:bg-emerald-700"
            onClick={() => exportInvoicesToPDF(filteredInvoices)}
          >
            <Printer className="mr-2 h-4 w-4" /> Bulk Print
          </Button>
          <Button 
            className="shadow-md bg-primary hover:bg-primary/90"
            onClick={() => exportInvoicesToCSV(filteredInvoices)}
          >
            <Download className="mr-2 h-4 w-4" /> Bulk Export
          </Button>
        </div>
      </div>

      {/* Main Content Card */}
      <Card className="border-primary/10 shadow-xl overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold text-slate-800">All Invoices</CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by Invoice #, Customer..." 
                className="pl-9 bg-white border-primary/20 focus-visible:ring-primary h-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="py-4 font-bold text-slate-700">Invoice #</TableHead>
                  <TableHead className="py-4 font-bold text-slate-700">Order Ref</TableHead>
                  <TableHead className="py-4 font-bold text-slate-700">Customer</TableHead>
                  <TableHead className="py-4 font-bold text-slate-700">Date</TableHead>
                  <TableHead className="py-4 font-bold text-slate-700 text-right">Amount</TableHead>
                  <TableHead className="py-4 font-bold text-slate-700 text-right">Balance</TableHead>
                  <TableHead className="py-4 font-bold text-slate-700 text-center">Status</TableHead>
                  <TableHead className="py-4 font-bold text-slate-700 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-64 text-center py-20 text-muted-foreground">
                       <FileText className="h-10 w-10 mx-auto mb-4 opacity-10" />
                       <p className="text-lg font-medium">No invoices found</p>
                       <p className="text-sm">Try searching for a different term or generate from Orders.</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInvoices.map((invoice) => (
                    <TableRow key={invoice._id} className="hover:bg-slate-50 transition-colors group">
                      <TableCell className="font-bold text-primary py-4">
                        <Link href={`/invoices/${invoice._id}`} className="hover:underline cursor-pointer">
                          {invoice.invoiceNumber}
                        </Link>
                      </TableCell>
                      <TableCell className="text-slate-500 text-xs font-mono">
                        <Link href={`/orders/${invoice.orderId?._id}`} className="hover:text-primary hover:underline cursor-pointer">
                          {invoice.orderId?.orderNumber || '—'}
                        </Link>
                      </TableCell>
                      <TableCell className="font-medium text-slate-800">
                        {invoice.customerId?.name || '—'}
                      </TableCell>
                      <TableCell className="text-slate-600 text-sm">
                        {invoice.date ? new Date(invoice.date).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        }) : '—'}
                      </TableCell>
                      <TableCell className="text-right font-bold text-slate-800">
                        ₹{(invoice.totalAmount ?? 0).toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell className={cn(
                        "text-right font-bold",
                        (invoice.balance ?? 0) > 0 ? "text-rose-600" : "text-emerald-600"
                      )}>
                        ₹{(invoice.balance ?? 0).toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(invoice.status)}
                      </TableCell>
                       <TableCell className="text-right">
                        <div className="flex justify-end gap-2 pr-2">
                           <Button 
                             variant="ghost" 
                             size="icon" 
                             className="h-8 w-8 text-slate-500 hover:text-primary"
                             onClick={() => exportSingleInvoiceToPDF(invoice)}
                             title="Download PDF"
                           >
                             <Download className="h-4 w-4" />
                           </Button>
                           <Button 
                             variant="ghost" 
                             size="icon" 
                             className="h-8 w-8 text-slate-500 hover:text-emerald-600"
                             onClick={() => handleOpenPaymentModal(invoice)}
                             title="Record Payment"
                             disabled={invoice.status === "Paid"}
                           >
                             <CreditCard className="h-4 w-4" />
                           </Button>
                           <Button 
                             variant="ghost" 
                             size="icon" 
                             className="h-8 w-8 text-slate-500 hover:text-primary"
                             onClick={() => {
                               exportSingleInvoiceToPDF(invoice);
                               toast.info("Invoice generated for printing");
                             }}
                             title="Print Invoice"
                           >
                             <Printer className="h-4 w-4" />
                           </Button>
                           <Link href={`/invoices/${invoice._id}`}>
                             <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-primary">
                               <ExternalLink className="h-4 w-4" />
                             </Button>
                           </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Payment Modal */}
      <Dialog open={!!selectedInvoice} onOpenChange={(open) => !open && setSelectedInvoice(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-emerald-800">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <CreditCard className="h-5 w-5 text-emerald-600" />
              </div>
              Record Payment
            </DialogTitle>
            <DialogDescription>
              Add a payment transaction for {selectedInvoice?.invoiceNumber}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label className="text-slate-600 font-bold uppercase text-[10px]">Amount Received (₹)</Label>
              <Input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                className="text-lg font-bold border-emerald-200 focus-visible:ring-emerald-500"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-slate-600 font-bold uppercase text-[10px]">Payment Method</Label>
              <Select 
                value={paymentMethod} 
                onValueChange={(v: any) => setPaymentMethod(v)}
              >
                <SelectTrigger className="border-emerald-200">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UPI">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-purple-600" /> UPI / PhonePe / GPay
                    </div>
                  </SelectItem>
                  <SelectItem value="Cash">
                    <div className="flex items-center gap-2">
                      <Wallet className="h-4 w-4 text-emerald-600" /> Cash Payment
                    </div>
                  </SelectItem>
                  <SelectItem value="Bank">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-blue-600" /> Bank Transfer
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label className="text-slate-600 font-bold uppercase text-[10px]">Reference / Transaction ID</Label>
              <Input
                placeholder="TXN-123456"
                value={paymentRef}
                onChange={(e) => setPaymentRef(e.target.value)}
                className="border-emerald-200 focus-visible:ring-emerald-500"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 shadow-lg"
              onClick={handleAddPayment}
              disabled={isCreatingPayment}
            >
              {isCreatingPayment ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CreditCard className="h-4 w-4 mr-2" />}
              Confirm Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
