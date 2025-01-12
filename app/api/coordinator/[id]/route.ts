import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


// export const GET = async (req: Request, res: NextResponse) => {
//   try {
//     const id = req.url.split("/blog/")[1];
//     await main();
//     const post = await prisma.post.findFirst({ where: { id } });
//     if (!post)
//       return NextResponse.json({ message: "Not Found" }, { status: 404 });
//     return NextResponse.json({ message: "Success", post }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ message: "Error", error }, { status: 500 });
//   } finally {
//     await prisma.$disconnect();
//   }
// };

// GET /api/record/[id]
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
