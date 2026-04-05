import { api } from "./api";

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface Customer {
  _id?: string; // MongoDB ID (optional for creation)
  name: string;
  email: string;
  phone: string;
  company?: string;
  gstin?: string;
  address?: Address;
  customerType?: 'individual' | 'corporate';
  notes?: string;
  tags?: string[];
  totalOrders?: number;
  outstandingBalance?: number;
  isActive?: boolean;
}

export interface CustomersResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: Customer[];
}

export const customerApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query<Customer[], { search?: string; customerType?: string; isActive?: boolean } | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params) {
          if (params.search) queryParams.append("search", params.search);
          if (params.customerType && params.customerType !== 'all') queryParams.append("customerType", params.customerType);
          if (params.isActive !== undefined) queryParams.append("isActive", params.isActive.toString());
        }
        return `/customers?${queryParams.toString()}`;
      },
      transformResponse: (response: CustomersResponse) => response.data,
      providesTags: ["Customers"],
    }),
    getCustomerById: builder.query<{ success: boolean; data: Customer }, string>({
      query: (id) => `/customers/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Customers", id }],
    }),
    createCustomer: builder.mutation<{ success: boolean; data: Customer }, Partial<Customer>>({
      query: (newCustomer) => ({
        url: "/customers",
        method: "POST",
        body: newCustomer,
      }),
      invalidatesTags: ["Customers"],
    }),
    updateCustomer: builder.mutation<{ success: boolean; data: Customer }, { id: string; data: Partial<Customer> }>({
      query: ({ id, data }) => ({
        url: `/customers/${id}`,
        method: "PUT", // Matched with backend (was PATCH)
        body: data,
      }),
      invalidatesTags: ["Customers"],
    }),
    deleteCustomer: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/customers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Customers"],
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useGetCustomerByIdQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = customerApi;
