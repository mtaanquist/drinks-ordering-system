import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getDrink, createDrink, updateDrink } from "../../api/index";
import { MarkdownEditor } from "../../components/MarkdownEditor";

export const DrinkForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    recipe: "",
    imageUrl: "",
    inStock: true,
  });

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEditMode) {
      const fetchDrink = async () => {
        try {
          const response = await getDrink(parseInt(id));
          const { name, description, recipe, imageUrl, inStock } =
            response.data;
          setFormData({
            name,
            description,
            recipe,
            imageUrl: imageUrl || "",
            inStock,
          });
        } catch (err) {
          setError("Failed to load drink details. Please try again.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchDrink();
    }
  }, [id, isEditMode]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleRecipeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      recipe: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      if (isEditMode) {
        await updateDrink(parseInt(id), formData);
      } else {
        await createDrink(formData);
      }

      navigate("/admin/drinks");
    } catch (err) {
      setError(
        `Failed to ${isEditMode ? "update" : "create"} drink. Please try again.`
      );
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          {isEditMode ? "Edit Drink" : "Add New Drink"}
        </h1>
        <Link
          to="/admin/drinks"
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 rounded">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="mb-6">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Drink Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter drink name"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter a short description"
              rows={3}
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="recipe"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Recipe
            </label>
            <MarkdownEditor
              value={formData.recipe}
              onChange={handleRecipeChange}
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="imageUrl"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Image URL (optional)
            </label>
            <input
              id="imageUrl"
              name="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter image URL"
            />
          </div>

          <div className="mb-6">
            <div className="flex items-center">
              <input
                id="inStock"
                name="inStock"
                type="checkbox"
                checked={formData.inStock}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="inStock"
                className="ml-2 block text-sm text-gray-700"
              >
                Available (In Stock)
              </label>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={submitting}
              className={`px-6 py-2 text-white rounded-md ${
                submitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {submitting
                ? "Processing..."
                : isEditMode
                ? "Update Drink"
                : "Add Drink"}
            </button>
            <Link
              to="/admin/drinks"
              className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
