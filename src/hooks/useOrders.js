import { useEffect, useState } from "react";
import api from "../../../src/services/api";

export default function useOrders() {
  const [orders, setOrders] = useState([]);

  // GET ALL ORDERS
  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // CREATE ORDER (CHECKOUT)
  const addOrder = async (order) => {
    try {
      const res = await api.post("/orders", order);

      setOrders((prev) => [...prev, res.data]);
    } catch (err) {
      console.log(err);
    }
  };

  // UPDATE STATUS
  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}`, { status });

      setOrders((prev) =>
        prev.map((o) =>
          o.id === id ? { ...o, status } : o
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    addOrder,
    updateStatus,
  };
}