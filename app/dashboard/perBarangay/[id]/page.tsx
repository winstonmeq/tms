



import React from 'react'
import { DataTable } from './datatables'
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";




const PerBarangayPage = async () => {

  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    return redirect('/sign-in/')
  }

  // const user = session?.user;


  return (
    <div className="container mx-auto py-10">
      Per Barangay
      <DataTable />
    </div>
  )
}

export default PerBarangayPage