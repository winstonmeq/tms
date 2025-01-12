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

import { AArrowUpIcon } from "lucide-react"




export type Coordinator = {
  id: string
  userId: string
  fname: string
  lname: string
  prkname: string
  phone: string
  position: string
  barId: string
  munId: string
  bar: {
    id: string;
    userId: string;
    munId: string;
    barname: string;  
  };
  municipality: {
    id: string;
    userId: string;
    munname: string;
   
  };

}

import Link from "next/link"

export const columns: ColumnDef<Coordinator>[] = [
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
      return <Link href={`/dashboard/coordinator/${id}`}><div className="font-semibold">{fname}</div></Link>;  // Replace '/somepath/${id}' with your desired link URL
    },
  },
  {
    accessorKey: "lname",
    header: "Last Name",
  },
 
  {
    accessorKey: "prkname",
    header: "Purok Name",
  },
 
  {
    accessorKey: "position",
    header: "Position"
  },

  {
    accessorKey: "phone",
    header: "Phone"
  },

  {
    accessorKey: "bar.barname",
    header: "Barangay"
  },
  {
    accessorKey: "municipality.munname",
    header: "Municipality"
  },
]






export function DataTable({userIdd}:{userIdd:string}) {

  const [coordinators, setCoordinators] = useState<Coordinator[]>([]) // Apply the Patient type here
  const [loading, setLoading] = useState(true) // Track loading state
  const [progress, setProgress] = useState(0) // Progress state for the loading bar
  const [searchLastName, setSearchLastName] = useState('')
  const [data, setData] = useState<Coordinator[]>(coordinators)
  const [searchmun, setSearchMun] = useState("")
  const [filterMunBar, setFilterMunBar] = useState<Coordinator[]>(coordinators)



useEffect(() => {
  
// Fetch patients from the API endpoint

  setLoading(true)

async function fetchData() {
  const response = await fetch('/api/coordinator'); // Replace with your API route.
  const json = await response.json();
  setCoordinators(json);
  setLoading(false)
}

fetchData();



}, [])

useEffect(() => {
  const filteredData = coordinators.filter(coordinators => 
    coordinators.lname.toLowerCase().includes(searchLastName.toLowerCase())
  )
  setData(filteredData)
}, [searchLastName, coordinators])




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
       <div className="flex flex-row mt-2 justify-start gap-4">
        <div>
          <Input
            placeholder="Search by last name"
            value={searchLastName}
            onChange={(e) => setSearchLastName(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div>
          <Select
            onValueChange={(value) => {
              const filteredData = coordinators.filter(
                (coordinators) => coordinators.municipality.munname === value
              );
              setSearchMun(value)
              setData(filteredData);
              setFilterMunBar(filteredData)
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by Municipality" />
            </SelectTrigger>
            <SelectContent>
              {Array.from(
                new Set(coordinators.map((items) => items.municipality.munname))
              ).map((municipality, index) => (
                <SelectItem key={index} value={municipality}>
                  {municipality}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select
            onValueChange={(value) => {
              const filteredData = coordinators.filter(
                (items) => items.bar.barname === value && items.municipality.munname === searchmun
              );
              setData(filteredData);
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by Barangay" />
            </SelectTrigger>
            <SelectContent>
              {Array.from(
                new Set(filterMunBar.map((items) => items.bar.barname))
              ).map((items, index) => (
                <SelectItem key={index} value={items}>
                  {items}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
              <Button onClick={() => {
                   const filteredData = coordinators.filter((coordinators) =>
                    coordinators.lname.toLowerCase().includes("")
                  );
                  setData(filteredData);;
              }}>Clear</Button>
              </div>

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

