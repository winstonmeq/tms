

import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()


export async function GET() {

  try {
    const municipalities = await prisma.municipality.findMany({
      include: {
        voter: true
      }
    });

    const voterCounts = municipalities.map((municipality) => ({
      munId: municipality.id,
      munname: municipality.munname,
      votersCount: municipality.voter.length,
      votersMemberCount: municipality.voter.filter((voter) => voter.member === 'Yes').length,
    }));

    return NextResponse.json(voterCounts);

  } catch (error) {

    console.error("Error fetching barangays:", error);

    return NextResponse.json({ error: "Failed to fetch municipalities" }, { status: 500 });
    
  }
}
