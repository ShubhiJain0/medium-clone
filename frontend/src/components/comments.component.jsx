import React, { useContext } from 'react'
import { BlogContext } from '../pages/blog.page'
import { RxCross1 } from "react-icons/rx";
import CommentField from './comment-field.component';
import axios from 'axios';
import NOData from './nodata.component';
import AnimationWrapper from '../common/page-animation';
import CommentCard from './comment-card.component';

export const fetchComments = async ({
  skip = 0,
  blog_id,
  setParentCommentCountFun,
  comment_array = null,
  parentCommentCountFun,
}) => {
  let res;

  await axios
    .post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog-comments", {
      blog_id,
      skip,
    })
    .then(({ data }) => {
      console.log(data);

      data.map((comment) => {

        comment.childrenLevel = 0;
      })

      setParentCommentCountFun(parentCommentCountFun + data.length);
      
      if (comment_array == null) {
        res = { results: data };
        //console.log(res);
      } else {
        res = { results: [...comment_array, ...data] };
        
      }
    });
    
    return res;
};

const CommentsContainer = () => {
let {blog,
  blog: {
    _id,
    title = "",
    comments: { results: commentsArr = [] } = {}, activity:{total_parent_comments}// Fallback values for safety
  },
  commentWrapper,
  setCommentWrapper,
  totalParentCommentsLoaded,
  setTotalParentCommentsLoaded, setBlog
} = useContext(BlogContext);

//console.log(blog);
const handleLoadMoreComments=async ()=>{
  let newCommentsArr = await fetchComments({
    skip: totalParentCommentsLoaded,
    blog_id: _id,
    setParentCommentCountFun: setTotalParentCommentsLoaded,
    comment_array: commentsArr,
  });
  setBlog({...blog , comments: newCommentsArr})
}


  return (
    <div
      className={
        " max-sm:w-full fixed " +
        (commentWrapper ? "top-0 sm:right-0" : "top-[100%] sm:right-[-100%]") +
        " duration-700 max-sm:right-0 sm:top-0 w-[30%] min-w-[350px] h-full z-50 bg-white shadow-2xl p-8 px-16 overflow-y-auto overflow-x-hidden "
      }
    >
      <div className="relative">
        <h1 className="text-xl font-medium">Comments</h1>
        <p className="text-lg mt-2 w-[70%] text-dark-grey">{title}</p>
        <button
          className="bg-grey rounded-full "
          onClick={() => {
            setCommentWrapper(!commentWrapper);
          }}
        >
          <RxCross1 className="right-0 max-sm:block absolute right-3 w-8 h-8 bg-grey rounded-full top-3" />
        </button>
        <hr className="border-grey my-8 w-[120%] -ml-10" />

        <CommentField action = {"Comment"}/>
        {
          commentsArr && commentsArr.length ? (
            commentsArr.map((comment, i)=>{
              
              return (
                <AnimationWrapper>
                  <CommentCard commentData={comment} 
                    index = {i}
                    leftVal={comment.childrenLevel*4}
                    />
                </AnimationWrapper>
              );
            })
          ) : <NOData />
        }
        {
          total_parent_comments > totalParentCommentsLoaded? <button className='btn-dark  p-2 px-3' 
          onClick={handleLoadMoreComments}
          >Load more</button>: null
        }
      </div>
    </div>
  );
}

export default CommentsContainer