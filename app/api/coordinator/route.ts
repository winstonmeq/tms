import { NextRequest, NextResponse } from "next/server";
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



export async function POST(request: NextRequest) {
    
    
  try {
    const data = await request.json()

    // Validate required fields
    const {fname, lname, prkname, phone, position,userId,barId,munId } = data
    if (!lname || !fname || !prkname || !phone || !position || !barId || !munId ) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }


    // Save voter data to the database
    const save_coordinators = await prisma.coordinator.create({
      data: {
        lname,
        fname,
        prkname,
        phone,
        position,
        userId,
        barId,
        munId,
              
      },
    })

    // console.log("Received data:", data);


    return NextResponse.json({ message: 'Coordinator saved successfully', save_coordinators }, { status: 201 })

  } catch {

    return NextResponse.json({ error: 'Failed  to save data' }, { status: 500 })

  }
}

