

import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()


export async function GET() {

  try {
    const municipalities = await prisma.municipality.findMany();

    return NextResponse.json(municipalities);

  } catch (error) {

    console.error("Error fetching municipalities:", error);

    return NextResponse.json({ error: "Failed to fetch municipalities" }, { status: 500 });
    
  }
}
