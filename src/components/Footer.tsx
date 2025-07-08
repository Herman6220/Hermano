'use client'

import Link from 'next/link'
import React from 'react'
import { FaFacebook, FaTwitter, FaInstagram, FaDiscord, FaGithub } from "react-icons/fa";

function Footer() {

  return (
    <footer className="bg-gradient-to-br  from-[#1a0025] via-gray-950 to-[#0d0012] w-full py-8 px-4 md:px-20 ">
      <div className="w-full mx-auto">
        <div className="flex justify-between mb-10">
          <h2 className="text-2xl text-white font-bold">Hermano.</h2>
          <div className='flex gap-2'>
            <div className='w-10 h-10 flex items-center justify-center'><FaFacebook className='w-7 h-7' fill='white'/></div>
            <div className='w-10 h-10 flex items-center justify-center'><FaTwitter className='w-7 h-7' fill='white'/></div>
            <div className='w-10 h-10 flex items-center justify-center'><FaInstagram className='w-7 h-7' fill='white'/></div>
            <div className='w-10 h-10 flex items-center justify-center'><FaDiscord className='w-7 h-7' fill='white'/></div>
            <div className='w-10 h-10 flex items-center justify-center'><FaGithub className='w-7 h-7' fill='white'/></div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-8 text-white items-start justify-items-center">
          {/* Column 1 */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-sm hover:text-gray-600">Home</a></li>
              <li><a href="#" className="text-sm hover:text-gray-600">Contact us</a></li>
              <li><a href="#" className="text-sm hover:text-gray-600">About us</a></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="font-semibold mb-4">Professionals</h3>
            <ul className="space-y-2">
              <li><Link href="/professionals" className="text-sm hover:text-gray-600">Join as a professional</Link></li>
              {/* <li><a href="#" className="text-sm hover:text-gray-600">My account</a></li>
              <li><a href="#" className="text-sm hover:text-gray-600">Preferences</a></li>
              <li><a href="#" className="text-sm hover:text-gray-600">Purchase</a></li> */}
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h3 className="font-semibold mb-4"></h3>
            <ul className="space-y-2">
            </ul>
          </div>
        </div>
        </div>

        {/* Bottom section */}
        <div className="pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 mb-4 md:mb-0">
            Copyright © {new Date().getFullYear()} Hermano. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-sm text-gray-500 hover:text-gray-600">Privacy policy</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-600">Terms & condition</a>
          </div>
        </div>
    </footer>
  )

}

export default Footer