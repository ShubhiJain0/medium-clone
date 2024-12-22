import React, { useContext } from 'react'

import lightPageNotFound from '../imgs/404-light.png'

import darkPageNotFound from '../imgs/404-dark.png'

import { Link } from 'react-router-dom';
import { FaHome } from "react-icons/fa";


import lightFullLogo from '../imgs/full-logo-light.png'


import darkFullLogo from '../imgs/full-logo-dark.png'

import { ThemeContext } from '../App';

const FourOFour = () => {


let [theme, setTheme] = useContext(ThemeContext);

 
  
  return (
    <section className="h-cover p-10 flex flex-col items-center gap-20 text-center ">
      <img
        src={theme === "light" ? darkPageNotFound : lightPageNotFound}
        alt=""
        className="select-none border-2 border-grey w-72 aspect-square object-cover rounded"
      />
      <h1 className="text-4xl font-gelasio leading-7">Page not found</h1>
      <Link to={"/"}>
        <p className="text-2xl font-gelasio">
          Page you are looking for does not exist.
          <span className="underline text-3xl">
            Go back to home
            <FaHome className="inline-block w-10 h-10 mb-3 ml-2 " />
          </span>
        </p>
      </Link>
      <div className="mt-auto">
        <img
          src={theme === "light" ? darkFullLogo : lightFullLogo}
          alt=""
          className="h-8 object-contain block mx-auto select-none"
        />
        <p className="mt-5 text-dark-grey">
          Read millions of stories around the world
        </p>
      </div>
    </section>
  );
}

export default FourOFour