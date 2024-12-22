import React, { useContext, useEffect } from 'react'
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { BlogContext } from '../pages/blog.page'
import { FaRegComment } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Toaster , toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { userContext } from '../App';
import axios from 'axios';

const BlogInteraction = () => {
 
  
  let {
    blog,
    blog: {
      _id,
      title,
      blog_id,
      activity: { total_comments, total_likes },
      author: {
        personal_info: { username: author_username },
      },
    },
    setBlog,
    isLike,
    setIsLike,
    commentWrapper,
    setCommentWrapper,
  } = useContext(BlogContext);
  //console.log(blog);
  
  
  let {userAuth : {username = "", access_token=""} } = useContext(userContext)
  
  useEffect(()=>{
  if(access_token){
    //make request to server to get live information we need a route for that
   axios
     .post(
       import.meta.env.VITE_SERVER_DOMAIN + "/isliked-by-user",
       { _id },
       {
         headers: {
           Authorization: `Bearer ${access_token}`,
         },
       }
     )
     .then(({ data : {result} }) => {
       //console.log(result);
       setIsLike(Boolean(result))
     })
     .catch((err) => {
       console.log(err);
     });
  }
  } , [])

  const handleLike = ()=>{
    if(access_token){
      
      setIsLike(!isLike);
      
      
      !isLike? total_likes++ : total_likes--;

      setBlog({ ...blog, activity: { ...blog.activity, total_likes } });
      
      axios
        .post(
          import.meta.env.VITE_SERVER_DOMAIN + "/like-blog",
          { _id, isLike },
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        )
        .then(({ data }) => {
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });
      
    } else{
      //not logged in
      toast.error("please log in to like this blog")
    }
    
  }
  
  return (
    <>
    <Toaster />
      <h1 className="border-grey my-2" />
      <div className="flex gap-6  justify-between">
        <div className="flex gap-3 item-center">
          
            <button className={"w-10 h-10 rounded-full flex items-center justify-center "+(isLike? "bg-red/20 text-red ": " bg-grey/80")}
            onClick={handleLike}
            >
              {isLike? <FaHeart className='w-10 h-10' style={{color: "red"}}/>: <FaRegHeart className="w-10 h-10 " />}
            </button>
            <p className="text-2xl text-dark-grey"
            >{total_likes}</p>
          
            <button className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80">
              <FaRegComment className="w-10 h-10 " 
              onClick={()=>{
                setCommentWrapper(!commentWrapper)
              }}
              />
            </button>
            <p className="text-2xl text-dark-grey">{total_comments}</p>
          </div>
        <div className="flex gap-6 items-center">
          {
            username === author_username ? <Link to={`/editor/${blog_id}`}
            className='underline hover:text-purple text-xl'
            >Edit</Link>: null
          }
          <Link to={`https://twitter.com/intent/tweet?text=Read${title}&url=${location.href}`}>
            <FaXTwitter className='text-2xl'/>
          </Link>
        </div>
      </div>

      <h1 className="border-grey my-2" />
    </>
  );
}

export default BlogInteraction