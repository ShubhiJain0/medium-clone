import { Link, useNavigate, useParams } from "react-router-dom"
import logo from '../imgs/logo.png'
import axios from "axios";
import AnimationWrapper from "../common/page-animation";
import defaultBanner from '../imgs/blogbannerlight.png'

import darkBanner from "../imgs/blogbannerdark.png";
import lightLogo from '../imgs/logo-light.png'
import darkLogo from "../imgs/logo-dark.png";

import { useContext, useEffect, useState } from "react";
import EditorJs from '@editorjs/editorjs'
  import { Toaster, toast } from "react-hot-toast";
import { EditorContext } from "../pages/editor.pages";
import { tools } from "./tools.component";
import { ThemeContext, userContext } from "../App";
import React from "react";

const BlogEditor = ()=>{
  
  let { blog,
    blog:{title, banner, content , tags , des} , 
    setBlog, textEditor , 
    setTextEditor, setEditorState
  } = useContext(EditorContext);

  let { blog_id } = useParams();
  
  let { userAuth :{access_token}} = useContext(userContext)

 
let [theme, setTheme] = useContext(ThemeContext);
  

  let navigate = useNavigate();
  
  useEffect(()=>{
    if(!textEditor.isReady){
      setTextEditor(
        new EditorJs({
          holderId: "textEditor",
          data: Array.isArray(content) ? content[0] : content,
          tools: tools,
          placeholder: "Let's write an awesome story...!",
        })
      )
    }
    
  }, [])
  

  const [defaultBannerimg, setDefaultBannerimg] = useState(theme==="light"? defaultBanner : darkBanner);
  
  const handleBannerUpload =async (e)=>{
    
    let loadingToast = toast.loading("uploading...")

    let img = e.target.files[0]

    const formData = new FormData();
    formData.append("banner", img);

     try {
    const response = await axios.post(
      import.meta.env.VITE_SERVER_DOMAIN + "/upload-banner",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // Handle the response
    if (response.status === 200) {
      
      //console.log('Uploaded successfully:', response.data.bannerUrl);
      
      toast.dismiss(loadingToast);
      
      setDefaultBannerimg(response.data.bannerUrl);
      
      toast.success("Uploaded👍");
      
      setBlog({ ...blog, banner: response.data.bannerUrl});
      // Update the state with the uploaded banner URL if needed
    } else {
      console.error('Upload failed:', response.data.message);
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    toast.error(error);
  }
    
  }

  const handlePublishEvent = ()=>{
   if(!banner.length){
    return toast.error("upload a blog banner to publish it!")
   } 

   if(!title.length){
    return toast.error("Write blog title to publish it!");
   }

   if(textEditor.isReady){
    textEditor.save().then(data =>{
      if(data.blocks.length){
        setBlog({...blog, content : data})
        setEditorState("publish")
      } else{
        return toast.error("Write something in your blog to publish it")
      }
      
    }).catch((error) =>{
      console.log(error);
      
    }) 
   }
  }
  const handleTitleChange = (e)=>{
   

   let input = e.target;

   input.style.height = 'auto';
   input.style.height = input.scrollHeight + 5 +"px";
    
   setBlog({...blog , title:input.value })
  }
  const handleTitleKeyDown= (e)=>{
    // console.log(e);

    if(e.keyCode ===13){
      e.preventDefault()
    }
  } 

  const handleSaveDraft = (e)=>{
      
    if (e.target.className.includes("disable")) {
      return;
    }

    if (!title.length) {
      return toast.error("write blog title before saving the draft");
    }
    
    
    let loadingToast = toast.loading("Saving Your Draft....");
    e.target.classList.add("disable");

    if(textEditor.isReady){
      textEditor.save().then(content =>{
         let blogObject = {
           title,
           banner,
           des,
           content,
           tags,
           draft: true,
         };
         axios
           .post(
             import.meta.env.VITE_SERVER_DOMAIN + "/create-blog",
             {...blogObject , id: blog_id},
             {
               headers: {
                 Authorization: `Bearer ${access_token}`,
               },
             }
           )
           .then((data) => {
            //console.log(data);
            
             e.target.classList.remove("disable");
             
             toast.dismiss(loadingToast);
             toast.success("Saved👍");
             setTimeout(() => {
               navigate("/dashboard/blogs?tab=draft");
             }, 500);
           })
           .catch(({ response }) => {
             e.target.classList.remove("disable");
             
             toast.dismiss(loadingToast);
             return toast.error(response.data.error);
           });
   
      })
    }
    
  }
  return (
    <>
      <Toaster />
      <nav className="navbar">
        <Link to={"/"} className="flex-none w-10">
          <img src={theme ==="light"? darkLogo : lightLogo} alt="" />
        </Link>
        <p className="max-md:hidden text-black line-clamp-1 w-full">
          {title.length ? title : "New blog"}
        </p>
        <div className="flex gap-4 ml-auto">
          <button className="btn-dark py-2 px-4"
          onClick={handlePublishEvent}
          >Publish</button>

          <button className="btn-light py-2 px-4"
          onClick={handleSaveDraft}
          >Save Draft</button>
        </div>
      </nav>
      <AnimationWrapper>
        <section>
          <div className="mx-auto max-w-[900px] w-full">
            <div className="relative aspect-video bg-white border-4 border-grey hover:opacity-80">
              <label htmlFor="uploadBanner">
                <img src={banner? banner :defaultBannerimg} alt="" className="z-20" />
                <input
                  type="file"
                  src=""
                  alt=""
                  accept=".png, .jpg, .jpeg"
                  id="uploadBanner"
                  hidden
                  onChange={handleBannerUpload}
                />
              </label>
            </div>
            <textarea
            defaultValue={title}
              name=""
              id=""
              placeholder="Blog Title"
              className="text-4xl font-medium w-full h-20 outline-none  resize-none border-b border-b-dark-grey mt-10 leading-tight placeholder:opacity-40 bg-white"
              onKeyDown={handleTitleKeyDown}
              onChange={handleTitleChange}
            ></textarea>
          </div>
        </section>
        <div id="textEditor" className="font-gelasio pl-11"></div>
      </AnimationWrapper>
    </>
  );
}

export default BlogEditor