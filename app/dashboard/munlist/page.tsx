"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export type Municipality = {
  id: string;
  munname: string;
};

export default function MunListPage() {
  const [, setWidth] = useState(0);
  const carousel = useRef<HTMLDivElement>(null);

  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);

  useEffect(() => {
    fetchMunicipality();

    if (carousel.current) {
      setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth);
    }
  }, []);

  const fetchMunicipality = async () => {
    try {
      const response = await fetch("/api/municipality/", { cache: "default" });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch municipalities: ${response.statusText}`
        );
      }

      setMunicipalities(await response.json());
    } catch (error) {
      console.error("Error fetching municipalities:", error);
    }
  };

  return (
    <div className="w-full overflow-hidden p-2">
       {municipalities.map((card) => (
            <div
              key={card.id}
            >
                                  <Link href={`/dashboard/perMunicipality/${card.id}`}>

                  <div               className="min-w-[200px] h-[120px] p-4 m-2 bg-white rounded-lg shadow-md hover:bg-gray-100"
                  >
                      <p className="font-light italic text-gray-600">
                        Select:
                      </p>
                      <h2 className="text-xl font-bold text-gray-800">
                        {card.munname}
                      </h2>
                  </div>
                                      </Link>

            </div>
          ))}
    </div>
  );
}
