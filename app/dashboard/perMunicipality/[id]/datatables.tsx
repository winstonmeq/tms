"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";

import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import RegistrationPage from "./registration";
import Link from "next/link";
import BarGraph from "./barchart";
import  { Component } from "./circular_chart";

interface Voter {
  id: string;
  userId: string;
  coorId: string;
  barId: string;
  munId: string;
  fname: string;
  lname: string;
  mname: string;
  prkname: string;
  member: string;
  createdAt: string;
  updatedAt: string;
  bar: {
    id: string;
    userId: string;
    munId: string;
    barname: string;
    createdAt: string;
    updatedAt: string;
  };
  coor: {
    id: string;
    userId: string;
    fname: string;
    lname: string;
    phone: string;
    prkname: string;
  };
}

interface Municipality {
  id: string;
  munname: string;
  voters: {
    id: string;
    userId: string;
    coorId: string;
    barId: string;
    munId: string;
    fname: string;
    lname: string;
    mname: string;
    prkname: string;
    member: string;
    createdAt: string;
    updatedAt: string;
    bar: {
      id: string;
      userId: string;
      munId: string;
      barname: string;
      createdAt: string;
      updatedAt: string;
    }
    coor: {
      id: string;
      userId: string;
      fname: string;
      lname: string;
      phone: string;
      prkname: string;
    };
}[]

}


export const columns: ColumnDef<Voter>[] = [
  {
    accessorKey: "id",
    header: "Index",

    cell: ({ row }) => {
      return <>{row.index + 1}</>; // Replace '/somepath/${id}' with your desired link URL
    },
  },
  {
    accessorKey: "fname",
    header: "First Name",
    cell: ({ row }) => {
      const id = row.getValue("id");
      const vts = row.original
      const munId = vts.munId

      const fname = row.getValue("fname") as string;
      return <Link href={`/dashboard/voters/${id}&&${munId}`}>{fname}</Link>;  // Replace '/somepath/${id}' with your desired link URL
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
    accessorKey: "member",
    header: "Member",
    cell: ({ row }) => {
      const memberValue = row.getValue("member") as string;

      // Define the background color based on the value
      let bgColor = "";
      switch (memberValue) {
        case "Yes":
          bgColor = "bg-green-200";
          break;
        case "OFW":
          bgColor = "bg-violet-200";
          break;
        case "Undecided":
          bgColor = "bg-yellow-200";
          break;
        
        case "Not":
            bgColor = "bg-red-300";
            break;
        
        case "Deceased":
              bgColor = "bg-black";
              break;

        case "Possible":
          bgColor = "bg-blue-200";
          break;
        default:
          bgColor = "bg-gray-100"; // Default background color for undefined values
      }

      return (
        <span
          className={`${bgColor} px-2 py-1 rounded text-gray-800`}
          style={{ display: "inline-block" }}
        >
          {memberValue}
        </span>
      );
    },
  },

  {
    accessorKey: "phone",
    header: "Mobile #",
  },

  {
    accessorKey: "bar.barname",
    header: "Barangay",
  },
  
  {
    header: "Coordinator",
    cell: ({ row }) => {
      const data = row.original as Voter; // Type assertion to access Voter object
      return data.coor && data.coor.id ? `${data.coor.lname} ` : null ;
    },
  },

  {
    accessorKey: "remarks",
    header: "Remarks",
  },

];

export function DataTable({ userIdd }: { userIdd: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [voters, setVoters] = useState<Voter[]>([]); 
  const [municipality, setMunicipality] = useState<Municipality>(); 

  const [loading, setLoading] = useState(true); // Track loading state
  const [searchLastName, setSearchLastName] = useState("");
  const [data, setData] = useState<Voter[]>(voters);
  const [searchbar, setSearchBar] = useState("")
  const [munId, setMunId] = useState<string | null>(null);
  const [t_data, setT_data] = useState(0)
  const [y_data, setY_data] = useState(0)
  const [th_data, setTh_data] = useState(0)
  const [yes_count, setYes_count] = useState(0)
  const [OFW_count, setOFW_count] = useState(0)
  const [possible, setPossible] = useState(0)
  const [no_count, setNo_count] = useState(0)
  const [deceased_count, setDeceased_count] = useState(0)
  const [undecided_count, setUndecided_count] = useState(0)


  useEffect(() => {
    const pathMunId = window.location.pathname.split('/').pop();
    setMunId(pathMunId || null); // Assign `null` if `pathMunId` is `undefined`
  }, []);


  const fetchMunicipality = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/perMunicipality/${munId}`);
      if (response.ok) {
        const responseData = await response.json();

        setVoters(responseData.record.voter);
        setMunicipality(responseData.record);
        setT_data(responseData.today)
        setY_data(responseData.oneDayAgo)
        setTh_data(responseData.twoDaysAgo)
        setYes_count(responseData.yes_count)
        setOFW_count(responseData.OFW_count)
        setPossible(responseData.possible_count)
        setNo_count(responseData.no_count)
        setDeceased_count(responseData.deceased_count)
        setUndecided_count(responseData.undecided_count)

      } else {
        console.error("Failed to fetch municipality data");
      }
    } catch (error) {
      console.error("Error fetching municipality:", error);
    } finally {
      setLoading(false);
    }
  }, [munId]);

  useEffect(() => {
    if (!munId) return;
    fetchMunicipality();
  }, [munId, fetchMunicipality]);

  useEffect(() => {
    const filteredData = voters.filter((voter) =>
      voter.lname.toLowerCase().includes(searchLastName.toLowerCase())
    );
    setData(filteredData);
  }, [searchLastName, voters]);

  // Code nih para eh reload ang data sa table after ma save sa registration
  const handleSave = async () => {
    await fetchMunicipality();
    setIsModalOpen(false); // Close the modal after saving
  };

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
  });

  return (
    <div> 
       <div className="flex flex-row justify-between items-center mb-4 ">              
                
                <div className="text-2xl font-bold">
                  Municipality: {municipality?.munname}
                  {/* Yes #: {yes_count} |
                  OFW #: {OFW_count} |
                  Possible #: {possible} */}

                </div>
              
            
            <div className="gap-3">
            <Link href={`/dashboard/perBarangay/${munId}`}>
                      <Button
                        variant="outline"
                        className="bg-green-900 text-white hover:bg-green-700"
                      >
                        All Barangays
                      </Button>
            </Link>

            <Link href={`/dashboard/per_coordinator/${munId}`}>
                      <Button
                        variant="outline"
                        className="bg-green-900 text-white hover:bg-green-700"
                      >
                        Coordinators
                      </Button>
            </Link>

            
            <Link href={`/dashboard/ayuda/${munId}`}>
                      <Button
                        variant="outline"
                        className="bg-green-900 text-white hover:bg-green-700"
                      >
                        Ayuda
                      </Button>
            </Link>
            </div>
          
    </div>

      <div className="flex flex-row justify-center gap-3">
        <BarGraph t_data={t_data} y_data={y_data} threeData={th_data} />
        <Component ofw_data={undecided_count} title="Undecided" />
       <Component ofw_data={yes_count} title="Yes/Ato-a" />
       <Component ofw_data={possible} title="Possible?" />
       <Component ofw_data={OFW_count} title="OFW Data" />
       <Component ofw_data={no_count} title="Not" />
       <Component ofw_data={deceased_count} title="Deceased" />


      </div>
     
     

      <div className=" flex justify-between pt-2 pb-3 gap-4">
        <div className="flex justify-start">
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
              const filteredData = voters.filter(
                (voter) => voter.bar.barname === value
              );
              setSearchBar(value)
              setData(filteredData);
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by Barangay" />
            </SelectTrigger>
            <SelectContent>
              {Array.from(
                new Set(voters.map((voter) => voter.bar.barname))
              ).map((barangay, index) => (
                <SelectItem key={index} value={barangay}>
                  {barangay}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select
            onValueChange={(value) => {
              const filteredData = voters.filter(
                (voter) => voter.member === value && voter.bar.barname === searchbar
              );
              setData(filteredData);
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by Member" />
            </SelectTrigger>
            <SelectContent>
              {Array.from(
                new Set(voters.map((voter) => voter.member))
              ).map((member, index) => (
                <SelectItem key={index} value={member}>
                  {member}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
              <Button onClick={() => {
                   const filteredData = voters.filter((voter) =>
                    voter.lname.toLowerCase().includes("")
                  );
                  setData(filteredData);;
              }}>Clear</Button>
        </div>

        </div>

        <div className="">
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <div className="flex flex-row gap-2">             
              <Button>Add Member</Button>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Member Registration</DialogTitle>
            </DialogHeader>

            <DialogDescription>
    Fill out the form below to register a new voter.
  </DialogDescription>

            <RegistrationPage
              onClose={() => setIsModalOpen(false)}
              onSaveSuccess={handleSave}
              userIdd={userIdd}
            />
          </DialogContent>
        </Dialog>
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
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
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
              table.setPageSize(Number(value));
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
  );
}
