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

import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation";





// Define the structure for the perBarangayData
interface perBarangayData {
  munname: string;
  barname: string;
  voterCount: number;
  memberCount: number; // 
}



export const columns: ColumnDef<perBarangayData>[] = [
  {
    accessorKey: "id",
    header: "Index",

    cell: ({ row }) => {
        return <>{row.index + 1}</>;  // Replace '/somepath/${id}' with your desired link URL
    },

  },
 
  {
    accessorKey: "barname",
    header: "Barangay",
  },

  {
    accessorKey: "progress",
    header: "Progress",
    cell: ({ row }) => {
      // Calculate the progress percentage
      const percentage =
        Number(row.original.memberCount) > 0
          ? (Number(row.original.memberCount) / Number(row.original.voterCount)) * 100
          : 0;

      return (
        <div className="flex flex-col items-start space-y-2 mr-4">
          <div className="flex justify-between w-full">
            <span className="text-sm text-gray-600">
              {row.original.memberCount}/{row.original.voterCount}
            </span>
          </div>
          <Progress value={percentage} className="h-4 bg-yellow-300 rounded" />
        </div>
      );
    },
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



  const [perBarangay, setPerBarangay] = useState<perBarangayData[]>([]) // Apply the Patient type here
  const [loading, setLoading] = useState(true) // Track loading state

  const router = useRouter();

// Fetch patients from the API endpoint
const fetchMunicipality = async () => {

  const munId = window.location.pathname.split('/').pop();

  setLoading(true) // Stop loading once the fetch is done


   try {
    const response = await fetch(`/api/perBarangay/${munId}`);

    if (response.ok) {

      const data = await response.json();

      setPerBarangay(data);

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




const data: perBarangayData[] = perBarangay

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
      
       <div className="flex text-2xl font-bold justify-between m-4">{perBarangay[0]?.munname}: Proportion of recruited members to total members
       <Button onClick={()=>{router.back()}}>Back</Button>

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

