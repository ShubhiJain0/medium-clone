import React from "react";
import { IoMdTrendingUp } from "react-icons/io";
import { Link } from "react-router-dom";
import { getDay } from "../common/date";

const MinimalBlogPost = ({blog, index})=>{
  let { title , blog_id:id , author:{personal_info: {fullname , username , profile_img}} , publishedAt } = blog;

 return (
   <Link
     to={`/blog/${id}`}
     className="flex gap-5 mb-4 items-center shadow-lg px-2"
   >
     <div>
       <h1 className="blog-index ">{index < 10 ? "0" + (index + 1) : index}</h1>
       <div>
         <IoMdTrendingUp  className="w-10 h-10" />
       </div>
     </div>
     <div className="w-full   mb-1">
       <div className="flex gap-2 items-center mt-6 mb-3 ">
         <img src={profile_img} className="w-6 h-6 rounded-full" alt="" />
         <p className="line-clamp-1">
           {fullname}@{username}
         </p>
         <p className="min-w-fit">{getDay(publishedAt)}</p>
       </div>
       <div className="blog-title mb-3 ml-2">{title}</div>
     </div>
   </Link>
 ); 
}

export default MinimalBlogPost;