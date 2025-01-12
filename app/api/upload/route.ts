import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Handle POST requests
export async function POST(req: NextRequest) {
  try {
    const data = await req.json(); // Parse the JSON body

    if (!Array.isArray(data)) {
      return NextResponse.json({ error: "Invalid input, expected an array of objects." }, { status: 400 });
    }

    // Validate and map each item
    const municipalities = data.map((item) => {
      if (!item.userId || !item.munname) {
        throw new Error("Invalid input: 'userId' and 'munname' are required for each item.");
      }
      return {
        userId: item.userId,
        munname: item.munname,
      };
    });

    // Save data in bulk
    await prisma.municipality.createMany({
      data: municipalities,
      // skipDuplicates: true, // Optional: Prevent duplicate entries if necessary
    });

    return NextResponse.json({ message: "Data saved successfully!" }, { status: 200 });
  } catch (error: any) {
    console.error("Error saving data:", error.message);
    return NextResponse.json({ error: error.message || "Failed to save data." }, { status: 500 });
  }
}
