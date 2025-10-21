import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { Chart } from "../../components/Chart";
import Loading from "../../components/Loader";
import { FaBoxOpen, FaMoneyBill, FaUser, FaUsers } from "react-icons/fa";
import { IoCart } from "react-icons/io5";
import { toast } from "sonner";
import { useGetDashboardStatsQuery } from "../../redux/slices/api/adminApiSlice";


const Dashboard = () => {
  // const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
const { data: responseData, isLoading, isError } = useGetDashboardStatsQuery();

  // useEffect(() => {
  //   const fetchDashboardData = async () => {
  //     try{
  //       const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/dashboard`, {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //         credentials: "include",
  //         method: "GET",
  //         body: JSON.stringify({
  //           token: localStorage.getItem("token"),
  //           role: localStorage.getItem("role"),
  //           id: localStorage.getItem("id"),
  //           email: localStorage.getItem("email"),
  //           name: localStorage.getItem("name"),
  //           image: localStorage.getItem("image"),

  //         }),
  //       });
  //     const json = await res.json();
  //       if (json.success) setData(json.data);
  //       else toast.error(json.message || "Failed to load analytics");
  //     } catch (err) {
  //       console.error(err);
  //       toast.error("Error fetching dashboard analytics");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchDashboardData();
  // }, []);



if (isLoading) {
    return (
      <div className="py-10">
        <Loading />
      </div>
    );
  }

  if (isError || !responseData?.data) {
    return <p className="text-red-500 py-10 text-center">Failed to load dashboard data</p>;
  }


  const data = responseData.data;

  const totals = data?.shop || { totalRevenue: 0, orders: 0, products: 0, users: 0 };
  const stats = [
    { label: "Total Revenue", total: data.totalRevenue, icon: <FaMoneyBill />, bg: "bg-blue-600" },
    { label: "Total Orders", total: totals.orders, icon: <IoCart />, bg: "bg-emerald-600" },
    { label: "Total Products", total: totals.products, icon: <FaBoxOpen />, bg: "bg-yellow-500" },
    { label: "Total Users", total: totals.users, icon: <FaUsers />, bg: "bg-pink-600" },
  ];

  const Card = ({ label, count, bg, icon }) => (
    <div className="w-full h-32 bg-white p-5 shadow-md rounded-md flex items-center justify-between hover:shadow-lg transition">
      <div className="h-full flex flex-1 flex-col justify-between">
        <p className="text-base text-gray-600">{label}</p>
        <span className="text-2xl font-semibold">{count}</span>
        <span className="text-sm text-gray-400">{"Updated now"}</span>
      </div>
      <div className={clsx("w-10 h-10 rounded-full flex items-center justify-center text-white", bg)}>
        {icon}
      </div>
    </div>
  );

  const TopSellingSlider = ({ products }) => (
    <div className="w-full bg-white p-4 rounded shadow-sm">
      <h4 className="text-lg font-semibold text-gray-600 mb-4">Top Selling Products</h4>
      <div className="flex space-x-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
        {products.map((product, idx) => (
          <div key={idx} className="min-w-[200px] bg-gray-50 p-4 border rounded shadow flex-shrink-0">
            <img src={product.image} alt={product.name} className="w-24 h-24 object-cover mx-auto rounded" />
            <div className="text-center mt-2">
              <p className="font-semibold">{product.name}</p>
              <p className="font-semibold">${product.price}</p>
              <p className="text-sm text-gray-500">{product.sold} sold</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="h-full py-4">
      <div className="mb-2 p-2">
        <h1 className="text-2xl text-white font-bold">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {stats.map(({ icon, bg, label, total }, index) => (
          <Card key={index} icon={icon} bg={bg} label={label} count={total} />
        ))}
      </div>

      <div className="w-full bg-white my-16 p-4 rounded shadow-sm">
        <h4 className="text-xl text-gray-600 font-semibold">Sales Analytics</h4>
        {data?.graphData?.length ? (
          <Chart data={data.graphData} />
        ) : (
          <p className="text-gray-500 mt-4">No analytics available yet.</p>
        )}
      </div>

      <div className="w-full flex flex-col md:flex-row gap-4 py-8">
      {data?.topSelling?.length ? (
        <TopSellingSlider products={data.topSelling} />
      ) : (
        <p className="text-gray-500">No sales data yet.</p>
      )}     
       </div>
    </div>
  );
};

export default Dashboard;
