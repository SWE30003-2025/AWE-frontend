import { useEffect, useState } from "react";
import { getSalesAnalytics } from "../api";

export default function AdminAnalytics() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    getSalesAnalytics().then(setStats).catch(console.error);
  }, []);

  if (!stats) return <div>Loading analytics...</div>;

  return (
    <div className="max-w-xl mx-auto bg-white rounded shadow p-6 mt-8">
      <h2 className="text-xl font-bold mb-4">Sales Analytics</h2>
      <div className="mb-2">Total Sales: <span className="font-semibold">${stats.total_sales?.toFixed(2) || '0.00'}</span></div>
      <div className="mb-2">Total Orders: <span className="font-semibold">{stats.total_orders || 0}</span></div>
      <div className="mb-2">
        <h3 className="font-bold">Popular Products:</h3>
        <ul className="list-disc ml-5">
          {stats.popular_products && stats.popular_products.length > 0 ? (
            stats.popular_products.map((p: any, idx: number) => (
              <li key={idx}>{p.product__name} - Sold: {p.total_sold}</li>
            ))
          ) : (
            <li>No popular products data available</li>
          )}
        </ul>
      </div>
    </div>
  );
}
