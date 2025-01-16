"use client";

import { useState, useEffect} from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";

import { useRouter } from "next/navigation";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AyudaRegistrationPage from "./ayuda_registration";

interface Ayuda {
  id: string;
  userId: string;
  ayuda_name: string;
  ayuda_code: string;
  ayuda_type: string;
  ayuda_purpose: string;
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

    const [ayuda, setAyuda] = useState<Ayuda[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // const [dialogData, setDialogData] = useState<per_coordinator | null>(null);
  



  const router = useRouter()




    const fetchAyuda= async () => {
      const munId = window.location.pathname.split("/").pop();
  
      setLoading(true);
  
      try {
        const response = await fetch(`/api/ayuda/${munId}`);
  
        if (response.ok) {

          const data = await response.json();

          setAyuda(data.ayuda_data);

          setTotalRecords(data.totalRecords);

          setLoading(false);


        } else {

          console.error("Failed to fetch data");

        }
      } catch (error) {

        console.error("Error fetching data:", error);

      } 

    };
  
    useEffect(() => {
      fetchAyuda();
    }, []);
  
    const handleSave = async () => {
      await fetchAyuda();
      setIsModalOpen(false); // Close modal after saving
    };
  
  
  
    const columns: ColumnDef<Ayuda>[] = [
      {
        accessorKey: "id",
        header: "Index",
        cell: ({ row }) => <>{row.index + 1}</>,
      },
      {
        accessorKey: "ayuda_name",
        header: "Ayuda Name",
        cell: ({ row }) => {
          const ayuda = row.original;
  
          return (
          <span>{ayuda.ayuda_name}</span>
          );
        },
      },
      {
        accessorKey: "ayuda_code",
        header: "Code",
      },
      {
        accessorKey: "ayuda_type",
        header: "Type",
      },
      {
        accessorKey: "ayuda_purpose",
        header: "Purpose",
      },

      {
        accessorKey: "municipality.munname",
        header: "Municipality",
      },

      {
        accessorKey: "bar.barname",
        header: "Barangay",
      },
     
    ];
  
    const table = useReactTable({
      data: ayuda,
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
        <div className="flex flex-row justify-between gap-3">
          <div className="text-xl font-bold">
            Municipality of: {ayuda[0]?.municipality?.munname}
          </div>
          <div className="flex gap-3">
          <Button onClick={()=>{router.back()}}>Back</Button>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button>Create Ayuda</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Create Ayuda </DialogTitle>
              </DialogHeader>
              <DialogDescription>
                Fill out the form below to create ayuda.
              </DialogDescription>
              <AyudaRegistrationPage
                onClose={() => setIsModalOpen(false)}
                onSaveSuccess={handleSave}
                userId={userId}
              />
            </DialogContent>
          </Dialog>
          </div>
        </div>
        <div>Total Ayuda: {totalRecords}</div>
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
       
      </div>
    );
  }
  
