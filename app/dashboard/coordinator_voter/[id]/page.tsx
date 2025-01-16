



import React from 'react'
import { DataTable } from './data_table'
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";




const Coordinator_VoterPage = async () => {

  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    return redirect('/sign-in/')
  }

  // const user = session?.user;


  return (
    <div className="container mx-auto py-10">
       <DataTable />
    </div>
  )
}

export default Coordinator_VoterPage