

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

    // console.log(data)

    // Validate and map each item
    const voters = data.map((item) => {
      if (!item.userId || !item.fname || !item.lname || !item.mname || !item.prkname || !item.member) {
        throw new Error("Invalid input: 'userId' and 'fname' are required for each item.");
      }
      return {
        userId: item.userId,
        coorId: item.coorId,
        barId: item.barId,
        munId: item.munId,
        fname: item.fname,
        lname: item.lname,        
        mname: item.mname,
        prkname: item.prkname,
        member: item.member,
      };
    });

    // Save data in bulk
    await prisma.voter.createMany({

      data: voters,
      // skipDuplicates: true, // Optional: Prevent duplicate entries if necessary
    });

    return NextResponse.json({ message: "Data saved successfully!" }, { status: 200 });


  } catch (error) {

    console.error("Error saving data:", error);

    return NextResponse.json({ error: error || "Failed to save data." }, { status: 500 });

  }
}
