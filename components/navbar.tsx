import AuthButtons from "@/components/auth-buttons";

export default function Navbar() {
	return (
	
		<div className="flex flex-row justify-between bg-blue-800 p-2">
			<div className="flex flex-row justify-center font-bold text-white gap-3">
				TMS
				
			</div>
				
			<div><AuthButtons /></div>
			
		</div>
	);
}