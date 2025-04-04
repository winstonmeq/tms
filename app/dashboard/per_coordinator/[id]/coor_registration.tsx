"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CoorRegistrationPage = ({onClose,onSaveSuccess,userId,}: { onClose: () => void; onSaveSuccess: () => void; userId: string }) => {
  interface Barangay {
    id: string;
    munId: string;
    barname: string;
  }

  interface Municipality {
    id: string;
    munname: string;
    barangays: {
      id: string;
      munId: string;
      barname: string;
    }[];
    coordinators: {
      id: string;
      barId: string;
      lname: string;
      fname: string;
    }[];
  }

  // interface Coordinator {
  //   id: string;
  //   barId: string;
  //   lname: string;
  //   fname: string;
  // }

  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  // const [coordinators, setCoordinators] = useState<Coordinator[]>([]);
  // const [originalCoordinators, setOriginalCoordinators] = useState<
  //   Coordinator[]
  // >([]);

  const [barangays, setBarangays] = useState<Barangay[]>([]);
  const [loading, setLoading] = useState(true);
  const [munId, setMunId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    mname: "",
    prkname: "",
    phone: "",
    position: "",
    userId: userId,
    barId: "",
    munId: "",
  });

  useEffect(() => {
    const pathMunId = window.location.pathname.split("/").pop();
    setMunId(pathMunId || null);
  }, []);


  useEffect(() => {
    if (!munId) return;
    const fetchMunicipality = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/municipality/${munId}`);
        if (response.ok) {
          const data = await response.json();
          // const municipalitiesData = Array.isArray(data) ? data : [data];
          setMunicipalities([data]);
          setBarangays(data.barangay);
        } else {
          console.error("Failed to fetch municipality");
        }
      } catch (error) {
        console.error("Error fetching municipality:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMunicipality();
  }, [munId]);

  const handleDropdownChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/coordinator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log(response);

      if (response.ok) {
        onSaveSuccess();
        onClose();
      } else {
        console.error("Failed to save data");
      }
    } catch (error) {
      console.error("Error saving voter data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center p-2">
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-50 z-50">
          <div className="w-16 h-16 border-4 border-t-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-2 py-2">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="firstName" className="text-right">
            First Name
          </Label>
          <Input
            id="fname"
            name="fname"
            value={formData.fname}
            onChange={handleInputChange}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="lastName" className="text-right">
            Last Name
          </Label>
          <Input
            id="lname"
            name="lname"
            value={formData.lname}
            onChange={handleInputChange}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="middleName" className="text-right">
            Phone
          </Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="col-span-3"
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="middleName" className="text-right">
            Position
          </Label>
          <Input
            id="position"
            name="position"
            value={formData.position}
            onChange={handleInputChange}
            className="col-span-3"
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="prkname" className="text-right">
            Purok Name
          </Label>
          <Input
            id="prkname"
            name="prkname"
            value={formData.prkname}
            onChange={handleInputChange}
            className="col-span-3"
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="municipality" className="text-right">
            Municipality
          </Label>
          <Select
            onValueChange={(value) => handleDropdownChange("munId", value)}
            value={formData.munId}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select Municipality" />
            </SelectTrigger>
            <SelectContent>
              {municipalities.map((municipality) => (
                <SelectItem key={municipality.id} value={municipality?.id}>
                  {municipality.munname}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="barangay" className="text-right">
            Barangay
          </Label>
          <Select
            onValueChange={(value) => handleDropdownChange("barId", value)}
            value={formData.barId}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select a barangay" />
            </SelectTrigger>
            <SelectContent>
              {barangays.map((barangay) => (
                <SelectItem key={barangay.id} value={barangay.id}>
                  {barangay.barname}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

    
        <Button type="submit" className="mt-4">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default CoorRegistrationPage;
