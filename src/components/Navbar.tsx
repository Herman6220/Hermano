'use client'

import { User } from 'next-auth';
import { signOut, useSession } from 'next-auth/react'
import { redirect, usePathname } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import { Button } from './ui/button';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from './ui/separator';
import { Input } from './ui/input';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { useDebounceCallback } from "usehooks-ts"
import { Loader2 } from 'lucide-react';

function Navbar() {

  const [searchInput, setSearchInput] = useState("")
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [isGettingSuggestions, setIsgettingSuggestions] = useState(false)
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null)

  const debounced = useDebounceCallback(setSearchInput, 300)

  const { data: session } = useSession();
  const user: User = session?.user as User;
  const pathname = usePathname();
  const isProfessionalDashboard = pathname.startsWith("/professionals")

  useEffect(() => {
    const getSuggestions = async () => {
      if (searchInput) {
        setIsgettingSuggestions(true)
        setSuggestions([])
        try {
          const response = await axios.get(`/api/getSearchSuggestions?searchSuggestionTerm=${searchInput}`)
          console.log(response.data.message)
          console.log(isGettingSuggestions)
          setSuggestions(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          console.log("Error", axiosError)
        } finally {
          setIsgettingSuggestions(false)
        }
      }
    }
    getSuggestions()
  }, [searchInput])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [])

  const handleNavigate = async (searchTerm: string) => {
    if(!searchTerm || searchTerm.length === 0){
      return
    }else{
      redirect(`/search?searchTerm=${searchTerm}`)
    }
  }


  return (
    <nav className='p-2 md:p-4 shadow-md sticky top-0 z-50 bg-blue-500/80 backdrop-blur-sm w-full flex items-center justify-between'>
      <div>
        <a className='text-xl font-bold' href='/'>Hermano.</a>
      </div>

      <div className='relative'>
        <div className='flex gap-2 items-center w-110 border-1 pl-4 pr-1 rounded-full h-10 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-indigo-500 transition-all duration-75 ease-in-out shadow-sm'>

          <input
            className='w-full focus:border-none focus:outline-none focus:ring-0'
            placeholder={`search for services...`}
            onChange={(e) => {
              debounced(e.target.value)
            }}
            onKeyDown={(e) => {
              if(e.key === "Enter"){
                handleNavigate(searchInput)
              }
            }}
          />
          <span>
            {isGettingSuggestions ? (
              <Loader2 className='w-4 h-4 animate-spin' />
            ) : (
              <>
                <button
                  className='p-2 rounded-full hover:bg-gray-200'
                  onClick={() => handleNavigate(searchInput)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4 text-gray-700">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                </button>
              </>)}
          </span>
          {searchInput && !isGettingSuggestions ? (
            suggestions.length > 0 ? (
              <div className='absolute top-full left-0 w-full mt-1 max-h-40 bg-white border border-gray-200 rounded-lg shadow z-10 overflow-y-auto'>
                {suggestions.map((suggestion: any) =>
                  <div
                    className='px-4 py-2 hover:bg-gray-100 cursor-pointer'
                  >
                    <button
                      onClick={() => handleNavigate(suggestion)}
                      className='w-full bg-red text-left'
                    >
                      {suggestion}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className='absolute top-full left-0 w-full mt-1 max-h-40 bg-white border border-gray-200 rounded-lg shadow z-10'>
                <div className='px-4 py-2 hover:bg-gray-100 cursor-pointer'>No services found...</div>
              </div>
            )
          ) : (
            <></>
          )}

        </div>
      </div>


      <div className='flex items-center gap-4'>
        <div>{session ? (
          <>
            <p className='text-sm'>Welcome, {user.email}</p>
          </>
        ) : (
          <></>
        )}</div>
        <div className='flex items-center'>
          <div className='relative inline-block' ref={dropdownRef}>
            <div className='flex w-5 h-5 items-center justify-center'>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className='hover:bg-gray-200 p-2 rounded-full'
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className='size-5'
                >
                  <g xmlns="http://www.w3.org/2000/svg" fill="none" fillRule="evenodd"><path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z" /><path fill="currentColor" d="M12 13c2.396 0 4.575.694 6.178 1.671c.8.49 1.484 1.065 1.978 1.69c.486.616.844 1.352.844 2.139c0 .845-.411 1.511-1.003 1.986c-.56.45-1.299.748-2.084.956c-1.578.417-3.684.558-5.913.558s-4.335-.14-5.913-.558c-.785-.208-1.524-.506-2.084-.956C3.41 20.01 3 19.345 3 18.5c0-.787.358-1.523.844-2.139c.494-.625 1.177-1.2 1.978-1.69C7.425 13.694 9.605 13 12 13Zm0 2c-2.023 0-3.843.59-5.136 1.379c-.647.394-1.135.822-1.45 1.222c-.324.41-.414.72-.414.899c0 .122.037.251.255.426c.249.2.682.407 1.344.582C7.917 19.858 9.811 20 12 20c2.19 0 4.083-.143 5.4-.492c.663-.175 1.096-.382 1.345-.582c.218-.175.255-.304.255-.426c0-.18-.09-.489-.413-.899c-.316-.4-.804-.828-1.451-1.222C15.843 15.589 14.023 15 12 15Zm0-13a5 5 0 1 1 0 10a5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6a3 3 0 0 0 0-6Z" /></g>
                </svg>
              </button>
            </div>

            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-60 p-2 border-1 border-gray-300">
                <div >
                  {session ? (
                    <>
                      {isProfessionalDashboard ? (
                        <>
                          <Link href="/professionals/profile">
                            <button
                              className="block px-2 py-2 text-black hover:bg-gray-200 w-full justify-center my-1 rounded-md">
                              Profile
                            </button>
                          </Link>
                          <Separator />
                          <button
                            onClick={() => signOut()}
                            className="block px-2 py-2 text-black hover:bg-gray-200 w-full justify-center my-1 rounded-md">
                            Log Out
                          </button>
                        </>
                      ) : (
                        <>
                          <Link href="/profile">
                            <button
                              className="block px-2 py-2 text-black hover:bg-gray-200 w-full justify-center my-1 rounded-md">
                              Profile
                            </button>
                          </Link>
                          <Separator />
                          <button
                            onClick={() => signOut()}
                            className="block px-2 py-2 text-black  hover:bg-gray-200 w-full justify-center my-1 rounded-md">
                            Log Out
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      {isProfessionalDashboard ? (

                        <Link href="/professionals/sign-in">
                          <button
                            className="block px-2 py-2 text-black hover:bg-gray-100 w-full justify-center my-1 rounded-md">
                            Login
                          </button>
                        </Link>

                      ) : (

                        <Link href="/sign-in">
                          <button
                            className="block px-2 py-2 text-black hover:bg-gray-100 w-full justify-center my-1 rounded-md">
                            Login
                          </button>
                        </Link>

                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div>
          {isProfessionalDashboard ? (
            <></>
          ) : (
            <Link href="/cart">
              <div className='flex w-5 h-5 items-center justify-center'>
                <button
                  className='hover:bg-gray-200 p-2 rounded-full'
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className='size-5'
                  >
                    <g xmlns="http://www.w3.org/2000/svg" fill="none"><path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z" /><path fill="currentColor" d="M9 20a1 1 0 1 1 0 2a1 1 0 0 1 0-2Zm7 0a1 1 0 1 1 0 2a1 1 0 0 1 0-2ZM3.495 2.631l.105.07l1.708 1.28a2 2 0 0 1 .653.848l.06.171h12.846a2 2 0 0 1 1.998 2.1l-.013.148l-.457 3.655a5 5 0 0 1-4.32 4.34l-.226.023l-7.313.61l.26 1.124H17.5a1 1 0 0 1 .117 1.993L17.5 19H8.796a2 2 0 0 1-1.906-1.393l-.043-.157l-2.74-11.87L2.4 4.3a1 1 0 0 1 .985-1.723l.11.054ZM18.867 7H6.487l1.595 6.906l7.6-.633a3 3 0 0 0 2.728-2.617L18.867 7Z" /></g>
                  </svg>
                </button>
              </div>
            </Link>
          )}
        </div>
      </div>
    </nav>
 
  )
}

export default Navbar