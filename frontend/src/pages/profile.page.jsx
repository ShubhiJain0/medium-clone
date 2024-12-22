import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import AnimationWrapper from '../common/page-animation';
import Loader from '../components/loader.component';
import { Link } from 'react-router-dom';
import {userContext} from '../App'
import AboutUser from '../components/about.component';
import { filterPaginationData } from '../common/filter-pagination-data';
import InpageNavigation from '../components/inpage-navigation.component';

import NOData from '../components/nodata.component';

import LoadMoreDataBtn from '../components/load-more.component';

import BlogPost from '../components/blog-post.component';
import FourOFour from './404.page';

export const profileDataStructure =  {
    personal_info : {
      fullname : "",
      username : "",
      profile_img : "",
      bio:""
    },
    account_info :{
      total_posts : 0,
      total_blogs : 0
    },
    social_links : {},
    joinedAt: " "
};

const ProfilePage = () => {
  
  const {id: profileId} =useParams();  

  let { userAuth : {username}} = useContext(userContext)

  let [ profile , setProfile] = useState(profileDataStructure);

  let [loading , setLoading] = useState( true );

  let [blogs , setBlogs] = useState(null)

  let [ profileLoaded , setProfileLoaded] = useState("");

  const fetchUserProfile = () =>{
    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-profile" , {username : profileId})
    .then(({data : user})=>{
      if(user!== null ){
        setProfile(user);
      
      }
      setProfileLoaded(profileId)
      getBlogs({user_id: user._id})
      setLoading(false)
    })
    .catch(err =>{
      console.log(err);
      setLoading(false);
    })
  }

  const reseetState = ()=>{
    setProfile(profileDataStructure);
    setProfileLoaded("")
    setLoading(true)
  }

  useEffect(()=>{
    if(profileId !== profileLoaded){
    setBlogs(null)  
    }
    if(blogs === null){
      reseetState();
      fetchUserProfile();
  
    }
    }, [profileId , blogs ])

  let {personal_info : {fullname , username: profile_username , profile_img , bio }, account_info: {total_posts , total_reads}, social_links , joinedAt} = profile;

  const getBlogs = ({page = 1 , user_id })=>{
    user_id = user_id ===undefined ? blogs.user_id : user_id;
    axios.post(import.meta.env.VITE_SERVER_DOMAIN+'/search-blogs', {
      author : user_id,
      page 
    }).then(async({data})=>{
      
      
      let formatedData = await filterPaginationData({
        state : blogs,
        data :data.blogs,
        page,
        countRoute :'/search-blogs-count',
        data_to_send : {author: user_id}
      })
      formatedData.user_id = user_id;
      setBlogs(formatedData);
    })
  }


return (
  <AnimationWrapper>
    {loading ? (
      <Loader></Loader>
    ) : profile_username.length? (
      <section className=" h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]: gap-12">
        <div className="flex flex-col max-md: items-center min-w-[250px] md:w-[50%] md:pl-8 md:border-l border-grey md:sticky md:top-[100px] md:py-10 shadow-lg">
          <img
            src={profile_img}
            alt=""
            className="w-48 h-48 bg-grey rounded-full md:w-32 md:h-32 "
          />

          <h1 className="text-2xl font-medium">@{profile_username}</h1>
          <p className="text-xl capitalize h-6">{fullname}</p>

          <p>
            {total_posts.toLocaleString()} Blogs -{" "}
            {total_reads.toLocaleString()}
            Reads
          </p>

          <div className="flex gap-4 mt-2">
            {profileId === username ? (
              <Link
                to="/settings/edit-profile"
                className="btn-light rounded-md"
              >
                Profile settings
              </Link>
            ) : null}
          </div>
          <AboutUser
            bio={bio}
            social_links={social_links}
            joinedAt={joinedAt}
            className="max-md:hidden"
          />
        </div>

        <div className="max-md:mt-12 w-full">
          <InpageNavigation
            routes={["Blogs published", "About"]}
            defaultHidden={["About"]}
          >
            <>
              {blogs === null ? (
                <Loader></Loader>
              ) : blogs?.results?.length ? (
               
                <div>
                  {blogs.results.map((blog, i) => (
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
                state={blogs}
                fetchDataFun={getBlogs}
              />
            </>

            
              <AboutUser
                bio={bio}
                social_links={social_links}
                joinedAt={joinedAt}
                className=""
              />
            
          </InpageNavigation>
        </div>
      </section>
    ) : <FourOFour/>}
  </AnimationWrapper>
);
}

export default ProfilePage