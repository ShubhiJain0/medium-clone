import React from 'react'
import { IoMdHeartEmpty } from "react-icons/io";
import {Link} from 'react-router-dom'
import { getDay } from '../common/date';
const BlogPost = ({content , author}) => {
  
  let {publishedAt ,tags , blog_id:id , des,banner , title, activity:{total_likes}} = content

  let { fullname , profile_img , username } = author;
  const fiveTags = [];

  for(let i =0; i<5; i++){
    fiveTags.push(tags[i])
  }
  
  return (
    <Link to={`/blog/${id}`}
    className="flex gap-8 items-center border-b border-grey pb-5 mb-4 shadow-md py-1 px-2">
      <div className="w-full   mb-1">
        <div className="flex gap-2 items-center mt-6 mb-3 ">
          <img src={profile_img} className="w-6 h-6 rounded-full" alt="" />
          <p className="line-clamp-1">
            {fullname}@{username}
          </p>
          <p className="min-w-fit">{getDay(publishedAt)}</p>
        </div>
        <div className="blog-title mb-3 ml-2">{title}</div>
        <p className="my-3 text-xl font-gelasio leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2">
          {des}
        </p>
        <div className="flex space-x-2 flex-wrap sm:w-auto">
          {fiveTags.map((hashtag, i) => (
            <span className="btn-light py-1 px-4 shadow-lg mt-2 mb-2">#{hashtag}</span>
          ))}
        </div>
        <div className="flex mt-2 mb-2">
          <IoMdHeartEmpty className="w-6 h-6" />
          <span className="ml-3 flex items-center gap-2 text-red text-xl ">
            {total_likes} Likes
          </span>
        </div>
      </div>
      <div className="h-28 aspect-square bg-grey">
        <img
          src={banner}
          alt=""
          className="w-full h-full aspect-square object-cover"
        />
      </div>
    </Link>
  );
}

export default BlogPost