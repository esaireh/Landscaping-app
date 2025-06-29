import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function Home() {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    { title: "One-Time", priceId: "price_1ABC...", price: "$49", mode: "payment" },
    { title: "Weekly", priceId: "price_1DEF...", price: "$149/mo", mode: "subscription" },
    { title: "Monthly", priceId: "price_1GHI...", price: "$399/mo", mode: "subscription" }
  ];

  const handleCheckout = async () => {
    if (!selectedPlan) return alert("Please select a plan!");
    const stripe = await stripePromise;
    await stripe.redirectToCheckout({
      lineItems: [{ price: selectedPlan.priceId, quantity: 1 }],
      mode: selectedPlan.mode,
      successUrl: window.location.origin + "/?success=true",
      cancelUrl: window.location.origin + "/?canceled=true"
    });
  };

  return (
    <main style={{ padding: 40, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h1>Landscaping Service Plans</h1>
      <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
        {plans.map(plan => (
          <div key={plan.title} onClick={() => setSelectedPlan(plan)}
               style={{ padding: 20, border: selectedPlan === plan ? "2px solid green" : "1px solid gray", borderRadius: 8, cursor: "pointer" }}>
            <h2>{plan.title}</h2>
            <p>{plan.price}</p>
          </div>
        ))}
      </div>
      <button onClick={handleCheckout} style={{ marginTop: 30, padding: "10px 20px", fontSize: 18 }}>Confirm and Pay</button>
    </main>
  );
}
