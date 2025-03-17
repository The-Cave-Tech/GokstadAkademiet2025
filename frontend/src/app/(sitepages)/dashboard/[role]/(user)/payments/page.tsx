import AuthCard from "@/components/ui/AuthCard";
import React from "react";

const Payments = () => {
  return (
    <section>
      <h1 className="font-bold">Payments</h1>
      <ul className="grid grid-flow-col">
        <li>Payment 1 {/* Card component */}</li>
        <li>Payment 2 {/* Card component */}</li>
        <li>Payment 3 {/* Card component */}</li>
        <li>Payment 4 {/* Card component */}</li>
      </ul>
    </section>
  );
};

export default Payments;
