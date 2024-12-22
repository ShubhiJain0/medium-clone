import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Loader from '../components/loader.component';
import BlogContent from '../components/blog-content.component';
import AnimationWrapper from '../common/page-animation';

import { Link } from 'react-router-dom';
import { getDay } from '../common/date';
import BlogPost from '../components/blog-post.component';
import BlogInteraction from '../components/blog-interaction.component';
import CommentsContainer, { fetchComments } from '../components/comments.component';
export const BlogContext = createContext({});

export const blogStructure = {
  title : '',
  des : '',
  content : [],
  
  author : {personal_info : {} },
  banner : '',
  publishedAt : ''
}

const BlogPage = () => {
  let {  blog_id } = useParams();
  const [ blog , setBlog] = useState(blogStructure); 

  const [ loading , setLoading ] = useState(true);
const [commentWrapper, setCommentWrapper] = useState(true);
//
const [totalParentCommentsLoaded, setTotalParentCommentsLoaded] = useState(0);

const resetState =()=>{
  setBlog(blogStructure)
  setSimilarBlogs(null)
  setLoading(true)
  setCommentWrapper(true);
  setIsLike(false)
  setTotalParentCommentsLoaded(0)
}


  const [similarBlogs, setSimilarBlogs] = useState(null);

  const [ isLike, setIsLike] = useState(false);

  let {
    title,
    content,
    banner,
    author: {
      personal_info: { fullname, username: author_username, profile_img },
    },
    publishedAt,
    
  } = blog;

  

  const fetchBlog = ()=>{
    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog", {
      blog_id
    })
    .then( async ({data : {blog}}) =>{
     //console.log("before : ",blog);
     blog.comments = await fetchComments({
       blog_id: blog._id,
       setParentCommentCountFun: setTotalParentCommentsLoaded,
       parentCommentCountFun:
       totalParentCommentsLoaded,
     });
     setBlog(blog)
     //console.log("after : ", blog.comments);
     axios.post(import.meta.env.VITE_SERVER_DOMAIN+"/search-blogs" , { tag : blog.tags[0] , limit : 6 , eliminate_blog : blog_id })
     .then(({data})=>{
      
        setSimilarBlogs(data.blogs)
        //console.log(data.blogs);
        
     })
     setBlog(blog)
     setLoading(false)
    })
    .catch(err=>{
      
      console.log(err)
      
     setLoading(false);
    })
  }
  useEffect(()=>{
    resetState();
    fetchBlog()
  } , [blog_id])
  
  return (
    <>
      <AnimationWrapper>
        {loading ? (
          <Loader />
        ) : (
          <BlogContext.Provider
            value={{
              blog,
              setBlog,
              isLike,
              setIsLike,
              commentWrapper,
              setCommentWrapper,
              totalParentCommentsLoaded,
              setTotalParentCommentsLoaded,
            }}
          >
            <CommentsContainer/>
            <div className="max-w-[900px] center py-10 max-lg:px-[5vw]">
              <img src={banner} alt="" className="aspect-video" />
              <div className="mt-12">
                <h2 className="text-3xl">{title}</h2>
                <div className="flex max-sm:flex-col justify-between my-8">
                  <div className="flex gap-5 items-start">
                    <img
                      src={profile_img}
                      alt=""
                      className="w-12 h-12 rounded-full"
                    />
                    <p className="capitalize">
                      {fullname}
                      <br />@
                      <Link to={`/user/${author_username}`}>
                        {author_username}
                      </Link>
                    </p>
                  </div>
                  <p className="text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 text-xl max-sm:pl-5">
                    published on {getDay(publishedAt)}
                  </p>
                </div>
              </div>

              <BlogInteraction />
              <div className="my-12 font-gelasio blog-page-content">
                {content[0].blocks.map((block, i) => {
                  //console.log(block);

                  return (
                    <div key={i} className="my-4 md:my-8">
                      {<BlogContent block={block} />}
                    </div>
                  );
                })}
              </div>

              <BlogInteraction />

              {similarBlogs !== null && similarBlogs.length ? (
                <>
                  <h1 className="text-2xl mt-14 mb-10 font-medium font-gelasio">
                    Similar Blog
                  </h1>
                  {similarBlogs.map((blog, i) => {
                    let {
                      author: { personal_info },
                    } = blog;

                    return (
                      <AnimationWrapper
                        key={i}
                        transition={{ duration: 1, delay: i * 0.08 }}
                      >
                        <BlogPost content={blog} author={personal_info} />
                      </AnimationWrapper>
                    );
                  })}
                </>
              ) : null}
            </div>
          </BlogContext.Provider>
        )}
      </AnimationWrapper>
    </>
  );
}

export default BlogPage