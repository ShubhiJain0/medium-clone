import React from 'react'
import { getDay, getTime } from '../common/date';
import { Link } from 'react-router-dom';
  const NotificationCard = ({notification}) => {
   // console.log(notification);
  
    
    let {
      type,
      seen,
      createdAt,
      blog: { title, blog_id },
      replied_on_comment={},
      user: {
        personal_info: { username, profile_img },
      },
    } = notification;

  

    let newComment = "";

    if (type === "comment" || type === "reply") {
      let {
        comment: { comment },
      } = notification;
      newComment = comment.substring(0, 15);
    }

    let newTitle = title.substring(0, 30);

    return (
      <>
        <div
          className={
            "my-6 bg-grey rounded-xl w-full min-h-[70px] px-4 flex items-center py-4" +
            (!seen ? "border-black border-l-[2px] border-b-[2px]" : "")
          }
        >
          {type === "like" && (
            <div>
              <h1 className="text-xl font-gelasio">
                <img
                  src={profile_img}
                  alt=""
                  className="w-10 h-10 rounded-full inline-block"
                />
                <Link
                  to={`/user/${username}`}
                  className="text-xl font-bold mx-2 "
                >
                  @{username}
                </Link>{" "}
                <span className="underline text-xl underline-offset-2">
                  liked
                </span>{" "}
                <span className="max-md:text-xl font-gelasio my-2 text-2xl ">
                  on your blog on{" "}
                  <Link
                    to={`/blog/${blog_id}`}
                    className="max-md:text-xl text-2xl font-semibold"
                  >
                    {newTitle}...click here
                  </Link>
                </span>
              </h1>
              <h1>
                on{" "}
                <span className="font-bold text-xl">{getDay(createdAt)}</span>{" "}
                at{" "}
                <span className="font-bold text-xl">{getTime(createdAt)}</span>
              </h1>
            </div>
          )}
          {type === "comment" && (
            <div>
              <div className="text-xl font-gelasio">
                <img
                  src={profile_img}
                  alt=""
                  className="w-10 h-10 rounded-full inline-block"
                />
                <Link
                  to={`/user/${username}`}
                  className="text-xl font-bold mx-2 "
                >
                  @{username}
                </Link>{" "}
                <span className="underline text-xl underline-offset-2">
                  commented
                </span>{" "}
                :
                <p className="inline-block text-2xl font-serif">
                  " {newComment}
                  {newComment.length > 15 ? "..." : null} "
                </p>
              </div>
              <h1 className="max-md:text-xl font-gelasio my-2 text-2xl ">
                on your blog on{" "}
                <Link
                  to={`/blog/${blog_id}`}
                  className="max-md:text-xl text-2xl font-semibold"
                >
                  {newTitle}...click here
                </Link>
              </h1>

              <h1>
                on{" "}
                <span className="font-bold text-xl">{getDay(createdAt)}</span>{" "}
                at{" "}
                <span className="font-bold text-xl">{getTime(createdAt)}</span>
              </h1>
              <div>
                <h1 className="text-dark-grey font-xl"></h1>
              </div>
            </div>
          )}
          {type === "reply" && (
            <div>
              <h1 className="text-xl font-gelasio">
                <img
                  src={profile_img}
                  alt=""
                  className="w-10 h-10 rounded-full inline-block"
                />
                <span className="max-md:text-xl text-2xl font-semibold">
                  @{username}
                </span>{" "}
                <span className="underline text-xl underline-offset-2">
                  replied
                </span>{" "}
                :
                <p className="inline-block text-2xl font-serif">
                  " {newComment}
                  {newComment.length > 15 ? "..." : null} "
                </p>
                <span className="max-md:text-xl font-gelasio my-2 text-2xl ">
                  to your comment on the blog on{" "}
                  <Link
                    to={`/blog/${blog_id}`}
                    className="max-md:text-xl text-2xl font-semibold"
                  >
                    {newTitle}...click here
                  </Link>
                </span>
                <div className="px-4 py-2 my-2 bg-white rounded-2xl w-[70%]">
                  <p className="">{replied_on_comment.comment}</p>
                </div>
              </h1>
              <h1>
                on{" "}
                <span className="font-bold text-xl">{getDay(createdAt)}</span>{" "}
                at{" "}
                <span className="font-bold text-xl">{getTime(createdAt)}</span>
              </h1>
            </div>
          )}
        </div>
      </>
    );
  }

export default NotificationCard