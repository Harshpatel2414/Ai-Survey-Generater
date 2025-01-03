import connectToDatabase from "@/utils/mongodb";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        let db = await connectToDatabase();
        let landingInfoCollection = db.collection("LandingPage");
        let landingInfo = await landingInfoCollection.findOne({});
        return NextResponse.json(landingInfo, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error while fetching title and description" }, { status: 500 });
    }
}