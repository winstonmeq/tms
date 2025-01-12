

import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()



export async function POST(request: NextRequest) {
    
    
  try {
    const data = await request.json()

    // Validate required fields
    const {fname, lname, mname, prkname, member,userId, coorId,barId,munId } = data
    if (!lname || !fname || !mname || !prkname || !member || !coorId || !barId || !munId ) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }


    // Save voter data to the database
    const voters = await prisma.voter.create({
      data: {
        lname,
        fname,
        mname, 
        prkname,
        member,
        userId,
        coorId,
        barId,
        munId,
              
      },
    })

    // console.log("Received data:", data);


    return NextResponse.json({ message: 'Voters saved successfully', voters }, { status: 201 })

  } catch {

    return NextResponse.json({ error: 'Failed  dddddddd data' }, { status: 500 })

  }
}


// GET /api/patient/
export async function GET(request:NextRequest) {

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '50', 10);
  const skip = (page - 1) * limit;

  try {

    const voters = await prisma.voter.findMany({
      skip,
      take: limit,
      include: {
        bar: true,
        coor: true
      }
    })
    
    const totalRecords = await prisma.voter.count(); // Total number of records

    return NextResponse.json({voters, totalRecords})

  } catch (error) {

    console.error("Error fetching patients:", error)

    return NextResponse.error()
  }
}

