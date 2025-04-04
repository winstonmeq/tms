

import React from 'react'
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";




const VotersPage = async () => {

  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    return redirect('/dashboard/')
  }


  return (
    <div className="container mx-auto py-10">
      {/* <DataTable userIdd={user.id} /> */}
    </div>
  )
}

export default VotersPage