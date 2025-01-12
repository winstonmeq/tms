'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, progress } from 'framer-motion'
import Link from 'next/link'
import { NotebookPen, } from 'lucide-react'



const Mun = [
  {
  id:"sdfsdfsf",
  munname:"Kidapawan City"
},
{
  id:"dsfsfsfsdf",
  munname:"President Roxas"
}

]


export type Municipality = {
    id: string
    munname: string  
  }


export default function MunListPage() {
  
  const [width, setWidth] = useState(0)
  const carousel = useRef<HTMLDivElement>(null)

  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);


  useEffect(() => {

    fetchMunicipality()


    if (carousel.current) {
      setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth)
    }



  }, [])

  const fetchMunicipality = async () => {
    try {
      const response = await fetch('/api/municipality/', { cache: 'default' });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch municipalities: ${response.statusText}`);
      }
  
      setMunicipalities(await response.json());

    } catch (error) {
      console.error("Error fetching municipalities:", error);
    }
  };
  


  return (
    <div className="w-full overflow-hidden p-2 bg-gray-200">

     
      <motion.div ref={carousel} className="cursor-grab" whileTap={{ cursor: 'grabbing' }}>
        <motion.div
          drag="x"
          dragConstraints={{ right: 0, left: -width }}
          className="flex"
        >

          {municipalities.map((card) => (
            
              <div key={card.id} className="min-w-[200px] h-[120px] p-4 m-2 bg-white rounded-lg shadow-md hover:bg-gray-100">
              
              <motion.div>
              

              <div className="flex items-center space-x-4 mb-4">

          <Link href={`/dashboard/perMunicipality/${card.id}`}  >

          <div className="bg-gray-100 rounded-full p-3">
            <NotebookPen className="h-6 w-6 text-yellow-500" />
          </div>

          </Link>


          <div>
            <p className="font-light italic text-gray-600">Municipality of</p>
            <h2 className="text-xl font-bold text-gray-800">{card.munname}</h2>
          </div>
        </div>
        <div className="w-full h-1 bg-green-900 rounded-full mt-2"></div>

             
            </motion.div>

              </div>
              
           

            
          ))}
        </motion.div>
      </motion.div>
{/* 
      {municipalities.map((item) => (
        <div key={item.id}>{item.munname}</div>
      ))} */}
   

    </div>
  )
}

