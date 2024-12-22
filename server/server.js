import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import "dotenv/config";
import jwt from "jsonwebtoken";
import cors from "cors";

import { nanoid } from "nanoid";
import User from "./Schema/User.js";
import admin from "firebase-admin";
import serviceAccountKey from "./medium-clone-ddd23-firebase-adminsdk-ug4ra-3798d0dee2.json" with {type : "json"};
import Blog from './Schema/Blog.js'

import upload from './upload.js'

import { getAuth } from "firebase-admin/auth";

import Notification from './Schema/Notification.js'

import Comment from './Schema/Comment.js'

mongoose.connect(process.env.DB_LOCATION, {
  autoIndex: true,
});


const server = express();

let PORT = process.env.PORT || 3000;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

server.use(express.json());

server.use(cors());

const verifyJWT = (req,res, next)=>{
  const authHeader = req.headers['authorization']

  const token = authHeader && authHeader.split(" ")[1];

  if(token ===null){
    return res.status(401).json({"error": "No access token"})
  }
  jwt.verify(token , process.env.SECRET_ACCESS_KEY, (err, user)=>{
    if(err){
      return res.status(403).json({"error": "Access token is invalid"})
    }
    req.user= user.id;
    next();
  })
}

server.post("/get-profile", (req, res) =>{

  let {username} = req.body;

  User.findOne({ "personal_info.username" : username})
  .select("-personal_info.password -google_auth -updatedAt -blogs ")
  .then(user =>{
    return res.status(200).json(user)
  })
  .catch(err=>{
    return res.status(500).json({error : err.message})
  })

})

server.post("/latest-blogs", (req, res)=>{
  let {page} = req.body;
  
  let maxLimit =5;

  Blog.find({ draft: false })
  .populate("author" , "personal_info.profile_img personal_info.username personal_info.fullname -_id").sort({"publishedAt": -1})
  .select("blog_id title des banner activity tags publishedAt -_id")
  .skip((page - 1)*maxLimit)
  .limit(maxLimit)
  .then(blogs =>{
    return res.status(200).json({blogs})
  })
  .catch(err=>{
    return res.status(500).json({error: err.message})
  })
}
)

server.post("/all-latest-blogs-count" , (req, res) =>{
  Blog.countDocuments({draft : false})
  .then(count =>{
    return res.status(200).json({totalDocs: count})
  }) .catch(err =>{
    console.log(err.message);
    return res.status(500).json({error : err.message})
    
  })
})

server.post("/search-users" , (req, res) =>{
  let { query } = req.body;

  User.find({"personal_info.username": new RegExp(query , 'i')}).limit(50)
  .select("personal_info.fullname personal_info.username personal_info.profile_img").then(users => {
    return res.status(200).json({users})
  })
  .catch(err =>{
    return res.status(500).json({error : err.message})
  })
})

server.post("/get-blog", (req, res)=>{
  let { blog_id, draft , mode } = req.body;
let incrementVal = mode !=='edit' ? 1 :0;

  Blog.findOneAndUpdate({blog_id} , {$inc:{"activity.total_reads": incrementVal}})
  .populate("author" , "personal_info.fullname personal_info.username personal_info.profile_img")
  .select("title des content banner activity publishedAt blog_id tags")
  .then(blog =>{
    User.findOneAndUpdate({"personal_info.username" : blog.author.personal_info.username}, {$inc: { "account_info.total_reads": incrementVal}})
    .catch(err =>{
      return res.status(500).json({error : err.message})
    })
    if(blog.draft && !draft){
      return res.status(500).json({error : "you can not access draft blogs."})
    }

    return res.status(200).json({blog})
  })
  .catch(err=>{
    return res.status(500).json({error : err.message})
  })
})


server.post('/search-blogs', (req,res)=>{
  let { tag , query, author, page , limit , eliminate_blog} = req.body;

  let findQuery ;

  
 
  if(tag){
    //console.log(tag);
    
  findQuery = {tags: tag, draft :false , blog_id: {$ne: eliminate_blog}};
  } 
  
  else if(query){  
    findQuery = {draft : false , title: new RegExp(query , 'i')}
  } 
  else if(author){
      
    findQuery = {author , draft : false}
  }
  
  let maxLimit = limit? limit : 5 ;

  Blog.find(findQuery)
  .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id").sort({"publishedAt": -1})
  .select("blog_id title des banner activity tags publishedAt -_id")
  .skip((page -1)*maxLimit)
  .limit(maxLimit).then(blogs =>{
    
    
    return res.status(200).json({blogs})
    }).catch(err=>{return res.status(500).json({error : err.message})})
  
})

server.post("/search-blogs-count" , (req, res)=>{
  let {tag , query , author } = req.body;

  let findQuery 
  if(tag){
    findQuery = {tags : tag , draft : false}
  } 
  
  else if(query) {
    findQuery = {draft : false , title : new RegExp(query , 'i')}
  } 
  
  else if(author){
    findQuery = {author , draft : false}}

Blog.countDocuments(findQuery)
  .then(count=>{
    return res.status(200).json({totalDocs : count})
  })
  .catch(err =>{
    console.log(err);
    return res.status(500).json({error : err.message})
    
  })
  
})


server.get("/trending-blogs", (req, res)=>{
  Blog.find({draft: false}).populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id").sort({"activity.total_reads": -1, "activity.total_likes": -1,"publishedAt": -1 })
  .select("blog_id title publishedAt -_id").limit(5).then((blogs)=>{
    return res.status(200).json({blogs})
  }).catch((err)=>{
    return res.status(500).json({error: err.message})
  })
})

server.post("/create-blog" , verifyJWT, (req,res)=>{
  let authorId = req.user;
  
  let {title , banner , content , tags, des, draft , id} = req.body;
  
  if(!title.length){
    return res.status(403).json({"error": "you must provide a title to publish the blog."})
  }
  if(!draft){
    if(!des.length || des.length > 200){
    return res.status(403).json({"error": "you must provide a blog description under 200 characters."})
  }
  if(!banner.length){
    return res.status(403).json({"error": "you must provide a blog banner to publish."})
  }
  if(!content.blocks || !content.blocks.length){
    return res.status(403).json({"error": "there must be some block content to publish."})
  }

  if(!tags.length || tags.length>10){
    return res.status(403).json({"error" : "provide tags in order to publish the blog. Maximum 10 allowed."})
  }
  }
  
  tags = tags.map(tag=>tag.toLowerCase());

  let blog_id = id || title.replace(/[^a-zA-Z0-9]/g, ' ').replace(/\s+/g, "-").trim()+nanoid();

  if(id){

    Blog.findOneAndUpdate({blog_id} , {title , des , banner , content, tags , draft : draft? draft : false  })
    .then(() =>{
      return res.status(200).json({id : blog_id})
    })
    .catch(err=>{
      console.log(err)
      
     return res.status(500).json({error: err.message})
    })

  } else{

  let blog = new Blog({
    title, des, banner,content ,tags,author:authorId , blog_id, draft:Boolean(draft) 
  })
blog.save().then(blog =>{
  let incrementVal = draft? 0 : 1;
  User.findOneAndUpdate({_id: authorId} , {$inc : {"account_info.total_posts" : incrementVal} , $push : {"blogs" : blog._id}}).then(user=>{
    return res.status(200).json({id: blog.blog_id})
  }).catch(err=>{
    return res.status(500).json({"error":"failed to update total posts number"})
  })
}) .catch(err=>{return res.status(500).json({"error": err.message})})
  }

})

server.post('/upload-banner', upload.single('banner'), (req, res) => {
  try {
    // The uploaded image URL will be available in req.file.path
    res.status(200).json({
      message: 'Banner uploaded successfully!',
      bannerUrl: req.file.path,
    });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed', error });
  }
});

const generateUserName = async (email) => {
  let username = email.split("@")[0];

  let isusernameNotUnique = await User.exists({
    "personal_info.username": username,
  }).then((result) => result);

  isusernameNotUnique ? (username += nanoid().substring(0, 5)) : "";

  return username;
};

const formatDataToSend = (user) => {
  const access_token = jwt.sign(
    { id: user._id },
    process.env.SECRET_ACCESS_KEY
  );

  const { profile_img, username, fullname } = user.personal_info;

  return {
    access_token,
    profile_img,
    username,
    fullname,
  };
};

server.post("/signup", (req, res) => {
  let { fullname, email, password } = req.body;

  //validating the data
  if (fullname.length < 3) {
    return res
      .status(403)
      .json({ error: "Fullname must be atleast 3 letters long" });
  }
  if (!email.length) {
    return res.status(403).json({ error: "enter email" });
  }
  if (!emailRegex.test(email)) {
    return res.status(403).json({ error: "email is invalid" });
  }
  if (!passwordRegex.test(password)) {
    return res
      .status(403)
      .json({
        "error ":
          "password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letter",
      });
  }

  bcrypt.hash(password, 10, async (err, hashpassword) => {
    let username = await generateUserName(email);

    let user = new User({
      personal_info: {
        fullname,
        email,
        password: hashpassword,
        username,
      },
    });
    user
      .save()
      .then((u) => {
        return res.status(200).json(formatDataToSend(u));
      })
      .catch((err) => {
        if (err === 11000) {
          return res.status(500).json({ error: "email already exists." });
        }
        return res.status(500).json({ error: err.message });
      });
  });
});

server.post("/signin", (req, res) => {
  let { email, password } = req.body;

  User.findOne({ "personal_info.email": email })
    .then((user) => {
      if (!user) {
        return res.status(403).json({ error: "email not found" });

      }
if(!user.google_auth){

      bcrypt.compare(password, user.personal_info.password, (err, result) => {
        if (err) {
          return res
            .status(403)
            .json({ error: "error occured while login please try again." });
        }
        if (!result) {
          return res.status(403).json({ error: "incorrect password" });
        } else {
          return res.status(200).json(formatDataToSend(user));
        }
      });
} else{
  return res.status(403).json({"error" : "Account was created using google. Try logging in with google."})
}
    })
    .catch((err) => {
      console.log(err.message);
      return res.status(403).json({ error: err.message });
    });
});

server.post("/google-auth", async (req, res) => {
  const { access_token } = req.body;

  if (!access_token) {
    return res.status(400).json({"error": "Access token is missing"});
  }

  try {
    // console.log('Verifying ID token with Firebase...');
    const decodedUser = await admin.auth().verifyIdToken(access_token);
    
    
    let { email, name, picture } = decodedUser;

    if (picture) {
      picture = picture.replace("s96-c", "s384-c");
    }

    let user = await User.findOne({"personal_info.email": email}).select("personal_info.fullname personal_info.username personal_info.profile_img google_auth");

    if (user) {
      if (!user.google_auth) {
        return res.status(403).json({
          "error": "This email was signed up without Google. Please login with password to access the account."
        });
      }
    } else {
      const username = await generateUserName(email);
      user = new User({
        personal_info: { fullname: name, email,  username },
        google_auth: true
      });
      await user.save();
    }

    console.log('User authenticated successfully');
    return res.status(200).json(formatDataToSend(user));

  } catch (err) {
    console.error('Error during Google authentication:', err);
    return res.status(500).json({
      "error": "Failed to authenticate you with Google. Try with another account."
    });
  }
});

server.post("/like-blog",verifyJWT, (req,res)=>{
  
  let user_id = req.user;
  
  let {_id , isLike } = req.body;


  let incrementVal = !isLike ? 1:-1;

  Blog.findOneAndUpdate({ _id } ,{$inc : {"activity.total_likes" : incrementVal}} 
  ).then(blog=>{
    
    if(!isLike){
      let like = new Notification(
        {
          type : "like",
          blog:_id,
          notification_for: blog.author,
          user: user_id
        }
      )
      like.save()
      .then( notification =>{
        return res.status(200).json({isLike : true})
      })
    } else{
      Notification.findOneAndDelete({ user : user_id , blog : _id , type : "like"}).then(data =>{
        return res.status(200).json({isLike : false})
      }).catch(err=>{
        return res.status(500).json({error : err.message})
      })
    }
  })

})

server.post('/isliked-by-user', verifyJWT, (req, res) =>{
  let user_id = req.user; 

  let { _id } = req.body;

Notification.exists({user : user_id , type : "like" , blog : _id})
.then(result=>{
  //console.log(result);  
  return res.status(200).json({result})
})  
.catch(err=>{
  return res.status(500).json({error : err.message})
})

})


server.post("/add-comment", verifyJWT, async (req, res) => {
  try {
    const user_id = req.user; // Extract authenticated user ID
    const { _id, comment, replying_to, blog_author  } = req.body;

    //console.log(replying_to);
    

    // Validate the input
    if (!comment || comment.trim().length === 0) {
      return res.status(403).json({ error: "Write something to leave a comment." });
    }

    // Create the comment document
    const commentObj ={
      blog_id: _id,
      blog_author,
      comment,
      commented_by: user_id,
      replying_to: replying_to || null, // Handle replies
      
    };

  //  console.log(commentObj);
    

    if(replying_to){
      commentObj.parent = replying_to;
      commentObj.isReply = true
    }

//console.log(  commentObj.parent);
        

    const commentFile = await  new Comment(commentObj).save();

    //console.log(commentFile);
    
    
    const { comment: savedComment, commentedAt, children } = commentFile;

    // Update the blog with the new comment and increment counters
    const blogUpdate = await Blog.findOneAndUpdate(
      { _id },
      {
        $push: { comments: commentFile._id },
        $inc: {
          "activity.total_comments": 1,
          ...(replying_to ? {} : { "activity.total_parent_comments": replying_to ? 0 :1 }), // Only increment parent comments if not a reply
        },
      },
      { new: true } // Return the updated document
    );

    if (!blogUpdate) {
      return res.status(404).json({ error: "Blog not found." });
    }

    // Create the notification for the blog author
    const notificationObj = new Notification({
      type: replying_to? "reply" : "comment",
      blog: _id,
      notification_for: blog_author,
      user: user_id,
      comment: commentFile._id,
    });

    if(replying_to){
      notificationObj.replied_on_comment = replying_to;
      await Comment.findOneAndUpdate({_id: replying_to} , {$push:{ children: commentFile._id}}).then(replyingToCommentDoc =>{notificationObj.notification_for = replyingToCommentDoc.commented_by})
      
    }

    await notificationObj.save();

    // Send a successful response
    return res.status(200).json({
      comment: savedComment,
      commentedAt,
      _id: commentFile._id,
      user_id,
      children,
    });
  } catch (err) {
    console.error("Error adding comment:", err);
    return res.status(500).json({ error: "An error occurred while adding the comment." });
  }
});

server.post("/get-blog-comments" , (req,res)=>{
 let {blog_id , skip} = req.body;

 let maxLimit = 5;

 Comment.find({blog_id , isReply: false})
 .populate("commented_by", "personal_info.username  personal_info.fullname personal_info.profile_img")
 .skip(skip)
 .limit(maxLimit)
 .sort({
  'commentedAt': -1
 })
 .then(comment =>{
  return res.status(200).json(comment)
 })
 .catch(err=>{
  console.log(err.message);
  return res.status(500).json({error : err.message})
  
 })


})

server.post("/get-replies" , (req, res)=>{
    let { _id , skip } = req.body;

    let maxLimit = 5;

    Comment.findOne({_id})
    .populate({
      path: "children",
      option: {
        limit : maxLimit,
        skip: skip,
        sort: {'commentedAt': -1}
      },
      populate : {
       path : 'commented_by',
       select : "personal_info.profile_img personal_info.username personal_info.fullname "
      },
      select : "-blog_id -updatedAt "
    })
    .select("children")
    .then(doc =>{
      return res.status(200).json({replies : doc.children})
    })
    .catch(err=>{
      return res.status(500).json({error : err.message})
    })

})

const deleteComments = (_id)=>{
  Comment.findOneAndDelete({_id}).then(comment =>{
   if( comment.parent ){
    Comment.findOneAndUpdate({_id : comment.parent} , {$pull : {children : _id}})
    .then(data => console.log('comment deleted from parent')
    ).
    catch(err=>{console.log(err.message);
    })
   }
   Notification.findOne({comment : _id}).then(notification =>console.log("comment notification deleted")
   )
   Notification.findOneAndDelete({reply : _id}).then(notification =>console.log("reply deleted.")
   )

   Blog.findOneAndUpdate({_id : comment.blog_id } , {$pull :{comments : _id}, $inc:{"activity.total_comments": -1} , "activity.total_parent_comments": comment.parent? 0 : 1})
   .then(blog =>{
    if(comment.children.length){
      comment.children.map((child)=>{
        deleteComments(child)
      })
    }
   })
  })
  .catch(err=>{
    console.log(err.message);
    
  })
}

server.post("/delete-comment" ,verifyJWT, (req,res)=>{
  let user_id = req.user;

  let { _id } = req.body;

  Comment.findOne({_id})
  .then(comment =>{
    
    if(user_id ==comment.commented_by || user_id ==comment.blog_author){
        
        
      deleteComments(_id);

      return res.status(200).json({status : "done"})

    } else{
      return res.status(403).json({error : "You can not delete this coment."})
    }
  })
})


server.post("/delete-account", verifyJWT , async (req,res)=>{
  let user_id = req.user;
  let {username} = req.body

  Blog.deleteMany({"author": user_id}).then((data)=>{
    console.log("blogs deleted");
    
  }).catch((err)=>{console.log(err.message);
  })
  
  Comment.deleteMany({"commented_by": user_id}).then(()=>{console.log("comments deleted");
  }).catch(err=>{console.log(err.message);
  })

  
User.findOneAndDelete({ "_id":user_id })
    .then((data) => {
     // console.log(data);
      return res.status(200).json({status : "user deleted"})    
})
.catch(err=>{console.log(err);
})

})

server.post("/change-password", verifyJWT, (req, res) => {
  const user_id = req.user;

  const { currentPassword, newPassword } = req.body;

  User.findOne({ _id: user_id })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (user.google_auth) {
        return res
          .status(403)
          .json({ error: "You can't change the password because you logged in through Google." });
      }

      // Compare the current password
      bcrypt.compare(currentPassword, user.personal_info.password, (err, isMatch) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (!isMatch) {
          return res.status(403).json({ error: "Incorrect current password" });
        }

        // Hash the new password
        bcrypt.hash(newPassword, 10, (err, hashed_password) => {
          if (err) {
            return res.status(500).json({ error: "Error hashing the password" });
          }

          // Update the password in the database
          User.findOneAndUpdate(
            { _id: user_id },
            { "personal_info.password": hashed_password },
            { new: true } // To return the updated user
          )
            .then(() => {
              return res.status(200).json({ status: "Password changed successfully" });
            })
            .catch((err) => {
              return res
                .status(500)
                .json({ error: "Error saving the new password. Please try again." });
            });
        });
      });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
});


server.post("/update-profile-img" , verifyJWT , (req, res) =>{
  let { url } = req.body;
  //console.log(url);
  
  let  user_id = req.user;
  //console.log(user_id);
  
  User.findOneAndUpdate({_id:  user_id} , {"personal_info.profile_img": url })
  .then(()=>{
    return res.status(200).json({profile_img : url})
  }).catch((err)=>{
    console.log(err);
    return res.status(500).json({error : err.message})
    
  })
})


server.post("/update-profile", verifyJWT , (req, res)=>{
      let { username , fullname , bio , email , social_links  } = req.body;

      

      let socialLinksArr = Object.keys(social_links);

      try {

        for(let i =0 ; i<socialLinksArr.length ; i++){
          if(social_links[socialLinksArr[i]].length){
            let hostname = new URL(social_links[socialLinksArr[i]]).hostname;
            if(!hostname.includes(`${socialLinksArr[i]}.com`) && socialLinksArr[i]!== 'website'){
              return res.status(403),json({error : `${socialLinksArr[i]} link is invalid. You must enter a full link.`})
            }
          }
        }
        
      } catch (error) {
        return res.status(500).json({error : "You must provide full social links with https included."})
      }
    let updateObj = {
      "personal_info.username ": username ,
      "personal_info.bio" : bio,
      "personal_info.email ": email ,
      "personal_info.fullname" : fullname,
      social_links 
    }
    User.findOneAndUpdate({_id : req.user} , updateObj  , {
      runValidators : true
    })
    .then(()=>{
      return res.status(200).json({username})
    })
    .catch(err=>{
      if(err.code ===1100){
        
      return res.status(409).json({error : err.message})
      }
      return res.status(500).json({error : err.message})
    })
})

server.get("/new-notification" , verifyJWT , (req,res)=>{
  const user_id = req.user;
  Notification.exists({ notification_for : user_id , seen:false , user: {$ne: user_id } })
  .then(result =>{
    if(result){
      return res.status(200).json({new_notification_available : true})
    } else {
      return res.status(200).json({new_notification_available : false})
    }
  }) 
  .catch(err=>{
    console.log(err.message);
    return res.status(500).json({ error : err.message })
    
  })
})

server.post("/user-notifications", verifyJWT , (req, res)=>{

  const user_id = req.user;
  const {filter , page, deletedDocCount} = req.body
  
  
  
  let maxLimit = 8;

  let findQuery = {notification_for : user_id , user : {$ne : user_id}}

  let skipCount= maxLimit*(page-1);
  
  if( filter !== "all" ){
      findQuery.type = filter;
  }
  if(deletedDocCount){
    skipCount -=deletedDocCount;
  }

    Notification.find(findQuery)
    .skip(skipCount)
    .limit(maxLimit)
    .populate("blog" , "title blog_id").populate("user", "personal_info.username personal_info.fullname personal_info.profile_img").populate("comment" , "comment").populate("replied_on_comment" , "comment").populate("reply" , "comment").sort({createdAt : -1})
    .select("createdAt type seen reply")
    
    .then(notifications =>{
      //console.log(notifications);
      Notification.updateMany(findQuery , { seen : true})
      .skip(skipCount)
      .limit(maxLimit)
      .then(()=>{console.log("seen");
      })
      .catch((err)=>{console.log(err.message);
      })
      return res.status(200).json({notifications})
    })
    .catch(err=>{
      console.log(err);
      return res.status(500).json({error : err.message})
      
    })
})

server.post("/all-notification-count" , verifyJWT , (req,res)=>{
  let user_id = req.user ;
  let{ filter } = req.body;
  let findQuery = { notification_for : user_id , user : {$ne : user_id}}
  if(filter !=="all"){
    findQuery.type = filter;
  }
  Notification.countDocuments(findQuery).then(count =>{
    return res.status(200).json({totalDocs : count})
  })
  .catch(err=>{
    return res.status(500).json({error : err.message})
  })
})

server.post("/user-written-blogs", verifyJWT , (req, res)=>{
  let user_id = req.user;

  let { page , draft , query, deleteDocCount} = req.body;

  let maxLimit = 5;

  let skipDocs = ( page -1)* maxLimit;

  if( deleteDocCount){
    skipDocs-=deleteDocCount
  }

  Blog.find({ author : user_id , draft , title : new RegExp( query , 'i')})
  .skip(skipDocs)
  .limit(maxLimit)
  .sort({ publishedAt : -1})
  .select(" title banner publishedAt blog_id activity des draft -_id")
  .then( blogs =>{
    return res.status(200).json({ blogs})
  })
  .catch(err=>{ 
    return res.status(500).json({error : err.message})
  })
})

server.post("/user-written-blogs-count" , verifyJWT , (req, res)=>{
  let user_id = req.user;

  let {draft , query } = req.body;

  Blog.countDocuments({ author : user_id , draft , title: new RegExp( query , 'i')})
  .then( count =>{
    return res.status(200).json({totalDocs : count})
  })
  .catch(err=>{
    console.log(err.message);
    return res.status(500).json({error : err.message})
    
  })
})

server.post('/delete-a-blog' , verifyJWT , (req,res)=>{
  const {id} = req.body;
  const user_id = req.user;
  Blog.findOneAndDelete({blog_id:id , author: user_id}).then(blog=>{
    Notification.deleteMany({blog: blog_id}).then(data=>{console.log("notifications deleted")}
    )

    Comment.deleteMany({blog_id : blog._id}).then(()=>{
      console.log("comments deleted")
      
    })

    User.findOneAndUpdate({_id: user_id} , {$pull : { blog: blog._id} , $inc: {"account_info.total_posts ": -1}}).then(user =>console.log("blog deleted")
    )
    return res.status(200).json({msg : "data deleted"})
    
  })
  .catch(err=>{
    console.log(err.message);
    return res.status(500).json({error: err.message})
    
  })

})

server.listen(PORT, () => {
  console.log("listening on port , " + PORT);
});
