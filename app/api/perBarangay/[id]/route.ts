import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Define the structure for the perBarangayData
interface PerBarangayData {
  munname: string;
  barname: string;
  voterCount: number;
  memberCount: number; // Added memberCount
}

// GET /api/record/[id]
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Extract the ID from the URL
    const id = request.url.split("/perBarangay/")[1];

    if (!id) {
      return NextResponse.json({ message: 'ID parameter is required' }, { status: 400 });
    }

    // Fetch municipality data with voters and their associated bars, filtering voters based on 'member == "yes"'
    const record = await prisma.municipality.findUnique({
      where: { id },
      include: {
        voter: {
          include: {
            bar: true,
          },
        },
      },
    });

    if (!record) {
      return NextResponse.json({ message: 'Record not found' }, { status: 404 });
    }

    // Aggregate voter counts per bar and count the number of members
    const result: PerBarangayData[] = Object.entries(
      record.voter.reduce((acc, voter) => {
        const barName = voter.bar?.barname || 'Unknown Bar'; // Handle null bar cases
        // Count total voters and members
        if (!acc[barName]) {
          acc[barName] = { voterCount: 0, memberCount: 0 };
        }
        acc[barName].voterCount += 1;
        if (voter.member === 'Yes') {
          acc[barName].memberCount += 1;
        }
        return acc;
      }, {} as { [key: string]: { voterCount: number, memberCount: number } })
    ).map(([barname, { voterCount, memberCount }]) => ({
      munname: record.munname,
      barname,
      voterCount,
      memberCount, // Add the memberCount here
    }));

    // Send the response
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching record:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
