import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/record/[id]
export async function GET(request: NextRequest) {
  try {
    const id = request.url.split("/perMunicipality/")[1];

    if (!id) {
      return NextResponse.json({ message: 'Municipality ID is required' }, { status: 400 });
    }

    console.log('perMun', id);

    // Calculate UTC-based dates with full day ranges
    const todayUTC = new Date();
    todayUTC.setUTCHours(0, 0, 0, 0);  // Start of today

    const endOfTodayUTC = new Date(todayUTC);
    endOfTodayUTC.setUTCHours(23, 59, 59, 999);  // End of today

    const yesterdayUTC = new Date(todayUTC);
    yesterdayUTC.setUTCDate(yesterdayUTC.getUTCDate() - 1);

    const twoDaysAgoUTC = new Date(todayUTC);
    twoDaysAgoUTC.setUTCDate(twoDaysAgoUTC.getUTCDate() - 2);

    console.log('UTC Dates:', { todayUTC, endOfTodayUTC, yesterdayUTC, twoDaysAgoUTC });

    // Query for records created today (from start of today to the end of today)
    const recordsToday = await prisma.voter.findMany({
      where: {
        munId: id,
        createdAt: {
          gte: todayUTC,
          lt: endOfTodayUTC,
        },
      },
    });

    // Query for records created yesterday (from the start of yesterday to the end of yesterday)
    const recordsYesterday = await prisma.voter.findMany({
      where: {
        munId: id,
        createdAt: {
          gte: yesterdayUTC,
          lt: todayUTC,
        },
      },
    });

    // Query for records created two days ago
    const recordsTwoDaysAgo = await prisma.voter.findMany({
      where: {
        munId: id,
        createdAt: {
          gte: twoDaysAgoUTC,
          lt: yesterdayUTC,
        },
      },
    });

    // Fetch the municipality record
    const record = await prisma.municipality.findUnique({
      where: { id: id },
      include: {
        voter: {
          include: {
            bar: true,
            coor: true,
          },
        },
      },
    });

    const yes_count = record?.voter.filter((voter) => voter.member === 'Yes').length
    const OFW_count = record?.voter.filter((voter) => voter.member === 'OFW').length
    const possible_count = record?.voter.filter((voter) => voter.member === 'Possible').length
    const no_count = record?.voter.filter((voter) => voter.member === 'Not').length
    const deceased_count = record?.voter.filter((voter) => voter.member === 'Deceased').length
    const undecided_count = record?.voter.filter((voter) => voter.member === 'Undecided').length


    if (!record) {
      return NextResponse.json({ message: 'Municipality not found' }, { status: 404 });
    }

    // Build and return the JSON response
    const jsonResponse = {
      record: record,
      today: recordsToday.length,
      oneDayAgo: recordsYesterday.length,
      twoDaysAgo: recordsTwoDaysAgo.length,
      yes_count, OFW_count, possible_count, no_count, deceased_count, undecided_count
    };

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error('Error fetching record:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
