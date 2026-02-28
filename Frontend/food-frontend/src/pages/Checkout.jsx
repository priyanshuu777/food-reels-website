import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/Checkout.css";

const Checkout = () => {
  const { id } = useParams();
  const [buy, setBuy] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/buy/${id}`, { withCredentials: true })
      .then(res => setBuy(res.data.buy))
      .catch(err => console.error(err));
  }, [id]);

  const payNow = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:3000/api/payment/create",
        { buyId: buy._id },
        { withCredentials: true }
      );
console.log(res.data)

      // 🔥 Xendit hosted checkout URL
      window.location.href = res.data.invoice_url || res.data.paymentUrl;
      

    } catch (err) {
      console.error(err);
      alert("Failed to start payment");
    } finally {
      setLoading(false);
    }
  };

  if (!buy) return <div style={{ padding: 20 }}>Loading…</div>;

 return (
  <div className="checkout-container">
    <div className="checkout-card">

      <h2>Checkout</h2>

      <div className="checkout-row">
        <span>Food</span>
        <span>{buy.food?.name}</span>
      </div>

      <div className="checkout-row">
        <span>Quantity</span>
        <span>{buy.quantity}</span>
      </div>

      <div className="checkout-row">
        <span>Price</span>
        <span>₹{buy.price * buy.quantity}</span>
      </div>

      <div className="checkout-row">
        <span>Status</span>
        <span>{buy.status}</span>
      </div>

      {buy.status !== "PAID" && (
        <button className="pay-btn" onClick={payNow} disabled={loading}>
          {loading ? "Redirecting…" : "Pay Now"}
        </button>
      )}

      {buy.status === "PAID" && (
        <div className="paid-badge">Payment Successful ✅</div>
      )}

    </div>
  </div>
);

};

export default Checkout;
