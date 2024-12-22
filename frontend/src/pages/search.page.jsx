import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import InpageNavigation from '../components/inpage-navigation.component'
import Loader from '../components/loader.component'
import BlogPost from '../components/blog-post.component'

import AnimationWrapper from '../common/page-animation'

import NOData from '../components/nodata.component'

import LoadMoreDataBtn from '../components/load-more.component'

import { filterPaginationData } from '../common/filter-pagination-data'

import axios from 'axios'

import UserCard from '../components/usercard.component'

import { FaUserAlt } from "react-icons/fa";

const SearchPage = () => {

 const [latestBlogs , setLatestBlogs] = useState(null);

 
 const [users, setUsers] = useState(null);
  
 let { query } = useParams()

 const searchBlogs = ({page =1 , create_new_arr = false}) =>{

  axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/search-blogs', {query , page})
  .then( async ({data}) =>{

    let formatData = await filterPaginationData({
      state : latestBlogs,
      data : data.blogs,
      page ,
      countRoute : "/search-blogs-count",
      data_to_send : {query},
      create_new_arr
    })
    setLatestBlogs(formatData)
  })
 }

 const fetchUsers = ()=>{
  axios.post(import.meta.env.VITE_SERVER_DOMAIN +"/search-users" , {query})
  .then(({data :{users}}) =>{
    setUsers(users);
  })
 }
 useEffect(()=>{
    resetState();
    searchBlogs({page : 1 , create_new_arr : true});
    fetchUsers();
  } , [query])

  const resetState = ()=>{
    setLatestBlogs(null);
    setUsers(null)
  }

  const UserCardWrapper = () =>{
    
    
    return (
      <>
      {
        users === null ? <Loader/> : users.length? 
        users.map((user , i)=>(
          <AnimationWrapper key={i}
          transition={{duration : 1 , delay : i*0.8}}
          >
            <UserCard user = {user}/>
          </AnimationWrapper>
        )) : <NOData message={"No user found"}/> 
      }
      </>
    )
  }
 
  return (
    <section className="h-cover flex justify-center gap-10">
      <div className="w-full ">
        <InpageNavigation
          routes={[`Search results for "${query}"`, "Accounts Matched"]}
          defaultHidden={["Accounts Matched"]}
        >
          <>
            {
              <>
                {latestBlogs === null ? (
                  <Loader></Loader>
                ) : latestBlogs?.results?.length ? (
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
                ) : (
                  <NOData message={"No blogs published yet."} />
                )}
                <LoadMoreDataBtn
                  state={latestBlogs}
                  fetchDataFun={searchBlogs}
                />
              </>
            }
          </>

          <>
            <UserCardWrapper />
          </>
        </InpageNavigation>
      </div>
      <div className="min-w-[40%] lg:min-w-[350px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
        <h1 className="font-medium text-2xl mb-8 border-b ">
          Users releated to search{" "}
          <FaUserAlt className="inline-block w-8 h-8 mb-2 ml-2" />
        </h1>
        <UserCardWrapper />
      </div>
    </section>
  );

}

export default SearchPage