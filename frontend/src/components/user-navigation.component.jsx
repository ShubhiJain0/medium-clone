import React, { useContext } from "react";
import { LuFileEdit } from "react-icons/lu";
import AnimationWrapper from "../common/page-animation";
import { Link } from "react-router-dom";
import { LuLayoutDashboard } from "react-icons/lu";
import { userContext } from "../App";
import { AiOutlineProfile } from "react-icons/ai";
import { CiSettings } from "react-icons/ci";
import { removeFromSession } from "../common/session";
import { VscSignOut } from "react-icons/vsc";
const UserNavigationPanel = ()=>{
  const {userAuth : {username}, setUserAuth } = useContext(userContext);
  const signOutUser = ()=>{
    removeFromSession("user");
    setUserAuth({access_token : null})
  }
  return (
    <AnimationWrapper
      classname="absolute right-0 z-50"
      transition={{ duration: 0.2 }}
    >
      <div className="bg-white absolute border-grey w-60  duration-200 right-0 shadow-lg">
        <Link to={"/editor"} className="flex gap-2 link md:hidden pl-8 py-4">
          <LuFileEdit />
          <p>Write</p>
        </Link>

        <Link
          to={`/user/${username}`}
          className="link pl-8 py-4 flex items-center gap-1"
        >
          <AiOutlineProfile />
          Profile
        </Link>

        <Link
          to="/dashboard/blogs"
          className="link pl-8 py-4 flex gap-1 items-center"
        >
          <LuLayoutDashboard />
          Dashboards
        </Link>

        <Link
          to="/settings/edit-profile"
          className="link pl-8 py-4  flex gap-1"
        >
          <CiSettings className="w-6 h-6" /> Settings
        </Link>

        <span className="absolute border-t border-grey w-[100%]"></span>

        <button
          className="text-left p-4 hover:bg-grey w-full pl-8 py-4"
          onClick={signOutUser}
        >
          <div className="flex items-center gap-1">
            <h1 className="font-bold text-xl mb-1">Sign out</h1>
            <VscSignOut className="w-6 h-6" />
          </div>

          <p className="text-dark-grey">@{username}</p>
        </button>
      </div>
    </AnimationWrapper>
  );
}

export default UserNavigationPanel;