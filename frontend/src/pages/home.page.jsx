import React, { useEffect, useState } from 'react'
import LoadMoreDataBtn from '../components/load-more.component';
import { IoMdTrendingUp } from "react-icons/io";
import AnimationWrapper from '../common/page-animation'
import InpageNavigation from '../components/inpage-navigation.component';
import axios from 'axios';
import Loader from '../components/loader.component'
import BlogPost from '../components/blog-post.component';
import MinimalBlogPost from '../components/nobanner-blog-post.component';
import { activeTabRef, activeTabLineRef } from '../components/inpage-navigation.component';
import NOData from '../components/nodata.component';
import { filterPaginationData } from '../common/filter-pagination-data';
const Homepage = () => {
 const [latestBlogs , setLatestBlogs] = useState(null);
let categories = ["programming", "hollywood" , "flim making", "social media", "tech", "sports", "life", "home", "love"];
  const [trendingBlogs, setTrendingBlogs] = useState([]);

  const [ pageState , setPageState] = useState("home");

const fetchLatestBlogs = ({page =1}) =>{
  axios.post(import.meta.env.VITE_SERVER_DOMAIN+"/latest-blogs", {page}).then(async ({data})=>{
    //console.log(data);
    
    let formatedData = await filterPaginationData({
      state :  latestBlogs, 
      data : data.blogs , 
      page , 
      countRoute: "/all-latest-blogs-count"}) 
    //setLatestBlogs(blogs);
    setLatestBlogs(formatedData)
    
  }).catch((err)=>{console.log(err);
  })
}

const fetchBlogsByCategory = ({page =1}) =>{
  
  axios
  .post(import.meta.env.VITE_SERVER_DOMAIN+"/search-blogs" , {tag : pageState , page})
  .then(async ({data})=>{
    
    let formatedData = await filterPaginationData({
      state: latestBlogs,
      data: data.blogs,
      page,
      countRoute: "/search-blogs-count",
      data_to_send: { tag: pageState, page },
    });
    
    
    setLatestBlogs(formatedData);
    
    
  }).catch((err)=>{
    console.log(err);
    
  })
}

const loadBlogByCategory=(e) => {
  let category = e.target.innerText.toLowerCase();

  setLatestBlogs([]);
  if(pageState === category){
    setPageState("home");
  }
  else{
    setPageState(category);
  }
}
const TrendingBlogs = () => {
  axios
    .get(import.meta.env.VITE_SERVER_DOMAIN + "/trending-blogs")
    .then(({ data: { blogs } }) => {
      setTrendingBlogs(blogs);
    })
    .catch((err) => {
      console.log(err);
    });
};
useEffect(()=>{
  activeTabRef.current.click();
  if(pageState == "home"){
fetchLatestBlogs({page :1});
  } else{
    fetchBlogsByCategory({page : 1})
  }
  if(!trendingBlogs.length){
    TrendingBlogs();

  }
  }, [pageState])
  
  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10">
        {/* Latest Blogs */}

        <div className="w-full mt-20 sm:mt-20 md:mt-2 lg:mt-2">
          <InpageNavigation
            routes={[pageState, "Trending Blogs"]}
            defaultHidden={["Trending Blogs"]}
          >
            <>
              {latestBlogs===null ? (
                <Loader></Loader>
              ) : latestBlogs?.results?.length?(
                <div>
                  {latestBlogs.results.map((blog, i) => (
                    <AnimationWrapper
                      transition={{ duration: 1, delay: i * 0.4 }}
                    key={i}
                    >
                      <BlogPost
                        content={blog}
                        author={blog.author.personal_info}
                      ></BlogPost>
                    </AnimationWrapper>
                  ))}
                </div>
              ) : <NOData message={"No blogs published yet."}/>}
              <LoadMoreDataBtn state={latestBlogs} fetchDataFun={fetchLatestBlogs}/>
            </>

            <>
              {trendingBlogs===null? (
                <Loader></Loader>
              ) : trendingBlogs.length?(
                <div>
                  {trendingBlogs.map((blog, i) => (
                    <AnimationWrapper
                      transition={{ duration: 1, delay: i * 0.4 }}
                    >
                      <MinimalBlogPost blog={blog} index={i}></MinimalBlogPost>
                    </AnimationWrapper>
                  ))}
                </div>
              ) : <NOData message={"No blogs published yet."}/>}
            </>
          </InpageNavigation>
        </div>

        {/* Filters and trending Blogs */}
        <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max:md:hidden">
          <div className="flex flex-col gap-10">
            <h1 className='font-medium text-xl mb-2'>Stories from all interests</h1>

            <div className='flex gap-3 flex-wrap'> 
              {
                categories.map((category , i)=>(
                  <button key={i} className={'tag shadow-lg ' +(pageState === category? "bg-black text-white": "")} onClick={loadBlogByCategory}
                  >{category}</button>
                ))
              }
            </div>
            <hr className='h-3 '/>
          </div>
          <div>
            <h1 className='text-4xl font-inter'>
              Trending <IoMdTrendingUp className="w-20 h-20 inline-block" />
            </h1>
            {!trendingBlogs.length ? (
              <Loader></Loader>
            ) : (
              <div>
                {trendingBlogs.map((blog, i) => (
                  <AnimationWrapper
                    transition={{ duration: 1, delay: i * 0.4 }}
                  >
                    <MinimalBlogPost blog={blog} index={i}></MinimalBlogPost>
                  </AnimationWrapper>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
}

export default Homepage