import React, { useContext, useEffect, useRef, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import { userContext } from '../App';
import { FaLock } from "react-icons/fa";
import { FaUserAlt } from "react-icons/fa";
import { LuFileEdit } from 'react-icons/lu';
import { FaLockOpen } from "react-icons/fa";
import { IoIosDocument } from "react-icons/io";
import { FaRegUser } from "react-icons/fa6";
import { CiBellOn } from "react-icons/ci";
import { MdSpaceDashboard } from "react-icons/md";
import { CiMenuBurger } from "react-icons/ci";
import { NavLink } from 'react-router-dom';
import { FaScrewdriverWrench } from "react-icons/fa6";
const SideNavBar = () => {
let p = location.pathname.split("/")[2];

const [page , setPageState] =  useState(p.replace('-' , ' '));
const {
  userAuth: { access_token, new_notification_available },
} = useContext(userContext);

let activeTabLine =useRef();

let sideBarIcon = useRef();

let pageStateTab = useRef();

const [showSideNav , setShowSideNav] =useState(false);

let changePageState = (e)=>{
  let {offsetWidth , offsetLeft} = e.target;
  

  activeTabLine.current.style.width = offsetWidth + 'px';
  activeTabLine.current.style.left = offsetLeft + "px";

  if(e.target ===sideBarIcon.current){
    setShowSideNav(true)
  } else{
    setShowSideNav(false)
  }
}
  useEffect(()=>{
    setShowSideNav(false)
    pageStateTab.current.click();
  } , [page])
return access_token === null ? (
  <Navigate to={"/signin"} />
) : (
  <>
    <section className="relative flex gap-10 py-0 m-0 mt-3 max-md:flex-col ">
      <div className=" sticky top-[80px] z-30 md:pr-0 md:border-grey md:border-r absolute ">
        <div className="md:hidden bg-white py-1 border-b border-grey flex flex-nowrap overflow-x-auto">
          <button
            onClick={changePageState}
            ref={sideBarIcon}
            className="p-5 capitalize"
          >
            <CiMenuBurger className="w-6 h-6 pointer-events-none" />
          </button>

          <button
            onClick={changePageState}
            ref={pageStateTab}
            className="p-5 capitalize"
          >
            {page}
          </button>

          <hr ref={activeTabLine} className="absolute bottom-0 duration-500" />
        </div>
        <div
          className={
            " min-w-[200px] h-[calc(100vh-80px-60px)] md:h-cover md:sticky top-24 overflow-auto p-6 md:pr-0  md:border-grey md:border-r absolute max-md:top-[64px] bg-white max-md:w-[calc(100% +80px)] max-md:px-16 max-md:-ml-7 duration-500 " +
            (!showSideNav
              ? "max-md:opacity-0 max-md:pointer-events-none "
              : " opacity-100 pointer-events-auto ")
          }
        >
          <h1 className="text-xl text-dark-grey mb-3 ">
            <MdSpaceDashboard className="inline-block mr-2" />
            Dashboard
          </h1>
          <hr className="border-grey -ml-6 mb-8 mr-6" />

          <NavLink
            to="/dashboard/blogs"
            onClick={(e) => {
              setPageState(e.target.innerText);
            }}
            className="sidebar-link"
          >
            <IoIosDocument className="w-7 h-7" />
            Blogs
          </NavLink>

          <NavLink
            to="/dashboard/notifications"
            onClick={(e) => {
              setPageState(e.target.innerText);
            }}
            className="sidebar-link relative"
          >
            {new_notification_available && (
              <span className="bg-red w-3 h-3 rounded-full absolute top-[16px] left-[13px]"></span>
            )}
            <CiBellOn className="w-7 h-7" />
            Notification
          </NavLink>

          <NavLink
            to="/editor"
            onClick={(e) => {
              setPageState(e.target.innerText);
            }}
            className="sidebar-link"
          >
            <LuFileEdit className="w-7 h-7" /> Write
          </NavLink>

          <h1 className="text-xl text-dark-grey mb-3 mt-20 ">
            <FaScrewdriverWrench className="inline-block mr-2 w-7 h-7" />
            Settings
          </h1>
          <hr className="border-grey -ml-6 mb-8 mr-6" />

          <NavLink
            to="/settings/edit-profile"
            onClick={(e) => {
              setPageState(e.target.innerText);
            }}
            className="sidebar-link"
          >
            {page === "Edit Password" ? (
              <FaRegUser className="w-7 h-7" />
            ) : (
              <FaUserAlt className="w-7 h-7" />
            )}
            Edit Profile
          </NavLink>

          <NavLink
            to="/settings/change-password"
            onClick={(e) => {
              setPageState(e.target.innerText);
            }}
            className="sidebar-link"
          >
            {page === "Edit Password" ? (
              <FaLockOpen className="w-7 h-7" />
            ) : (
              <FaLock className="w-7 h-7" />
            )}
            Edit Password
          </NavLink>
        </div>
      </div>

      <div className=" mt-5 max-md:-mt-8 max-md:w-full">
        <Outlet></Outlet>
      </div>
    </section>
  </>
);
}

export default SideNavBar