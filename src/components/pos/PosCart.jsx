import { useCartStore } from "../../store/useCartStore";
import { createOrder } from "../../services/orderService";
import { useState } from "react";

export default function PosCart() {
  const { items, addItem, clear } = useCartStore();
  const [customer, setCustomer] = useState("");
  const [weight, setWeight] = useState("");

  const add = () => {
    addItem({
      service_id: 1,
      name: "Cuci Kiloan",
      weight: Number(weight),
      price: 6000
    });
    setWeight("");
  };

  const total = items.reduce(
    (sum, i) => sum + i.weight * i.price,
    0
  );

  const submit = async () => {
    await createOrder({
      customer_name: customer,
      phone: "-",
      address: "-",
      items
    });

    alert("Order berhasil");
    clear();
    setCustomer("");
  };

  return (
    <div>
      <h2>POS</h2>

      <input
        placeholder="Customer"
        value={customer}
        onChange={(e) => setCustomer(e.target.value)}
      />

      <input
        type="number"
        placeholder="Berat"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
      />

      <button onClick={add}>Tambah</button>

      <ul>
        {items.map((i, idx) => (
          <li key={idx}>{i.name} - {i.weight}kg</li>
        ))}
      </ul>

      <h3>Total: {total}</h3>

      <button onClick={submit}>Simpan</button>
    </div>
  );
}