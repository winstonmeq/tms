import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/record/[id]
export async function GET(request: NextRequest, response: NextResponse) {
 
  try {
    const id = request.nextUrl.pathname.split('/voters/')[1];

    if (id) {
      const record = await prisma.voter.findUnique({
        where: { id : id },
        include:{
          bar:true,
          coor:true
        }, 
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

export async function main() {
  try {
    await prisma.$connect();
  } catch (err) {
    return Error("Database Connection Unsuccessull");
  }
}

export const PUT = async (request: Request, response: NextResponse) => {

  try {
    await main();
    const id = request.url.split("/voters/")[1];
    const data = await request.json()    
    const {fname, lname, mname, prkname, member,userId, coorId,barId,munId } = data
    const dataSave = await prisma.voter.update({
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
      where: { id },
    });
    return NextResponse.json({ message: "Success", dataSave }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};


