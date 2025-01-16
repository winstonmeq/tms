



import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client'




const prisma = new PrismaClient()


export async function GET(request:NextRequest) {

    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page') || '1', 10);

    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const skip = (page - 1) * limit;
  
  

    try {

      const pathname = new URL(request.url).pathname;
      const id = pathname.split("/coordinator_voter/")[1];

        console.log('coorId',id)
  
      const coor_voter = await prisma.voter.findMany({
        skip,
        take: limit,
        where: { coorId: id },
        
        include: {
          bar: true,
          municipality: true
        }
      })
      
      const totalRecords = await prisma.voter.count(); // Total number of records
  
      return NextResponse.json({coor_voter, totalRecords})
  
    } catch (error) {
  
      console.error("Error fetching patients:", error)
  
      return NextResponse.error()
    }
  }
  