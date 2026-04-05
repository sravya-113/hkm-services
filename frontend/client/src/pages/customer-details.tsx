import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockCustomers, mockOrders } from "@/lib/mockData";
import { Mail, Phone, Calendar, ShoppingBag, MapPin, IndianRupee } from "lucide-react";
import { useParams, useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";

export default function CustomerDetails() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const customer = mockCustomers.find(c => c.id === id) || mockCustomers[0];
  const customerOrders = mockOrders.filter(o => o.customerName.includes(customer.name) || o.gstNumber === customer.gstNumber);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold">
            {customer.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{customer.name}</h1>
            <p className="text-muted-foreground">{customer.company || "Personal Client"}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Edit Profile</Button>
          <Button onClick={() => setLocation("/orders/new")}>New Order</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader><CardTitle>Contact Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 text-sm"><Mail className="h-4 w-4 text-muted-foreground" /> {customer.email}</div>
            <div className="flex items-center gap-3 text-sm"><Phone className="h-4 w-4 text-muted-foreground" /> {customer.phone}</div>
            <div className="flex items-center gap-3 text-sm font-semibold text-primary"><IndianRupee className="h-4 w-4" /> Outstanding: ₹{customer.outstandingBalance.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader><CardTitle>Order History</CardTitle><CardDescription>Showing {customerOrders.length} recent caterings.</CardDescription></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customerOrders.map(order => (
                <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <div className="font-medium">{order.id}</div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {order.eventDate}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {order.venue}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{order.status}</Badge>
                    <div className="font-bold text-sm">₹{order.totalAmount.toLocaleString()}</div>
                    <Button variant="ghost" size="sm" onClick={() => setLocation(`/orders/${order.id}`)}>Details</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
