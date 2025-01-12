import Link from "next/link";
import AuthButtons from "@/components/auth-buttons";

export default function Navbar() {
	return (
	
		<div className="flex flex-row justify-between bg-green-800 p-2">
			<div className="flex flex-row justify-center font-bold text-white gap-3">
				<Link href={"/dashboard/voters"}>VMS</Link>
				<Link href={"/dashboard/allMunicipality"}>Municipality</Link>
				<Link href={"/dashboard/coordinator"}>Coordinator</Link>

			</div>
				
			<div><AuthButtons /></div>
			
		</div>
	);
}