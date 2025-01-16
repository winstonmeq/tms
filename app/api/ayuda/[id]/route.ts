

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client'




const prisma = new PrismaClient()


export async function GET(request:NextRequest) {

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const skip = (page - 1) * limit;
  
  

    try {

        const id = request.url.split("/ayuda/")[1]

        console.log('perMun',id)
  
      const ayuda_data = await prisma.ayuda.findMany({
        skip,
        take: limit,
        where: { munId: id },
        
        include: {
          bar: true,
          municipality: true
        }
      })
      
      const totalRecords = await prisma.ayuda.count(); // Total number of records
  
      return NextResponse.json({ayuda_data, totalRecords})
  
    } catch (error) {
  
      console.error("Error fetching patients:", error)
  
      return NextResponse.error()
    }
  }
  