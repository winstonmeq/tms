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





interface Barangay {
  id: string;
  munId: string
  barname: string;
}

interface Municipality {
  id: string;
  munname: string;
  barangays: {
    id: string
    munId: string
    barname: string
  }[]
  coordinators: {
    id:string 
    barId: string
    lname: string 
    fname: string
  }[]   
}

interface Coordinator {
  id: string;
  barId: string
  lname: string;
  fname: string;
}

const UpdateVoterForm = () => {

 
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [coordinators, setCoordinators] = useState<Coordinator[]>([]);
  const [originalCoordinators, setOriginalCoordinators] = useState<Coordinator[]>([]);
  const [barangays, setBarangays] = useState<Barangay[]>([]);
  const [munId, setMunId] = useState<string | null>(null);
  const [voterId, setVoterId] = useState<string | null>(null);



  const [loading, setLoading] = useState(true); // Track loading state
  const router = useRouter(); // Initialize useRouter



  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    mname: "",
    phone:"",
    prkname: "",
    member: "",
    barname:"",
    remarks: "",
    barId: "",
    coorId: "",
    munId: ""
  });

  useEffect(() => {

    setLoading(true)


    const path = window.location.pathname.split("/").pop(); // Get the last part after "/"
    const voterId = path?.split("&&")[0] || null; // Extract only the part before "&&"
    setVoterId(voterId);

    const pathMunId = window.location.pathname.split('&&').pop();
    setMunId(pathMunId || null);
  }, []);

  useEffect(() => {

    if (!voterId) return;
    const fetchVoter = async () => {
   
      try {
        const response = await fetch(`/api/voters/${voterId}`);
        if (response.ok) {
          const data = await response.json();
          // setVoter(data);
          setFormData({
            fname: data.fname || "",
            lname: data.lname || "",
            mname: data.mname || "",
            phone: data.phone || "",
            prkname: data.prkname || "",
            member: data.member || "",
            barname:data.bar.barname || "",
            remarks: data.remarks || "",
            barId: "",
            coorId: "",
            munId:data.munId,
            
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
  }, [voterId]);

 
  
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
          //setCoordinators(data.coordinator);
          setOriginalCoordinators(data.coordinator); // Preserve the original list


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



  const handleDropdownBarChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "barId") {
      // Find coordinators linked to the selected barangay
  
      const filteredCoordinators = originalCoordinators.filter(
        (coordinator) => coordinator.barId === value
      );
      setCoordinators(filteredCoordinators); 
      console.log(value)      

    }
  };
  


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

       console.log('this is formData', formData)
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
          <Label htmlFor="mname" className="text-right">
            Cellphone
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
             
                     <SelectItem  value="Yes">Yes</SelectItem>
                     <SelectItem  value="OFW">OFW</SelectItem>
                     <SelectItem  value="Deceased">Deceased</SelectItem>
                     <SelectItem  value="Undecided">Undecided</SelectItem>
                     <SelectItem  value="Possible">Possible?</SelectItem>
                     <SelectItem  value="Not">Not</SelectItem>

            </SelectContent>
          </Select>
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
        <SelectItem key={municipality.id} value={municipality.id}>
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
                 onValueChange={(value) => handleDropdownBarChange("barId", value)}
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

         <div className="grid grid-cols-4 items-center gap-4">
           <Label htmlFor="coordinator" className="text-right">
             Coordinator
           </Label>

           <Select
                 onValueChange={(value) => handleDropdownChange("coorId", value)}
                 value={formData.coorId}
               >
                 <SelectTrigger className="col-span-3">
                   <SelectValue placeholder="Select a Coordinator" />
                 </SelectTrigger>
                 <SelectContent>
                   {coordinators.map((items) => (
                     <SelectItem key={items.id} value={items.id}>
                       {items.lname}, {items.fname}
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
           
         </div>


        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="mname" className="text-right">
            Remarks
          </Label>
          <Input
            id="remarks"
            name="remarks"
            value={formData.remarks}
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
