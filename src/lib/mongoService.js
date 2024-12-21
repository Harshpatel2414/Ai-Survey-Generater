import { MongoClient, ObjectId } from "mongodb";

class MongoService {
    constructor() {
        const uri = process.env.MONGO_URI;
        this.client = new MongoClient(uri);
        this.dbName = process.env.DB_NAME || "AiSurvey";
    }

    async connect() {
        if (!this.client.isConnected()) {
            await this.client.connect();
        }
        this.db = this.client.db(this.dbName);
    }

    // Register a new user
    async registerUser(email, password) {
        await this.connect();
        const user = await this.db.collection("Users").findOne({ email });
        if (user) {
            throw new Error("User already exists");
        }

        const result = await this.db.collection("Users").insertOne({
            email,
            password,
            wallet: 0,
            profilesGenerated: 0,
        });
        return result.insertedId;
    }

    // Login a user
    async loginUser(email) {
        await this.connect();
        const user = await this.db.collection("Users").findOne({ email });
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }

    // Update wallet balance
    async updateWallet(userId, amount) {
        await this.connect();
        const result = await this.db.collection("Users").updateOne(
            { _id: new ObjectId(userId) },
            { $inc: { wallet: amount } }
        );
        if (result.modifiedCount === 0) {
            throw new Error("Failed to update wallet");
        }
        return true;
    }

    // Fetch wallet balance
    async getWalletBalance(userId) {
        await this.connect();
        const user = await this.db.collection("Users").findOne({ _id: new ObjectId(userId) });
        if (!user) {
            throw new Error("User not found");
        }
        return user.wallet;
    }

    // Add a transaction
    async addTransaction(userId, amount, description) {
        await this.connect();
        const result = await this.db.collection("Transactions").insertOne({
            userId: new ObjectId(userId),
            amount,
            description,
            date: new Date(),
        });
        return result.insertedId;
    }

    // Fetch all transactions
    async getAllTransactions() {
        await this.connect();
        const transactions = await this.db.collection("Transactions").find().toArray();
        return transactions;
    }
}

export default new MongoService();
