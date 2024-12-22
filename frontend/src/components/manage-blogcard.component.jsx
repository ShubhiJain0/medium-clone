import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom';
import { getDay } from '../common/date';
import axios from 'axios';
import { userContext } from '../App';
import { CiHeart } from "react-icons/ci";
import { FaComment } from "react-icons/fa";
import toast from 'react-hot-toast';
import { FaRegEye } from "react-icons/fa";
import { Toaster } from 'react-hot-toast';
const BlogStats = ({stats})=>{
  const iconArr = [<CiHeart />, <FaComment />, <FaRegEye />];
    return (
      <div className='flex gap-2 max-lg:mb-6 pb-6 border-grey max-lg:border-b'>
        {
          Object.keys(stats).map((key , i)=>{
            return !key.includes("parent") ? (
              <div
                key={i}
                className={"flex flex-col items-center w-full h-full justify-center p-4 px-6 " +(i!==0? "border-grey border-l": "")}
              >
                <h1 className="text-xl lg:text-2xl mb-2">
                  {stats[key].toLocaleString()}
                </h1>
                <div className='flex flex-col justify-center items-center'>
                  {iconArr[i]}
                  <p className="max-lg:text-dark-grey capitalize">
                    {key.split("_")[1]}
                  </p>
                </div>
              </div>
            ) : (
              ""
            );
          })
        }
      </div>
    )
}


const ManagePublishBlogCard = ({blog}) => {
  
  
  let { banner, title, blog_id, publishedAt, activity } = blog;

 const { userAuth : { access_token}}= useContext(userContext);

 const [ showStats , setShowStats ] = useState(false);

  
  const handleDeleteBlog = ()=>{
    axios
      .post(
        import.meta.env.VITE_SERVER_DOMAIN + "/delete-a-blog",
        { id: blog_id},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then((response) => {
      toast.success("blog deleted successfully")
      }).catch(()=>{
        toast.error("Error in deleting the blog")
      })
      window.location.reload();
  }

  return (
    <>
      <Toaster />
      <div className="flex gap-10 border-b mb-6 max-md:px-4 border-grey pb-6 items-center ">
        <img
          src={banner}
          alt=""
          className="max-md:hidden lg:hidden xl:block w-28 h-28 flex-none bg-grey  object-cover"
        />

        <div className="flex flex-col justify-between py-2 w-full min-w-[300px]">
          <div>
            <Link to={`/blog/${blog_id}`} className="blog-title">
              {title}
            </Link>

            <p className="line-clamp-1">Published on {getDay(publishedAt)}</p>
          </div>

          <div className="flex gap-6 mt-3">
            <Link to={`/editor/${blog_id}`} className="pr-4 py-2 underline">
              Edit
            </Link>

            <button
              className="lg:hidden pr-4 py-2 underline"
              onClick={() => {
                setShowStats(!showStats);
              }}
            >
              stats
            </button>

            <button
              className="pr-4 py-2 underline text-red"
              onClick={handleDeleteBlog}
            >
              Delete
            </button>
          </div>
        </div>
        <div className="max-lg:hidden">
          <BlogStats stats={activity} />
        </div>
      </div>
      {showStats && (
        <div className="lg:hidden">
          <BlogStats stats={activity} />
        </div>
      )}
    </>
  );
}

export default ManagePublishBlogCard

export const ManageDraftBlogCard=({blog , index})=>{
  let { title, des, blog_id} = blog;

  
 const {
   userAuth: { access_token },
 } = useContext(userContext);

  const handleDeleteBlog = () => {
    axios
      .post(
        import.meta.env.VITE_SERVER_DOMAIN + "/delete-a-blog",
        { id: blog_id },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then((response) => {
        toast.success("Draft deleted successfully");
      })
      .catch(() => {
        toast.error("Error in deleting the blog");
      });
      
      window.location.reload();
  };

  
return (
  <>
  <Toaster />
    <div className="flex gap-5 lg:gap-10 pb-6 border-b mb-6 border-grey">
      <h1 className="blog-index text-center pl-4 md:pl-6 flex-none">
        {index < 10 ? "0" + index : index}
      </h1>

      <div>
        <h1>{title}</h1>

        <p className="line-clamp-2 font-gelasio">
          {des && des.length ? des : "No description available"}
        </p>

        <div className="flex gap-6 mt-3">
          <Link to={`/editor/${blog_id}`} className="pr-4 py-2 underline">
            Edit
          </Link>

          <button
            className="pr-4 py-2 underline text-red"
            onClick={handleDeleteBlog}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </>
);
}

