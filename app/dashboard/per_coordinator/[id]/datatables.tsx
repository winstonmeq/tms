"use client"

import { useState,useEffect } from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table"

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





// Define the structure for the perBarangayData
interface per_coordinator {
fname: string
lname: string
mname: string
prkname: string
phone: string

}



export const columns: ColumnDef<per_coordinator>[] = [
  {
    accessorKey: "id",
    header: "Index",

    cell: ({ row }) => {
        return <>{row.index + 1}</>;  // Replace '/somepath/${id}' with your desired link URL
    },

  },
  
  {
    accessorKey: "munname",
    header: "Municipality",
  },
  {
    accessorKey: "barname",
    header: "Barangay",
  },
 
  {
    accessorKey: "memberCount",
    header: "#Membership",
  },

  {
    accessorKey: "voterCount",
    header: "#Total Members",
  },
 

  
]




export function DataTable() {



  const [coordinators, setCoordinators] = useState<per_coordinator[]>([]) // Apply the Patient type here
  const [loading, setLoading] = useState(true) // Track loading state

// Fetch patients from the API endpoint
const fetchMunicipality = async () => {

  const munId = window.location.pathname.split('/').pop();

  setLoading(true) // Stop loading once the fetch is done


   try {
    const response = await fetch(`/api/perBarangay/${munId}`);

    if (response.ok) {

      const data = await response.json();

      setCoordinators(data);

    } else {
      console.error('Failed to fetch patient data');
    }
 
  } catch (error) {
    console.error("Error fetching patients:", error)
  } finally {
    setLoading(false) // Stop loading once the fetch is done
  }
}

useEffect(() => {
  fetchMunicipality()
}, [])




const data: per_coordinator[] = coordinators

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  })

 
  return (
    <div >
      
    
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
                    <TableHead key={header.id}>
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
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 20, 30, 40, 50].map((pageSize) => (
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
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

