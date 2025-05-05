import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPendingOrders, completeOrder } from "../../api/index";
import { OrderCard } from "../../components/OrderCard";
import { Order } from "../../types/index";

export const BartenderLanding: React.FC = () => {
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      const response = await getPendingOrders();
      setPendingOrders(response.data);
    } catch (err) {
      setError("Failed to load pending orders. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Poll for updates every 10 seconds
    const intervalId = setInterval(fetchOrders, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const handleCompleteOrder = async (orderId: number) => {
    try {
      await completeOrder(orderId);
      fetchOrders(); // Refresh list after completing order
    } catch (err) {
      setError("Failed to complete order. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Bartender Dashboard
        </h1>
        <Link
          to="/admin/drinks"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Manage Drinks
        </Link>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Pending Orders
        </h2>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => fetchOrders()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        ) : pendingOrders.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No pending orders at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onComplete={handleCompleteOrder}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
