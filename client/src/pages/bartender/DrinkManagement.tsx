import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDrinks, updateDrink, deleteDrink } from "../../api/index";
import { Drink } from "../../types/index";

export const DrinkManagement: React.FC = () => {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDrinks = async () => {
    try {
      const response = await getDrinks();
      setDrinks(response.data);
    } catch (err) {
      setError("Failed to load drinks. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrinks();
  }, []);

  const handleToggleStock = async (drink: Drink) => {
    try {
      await updateDrink(drink.id, {
        ...drink,
        inStock: !drink.inStock,
      });

      fetchDrinks(); // Refresh list
    } catch (err) {
      setError("Failed to update drink. Please try again.");
      console.error(err);
    }
  };

  const handleDeleteDrink = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this drink?")) {
      return;
    }

    try {
      await deleteDrink(id);
      fetchDrinks(); // Refresh list
    } catch (err) {
      setError("Failed to delete drink. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manage Drinks</h1>
        <div className="space-x-4">
          <Link
            to="/admin"
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Back to Dashboard
          </Link>
          <Link
            to="/admin/drinks/new"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Add New Drink
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => fetchDrinks()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      ) : drinks.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-600">
            No drinks found. Add a new drink to get started.
          </p>
          <Link
            to="/admin/drinks/new"
            className="mt-4 inline-block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Add New Drink
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-gray-600">Name</th>
                <th className="py-3 px-4 text-left text-gray-600">
                  Description
                </th>
                <th className="py-3 px-4 text-center text-gray-600">Status</th>
                <th className="py-3 px-4 text-center text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {drinks.map((drink) => (
                <tr key={drink.id}>
                  <td className="py-3 px-4">{drink.name}</td>
                  <td className="py-3 px-4 text-gray-600 truncate max-w-xs">
                    {drink.description}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        drink.inStock
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {drink.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleToggleStock(drink)}
                        className={`px-3 py-1 rounded text-xs font-medium ${
                          drink.inStock
                            ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                            : "bg-green-100 text-green-800 hover:bg-green-200"
                        }`}
                      >
                        {drink.inStock ? "Mark Out of Stock" : "Mark In Stock"}
                      </button>
                      <Link
                        to={`/admin/drinks/edit/${drink.id}`}
                        className="px-3 py-1 bg-blue-100 text-blue-800 hover:bg-blue-200 rounded text-xs font-medium"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteDrink(drink.id)}
                        className="px-3 py-1 bg-red-100 text-red-800 hover:bg-red-200 rounded text-xs font-medium"
                      >
                        Delete
                      </button>
                    </div>
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
