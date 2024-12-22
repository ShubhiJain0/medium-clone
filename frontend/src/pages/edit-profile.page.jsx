import React, { useContext, useState, useEffect, useRef } from "react";
import { userContext } from "../App";
import { Toaster } from "react-hot-toast";
import { removeFromSession, storeInSession } from "../common/session";

import toast from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { profileDataStructure } from "./profile.page";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import Input from "../components/input.component";
const EditProfilePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [useRedirect, setUseRedirect] = useState(false);
  const [enteredUsername, setEnteredUsername] = useState("");
  const navigate = useNavigate();

  const {
    userAuth: { username, access_token },
    userAuth,
    setUserAuth,
  } = useContext(userContext);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleDelete = (e) => {
  
    e.preventDefault();

    if (enteredUsername !== username || enteredUsername.trim() === "") {
      return toast.error("Enter the correct username.");
    }

    axios
      .post(
        import.meta.env.VITE_SERVER_DOMAIN + "/delete-account",
        { username },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then(() => {
        removeFromSession("user");
        setUserAuth({});
        setUseRedirect(true); // Set redirect flag
      })
      .catch((err) => {
        console.error(err.message);
        toast.error("Failed to delete account.");
      });
  };


  const [profile, setProfile] = useState(profileDataStructure);

  const [loading, setLoading] = useState(true);

 let profileImg = useRef();
 const [updatedProfileImg , setUpdatedProfileImg] = useState(null);
  // Trigger navigation after successful deletion
  let {
    personal_info: {
      fullname,
      username: profile_username,
      profile_img,
      email,
      bio,
    },
    social_links,
  } = profile;
  useEffect(() => {
    if (useRedirect) {
      navigate("/signup");
    }
    if (access_token) {
      axios
        .post(import.meta.env.VITE_SERVER_DOMAIN + "/get-profile", { username })
        .then(({ data }) => {
          //console.log(data);
          setProfile(data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [useRedirect, navigate, access_token]);

 const editProfileForm = useRef();

  const handleSaveProfile = (e)=>{
      //e.preventDefault();
    let form = new FormData(editProfileForm.current)

    let formData = {};

    for( let [key , value] of form.entries()){
      formData[key] = value;
      console.log(key , value);
      
    }
    console.log(formData);

    let { username , fullname , bio , email , youtube , facebook , github , instagram , website  } = formData;

    if(username.length<3){
      toast.error("Username must be atleast 3 characters long.");
    }
    if(bio?.length > 150){
    toast.error("Bio must be under 150 characters.");
    }

    let loadingToast = toast.loading("Updating....")

    e.target.setAttribute("disabled" , false)

    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/update-profile", {
      username,
      fullname,
      bio,
      email,
      social_links: { youtube, facebook, github, instagram, website },
    }, 
  {
    headers :{
      Authorization : `Bearer ${access_token}`
    }
  }).then(({data})=>{
    if(userAuth.username!==data.username){
      let newUserAuth = { ...userAuth , username : data.username}

      storeInSession("user" , JSON.stringify(newUserAuth))

      setUserAuth(newUserAuth);
    }
    toast.dismiss(loadingToast);
    e.target.removeAttribute("disabled")
    toast.success("Profile updated.")
  }).catch(({response})=>{
    toast.dismiss(loadingToast);
    e.target.removeAttribute("disabled");
    toast.error(response.data.error)
  })
    
  }

  const handleImagePreview = (e)=>{
    let img = e.target.files[0];

    profileImg.current.src = URL.createObjectURL(img);

    setUpdatedProfileImg(img);

    console.log(img);
    

  }

  
  const handleBannerUpload = async (e) => {
    e.preventDefault();

    let loadingToast = toast.loading("uploading...");

    e.target.setAttribute("disabled" , true)

    let img = updatedProfileImg;

    const formData = new FormData();
    
    formData.append("banner", img);

    try {
      axios.post(
        import.meta.env.VITE_SERVER_DOMAIN + "/upload-banner",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      ).then(({data})=>{
        console.log(data);
        axios
          .post(
            import.meta.env.VITE_SERVER_DOMAIN + "/update-profile-img",
            {
              url: data.bannerUrl,
            },
            {
              headers: {
                Authorization: `Bearer ${access_token}`,
              },
            }
          )
          .then(({ data }) => {
            console.log(data);

            let newUserAuth = { ...userAuth, profile_img: data.profile_img };
            storeInSession("user", JSON.stringify(newUserAuth));
            setUserAuth(newUserAuth);
            setUpdatedProfileImg(null);
            toast.dismiss(loadingToast);

            toast.success("Uploaded👍");

            e.target.removeAttribute("disabled");
          })
          .catch((error) => {
            console.error("Error uploading file:", error);
            toast.error("Upload failed ❌");
          }); 
      });

      // Handle the response
 
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Upload failed ❌");
     
    }
  };

  return (
    <>
      <AnimationWrapper>
        <Toaster />

        {loading ? (
          <Loader />
        ) : (
          <div className="relative">
            <h1 className="text-2xl font-bold">Edit Profile Page</h1>

            <div className="flex flex-col lg:flex-row items-start py-10 gap-8 lg:gap-10">
              <div className="max-lg:center mb-5 ">
                <label
                  htmlFor="uploadImg"
                  id="profileImgLabel"
                  className="relative block w-48 h-48 bg-grey rounded-full overflow-hidden"
                >
                  <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center text-white bg-black/40 opacity-0 hover:opacity-100 cursor-pointer">
                    Upload Image
                  </div>
                  <img src={profile_img} alt="" ref={profileImg} />
                </label>
                <input
                  type="file"
                  id="uploadImg"
                  accept=".jpeg, .png, .jpg"
                  hidden
                  onChange={handleImagePreview}
                />
                <button
                  className="btn-light mt-5 max-lg:center lg:w-full px-10"
                  onClick={handleBannerUpload}
                >
                  Upload
                </button>
              </div>
              <form action="" ref={editProfileForm}>
                <div className="w-full flex flex-col space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5 gap-5">
                    <Input
                      name="fullname"
                      type="text"
                      value={fullname}
                      placeholder="fullname"
                      className="input-box"
                    />

                    <Input
                      name="email"
                      type="email"
                      value={email}
                      placeholder="email"
                      className="input-box"
                    />
                  </div>
                  <Input
                    type="text"
                    name="username"
                    value={profile_username}
                    className="input-box"
                    placeholder="username"
                  />
                  <p>
                    Username will be used to search user and will be visible to
                    all other users
                  </p>

                  <textarea
                    name="bio"
                    id=""
                    maxLength={150}
                    defaultValue={bio}
                    className="input-box h-64 lg:h-40 resize-none leading-7 mt-5 pl-5 placeholder:text-dark-grey"
                    placeholder="Enter your bio"
                  ></textarea>

                  <p className="my-6 text-dark-grey">
                    Add your social handles below
                  </p>
                  <div className="md:grid md:grid-cols-2 gap-x-6">
                    {Object.keys(social_links).map((key, i) => {
                      let link = social_links[key];
                      return (
                        <Input
                          key={i}
                          name={key}
                          type="text"
                          value={link}
                          placeholder="https://"
                          className="input-box my-1"
                        />
                      );
                    })}
                  </div>
                </div>
              </form>
            </div>
            <div>
              <button
                type="button"
                onClick={openModal}
                className="mt-4 px-4 py-2 btn-dark"
              >
                Delete Account
              </button>
              <button
                type="button"
                className="mt-4 px-4 ml-4 py-2 btn-dark"
                onClick={handleSaveProfile}
              >
                Save Profile
              </button>
            </div>
            {isModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-md shadow-lg max-w-sm w-full relative">
                  <h1 className="text-2xl ">
                    Type
                    <span className="text-2xl underline font-bold">
                      {" "}
                      {username}
                    </span>{" "}
                    to proceed
                  </h1>
                  <button
                    className="bg-grey p-2 rounded-full absolute right-2 top-1"
                    onClick={closeModal}
                  >
                    <RxCross2 className="w-8 h-8 ml-2" />
                  </button>

                  <p className="mt-2 text-sm text-gray-700">
                    All your information will be deleted.
                  </p>

                  <input
                    type="text"
                    className="px-4 py-2 border border-dark-grey mt-2"
                    value={enteredUsername}
                    onChange={(e) => setEnteredUsername(e.target.value)}
                  />
                  <button
                    className="mt-4 px-4 py-2 btn-dark rounded-md"
                    onClick={handleDelete}
                  >
                    Delete your account
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </AnimationWrapper>
    </>
  );
};

export default EditProfilePage;
