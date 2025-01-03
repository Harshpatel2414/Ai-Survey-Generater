import connectToDatabase from "@/utils/mongodb";
import { NextResponse } from "next/server";

export const PUT = async (req) => {
    let {title, description} = await req.json();
    try {
        let db = await connectToDatabase();
        let landingInfoCollection = db.collection("LandingPage");
        await landingInfoCollection.updateOne({}, { $set: { title, description } });
        return NextResponse.json({ message : "Information updated successfully"}, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Error while changing title and description" }, { status: 500 });
    }
}