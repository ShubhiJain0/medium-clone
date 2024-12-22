import React from 'react'

const List = ({style , items})=>{
  return (
    <ol className={`pl-5 ${style ==='ordered'? "list-decimal": "list-disc"}`}>
      {
        items.map((listItem , i)=>{
          return <li key={i} className='my-4' dangerouslySetInnerHTML={{__html : listItem}}></li>
        })
      }
    </ol>
  )
}
const Quote = ({caption , quote}) =>{
  return (
    <div className='bg-purple/10 p-3 pl-5 border-purple'>
      <p className='text-xl'>{quote}</p>
      {
        caption.length ? <p className='text-xl w-full text-purple text-base leading-10 md:text-2xl'>{caption}</p>: ""
      }
    </div>
  );
}

const Img = ({url , caption})=>{
  return (
    <div>
      <img src={url} alt="" />
      {
        caption.length ? <p className='w-full text-center my-3 md:mb-12 text-base text-dark-grey'>{caption}</p> : ""
      }
    </div>
  )
}


const BlogContent = ({block}) => {
  
  let {type , data } = block;

  if(type ==="paragraph"){
    return <p dangerouslySetInnerHTML={{__html : data.text}}></p>
  } 
  if(type ==="header"){
    
    if(data.level ===3){
      return (
        <h3
          className="text-3xl font-bold"
          dangerouslySetInnerHTML={{ __html: data.text }}
        ></h3>
      )
    }
      return <h3
         className="text-4xl font-bold"
         dangerouslySetInnerHTML={{ __html: data.text }}
       ></h3>} 
       if(type ==="image"){
    return <Img url={data.file.url} caption={data.caption}></Img>
  } 
  if(type ==="quote"){
    return <Quote quote={data.text} caption = {data.caption}></Quote>
  } if(type ==="list"){
    return <List style = {data.style} items={data.items}></List>
  }
  else{
    return (
      <h3
        dangerouslySetInnerHTML={{ __html: data.text }}
      ></h3>
    );
  }
}

export default BlogContent