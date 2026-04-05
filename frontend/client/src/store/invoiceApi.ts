import { api } from "./api";

export interface InvoiceItem {
  name: string;
  qty: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  _id: string;
  invoiceNumber: string;
  orderId: { _id: string; orderNumber: string; eventName?: string }; 
  orderNumber?: string;
  customerId: { _id: string; name: string; email?: string; phone?: string; company?: string }; 
  customerName?: string;
  date: string;
  dueDate?: string;
  lineItems: InvoiceItem[];
  subTotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  amountPaid: number;
  balance: number;
  status: "Sent" | "Partially Paid" | "Paid" | "Cancelled";
  notes?: string;
  createdAt: string;
}

export interface InvoicesResponse {
  success: boolean;
  data: Invoice[];
  total: number;
}

export interface SingleInvoiceResponse {
  success: boolean;
  data: Invoice;
}

export const invoiceApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getInvoices: builder.query<InvoicesResponse, void>({
      query: () => "/invoices",
      providesTags: ["Invoices"],
    }),
    getInvoiceById: builder.query<SingleInvoiceResponse, string>({
      query: (id) => `/invoices/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Invoices", id }],
    }),
    createInvoice: builder.mutation<SingleInvoiceResponse, { orderId: string }>({
      query: (body) => ({
        url: "/invoices",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Invoices"],
    }),
    markAsPaid: builder.mutation<SingleInvoiceResponse, { id: string; amount?: number }>({
      query: ({ id, ...body }) => ({
        url: `/invoices/${id}/pay`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Invoices", id },
        "Invoices",
      ],
    }),
  }),
});

export const {
  useGetInvoicesQuery,
  useGetInvoiceByIdQuery,
  useCreateInvoiceMutation,
  useMarkAsPaidMutation,
} = invoiceApi;
