"use client";

import { useState, useEffect } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CoorRegistrationPage from "./coor_registration";
import UpdateCoordinatorPage from "./update_coordinator";
import Link from "next/link";

interface per_coordinator {
  id: string;
  userId: string;
  fname: string;
  lname: string;
  mname: string;
  prkname: string;
  phone: string;
  position: string;
  bar: {
    id: string;
    barname: string;
  };
  municipality: {
    id: string;
    munname: string;
  };
}


export function DataTable({ userId }: { userId: string }) {
    const [coordinators, setCoordinators] = useState<per_coordinator[]>([]);
    const [totalCoor, setTotalCoor] = useState("");
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dialogData, setDialogData] = useState<per_coordinator | null>(null);
  





    const router = useRouter()



    const fetchMunicipality = async () => {

      const munId = window.location.pathname.split("/").pop();
  
      setLoading(true);
  
      try {
        const response = await fetch(`/api/per_coordinator/${munId}`);
  
        if (response.ok) {
          const data = await response.json();
          setCoordinators(data.coordinator_data);
          setTotalCoor(data.totalRecords);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchMunicipality();
    }, []);
  
    const handleSave = async () => {
      await fetchMunicipality();
      setIsModalOpen(false); // Close modal after saving
    };
  
    const openDialog = (coordinator: per_coordinator) => {
      setDialogData(coordinator);
    };
  
    const closeDialog = () => {
      setDialogData(null);
    };
  
    const columns: ColumnDef<per_coordinator>[] = [
      {
        accessorKey: "id",
        header: "Index",
        cell: ({ row }) => <>{row.index + 1}</>,
      },
      {
        accessorKey: "fname",
        header: "First Name",
        cell: ({ row }) => {
          const coordinator = row.original;
  
          return (
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => openDialog(coordinator)}
            >
              {coordinator.fname}
            </span>
          );
        },
      },
      {
        accessorKey: "lname",
        header: "Last Name",
      },
      {
        accessorKey: "phone",
        header: "Phone",
      },
      {
        accessorKey: "position",
        header: "Position",
      },
      {
        accessorKey: "bar.barname",
        header: "Barangay",
      },
      {
        accessorKey: "prkname",
        header: "Purok Name",
      },

      {
        header: "Action",    
        cell: ({ row }) => {
          const id = row.getValue("id")
          return <Link  href={`/dashboard/coordinator_voter/${id}`}><div className="font-semibold"><Button variant="outline">Members</Button></div></Link>;  // Replace '/somepath/${id}' with your desired link URL
        },
      },
    ];
  
    const table = useReactTable({
      data: coordinators,
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
        <div className="flex flex-row justify-between gap-3 pb-4">
          <div className="flex">
            
              <div className="text-xl font-bold items-center">
               {coordinators[0]?.municipality?.munname}
              </div>
          </div>
          <div className="flex gap-3">
          <Button onClick={()=>{router.back()}}>Back</Button>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button>Add Coordinator</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Coordinator Registration</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                Fill out the form below to register a new coordinator.
              </DialogDescription>
              <CoorRegistrationPage
                onClose={() => setIsModalOpen(false)}
                onSaveSuccess={handleSave}
                userId={userId}
              />
            </DialogContent>
          </Dialog>
          </div>
        </div>
        <div>Total Coordinator: {totalCoor}</div>
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
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
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
        {dialogData && (
          <Dialog open={!!dialogData} onOpenChange={closeDialog}>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Update Coordinator</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                Update the details for {dialogData.fname} {dialogData.lname}.
              </DialogDescription>
              <UpdateCoordinatorPage
                onClose={closeDialog}
                onSaveSuccess={handleSave}
                userId={dialogData.userId}
                fname={dialogData.fname}
                lname={dialogData.lname}
                phone={dialogData.phone}
                prkname={dialogData.prkname}
                position={dialogData.position}
                barId={dialogData.bar?.id}
                munId={dialogData.municipality?.id}
                coorId={dialogData.id}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    );
  }
  
