import React, { useContext, useState } from 'react'
import { getDay } from '../common/date';
import { MdDeleteOutline } from "react-icons/md";
import CommentField from './comment-field.component';
import { userContext } from "../App";
import toast from 'react-hot-toast';
import { BlogContext } from '../pages/blog.page';
import axios from 'axios';

const CommentCard = ({commentData , index , leftVal }) => {
  
  let {_id , commented_by : {personal_info : {profile_img , fullname , username: commented_by_username}} , commentedAt, comment, children} = commentData;

  let {
    blog: {
      comments,
      activity,
      activity: { total_parent_comments },
      comments: { results: commentsArr },
      author: {
        personal_info: { username: author_username },
      },
    },
    blog,
    setBlog,
    setTotalParentCommentsLoaded,
    totalParentCommentsLoaded,
  } = useContext(BlogContext);

  console.log(author_username);
  

  let {
    userAuth: { access_token , username},
  } = useContext(userContext);

 const [isReply , setIsReply]= useState(false);

  const handleReplyClick = ()=>{
      if(!access_token){
       return toast.error("Login first to leave a reply.")
      }  
      setIsReply(!isReply);

  }

  const getParentIndex = ()=>{
      let startingPoint = index -1;
      
      try {
        while(commentsArr[startingPoint].childrenLevel >=commentData.childrenLevel){

            startingPoint--;
        
          }
      } catch (error) {
        //console.log(error);
        startingPoint = undefined;
        
      }
      return startingPoint;
  }

  const  removeCommentsCards = (startingPoint , isDelete = false)=>{
    if(commentsArr[startingPoint]){
      while( commentsArr[startingPoint].childrenLevel > commentData.childrenLevel){
        commentsArr.splice(startingPoint , 1)
        if(!commentsArr[startingPoint]){
          break;
        }
      }
    }
    
        if (isDelete) {
          let parentIndex = getParentIndex();
          if(parentIndex !== undefined){
            commentsArr[parentIndex].children =
              commentsArr[parentIndex].children.filter(child !== _id) 

              if(!commentsArr[parentIndex].children.length){
                commentsArr[parentIndex].isReplyLoaded = false;
              }
          }
          commentsArr.splice(index , 1);
        }
        if(commentData.childrenLevel ===0 && isDelete){
          setTotalParentCommentsLoaded(totalParentCommentsLoaded -1);
        }
    setBlog({
      ...blog,
      comments: { results: commentsArr },
      activity: {
        ...activity,
        total_parent_comments: total_parent_comments-(
          commentData.childrenLevel === 0 && isDelete ? 1 : 0
        ),
      },
    });

  }


  const handleShowReplies = ({skip = 0})=>{

    if(children.length){
      handleHideReplies();
      axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-replies" , {
        _id , skip 
      })
      .then(({data: { replies}})=>{
        commentData.isReplyLoaded = true;
        for( let i =0; i < replies.length ; i++){
          replies[i].childrenLevel = commentData.childrenLevel + 1;

          commentsArr.splice(index + 1 + i + skip, 0 , replies[i] )
        }
        setBlog({ ...blog, comments :{
          ...comments, results: commentsArr
        }});
      }).catch(err=>{
        console.log(err);
        
      })

    }
  }
  
  const handleHideReplies = ()=>{
    commentData.isReplyLoaded = false;
    removeCommentsCards(index +1)
  }

  const handleDeleteComment = (e)=>{
    e.target.setAttribute("disabled", true);
    axios
      .post(
        import.meta.env.VITE_SERVER_DOMAIN + "/delete-comment",
        {
          _id,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then(() => {
        e.target.removeAttribute("disable");
        removeCommentsCards(index + 1, true);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return (
    <div className="w-full" style={{ paddingLeft: `${leftVal * 10 + 5}px` }}>
      <div className="my-5 p-6 rounded-md border border-grey">
        <div className="flex gap-3 items-center mb-8 ">
          <img src={profile_img} alt="" className="w-8 h-8 rounded-full" />
          <p className="line-clamp-1">
            {fullname}@{commented_by_username}
          </p>
          <p className="min-w-fit">{getDay(commentedAt)}</p>
        </div>
        <p className="font-gelasio text-xl ml-3">{comment}</p>
        <div className="flex gap-5 items-center mt-5">
          {commentData.isReplyLoaded ? (
            <button
              className="underline text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"
              onClick={handleHideReplies}
            >
              hide replies
            </button>
          ) : (
            <button
              className="underline text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"
              onClick={handleShowReplies}
            >
              show {children.length} replies
            </button>
          )}
          <button className="underline " onClick={handleReplyClick}>
            Reply
          </button>
          {username === commented_by_username ||
          username === author_username ? (
            <button className='p-2 px-3 rounded-md border-grey ml-auto hover:bg-red flex items-center hover:text-white'
            onClick={handleDeleteComment}
            >
              <MdDeleteOutline className='w-6 h-6 pointer-events-none'/>
            </button>
          ) : null}
        </div>
        {isReply && (
          <div className="mt-8">
            <CommentField
              action="reply"
              index={index}
              replyingTo={_id}
              setIsReply={setIsReply}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default CommentCard