import React, { useState } from "react";
import {
  MdAdminPanelSettings,
  MdDashboard,
  MdOutlineFlagCircle,
  MdOutlinePerson,
  MdOutlineSearch,
  MdOutlineShoppingBag,
} from "react-icons/md";
import { HiOutlineMenuAlt3, HiX } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { setOpenSidebar } from "../redux/slices/authSlice";
import UserAvatar from "./UserAvatar";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartItems } = useSelector((state) => state.cart);
  const uniqueItemCount = cartItems.length;
  

  

  return (
    <div className="bg-white sticky top-0 z-10 shadow-sm">
      <div className="flex justify-between items-center px-4 py-2">
        {/* Mobile hamburger */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <HiX size={28} /> : <HiOutlineMenuAlt3 size={28} />}
          </button>
        </div>
        

        {/* Left Nav - desktop only */}
        <nav className=" text-[10px] hidden md:flex gap-x-5 items-center">
          <a href="/" className="hover:border-b-1">Home</a>
          <a href="/shop/women" className="hover:border-b-1">Women</a>
          <a href="/shop/men"className="hover:border-b-1">Men</a>
          {/* <a href="#"className="hover:border-b-1">Kids</a>
          <a href="#"className="hover:border-b-1">Our mission</a>
          <a href="#"className="hover:border-b-1">Archive</a> */}
        </nav>

        {/* Center logo */}
        <div className="text-2xl font-bold flex-1 text-center md:text-left md:flex-none">
          Mavrauder
        </div>

        {/* Right content */}
        <div className="hidden md:flex items-center gap-4">
          <div className="text-[10px] flex items-center gap-4">
            <a href="#" className="hidden" >Gifts</a>
              {/* Conditionally render Admin Link */}
            {user?.isAdmin && ( 
          <a href="/admin" className="text-sm font-medium text-blue-500">
            <MdAdminPanelSettings/>
          </a>
              )}
            <a href="#" className=" text-blue-500">Inner Circle</a>
          </div>
           
          {/* Search bar for desktop */}
          <div className="w-40 flex items-center px-2 py-1 gap-1 rounded-full bg-gray-100">
            <MdOutlineSearch className="text-black text-lg" />
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-transparent outline-none placeholder:text-gray-500 text-sm"
            />
          </div>

          <div className="flex gap-3">
            <MdOutlineFlagCircle size={18} className="hover:cursor-pointer"/>
            <UserAvatar/>
            {/* <MdOutlinePerson size={18} className="hover:cursor-pointer"/> */}
              <Link to= "/cart"
           className="relative">
            <MdOutlineShoppingBag size={18} />
            {uniqueItemCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {uniqueItemCount}
              </span>
            )}
          </Link>
          </div>
        </div>

        {/* Search icon for small screens */}
        <div className="md:hidden flex items-center gap-4">
          <MdOutlineSearch size={18} className="hover:cursor-pointer"/>
          <Link to= "/cart"
           className="relative">
            <MdOutlineShoppingBag size={18} />
            {uniqueItemCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {uniqueItemCount}
              </span>
            )}
          </Link>
          {user?.isAdmin && ( 
          <a href="/admin" className="text-sm font-medium text-blue-500">
            <MdAdminPanelSettings size={18}/>
          </a> )}
          <UserAvatar className="hover:cursor-pointer items-center" />
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-3 pt-2 space-y-3 bg-white shadow">
          <a href="/" className="block">Home</a>
          <a href="/shop/women" className="block">Women</a>
          <a href="/shop/men" className="block">Men</a>
        </div>
      )}
    </div>
  );
};

export default Navbar;
