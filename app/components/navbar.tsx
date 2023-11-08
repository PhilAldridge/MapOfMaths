import Link from "next/link"
import LogoutButton from "./logoutButton"
import SearchBar from "./searchBar"
import Image from "next/image"

function Navbar() {
    

  return (
    <div className="w-full flex flex-row justify-end bg-gradient-to-r from-pink-500 to-violet-500 p-3 px-8 gap-6 z-40">
        <Image src="/map.png" alt="logo" className=" invert mr-auto" height="30" width="40"/>
        <Link href={'/'} className="bg-black bg-opacity-0 align-middle my-auto">View Graph</Link>
        <label htmlFor="atomSearch" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
        <SearchBar />
        <LogoutButton />
    </div>
  )
}

export default Navbar