let months = ['Jan' , 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul' , 'Aug','Sep', 'Oct', 'Nov','Dec'];

let days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri","Sat"];

export const getDay = (timeStamp)=>{
  let date = new Date(timeStamp);

  return `${date.getDate()} ${months[date.getMonth()]}`
}

export const getFullDay =(timeStamp)=>{
  let date = new Date(timeStamp)

  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

export const getTime = (timeStamp) => {
  let date = new Date(timeStamp);

  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? "PM" : "AM";

  // Convert to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // The hour '0' should be '12'

  // Pad minutes with a leading zero if necessary
  minutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${hours}:${minutes} ${ampm}`;
};
