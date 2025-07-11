import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { getSalesAnalytics } from "../../api";

interface SalesAnalytics {
  summary: {
    period_start: string;
    period_end: string;
    total_orders: number;
    total_revenue: number;
    total_items_sold: number;
    average_order_value: number;
  };
  sales_by_period: Array<{
    period: string;
    total_orders: number;
    total_sales: number;
  }>;
  top_products: Array<{
    product_id: string;
    product_name: string;
    category_name: string;
    total_quantity: number;
    total_revenue: number;
  }>;
}

export default function StatisticDashboard() {
  const [stats, setStats] = useState<SalesAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<string>("month");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    const isLoggedIn = localStorage.getItem("userId");

    if (!isLoggedIn) {
      toast.error("Please log in to access this page");
      navigate("/login");
      return;
    }

    if (userRole !== "admin" && userRole !== "statistics_manager") {
      toast.error("You don't have permission to access this page");
      navigate("/");
      return;
    }

    fetchAnalytics();
  }, [navigate, period, startDate, endDate]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      const params: {
        period?: string;
        start_date?: string;
        end_date?: string;
      } = { period };

      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const data = await getSalesAnalytics(params);
      setStats(data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "AUD"
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-AU", {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getProgressPercentage = (sold: number, maxSold: number) => {
    return maxSold > 0 ? (sold / maxSold) * 100 : 0;
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading analytics...</div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="text-center text-red-600">
          Failed to load analytics data. Please try again.
        </div>
      </div>
    );
  }

  const maxSold = stats.top_products && stats.top_products.length > 0 
    ? Math.max(...stats.top_products.map(p => p.total_quantity)) 
    : 0;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Sales Analytics
        </h1>

        <p className="text-gray-600 mt-2">
          Overview of your store's performance and top products
        </p>
      </div>

      {/* Date Range Controls */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Period
            </label>

            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="day">Daily</option>
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
              <option value="year">Yearly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>

            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {stats && stats.summary && (
          <div className="mt-4 text-sm text-gray-600">
            Showing data from {formatDate(stats.summary.period_start)} to {formatDate(stats.summary.period_end)}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>

            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Revenue
              </p>

              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(stats.summary.total_revenue)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>

            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Orders
              </p>

              <p className="text-2xl font-semibold text-gray-900">
                {stats.summary.total_orders}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>

            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Average Order Value
              </p>

              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(stats.summary.average_order_value)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>

            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Items Sold
              </p>

              <p className="text-2xl font-semibold text-gray-900">
                {stats.summary.total_items_sold}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Period Sales Chart */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Sales by Period
        </h2>

        <div className="space-y-4">
          {stats.sales_by_period && stats.sales_by_period.length > 0 ? (
            stats.sales_by_period
              .sort((a, b) => new Date(b.period).getTime() - new Date(a.period).getTime())
              .map((periodData, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {formatDate(periodData.period)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {periodData.total_orders} orders
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(periodData.total_sales)}
                    </p>
                  </div>
                </div>
              ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No sales data available for the selected period.</p>
            </div>
          )}
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Top Selling Products
          </h2>

          <p className="text-sm text-gray-600">
            Products ranked by total units sold
          </p>
        </div>

        <div className="p-6">
          {stats.top_products && stats.top_products.length > 0 ? (
            <div className="space-y-4">
              {stats.top_products.map((product, index) => (
                <div key={product.product_id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-white font-bold text-sm ${
                      index === 0 ? 'bg-yellow-500' : 
                      index === 1 ? 'bg-gray-400' : 
                      index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                    }`}>
                      {index + 1}
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-900">
                        {product.product_name}
                      </h3>

                      <p className="text-sm text-gray-600">
                        {product.total_quantity} units sold - {formatCurrency(product.total_revenue)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getProgressPercentage(product.total_quantity, maxSold)}%` }}
                      ></div>
                    </div>

                    <span className="text-sm font-medium text-gray-900 w-12 text-right">
                      {Math.round(getProgressPercentage(product.total_quantity, maxSold))}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>

              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No product data available
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Start selling to see your top products here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
