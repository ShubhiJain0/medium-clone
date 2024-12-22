//import tools
import Embed from '@editorjs/editorjs';

import List from '@editorjs/list';

import Image from '@editorjs/image'

import Header from '@editorjs/header'

import Quote from '@editorjs/quote'

import Marker from '@editorjs/marker'

import InlineCode from '@editorjs/inline-code'

import axios from 'axios';

const uploadImageByFile = async (file) => {
  if (!file) {
    console.error("No file selected.");
    return { success: 0, error: "No file selected." };
  }

  const formData = new FormData();
  formData.append("banner", file);

  try {
    // Send the file to the server using Axios
    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_DOMAIN}/upload-banner`, // Your upload endpoint
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Set the correct content type for file upload
        },
      }
    );

    // Check if the upload was successful
    if (response.status === 200) {
      // Return the uploaded file URL to the Editor.js image tool
      return {
        success: 1,
        file: {
          url: response.data.bannerUrl, // Use the correct field from your server's response
        },
      };
    } else {
      return { success: 0, error: "Upload failed: " + response.data.message };
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    return { success: 0, error: error.message || "Unknown error" };
  }
};
  

const uploadImageByUrl =(e)=>{
  let link = new Promise((resolve , reject)=>{
    try {
      resolve(e)
    } catch (error) {
      reject(error)
    }
  })
  return link.then(url =>{
    return {
      success : 1,
      file : {url}
    }
  })
}

export const tools = {
  embed: Embed,

  list: { class: List, inlineToolbar: true },

  image: {class : Image,
    config :{
      uploader :{
        uploadByUrl : uploadImageByUrl,
        uploadByFile : uploadImageByFile,
      }
    }
  },

  header: { class: Header,
    config:{
      placeholder : "Type Heading...",
      levels:[1,2,3],
      defaultLevel :2
    }
   },

  quote: {class : Quote,
    inlineToolbar: true
  },

  marker: Marker,

  inlineCode: InlineCode,
};