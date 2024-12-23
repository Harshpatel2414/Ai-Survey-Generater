import React, { useState } from "react";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

const Checkout = ({ amount, clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);

  // Handle Payment Submission and Intent Creation
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;
    setLoading(true);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message);
      setLoading(false);
      return;
    }
    let date = new Date().toISOString();
    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret: clientSecret,
      confirmParams: {
        return_url: `${"https://ai-survey-generater.vercel.app"}/success?amount=${amount}&userId=${currentUser._id}&email=${currentUser.email}&date=${date}`,
      },
      
    });
    if (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  return (
    <form className="flex flex-col items-center gap-4 w-full">
      <PaymentElement />
      <button
        onClick={(e) => handlePaymentSubmit(e)}
        disabled={loading}
        className="bg-[#4e8d99] text-white py-2 px-6 rounded-md w-full"
      >
        {loading ? "Processing..." : `Complete Payment $${amount}`}
      </button>
    </form>
  );
};

export default Checkout;
