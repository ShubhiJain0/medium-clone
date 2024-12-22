export const storeInSession = (key, value) =>{
  sessionStorage.setItem(key , value);
}

export const lookInSEssion = (key) =>{
  return sessionStorage.getItem(key);
}

export const removeFromSession = (key) =>{
  return sessionStorage.removeItem(key);
}

export const loutOut=() =>{
  sessionStorage.clear();
}