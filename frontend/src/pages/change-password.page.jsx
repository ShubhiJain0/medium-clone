import React, { useRef, useState } from 'react'
import AnimationWrapper from '../common/page-animation'
import Input from '../components/input.component'
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import {Toaster , toast} from 'react-hot-toast'
import axios from 'axios';
import { useContext } from 'react';
import {userContext} from '../App'

const ChangePasswordPage = () => {

 let {userAuth : {access_token}} = useContext(userContext);
 
  const [passwordVisibile , setPasswordVisible] = useState(false);

  
  const [newPasswordVisibile, setNewPasswordVisible] = useState(false);


const changePasswordForm= useRef();


let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

  const handleChangePassword=(e)=>{
      e.preventDefault();

      let form = new FormData(changePasswordForm.current);

    let formData = {};

    for( let [key , value] of form.entries()){
      formData[key ] = value;
    }

    let {currentPassword , newPassword}= formData;

    if(!currentPassword.length || !newPassword.length){
      return toast.error("Fill all the inputs")
    }
    
    if(!passwordRegex.test(currentPassword) || !passwordRegex.test(newPassword)){
      return toast.error(
        "password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letter"
      );
    }
    
      e.target.setAttribute("disabled", true);

      let loadingToast = toast.loading("Updating...");

      axios.post(import.meta.env.VITE_SERVER_DOMAIN +"/change-password" , formData,
        { 
        headers :{
          Authorization : `Bearer ${access_token}`
        }
      }
      ).then((data)=>{
        toast.dismiss(loadingToast);
         toast.success("Password changed successfully!");
        e.target.removeAttribute("disabled");

      })
      .catch(({response})=>{
        
        toast.dismiss(loadingToast)

        e.target.removeAttribute("disabled");
        return toast.error(response.data.error)
      })

    

  };
 
  return (
    <AnimationWrapper>
      <Toaster/>
      <form action="" ref={changePasswordForm}>
        <h1 className="max-md:hidden text-2xl ">Change Password</h1>
        <div className="relative flex flex-col justify-center">
          <div>
            <Input
              name="currentPassword"
              type={!passwordVisibile ? "password" : "text"}
              className="profile-edit-input"
              placeholder="current password"
            />
            {!passwordVisibile ? (
              <FaEyeSlash
                className="w-6 h-6 absolute right-3 top-5 "
                onClick={() => {
                  setPasswordVisible(!passwordVisibile);
                }}
              />
            ) : (
              <FaEye
                className="w-6 h-6 absolute right-3 top-5 "
                onClick={() => {
                  setPasswordVisible(!passwordVisibile);
                }}
              />
            )}
          </div>

          <div className="relative mt-4">
            <Input
              name="newPassword"
              type={!newPasswordVisibile ? "password" : "text"}
              className="profile-edit-input"
              placeholder="new password"
            />
            {!newPasswordVisibile ? (
              <FaEyeSlash
                className="w-6 h-6 absolute right-3 top-5 "
                onClick={() => {
                  setNewPasswordVisible(!newPasswordVisibile);
                }}
              />
            ) : (
              <FaEye
                className="w-6 h-6 absolute right-3 top-5 "
                onClick={() => {
                  setNewPasswordVisible(!newPasswordVisibile);
                }}
              />
            )}
          </div>
          <button className="btn-dark mt-5" onClick={handleChangePassword}>
            Change password
          </button>
        </div>
      </form>
    </AnimationWrapper>
  );
}

export default ChangePasswordPage