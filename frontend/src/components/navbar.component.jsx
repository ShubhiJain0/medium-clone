import {motion} from 'framer-motion'
import { FaBell } from "react-icons/fa";
import React, { useContext, useEffect, useState } from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import darkLogo from '../imgs/logo-dark.png'
import lightLogo from "../imgs/logo-light.png";
import { IoSearchSharp } from "react-icons/io5";
import { LuFileEdit } from "react-icons/lu";
import { Link } from 'react-router-dom'
import { ThemeContext, userContext } from '../App';
import UserNavigationPanel from './user-navigation.component';
import axios from 'axios';
import { storeInSession } from '../common/session';

const Navbar = () => {

  
let [theme, setTheme] = useContext(ThemeContext);

 const [searchBoxVisibility , setSearchBoxVisiblity] = useState(false);
 const [focus , setFocus] =useState(false);
const {
  setUserAuth,
  userAuth,userAuth: { access_token, profile_img, new_notification_available=false },
} = useContext(userContext);



const [userNavPanel , setUserNavPanel] =useState(false);

const navigate = useNavigate();

useEffect(()=>{
  
  if(access_token){
    axios.get(import.meta.env.VITE_SERVER_DOMAIN+"/new-notification",{
      headers:{
        Authorization : `Bearer ${access_token}`
      }
    }).then(({data})=>{
        setUserAuth({...userAuth, ...data})
    })
    .catch(err=>{
      console.log(err);
      
    })
  }
} , [access_token])

const handleSearchFun = (e)=>{
  let query = e.target.value.toLowerCase();

  if(e.keyCode ===13 && query.length){
   navigate(`/search/${query}`) 
  }
  
}

const [inputVal , setInputVal] =useState("");


const handleTheme = ()=>{
  //setLight(!light);
  let newTheme =theme=== "light"? "dark": "light";
  document.body.setAttribute("data-theme", newTheme)
  setTheme(newTheme)

  storeInSession("theme", newTheme)
}



  return (
    <>
      <nav className="navbar z-50">
        <Link to="/" className="flex-none w-10 ">
          <img
            src={theme === "light" ? darkLogo : lightLogo}
            alt=""
            className="w-full"
          />
        </Link>

        <div
          className={`absolute bg-white w-full left-0 top-full mt-0.5 border-b border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:pl-12 ${
            searchBoxVisibility ? "show" : "hide"
          } md:show`}
        >
          <div className="relative overflow-hidden rounded-full">
            <input
              type="text"
              placeholder="search"
              className="w-full md:w-auto bg-grey p-4 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey relative"
              onFocus={() => {
                setFocus(true);
              }}
              value={inputVal}
              onChange={(e) => {
                setInputVal(e.target.value);
              }}
              onBlur={() => {
                setFocus(false);
              }}
              onKeyDown={handleSearchFun}
            />
            {!focus && inputVal == "" && (
              <motion.div
                className="absolute inset-y-0 left-0 bg-grey rounded-r-full w-1/3 h-6 mt-4 ml-3 border-l border-l-dark-grey"
                initial={{ x: "0", opacity: 1 }}
                animate={{
                  x: ["0px", "50px", "50px", "0px"],
                  opacity: [1, 1, 0, 1, 1],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "linear",
                }}
              ></motion.div>
            )}
          </div>

          <IoSearchSharp
            className="absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2
        text-dark-grey
        text-xl"
          />
        </div>
        <div className="flex items-center gap-3 md:gap-6 ml-auto">
          <button
            className="md:hidden bg-grey w-12 h-12 flex justify-center items-center rounded-full"
            onClick={() => {
              setSearchBoxVisiblity(!searchBoxVisibility);
            }}
          >
            <IoSearchSharp />
          </button>

          <div
            className={`${
              theme === "light" ? "bg-grey shadow-inner" : "bg-black shadow-white"
            } rounded-3xl relative h-[30px] w-[65px] px-2 py-2 flex items-center  `}
          >
            <motion.button
              className={`bg-white  absolute min-w-[22px] min-h-[22px] rounded-full ${
                theme === "light" ? "shadow-lg" : "shadow-inner shadow-white"
              }`}
              animate={{ x: theme === "light" ? 0 : "32px" }}
              onClick={handleTheme}
            ></motion.button>
          </div>

          <motion.button
            className="bg-grey rounded-full px-2"
            whileHover={{ scale: 1.035 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setTimeout(() => {
                navigate("/editor"); // Delayed navigation
              }, 500); // Adjust the delay time (500ms in this case)
            }}
          >
            <div className="flex items-center">
              <LuFileEdit className="h-12 w-12 p-2 " />
              <span className="hidden md:block">Write</span>
            </div>
          </motion.button>

          {access_token ? (
            <>
              <Link to={"/dashboard/notifications"}>
                <button className="w-12 h-12 rounded-full bg-grey relative hover:bg-black/10 flex justify-center items-center relative">
                  <FaBell className="w-6 h-6 " />
                  {new_notification_available && (
                    <span className="bg-red w-3 h-3 rounded-full absolute top-[8px] right-[5px]"></span>
                  )}
                </button>
              </Link>
              <div
                className="relative"
                onClick={() => {
                  setUserNavPanel(!userNavPanel);
                }}
                onBlur={() => {
                  setTimeout(() => {
                    setUserNavPanel(false);
                  }, 400);
                }}
              >
                <button className="w-12 h-12 mt-1">
                  <img
                    src={profile_img}
                    alt=""
                    className="w-full h-full object-cover rounded-full"
                  />
                </button>
                {userNavPanel ? <UserNavigationPanel /> : null}
              </div>
            </>
          ) : (
            <>
              <Link to="/signin">
                <button className="bg-black text-white py-1 px-2 text-xl rounded-xl">
                  Sign In
                </button>
              </Link>

              <Link to="/signup">
                <button className="bg-grey py-1 px-2 text-xl rounded-xl">
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>
      </nav>
      <Outlet />
    </>
  );
}

export default Navbar