import React from "react";
import { Link } from "react-router-dom";
import { Drink } from "../types/index";

interface DrinkCardProps {
  drink: Drink;
  isCustomer?: boolean;
  onQuantityChange?: (id: number, quantity: number) => void;
  quantity?: number;
}

export const DrinkCard: React.FC<DrinkCardProps> = ({
  drink,
  isCustomer = false,
  onQuantityChange,
  quantity = 1,
}) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {drink.imageUrl && (
        <div className="h-48 overflow-hidden">
          <img
            src={drink.imageUrl}
            alt={drink.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="text-lg font-medium">{drink.name}</h3>
        <p className="text-gray-600 mt-1">{drink.description}</p>

        <div className="mt-4 flex items-center justify-between">
          <Link
            to={`/drinks/${drink.id}`}
            className="text-blue-600 hover:text-blue-800"
          >
            View Recipe
          </Link>

          {isCustomer && drink.inStock && (
            <div className="flex items-center space-x-2">
              <label htmlFor={`quantity-${drink.id}`} className="text-sm">
                Qty:
              </label>
              <input
                id={`quantity-${drink.id}`}
                type="number"
                min="1"
                max="10"
                value={quantity}
                onChange={(e) =>
                  onQuantityChange &&
                  onQuantityChange(drink.id, parseInt(e.target.value))
                }
                className="w-16 border rounded p-1 text-center"
              />
            </div>
          )}

          {!isCustomer && (
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                drink.inStock
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {drink.inStock ? "In Stock" : "Out of Stock"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
