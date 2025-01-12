import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()


export async function GET() {

  try {
    const coordinators = await prisma.coordinator.findMany({
      include: {
        bar: true,
        municipality: true
      }
    });

    return NextResponse.json(coordinators);

  } catch (error) {

    console.error("Error fetching barangays:", error);

    return NextResponse.json({ error: "Failed to fetch coordinators" }, { status: 500 });
    
  }
}
