import { useContext } from "react";
import AnimationWrapper from "../common/page-animation";
import {Toaster , toast} from 'react-hot-toast'
import { RxCross1 } from "react-icons/rx";
import { EditorContext } from "../pages/editor.pages";
import Tag from "./tags.component";
import axios from "axios";
import { userContext } from "../App";
import { useNavigate} from "react-router-dom";
const PublishFrom = () => {
 let {setEditorState, blog:{banner , title , tags, des, content}, setBlog, blog}= useContext(EditorContext);

 
  
let { userAuth :{access_token}} = useContext(userContext)

let navigate = useNavigate();

  const handleCloseEvent = ()=>{
    setEditorState("editor")
  }

  const handleBlogPublish = (e)=>{
    //console.log("hello");
    
    if(e.target.className.includes("disable")){
      return;
    }  
    
    if(!title.length){
        return toast.error("write blog title before publishing")
      }
      if(!des.length || des.length>200){
        return toast.error("write description under 200 characters before publishing");
      }
     if(!tags.length ||  tags.length > 10){
      
        return toast.error(
          "write tags before publishing. Maximum 10 allowed."
        );
     } 
     let loadingToast = toast.loading("publishing....")
     e.target.classList.add("disable");
      let blogObject = {
        title, banner , des,content,tags, draft:false
      }
     axios.post(
       import.meta.env.VITE_SERVER_DOMAIN + "/create-blog",
       blogObject,
       {
         headers: {
           Authorization: `Bearer ${access_token}`,
         },
       }
     ).then(()=>{
      e.target.classList.remove('disable')
      toast.dismiss(loadingToast);
      toast.success("published👍");
      setTimeout(()=>{
        navigate("/dashboard/blogs")
      },500)
     }).catch(({response})=>{
      e.target.classList.remove("disable");
      toast.dismiss(loadingToast);
      return toast.error(response.data.error)
     })
  }

  const handleBlogTitle = (e)=>{
    let input = e.target;
    setBlog({...blog, title: input.value})
  }
const characterLimit = 200
const handleBlogDes = (e)=>{
  let description = e.target;
  setBlog({...blog, des : description.value})
}

const handleTagsKeyDoownFunction = (e)=>{
  if(e.keyCode ===13 || e.keyCode===188){
    e.preventDefault();
    let tag = e.target.value;
    if(tags.length <10){
      
      
      if(!tags.includes(tag) && tag.length){
        setBlog({ ...blog, tags: [...tags, tag] });
      }
    } else{
      toast.error(`You can a maximum of 10 tags`)
      
    }
    e.target.value="";
  }
}

const handleTitleKeyDown = (e)=>{
  if(e.keyCode ===13){
    e.preventDefault();
  }
}
  return (
    <AnimationWrapper>
      <button>
        <RxCross1
          className="w-10 h-10 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]"
          onClick={handleCloseEvent}
        />
      </button>
      <section className="w-screen min-h-screen grid lg:grid-cols-2 gap-4 py-16">
        <Toaster />

        <div className="max-w-[550px] mx-auto center">
          <p className="text-dark-grey mb-1">Preview</p>
          <div className="w-full aspect-video rounded-lg bg-grey overflow-hidden mt-4">
            <img src={banner} alt="" />
          </div>
          <h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-2">
            {title}
          </h1>
          <p className="font-gelasio line-clamp-2 text-xl leading-7 mt-4">
            {des}
          </p>
        </div>
        <div className="border-grey lg:border-1 lg:pl-8">
          <p className="text-dark-grey mb-2 mt-9">Blog Title</p>
          <input
            type="text"
            placeholder="Blog title"
            defaultValue={title}
            className="input-box pl-4"
            onChange={handleBlogTitle}
          />

          <p className="text-dark-grey mb-2 mt-9">
            Short description about your blog
          </p>
          <textarea
            name=""
            id=""
            maxLength={characterLimit}
            defaultValue={des}
            onChange={handleBlogDes}
            className="h-40 resize-none leading-7 input-box pl-4"
            onKeyDown={handleTitleKeyDown}
          ></textarea>
          <p className="mt-1 text-dark-grey text-sm text-right">
            {characterLimit - des.length} characters left
          </p>
          <p className="text-dark-grey mb-2 mt-9">
            Topics -( Helps in searching and ranking your blog)
          </p>
          <div className="relative input-box pl-2 py-2 pb-4">
            <input
              type="text"
              placeholder="topics/tags"
              className="sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white"
              onKeyDown={handleTagsKeyDoownFunction}
            />
            {tags.map((tag, i) => (
              <Tag tag={tag} tagIndex={i} />
            ))}
            <p className="mt-1 text-dark-grey text-sm text-right">
              {10 - tags.length} tags left
            </p>
          </div>
          <button className="btn-dark px-8 mt-8 mb-8"
          onClick={handleBlogPublish}
          >Publish</button>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default PublishFrom;
