import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();



export async function GET(request: NextRequest) {
 

  try {

    const id = request.url.split("/coordinator/")[1]

    if (id) {
      const record = await prisma.coordinator.findMany({
        where: { munId: id },
   
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

export const PUT = async (request: NextRequest) => {


  try {
   
    const id = request.url.split("/coordinator/")[1];

    await prisma.$connect();

    const data = await request.json()

    const {fname, lname, phone, prkname, position,userId,barId,munId } = data

    const dataSave = await prisma.coordinator.update({
      data: {
        fname,
        lname,
        prkname,
        phone,
        position,
        userId,
        barId,
        munId,              
      },
      where: { id },
    });

    return NextResponse.json({ message: "Success", dataSave }, { status: 200 });

  } catch (error) {

    return NextResponse.json({ message: "Error", error }, { status: 500 });

  } finally {

    await prisma.$disconnect();

  }
};
