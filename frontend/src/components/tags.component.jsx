import React, { useContext } from 'react'
import { RxCross2 } from "react-icons/rx";
import { EditorContext } from '../pages/editor.pages';
const Tag = ({tag, tagIndex}) => {
let {blog: {tags} , setBlog , blog} = useContext(EditorContext);

const addEditable = (e)=>{
  e.target.setAttribute("contentEditable" , true);
  e.target.focus();
}
 
  const handleTagClose = ()=>{
      tags = tags.filter((t)=>{ t!==tag })
     setBlog({...blog , tags}) 
 }

 const handleTagEdit = (e)=>{
  if(e.keyCode ===13 || e.keyCode ===188){
    e.preventDefault();
    let currentTag = e.target.innerText;
    tags[tagIndex] = currentTag;
    setBlog({...blog , tags});
    e.target.setAttribute("contentEditable" , false)
  }
 }
  return (
    <div className="relative p-2 mt-2 mr-2 px-5 bg-white rounded-full inline-block hover:bg-opacity-50 pr-10 outline-none font-bold">
      <p onClick={addEditable} onKeyDown={handleTagEdit}>
        {tag}
      </p>
      <button
        className="mt-[2px] rounded-full absolute right-3 top-1/2 -translate-y-1/2 "
        onClick={handleTagClose}
      >
        <RxCross2 className="text-lg pointer-events-none mb-[3px] w-5 h-7" />
      </button>
    </div>
  );
}

export default Tag