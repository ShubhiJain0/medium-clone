import React, { useContext, useState } from "react";
import { userContext } from "../App";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { BlogContext } from "../pages/blog.page";

const CommentField = ({
  action = "comment",
  index = undefined,
  replyingTo = undefined,
  setIsReply,
}) => {
  // Destructure from BlogContext safely
  const {
    blog: { _id, author: { _id: blog_author } = {} } = {},
    blog = {},
    setBlog,
    comments = {},
    activity = {},
    activity: { total_comments = 0, total_parent_comments = 0 } = {},
    setTotalParentCommentsLoaded,
    totalParentCommentsLoaded,
  } = useContext(BlogContext);
  //console.log(blog);

  let commentsArr = blog.comments.results || [];

  //console.log(commentsArr);
  const [comment, setComment] = useState("");

  //console.log(replyingTo);
  
  
  // Destructure userAuth from userContext
  const {
    userAuth: { access_token, username, fullname, profile_img },
  } = useContext(userContext);

  const handleComment = async () => {
    // Validation
    if (!access_token) return toast.error("Login first to leave a comment.");
    if (!comment.trim())
      return toast.error("Write something to leave a comment...");

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_DOMAIN}/add-comment`,
        { _id, blog_author, comment, replying_to: replyingTo },
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );
     console.log(data);
      data.commented_by = {
        personal_info: { username, profile_img, fullname },
      };
      data.childrenLevel = 0;
      let newCommentArr;

      if (replyingTo) {
        commentsArr[index].children.push(data._id);
        data.childrenLevel = commentsArr[index].childrenLevel + 1;
        data.parentIndex = index;

        commentsArr[index].isReplyLoaded = true;
        commentsArr.splice(index + 1, 0, data);
        newCommentArr = commentsArr;
        
      setComment("");
        setIsReply(false);
      } else {
        data.childrenLevel = 0;

        newCommentArr = [data, ...commentsArr];
       
      }

      let parentCommentIncrementVal = replyingTo ? 0 : 1;

      setBlog({
        ...blog,
        comments: { comments, results: newCommentArr },
        activity: {
          ...activity,
          total_comments: total_comments + 1,
          total_parent_comments:
            total_parent_comments + parentCommentIncrementVal,
        },
      });

      setTotalParentCommentsLoaded(
        totalParentCommentsLoaded + parentCommentIncrementVal
      );

      // Clear the input
       setComment("");
      toast.success("Comment added successfully!");

      // Prepare new comment
    } catch (err) {
      console.error(err);
      toast.error("Failed to add comment. Please try again.");
    }
  };

  return (
    <>
      <Toaster />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Leave a comment"
        className="input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto"
      ></textarea>
      <button className="btn-dark mt-5 px-10" onClick={handleComment}>
        {action}
      </button>
    </>
  );
};

export default CommentField;
