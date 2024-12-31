import { NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";

export const GET = async (req) => {

    try {
        let db = await connectToDatabase();
        const transactionsCollection = db.collection("Transactions");

        const totalTransactions = await transactionsCollection.countDocuments();

        const totalRevenue = await transactionsCollection.aggregate([
            { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
        ]).toArray();
        const totalRevenueAmount = totalRevenue.length > 0 ? totalRevenue[0].totalAmount : 0;

        const averageTransactionAmount =
            totalTransactions > 0 ? totalRevenueAmount / totalTransactions : 0;

        const topTransactions = await transactionsCollection
            .find()
            .sort({ transactionDate: -1 })
            .limit(10)
            .toArray();

        const stats = {
            totalTransactions,
            totalRevenue: totalRevenueAmount,
            averageTransaction: averageTransactionAmount.toFixed(2),
            transactions: topTransactions,
        };

        return NextResponse.json(stats, { status: 200 });
    } catch (error) {
        console.error("Error fetching transaction stats:", error);
        return NextResponse.json({ message: "Failed to fetch stats" }, { status: 500 });
    }
}
