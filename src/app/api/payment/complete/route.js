export const maxDuration = 60;
import { MongoClient, ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const mongoClient = new MongoClient(process.env.MONGO_URI);

export const POST = async (req, res) => {
  const { paymentIntentId,
    amount,
    userId,
    email,
    date } = await req.json(); // Get necessary data

  try {
    // Verify the payment intent status with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Connect to MongoDB
      await mongoClient.connect();
      const db = mongoClient.db(process.env.DATABASE);
      const userCollection = db.collection('Users');
      const transactionsCollection = db.collection('Transactions');

      await userCollection.updateOne(
        { _id: new ObjectId(userId) },
        {
          $inc: { walletAmount: parseInt(amount) }
        }
      );

      // Log the transaction in the transactions collection
      await transactionsCollection.insertOne({
        userId,
        email,
        amount,
        transactionDate: date,
        transactionType: 'credit',
        paymentIntentId: paymentIntent.id,
      });

      return NextResponse.json({ message: 'Payment successful and wallet updated' }, {
        status: 200,
      });
    } else {
      return NextResponse.json({ message: 'Payment failed' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error completing payment:', error);
    return NextResponse.json({ message: 'Failed to complete payment' }, { status: 500 });
  }
}
