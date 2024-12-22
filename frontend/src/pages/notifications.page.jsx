import React, { useContext, useEffect, useState } from "react";
import { FaRegComment } from "react-icons/fa";
import { FaReplyAll } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { MdNotificationsActive } from "react-icons/md";
import axios from 'axios';
import NotificationCard from "../components/notification-card.component";
import {userContext} from '../App'
import { filterPaginationData } from "../common/filter-pagination-data";
import Loader from "../components/loader.component";
import AnimationWrapper from "../common/page-animation";
import NOData from "../components/nodata.component";
import LoadMoreDataBtn from "../components/load-more.component";
const NotificationPage = () => {
  const [filter, setFilter] = useState("all");


  const [notificationData , setNotificationData] = useState(null)

 const {userAuth : {access_token, new_notification_available}, userAuth , setUserAuth} = useContext(userContext);
 

  const filters = ["all", "comment", "reply", "like"];

  const filtersIcons = {
    all: <MdNotificationsActive className="inline-block w-8 h-8" />,
    comment: <FaRegComment className="inline-block  w-8 h-8" />,
    reply: <FaReplyAll className="inline-block  w-8 h-8" />,
    like: <CiHeart className="inline-block  w-8 h-8" />,
  };

const fetchNotifications = ({ page , deletedDocCount=0 }) => {
  axios
    .post(
      import.meta.env.VITE_SERVER_DOMAIN + "/user-notifications",
      { filter, page, deletedDocCount },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    )
    .then(async ({ data :{ notifications: data} }) => {
      //console.log("Fetched data:", data);
       if( new_notification_available){
        setUserAuth({...userAuth , new_notification_available: false})
       }
       
      let formatedData = await filterPaginationData({
        state: notificationData,
        data,
        page,
        countRoute: "/all-notification-count",
        data_to_send : { filter},
        user: access_token
      });
      //console.log(formatedData);
      
      setNotificationData(formatedData);
      
    })
    .catch((err) => {
      console.log( err);
    });
};

  useEffect(()=>{
    if(access_token){
      fetchNotifications({page : 1});
  
    }
    }, [access_token , filter]) 
  return (
    <div>
      <h1 className="max-md:hidden">Recent Notifications</h1>
      <div className="my-8 flex gap-6 shrink-1">
        {filters.map((filtername) => (
          <button
            key={filtername}
            onClick={() => {
              setFilter(filtername);
              setNotificationData(null);
            }}
            className={`text-2xl px-4 px-2 rounded-lg max-md:text-xl max-md:px-2 max-md:py-1 ${
              filter === filtername ? "bg-black text-white" : ""
            }`}
          >
            {filtersIcons[filtername]} {filtername}
          </button>
        ))}
      </div>
      <div>
        {notificationData === null ? (
          <Loader />
        ) : (
          <>
            {notificationData.results.length ? (
              notificationData.results.map((notification, i) => {
                return (
                  <AnimationWrapper>
                    <NotificationCard notification={notification} />
                  </AnimationWrapper>
                );
              })
            ) : (
              <NOData message="No data to show" />
            )}
            <LoadMoreDataBtn state={notificationData} fetchDataFun={fetchNotifications} addtionalParams = {{deletedDocCount: notificationData.deletedDocCount}} />
          </>
        )}
      </div>
      <div></div>
    </div>
  );
};

export default NotificationPage; 