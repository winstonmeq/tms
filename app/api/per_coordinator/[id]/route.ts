

import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()


export async function GET(request:NextRequest) {

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '50', 10);
  const skip = (page - 1) * limit;


  try {

    const id = request.url.split("/per_coordinator/")[1]

    console.log('perMun',id)

    const coordinator_data = await prisma.coordinator.findMany({
      skip,
      take: limit,
      where: { munId: id },
      include: {
        bar: true,
        municipality: true
      }
    })
    
    // Count the number of records in the result
     const totalRecords = coordinator_data.length;

    return NextResponse.json({coordinator_data, totalRecords})


  } catch (error) {

    console.error("Error fetching patients:", error)

    return NextResponse.error()
  }
}

