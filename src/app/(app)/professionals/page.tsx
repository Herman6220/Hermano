"use client"

import React, { useEffect } from 'react'
import AOS from "aos"
import "aos/dist/aos.css";

function page() {



  useEffect(() => {
      AOS.init({
        once: true, // animation triggers only once
      });
    }, []);

  return (
    <div className='min-h-[80vh] w-full overflow-hidden'>
      <div>
        <div className='w-full h-[80vh] relative'>
          <div className='bg-blue-500 w-1/3 h-[80vh] absolute right-0 '>
            <img 
              src="https://res.cloudinary.com/herman000/image/upload/v1751431197/wallpapersden.com_better-call-saul-season-6_3840x2160_vyatrn.jpg"
              alt='lawyer-image'
              className='w-full h-full object-cover'
            />
          </div>
          <div style={{
      animation: "slideRight 1.5s ease-out forwards",
    }}>
          <div 
          className='bg-red-500 w-1/4 h-[80vh] absolute right-70 transform -skew-x-[8deg]  overflow-hidden'>
          <div className='transform -skew-x-[-8deg] w-120'>
            <img 
              src="https://res.cloudinary.com/herman000/image/upload/v1751431196/john-wick-the-boogeyman-in-action-1w4a5ggq6uamgvf3-1w4a5ggq6uamgvf3_nlpasz.jpg"
              alt='assasin-image'
              className='w-full h-full object-cover'
            />
          </div>
          </div>
          </div>
          <div style={{
      animation: "slideRight 3.0s ease-out forwards",
    }}>
          <div className='bg-orange-500 w-5xl h-[80vh] absolute right-140 transform -skew-x-[8deg] overflow-hidden'>
            <div className='transform -skew-x-[-8deg] w-[1320px]'>
            <img 
              src="https://res.cloudinary.com/herman000/image/upload/v1751431195/wallpaperflare.com_wallpaper_o5nnxq.jpg"
              alt='assasin-image'
              className='w-full h-full object-cover'
            />
          </div>
          </div>
          </div>
          <div 
          style={{animation: "slideRightBlur 3.0s ease-out forwards"}}
          className="absolute inset-0 bg-violet-950 [mask-image:linear-gradient(to_right,black,80%,transparent)]"></div>
          <h1 
          data-aos="fade-right"
          className="absolute top-56 left-28 text-7xl text-white font-extrabold">Hermano.</h1>
          <h3 
          data-aos="fade-right"
          className='absolute top-72 left-84 text-2xl text-white font-light italic'>Professionals</h3>
        </div>
        <style>
          {`
            @keyframes slideRight {
            from {
            transform: translateX(-20px);
           }
           to {
           transform: translateX(0);
           }
           }

           @keyframes slideRightBlur {
        from {
          transform: translateX(-800px);
        }
        to {
        transform: translateX(0)
        }
      }
           `}
          </style>
      </div>
    </div>
  )
}

export default page