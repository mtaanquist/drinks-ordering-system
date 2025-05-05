import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDrinks, createOrder } from "../../api/index";
import { DrinkCard } from "../../components/DrinkCard";
import { useCustomer } from "../../contexts/CustomerContext";
import { Drink } from "../../types/index";

export const DrinksList: React.FC = () => {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [orderLoading, setOrderLoading] = useState(false);

  const { customerName, hasOrderedDrink, setHasOrderedDrink } = useCustomer();
  const navigate = useNavigate();

  useEffect(() => {
    if (!customerName) {
      navigate("/");
      return;
    }

    const fetchDrinks = async () => {
      try {
        const response = await getDrinks();
        const availableDrinks = response.data.filter(
          (drink: Drink) => drink.inStock
        );
        setDrinks(availableDrinks);

        // Initialize quantities
        const initialQuantities: Record<number, number> = {};
        availableDrinks.forEach((drink: Drink) => {
          initialQuantities[drink.id] = 1;
        });
        setQuantities(initialQuantities);
      } catch (err) {
        setError("Failed to load drinks menu. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDrinks();
  }, [customerName, navigate]);

  const handleQuantityChange = (drinkId: number, quantity: number) => {
    setQuantities((prev) => ({
      ...prev,
      [drinkId]: quantity,
    }));
  };

  const handleOrder = async (drinkId: number) => {
    if (hasOrderedDrink) {
      navigate("/order/status");
      return;
    }

    setOrderLoading(true);

    try {
      const orderData = {
        customerName,
        items: [
          {
            drinkId,
            quantity: quantities[drinkId],
          },
        ],
      };

      await createOrder(orderData);
      setHasOrderedDrink(true);
      navigate("/order/status");
    } catch (err) {
      setError("Failed to place order. Please try again.");
      console.error(err);
    } finally {
      setOrderLoading(false);
    }
  };

  if (!customerName) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Hi, {customerName}! What would you like to drink?
        </h1>
        <p className="text-gray-600 mt-2">
          Browse our selection of drinks and place your order.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          {hasOrderedDrink && (
            <div className="mb-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded">
              <p className="text-yellow-700">
                You already have a pending order.
                <button
                  onClick={() => navigate("/order/status")}
                  className="ml-2 underline"
                >
                  View status
                </button>
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drinks.map((drink) => (
              <div key={drink.id} className="flex flex-col">
                <DrinkCard
                  drink={drink}
                  isCustomer={true}
                  onQuantityChange={handleQuantityChange}
                  quantity={quantities[drink.id]}
                />
                <button
                  onClick={() => handleOrder(drink.id)}
                  disabled={orderLoading || hasOrderedDrink}
                  className={`mt-2 px-4 py-2 text-white rounded-md transition-colors ${
                    orderLoading || hasOrderedDrink
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {hasOrderedDrink ? "Already Ordered" : "Order Now"}
                </button>
              </div>
            ))}
          </div>

          {drinks.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-600">
                No drinks available at the moment. Please check back later.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
