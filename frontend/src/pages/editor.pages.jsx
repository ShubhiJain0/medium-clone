import { createContext, useContext, useEffect, useState } from "react";
import { userContext } from "../App";
import { Navigate, useParams } from "react-router-dom";
import PublishFrom from "../components/publish-form.component";
import BlogEditor from "../components/blog-editor.component";
import Loader from "../components/loader.component";
import axios from "axios";
const blogStructure = {
  title : '',
  banner : '',
  content : [],
  tags : [],
  des : '',
  author : {personal_info : {}}
}


export const EditorContext = createContext({});

const Editor = () =>{

  let {blog_id} = useParams();

 const [loading , setLoading] = useState(true);

 useEffect(()=>{
  if(!blog_id){
   return setLoading(false);
   
  }
  axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog", {blog_id , draft: true , mode:'edit'})
  .then(({data : {blog}})=>{
      setBlog(blog)
      setLoading(false)
  })
  .catch(err=>{
    setLoading(false)
    setBlog(null)
    console.log(err);
    
  })
 })
  
  const [textEditor, setTextEditor] = useState({ isReady: false });

  const [blog , setBlog] = useState(blogStructure)

  const [editorState , setEditorState] = useState("editor");

 let{ userAuth : {access_token}} =useContext(userContext);
 
 return (
    <EditorContext.Provider value={{blog , setBlog , editorState , setEditorState, textEditor , setTextEditor}}>
      {access_token === null ? (
        <Navigate to={"/signin"} />
      ) : loading? <Loader /> 
      : editorState == "editor" ? (
        <BlogEditor />
      ) : (
        <PublishFrom />
      )}
    </EditorContext.Provider>
  );
}

export default Editor;