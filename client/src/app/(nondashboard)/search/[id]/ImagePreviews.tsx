"use client"
import React, { useState } from 'react'
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ImagePreviews = ({images}: ImagePreviewsProps) => {
  const[currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrev= ()=>{
    setCurrentImageIndex((prev)=> (prev===0 ? images.length-1 : prev-1));
  }

  const handleNext = ()=>{
    setCurrentImageIndex((prev)=> (prev === images.length-1 ? 0: prev+1));
  }
  return (
    <div className='relative h-[450px] w-full'>
        {images.map((image, index)=>(
            <div key={image} className={`abosolute inset-0 transition-opacity duration-500 ease-in-out ${ index === currentImageIndex ? "opacity-1000" : "opacity-0"}`}>
                <Image src={image} alt={`Property Image ${index -1}`} fill priority={index==0} className='object-cover cursor-pointer transition-transform duration-500 ease-in-out'/>
            </div>
        ))}
        <button onClick={handlePrev} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 p-2 rounded-full focus:outline-none focus:ring" aria-label="Previous Image">
        <ChevronLeft className="h-4 w-4 text-white" /> </button>
        <button onClick={handlePrev} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 p-2 rounded-full focus:outline-none focus:ring" aria-label="Previous Image">
        <ChevronRight className="h-4 w-4 text-white" /> </button>
      
    </div>
  )
}

export default ImagePreviews
