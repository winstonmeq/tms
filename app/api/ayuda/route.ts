

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()



export async function POST(request: NextRequest) {
    
    
  try {
    const data = await request.json()

    // Validate required fields
    const {ayuda_name, ayuda_code, ayuda_type, ayuda_purpose, coorId, userId, barId, munId } = data

    if (!ayuda_name || !barId || !munId ) {

      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })

    }

    console.log(data)


    // Save voter data to the database
    const save_ayuda = await prisma.ayuda.create({
      data: {
        ayuda_name,
        ayuda_code,
        ayuda_type,
        ayuda_purpose,
        userId,
        barId,
        munId,
        coorId
              
      },
    })

    // console.log("Received data:", data);


    return NextResponse.json({ message: 'Ayuda saved successfully', save_ayuda }, { status: 201 })

  } catch {

    return NextResponse.json({ error: 'Failed  to save data' }, { status: 500 })

  }
}


