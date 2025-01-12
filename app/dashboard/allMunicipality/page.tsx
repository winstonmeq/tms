

import React from 'react'
import DataTable from './datatable'
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";





const AllMunicipalityPage = async () => {


 const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    return redirect('/sign-in')
  }


  return (
    <div>
      <DataTable />
    </div>
  )
}

export default AllMunicipalityPage