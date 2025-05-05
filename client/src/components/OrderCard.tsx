import React from "react";
import { Order } from "../types/index";

interface OrderCardProps {
  order: Order;
  onComplete?: (id: number) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onComplete }) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm p-4 mb-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium">Order for: {order.customerName}</h3>
        <span className="text-sm text-gray-500">
          {new Date(order.createdAt).toLocaleTimeString()}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        {order.items?.map((item) => (
          <div key={item.id} className="flex justify-between border-b pb-2">
            <span>
              {item.name} × {item.quantity}
            </span>
          </div>
        ))}
      </div>

      {onComplete && (
        <button
          onClick={() => onComplete(order.id)}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition-colors"
        >
          Mark as Completed
        </button>
      )}
    </div>
  );
};
