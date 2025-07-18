"use client"
import Image from "next/image";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setFilters } from "@/state";


const HeroSection = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleLocationSearch = async () => {
    try {
      const trimmedQuery = searchQuery.trim();
      if (!trimmedQuery) return;

      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          trimmedQuery
        )}.json?access_token=${
          process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
        }&fuzzyMatch=true`
      );
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        dispatch(
          setFilters({
            location: trimmedQuery,
            coordinates: [lat, lng],
          })
        );
        const params = new URLSearchParams({
          location: trimmedQuery,
          lat: lat.toString(),
          lng: lng,
        });
        router.push(`/search?${params.toString()}`);
      }
    } catch (error) {
      console.error("error search location:", error);
    }
  };
    return (
        <div className='relative h-screen'>

            <Image src="/landing-splash.jpg" alt="HEro Section" fill className='object-cover object-center' priority />

            <div className='absolute inset-0 bg-black opacity-80 '></div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className='absolute top-1/3 transform -translate-x-0.5 -translate-y-0.5 text-center w-full'>
                <div className='max-w-full mx-auto px-16 sm:px-12'>
                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 max-w-3xl mx-auto text-center leading-tight">
                        Start Your Journey To Find The Perfect Place Called <span className='text-pink-700'>Home.</span>
                    </h1>
                    <p className='text-xl text-white mb-8'>
                        Explore our wide range of rental properties tailore to fit your lifestyle and needs!
                    </p>
                    <div className='flex justify-center'>
                        <Input
                            type='text'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder='Search by city, neighborhood or address'
                            className='w-full max-w-lg rounded-none rounded-l-xl border-none bg-white h-12 ' />
                        <Button onClick={() => { }} className='text-white rounded-none rounded-r-xl border-none h-12 bg-red-400 hover:bg-pink-700 '>Search</Button>
                    </div>
                </div>
            </motion.div>

        </div>
    )
}

export default HeroSection
