import React, { useContext, useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import googleIcon from '../imgs/google.png'
import Input from '../components/input.component'
import { FaUser } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import { MdAlternateEmail } from "react-icons/md";
import { FaEye } from "react-icons/fa6";
import AnimationWrapper from '../common/page-animation'
import {Toaster, toast} from 'react-hot-toast'
import { storeInSession } from "../common/session";
import { Navigate } from 'react-router-dom';
import axios from 'axios'
import { userContext } from '../App';
import { authWithGoogle } from '../common/firebase';
const UserAuthForm = ({type}) => {
  const [showPassword, setShowPassword] = useState(false);

  let { userAuth : {access_token} ,  setUserAuth} = useContext(userContext);
  console.log("hello");
  
  console.log(access_token);
  

  let serverRoute = type ==="sign-up"? "/signup" : "/signin";
  
  const 
    userAuthThroughServer= (serverRoute , formData)=>{
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
      .then(({ data }) => {
        storeInSession("user" , JSON.stringify(data))
        setUserAuth(data)
      })
      .catch(({ response }) => {
        toast.error(response.data.error);
      });    
    }

  let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
  let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

  const handleSubmit = (e) => {
    e.preventDefault();

    let form = new FormData(formElement);

    const formData = {};

for( let [key , value] of form.entries()){
  formData[key] = value;
  console.log(key,value);
  
}

let {fullname , email, password} = formData;

if(fullname){
  if ( fullname.length < 3) {
      return toast.error("Fullname must be atleast 3 letters long");
    }
}
    if (!email.length) {
      return toast.error("enter email");
    }
    if (!emailRegex.test(email)) {
      return toast.error("email is invalid");
    }
    if (!passwordRegex.test(password)) {
      return toast.error(
        "password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letter"
      );
    }
    
    userAuthThroughServer(serverRoute , formData);
  };

  const handleGoogleAuth = (e)=>{
    e.preventDefault()

    authWithGoogle()
    .then((user)=>{let serverRoute = "/google-auth";
      let formData = {
        access_token : user.accessToken
      }
      userAuthThroughServer(serverRoute , formData)
    }).catch((err)=>{
      toast.error("trouble login through google.")
      return console.log(err);
      
    })
  }
  return (
    access_token? <Navigate to={'/'}/> :
       <AnimationWrapper keyValue={type}>
      <section className="h-cover flex items-center justify-center">
        <Toaster />
        <form id='formElement' action="" className="w-[80%] max-w-[400px]">
          <h1 className="text-4xl font-gelasio capitalize text-center">
            {type == "sign-in" ? "Welcome Back" : "Join us today"}
          </h1>
          {type === "sign-in" ? (
            <div className="flex flex-col space-y-4">
              <Input
                name="email"
                type="email"
                placeholder="Email"
                icon={<MdAlternateEmail className="w-8 h-8 ml-1" />}
              />
              <Input
                name="password"
                type={`${showPassword ? `text` : `password`}`}
                placeholder="password"
                icon={
                  showPassword ? (
                    <FaEye
                      className="w-8 h-8 ml-1"
                      onClick={() => {
                        setShowPassword(!showPassword);
                      }}
                    />
                  ) : (
                    <FaEyeSlash
                      className="w-8 h-8 ml-1"
                      onClick={() => {
                        setShowPassword(!showPassword);
                      }}
                    />
                  )
                }
              />
            </div>
          ) : (
            <div className="flex flex-col space-y-4">
              <Input
                name="fullname"
                type="text"
                placeholder="Full Name"
                icon={<FaUser className="w-8 h-8 ml-1" />}
              />
              <Input
                name="email"
                type="email"
                placeholder="Email"
                icon={<MdAlternateEmail className="w-8 h-8 ml-1" />}
              />
              <Input
                name="password"
                type={`${showPassword ? `text` : `password`}`}
                placeholder="password"
                icon={
                  showPassword ? (
                    <FaEye
                      className="w-8 h-8 ml-1"
                      onClick={() => {
                        setShowPassword(!showPassword);
                      }}
                    />
                  ) : (
                    <FaEyeSlash
                      className="w-8 h-8 ml-1"
                      onClick={() => {
                        setShowPassword(!showPassword);
                      }}
                    />
                  )
                }
              />
            </div>
          )}
          <button className="btn-dark center mt-14" onClick={handleSubmit}>
            {type.replace("-", " ")}
          </button>
          <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
            <hr className="w-1/2 border-black" />
            <p>or</p>
            <hr className="w-1/2 border-black" />
          </div>
          <button className="btn-dark flex items-center justify-center gap-4 w-[90%] center"
          onClick={handleGoogleAuth}
          >
            <img src={googleIcon} alt="" className="w-5" />
            Continue with Google
          </button>
          {type === "sign-in" ? (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Don't have an account?
              <Link to="/signup" className="underline text-black text-xl ml-1">
                Sign up
              </Link>
            </p>
          ) : (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Already have an account?
              <Link to="/signin" className="underline text-black text-xl ml-1">
                Sign In
              </Link>
            </p>
          )}
        </form>
      </section>
    </AnimationWrapper>
  
    
    );
}

export default UserAuthForm