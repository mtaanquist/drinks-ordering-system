import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDrink } from "../../api/index";
import { MarkdownEditor } from "../../components/MarkdownEditor";
import { Drink } from "../../types/index";

export const DrinkDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [drink, setDrink] = useState<Drink | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDrink = async () => {
      try {
        if (!id) return;
        const response = await getDrink(parseInt(id));
        setDrink(response.data);
      } catch (err) {
        setError("Failed to load drink details. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDrink();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !drink) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600">{error || "Drink not found"}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        Back to Menu
      </button>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {drink.imageUrl && (
          <div className="h-64 overflow-hidden">
            <img
              src={drink.imageUrl}
              alt={drink.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {drink.name}
          </h1>
          <p className="text-gray-600 mb-6">{drink.description}</p>

          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Recipe</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <MarkdownEditor
                value={drink.recipe}
                onChange={() => {}} // Read-only
                preview={true}
              />
            </div>
          </div>

          <div className="mt-6 border-t pt-6">
            <button
              onClick={() => navigate("/menu")}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
