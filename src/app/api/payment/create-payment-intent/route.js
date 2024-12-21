export const maxDuration = 30;
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const POST = async (req) => {
   const { userId, email, amount } = await req.json(); 

   try {
      // Create a payment intent with Stripe
      const paymentIntent = await stripe.paymentIntents.create({
         amount: amount,
         currency: 'inr',
         automatic_payment_methods: { enabled: true },
         description: 'Add Funds to Ai-Survey Wallet',
         metadata: { userId, email },
      });

      // Return the client secret to the client-side for confirming the payment
      return NextResponse.json({ clientSecret: paymentIntent.client_secret }, {
         status: 200,
      });
   } catch (error) {
      console.error('Error creating payment intent:', error);
      return NextResponse.json({ message: 'Failed to create payment intent' }, {
         status: 500,
      });
   }
}
