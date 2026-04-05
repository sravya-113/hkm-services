import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Orders from "@/pages/orders";
import OrderDetails from "@/pages/order-details";
import CalendarPage from "@/pages/calendar";
import MenuPage from "@/pages/menu";
import Customers from "@/pages/customers";
import CustomerDetails from "@/pages/customer-details";
import Quotes from "@/pages/quotes";
import QuoteDetails from "@/pages/quote-details";
import Payments from "@/pages/payments";
import Kitchen from "@/pages/kitchen";
import Invoices from "@/pages/invoices";
import InvoiceDetails from "@/pages/invoice-details";
import Expenses from "@/pages/expenses";
import Reports from "@/pages/reports";
import Settings from "@/pages/settings";
import FeedbackPage from "@/pages/feedback";
import AuthPage from "@/pages/AuthPage";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Layout } from "@/components/layout";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      
      {/* Protected Routes (Wrapped in Layout) */}
      <Route>
        <Layout>
          <Switch>
            <ProtectedRoute path="/" component={Dashboard} />
            <ProtectedRoute path="/orders" component={Orders} />
            <ProtectedRoute path="/orders/:id" component={OrderDetails} />
            <ProtectedRoute path="/invoices" component={Invoices} />
            <ProtectedRoute path="/invoices/:id" component={InvoiceDetails} />
            <ProtectedRoute path="/calendar" component={CalendarPage} />
            <ProtectedRoute path="/menu" component={MenuPage} />
            <ProtectedRoute path="/customers" component={Customers} />
            <ProtectedRoute path="/customers/:id" component={CustomerDetails} />
            <ProtectedRoute path="/quotes" component={Quotes} />
            <ProtectedRoute path="/quotes/new" component={QuoteDetails} />
            <ProtectedRoute path="/quotes/:id" component={QuoteDetails} />
            <ProtectedRoute path="/payments" component={Payments} />
            <ProtectedRoute path="/expenses" component={Expenses} />
            <ProtectedRoute path="/reports" component={Reports} />
            <ProtectedRoute path="/kitchen" component={Kitchen} />
            <ProtectedRoute path="/feedback" component={FeedbackPage} />
            <ProtectedRoute path="/settings" component={Settings} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <SonnerToaster position="top-right" expand={true} richColors />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
