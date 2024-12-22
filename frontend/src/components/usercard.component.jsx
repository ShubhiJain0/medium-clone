import React from 'react'

import { Link } from 'react-router-dom';

const UserCard = ({user}) => {
  let { personal_info : {username , fullname , profile_img}} = user;

  const colors = [
    "#00204a",
    " #005792",
    "#00bbf0",
    " #fdb44b",
    "#f70776",
    "#6643b5",
    "#2772db",
  ];

  return (
    <Link
      to={`/user/${username}`}
      className="shadow-lg flex gap-5 items-center mb-5 p-3 flex-wrap"
    >
      <div
        className="border-4 rounded-full"
        style={{
          borderColor: colors[Math.floor(Math.random() * colors.length)],
          
        }}
      >
        <img src={profile_img} alt="" className="w-14 h-14 rounded-full" />
      </div>
      <div>
        <h1 className='font-medium text-xl line-clamp-2'>{fullname}</h1>

        <p className='text-dark-grey'>@{username}</p>
      </div>
    </Link>
  );
}

export default UserCard