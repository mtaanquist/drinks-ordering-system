import axios from "axios";

const API_URL = "http://localhost:4000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Drink APIs
export const getDrinks = () => api.get("/drinks");
export const getDrink = (id: number) => api.get(`/drinks/${id}`);
export const createDrink = (drinkData: any) => api.post("/drinks", drinkData);
export const updateDrink = (id: number, drinkData: any) =>
  api.put(`/drinks/${id}`, drinkData);
export const deleteDrink = (id: number) => api.delete(`/drinks/${id}`);

// Order APIs
export const getOrders = () => api.get("/orders");
export const getPendingOrders = () => api.get("/orders/pending");
export const getCustomerOrder = (name: string) =>
  api.get(`/orders/customer/${name}`);
export const createOrder = (orderData: any) => api.post("/orders", orderData);
export const completeOrder = (id: number) => api.put(`/orders/${id}/complete`);
