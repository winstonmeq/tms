import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()


export async function GET() {

  try {
    const barangays = await prisma.barangay.findMany();

    return NextResponse.json(barangays);

  } catch (error) {

    console.error("Error fetching barangays:", error);

    return NextResponse.json({ error: "Failed to fetch barangays" }, { status: 500 });
    
  }
}
