import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/record/[id]
export async function GET(request: NextRequest) {
 

  try {

    const id = request.url.split("/municipality/")[1]

    if (id) {
      const record = await prisma.municipality.findUnique({
        where: { id: id },
        include: {            
            barangay:true,
            coordinator: true
            
        } 
      });

      if (!record) {
        return NextResponse.json({ message: 'Record not found' }, { status: 404 });
      }

      return NextResponse.json(record);
    } else {
      return NextResponse.json({ message: 'ID parameter is required' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error fetching record:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
