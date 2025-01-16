import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/record/[id]
export async function GET(request: NextRequest) {
 
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

// export async function main() {
//   try {
//     await prisma.$connect();
//   } catch  {
//     return Error("Database Connection Unsuccessull");
//   }
// }

export const PUT = async (request: NextRequest) => {
  try {
    const id = request.url.split("/voters/")[1]?.split("&&")[0]; // Capture only the part before '&&'
    console.log(id);

    if (!id) {
      return NextResponse.json({ message: "Error: Invalid ID" }, { status: 400 });
    }

    const data = await request.json();
    const { fname, lname, mname, prkname, phone, remarks, member, coorId, barId, munId } = data;

    // Check for required fields
    if (!fname || !lname || !barId || !munId || !coorId) {
      return NextResponse.json({ message: "Error: Missing required fields" }, { status: 400 });
    }

    const dataSave = await prisma.voter.update({
      data: {
        lname,
        fname,
        mname,
        phone,
        prkname,
        member,
        remarks,
        coorId,
        barId,
        munId,
      },
      where: { id },
    });

    return NextResponse.json({ message: "Success", dataSave }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};

