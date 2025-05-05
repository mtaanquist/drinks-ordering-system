import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCustomerOrder } from "../../api/index";
import { useCustomer } from "../../contexts/CustomerContext";
import { Order } from "../../types/index";

export const OrderStatus: React.FC = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { customerName, hasOrderedDrink, setHasOrderedDrink } = useCustomer();
  const navigate = useNavigate();

  useEffect(() => {
    if (!customerName) {
      navigate("/");
      return;
    }

    if (!hasOrderedDrink) {
      navigate("/menu");
      return;
    }

    const fetchOrderStatus = async () => {
      try {
        const response = await getCustomerOrder(customerName);
        setOrder(response.data);

        // If order is completed, update context state
        if (response.data.status === "completed") {
          setHasOrderedDrink(false);
        }
      } catch (err) {
        console.error(err);

        // If order not found, update context state
        if ((err as any).response?.status === 404) {
          setHasOrderedDrink(false);
          navigate("/menu");
        } else {
          setError("Failed to load order status. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrderStatus();

    // Poll for updates every 5 seconds
    const intervalId = setInterval(fetchOrderStatus, 5000);

    return () => clearInterval(intervalId);
  }, [customerName, navigate, hasOrderedDrink, setHasOrderedDrink]);

  if (!customerName || !hasOrderedDrink) {
    return null; // Will redirect in useEffect
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Your Order Status
          </h1>

          {order && (
            <>
              <div className="mb-6">
                <div className="flex justify-between text-gray-600 mb-2">
                  <span>Order for:</span>
                  <span className="font-medium text-gray-800">
                    {order.customerName}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 mb-2">
                  <span>Status:</span>
                  <span
                    className={`font-medium ${
                      order.status === "completed"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {order.status === "completed" ? "Completed" : "Pending"}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Ordered at:</span>
                  <span className="font-medium text-gray-800">
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              <div className="border-t border-b py-4 my-4">
                <h2 className="text-lg font-medium text-gray-800 mb-3">
                  Order Summary
                </h2>
                {order.items?.map((item) => (
                  <div key={item.id} className="flex justify-between mb-2">
                    <span className="text-gray-600">
                      {item.name} × {item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {order.status === "completed" ? (
                <div className="text-center">
                  <div className="mb-4 text-green-600 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Your order is ready!</span>
                  </div>

                  <button
                    onClick={() => {
                      setHasOrderedDrink(false);
                      navigate("/menu");
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Order Again
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="mb-4 text-yellow-600 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Please wait while we prepare your order...</span>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">
                    This page will automatically update when your order is
                    ready.
                  </p>

                  <button
                    onClick={() => navigate("/menu")}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Return to Menu
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
