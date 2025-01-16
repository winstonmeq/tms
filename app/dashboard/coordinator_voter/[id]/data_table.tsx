"use client"

import { useState,useEffect } from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table"
import { Input } from "@/components/ui/input"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"





export type Voter = {
  id: string
  fname: string
  lname: string
  mname: string
  prkname:string
  member:string
}

import Link from "next/link"

export const columns: ColumnDef<Voter>[] = [
  {
    accessorKey: "id",
    header: "Index",

    cell: ({ row }) => {
        return <>{row.index + 1}</>;  // Replace '/somepath/${id}' with your desired link URL
    },

  },
  {
    accessorKey: "fname",
    header: "First Name",    
    cell: ({ row }) => {
      const id = row.getValue("id")
      const fname = row.getValue("fname") as string
      return <Link href={`/dashboard/voters/${id}`}>{fname}</Link>;  // Replace '/somepath/${id}' with your desired link URL
    },
  },
  {
    accessorKey: "lname",
    header: "Last Name",
  },
  {
    accessorKey: "mname",
    header: "Middle Name",
  },
  {
    accessorKey: "prkname",
    header: "Purok Name",
  },
 
  {
    accessorKey: "bar.barname",
    header: "Barangay",
  },

 
]






export function DataTable() {

  const [voters, setVoters] = useState<Voter[]>([]) // Apply the Patient type here
  const [loading, setLoading] = useState(true) // Track loading state
  const [searchLastName, setSearchLastName] = useState('')
  const [data, setData] = useState<Voter[]>(voters)

  const [page, setPage] = useState(1);
const [pageSize, setPageSize] = useState(50);
const [totalRecords, setTotalRecords] = useState(0);



useEffect(() => {
  
// Fetch patients from the API endpoint
const fetch_coor_voter = async () => {

  const coorId = window.location.pathname.split("/").pop();


  try {

    const response = await fetch(`/api/coordinator_voter/${coorId}?page=${page}&limit=${pageSize}`)
    
    if (response.ok) {
    
      const data = await response.json()
      
      setVoters(data.coor_voter)
      setTotalRecords(data.totalRecords);


    } else {
      console.error("Failed to fetch patients")
    }
  } catch (error) {
    console.error("Error fetching patients:", error)
  } finally {
    setLoading(false) // Stop loading once the fetch is done
  }
}

fetch_coor_voter();

}, [page, pageSize])

useEffect(() => {
  const filteredData = voters.filter(voter => 
    voter.lname.toLowerCase().includes(searchLastName.toLowerCase())
  )
  setData(filteredData)
}, [searchLastName, voters])




// const data: Voter[] = voters

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 50,
      },
    },
  })



  return (
    <div >
       <div className="mb-4">
        <Input
          placeholder="Search by last name"
          value={searchLastName}
          onChange={(e) => setSearchLastName(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">

      {loading && (
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="w-16 h-16 border-4 border-t-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div> 
        </div>
      )}

        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="odd:bg-gray-100 even:bg-white" // Add stripe colors here

                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
              setPageSize(Number(value)); // Call your additional logic here

            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((prev) => prev + 1)}
            disabled={page * pageSize >= totalRecords}
          >
            Next
          </Button>
        </div>
      </div>
      <div className="flex flex-row justify-center items-center space-x-2">
  {/* <Button
    variant="outline"
    size="sm"
    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
    disabled={page === 1}
  >
    Previous
  </Button> */}
  <span className="text-sm font-medium">
    Page {page} of {Math.ceil(totalRecords / pageSize)}
  </span>
  {/* <Button
    variant="outline"
    size="sm"
    onClick={() => setPage((prev) => prev + 1)}
    disabled={page * pageSize >= totalRecords}
  >
    Next
  </Button> */}
</div>
    </div>
  )
}

