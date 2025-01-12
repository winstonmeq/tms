import "@/app/globals.css";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/navbar";
import MunListPage from "./munlist/page";
import { Analytics } from "@vercel/analytics/react"



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  
        <div>
          <Navbar />
          <MunListPage />
          <div className="min-h-screen flex flex-col">
            {children}
            </div>

          <Toaster />
          <Analytics />

            
        </div>
        
        
        
       
      
    
  );
}
