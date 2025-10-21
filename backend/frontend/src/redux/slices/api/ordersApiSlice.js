import { apiSlice } from "../apiSlice";

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrders: builder.query({
      query: () => `/orders`,
      providesTags: ["Orders"],
    }),
    getMyOrders: builder.query({
      query: () => `/orders/myorders`,
      providesTags: ["Orders"],
    }),
  }),
});

export const { useGetAllOrdersQuery, useGetMyOrdersQuery } = ordersApiSlice;
