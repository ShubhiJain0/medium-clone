import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { filterPaginationData } from '../common/filter-pagination-data';
import { userContext} from '../App'
import { Toaster , toast } from 'react-hot-toast';
import { CiSearch } from "react-icons/ci";
import LoadMoreDataBtn from '../components/load-more.component';
import InpageNavigation from '../components/inpage-navigation.component';
import Loader from '../components/loader.component';
import NOData from '../components/nodata.component';
import { ManageDraftBlogCard } from '../components/manage-blogcard.component';
import AnimationWrapper from '../common/page-animation';
import ManagePublishBlogCard from '../components/manage-blogcard.component';
import { useSearchParams } from 'react-router-dom';
const BlogManagementPage = () => {

  let acitiveTab = useSearchParams()[0].get("tab");

 const { userAuth : { access_token}} =useContext(userContext);

  const [ blogs , setBlogs] = useState(null);

  const [ drafts , setDrafts] = useState(null);

  const [ query , setQuery] = useState("")

  const getBlogs = ({ page , draft , deleteDocCount =0})=>{
      axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/user-written-blogs", {
        page, draft , query , deleteDocCount
      }, {
        headers : {
          Authorization : `Bearer ${access_token}`
        }
      }
    ).then(async ({data})=>{
      let formatedData =await  filterPaginationData({
        state : draft ? drafts : blogs,
        data : data.blogs,
        page,
        user: access_token,
        countRoute : "/user-written-blogs-count",
        data_to_send : { draft , query}
      })
      console.log(formatedData);
      
      if (draft) {
        setDrafts(formatedData);
      } else {
        setBlogs(formatedData);
      }
    }).catch(err=>{
      console.log(err);
      
    })
      
  }

useEffect(()=>{
  if(access_token){
    if(blogs ===null){
      getBlogs({page : 1 , draft : false })
    }
    if(drafts ===null){
        getBlogs({ page: 1, draft: true   });
    }
  }
} , [access_token, blogs , drafts , query])

const handleChange = ( e ) =>{
if(!e.target.value.length){
  setQuery("");
   setBlogs(null);
   setDrafts(null);
}
}

const handleSearch = (e)=>{
let searchQuery = e.target.value;
setQuery(searchQuery);
if (e.keyCode == 13 && searchQuery.length) {
  setBlogs(null);
  setDrafts(null);
}
}

  return (
    <>
      <h1 className="text-2xl font-bold">Manage Blogs</h1>
      <div className="relative max-md:mt-5 md:mt-8 mb-10">
        <input
          type="search"
          className="w-full bg-grey p-4 pl-14 pr-6 rounded-full placeholder:text-dark-grey"
          onChange={handleChange}
          onKeyDown={handleSearch}
        />
        <CiSearch className="absolute w-8 h-8 top-3 left-4 " />
      </div>
      <InpageNavigation
        routes={["Published Blogs", "Drafts"]}
        defaultActiveIndex={acitiveTab!="draft" ? 0: 1}
      >
        {blogs === null ? (
          <Loader />
        ) : blogs.results && blogs.results.length ? (
          <div>
            {blogs.results.map((blog, i) => {
              return (
                <AnimationWrapper key={i} transition={{ delay: i * 0.04 }}>
                  <ManagePublishBlogCard blog={blog} />
                </AnimationWrapper>
              );
            })}

            <LoadMoreDataBtn state={blogs} fetchDataFun={getBlogs} />
          </div>
        ) : (
          <NOData message="No published blogs" />
        )}

        {drafts === null ? (
          <Loader />
        ) : drafts.results && drafts.results.length ? (
          <div>
            {drafts.results.map((blog, i) => {
              return (
                <AnimationWrapper key={i} transition={{ delay: i * 0.04 }}>
                  <ManageDraftBlogCard blog={blog} index={i + 1} />
                </AnimationWrapper>
              );
            })}
            <LoadMoreDataBtn state={blogs} fetchDataFun={getBlogs} />
          </div>
        ) : (
          <NOData message="No blogs saved in draft" />
        )}
      </InpageNavigation>
    </>
  );
}

export default BlogManagementPage