import React from "react";
import { useGetMyOrdersQuery } from "../redux/slices/api/ordersApiSlice.js";
import Loading from "../components/Loader";

const MyOrdersPage = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  if (isLoading) return <Loading />;
  if (error)
    return (
      <div className="text-red-500 text-center mt-10">
        Error fetching orders: {error?.data?.message || error.error}
      </div>
    );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-6 text-white">My Orders</h2>
      {orders?.length === 0 ? (
        <p className="text-gray-500">You have no orders yet.</p>
      ) : (
        <div className="overflow-x-auto bg-white p-4 rounded-md shadow-md">
          <table className="min-w-full text-sm text-gray-600">
            <thead className="border-b text-gray-700 bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left">Order ID</th>
                <th className="py-2 px-4 text-left">Date</th>
                <th className="py-2 px-4 text-left">Total</th>
                <th className="py-2 px-4 text-left">Paid</th>
                <th className="py-2 px-4 text-left">Delivered</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{order._id}</td>
                  <td className="py-2 px-4">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 font-medium">${order.totalPrice.toFixed(2)}</td>
                  <td className="py-2 px-4">
                    {order.isPaid ? (
                      <span className="text-green-600 font-semibold">Yes</span>
                    ) : (
                      <span className="text-red-500">No</span>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {order.isDelivered ? (
                      <span className="text-green-600 font-semibold">Yes</span>
                    ) : (
                      <span className="text-red-500">No</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
