'use client';

import { useRouter } from "next/navigation"; // Import useRouter
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UpdateVoterForm = () => {

  // interface Voter {
  //   id: string;
  //   userId: string;
  //   fname: string;
  //   lname: string;
  //   mname: string;
  //   prkname: string;
  //   member: string;
  // }

  // const [voter, setVoter] = useState<Voter | null>(null); // Single voter object

  const [loading, setLoading] = useState(true); // Track loading state
  const router = useRouter(); // Initialize useRouter



  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    mname: "",
    prkname: "",
    member: "",
    barname:"",
    userId: "",
  });

  useEffect(() => {

    setLoading(true)

    const fetchVoter = async () => {
      const voterId = window.location.pathname.split("/").pop();
      try {
        const response = await fetch(`/api/voters/${voterId}`);
        if (response.ok) {
          const data = await response.json();
          // setVoter(data);
          setFormData({
            fname: data.fname,
            lname: data.lname,
            mname: data.mname,
            prkname: data.prkname,
            member: data.member,
            barname:data.bar.barname,
            userId: data.userId,
          });
        } else {
          console.error("Failed to fetch voter data");
        }
      } catch (error) {
        console.error("Error fetching voter:", error);
      } finally {
        setLoading(false); // Stop loading once the fetch is done
      }
    };

    fetchVoter();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDropdownChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    router.back()
  }

  const handleUpdate = async (e: React.FormEvent) => {

    e.preventDefault();

    const voterId = window.location.pathname.split("/").pop();

    try {
      const response = await fetch(`/api/voters/${voterId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Voter updated successfully!");
        router.back(); // Navigate back to the previous page
      } else {
        console.error("Failed to update voter");
      }
    } catch (error) {
      console.error("Error updating voter:", error);
    }
  };

  if (loading) {
    return <div>
    {loading && (
    <div className="absolute inset-0 flex justify-center items-center">
      <div className="w-16 h-16 border-4 border-t-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div> 
    </div>
  )}

</div>;
  }

  // if (!voter) {
  //   return <p>Voter not found.</p>;
  // }

  return (
    <div className="flex justify-center p-2">
       <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Update Information</CardTitle>
      </CardHeader>
      <CardContent>
      <form className="grid gap-2 py-2" onSubmit={handleUpdate}>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="fname" className="text-right">
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
          <Label htmlFor="lname" className="text-right">
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
          <Label htmlFor="mname" className="text-right">
            Middle Name
          </Label>
          <Input
            id="mname"
            name="mname"
            value={formData.mname}
            onChange={handleInputChange}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="prkname" className="text-right">
            Purok
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
          <Label htmlFor="member" className="text-right">
            Member
          </Label>
          <Select
            onValueChange={(value) => handleDropdownChange("member", value)}
            value={formData.member}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select Membership" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="prkname" className="text-right">
            Barangay
          </Label>
          <Input
            id="barname"
            name="barname"
            value={formData.barname}
            onChange={handleInputChange}
            className="col-span-3"
          />
        </div>
        </form>
        </CardContent>
      <CardFooter>
        <div className="flex flex-col w-full gap-4">
        <Button type="submit" className="w-full" onClick={handleUpdate}>
          Update
        </Button>
        <Button variant="outline" className="w-full" onClick={handleCancel}>
          Cancel
        </Button>

        </div>
     
      </CardFooter>
    </Card>
    </div>
  );
};

export default UpdateVoterForm;
