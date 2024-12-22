import Navbar from "./components/navbar.component";

import ChangePasswordPage from "./pages/change-password.page";

import ProfilePage from "./pages/profile.page";

import NotificationPage from "./pages/notifications.page";

import SearchPage from "./pages/search.page";

import { Route, Routes } from "react-router-dom";

import UserAuthForm from "./pages/userAuthForm.page";

import EditProfilePage from "./pages/edit-profile.page";

import { createContext, useEffect, useState } from "react";

import SideNavBar from "./components/sidenavbar.component";

import { lookInSEssion } from "./common/session";

import Editor from "./pages/editor.pages";

import BlogManagementPage from "./pages/manage-blogs.page";

import DashboardPage from "./pages/dashboard.page";

import Homepage from "./pages/home.page";

import FourOFour from "./pages/404.page";

import BlogPage from "./pages/blog.page";

export const userContext = createContext({});

export const ThemeContext = createContext({});


const App = () => {
  const [userAuth , setUserAuth] =useState({});

  const [theme , setTheme] = useState("light")

  useEffect(()=>{
    let userInSession = lookInSEssion("user");

    let themeInSession = lookInSEssion("theme");

    userInSession ? setUserAuth(JSON.parse(userInSession)) :setUserAuth({access_token : null}) 

    if(themeInSession){
      setTheme(()=>{
        document.body.setAttribute("data-theme", themeInSession);
          return themeInSession;
      })
    } else{
      document.body.setAttribute("data-theme", theme);

    }

    
  }, [])
    return (
      <>
        <ThemeContext.Provider value={[theme , setTheme]}>
          <userContext.Provider value={{ userAuth, setUserAuth }}>
            <Routes>
              <Route path="/editor" element={<Editor />} />

              <Route path="/editor/:blog_id" element={<Editor />} />

              <Route path="/" element={<Navbar />}>
                <Route index element={<Homepage />} />

                <Route path="settings" element={<SideNavBar />}>
                  <Route path="edit-profile" element={<EditProfilePage />} />
                  <Route
                    path="change-password"
                    element={<ChangePasswordPage />}
                  />
                </Route>

                <Route path="dashboard" element={<SideNavBar />}>
                  <Route path="notifications" element={<NotificationPage />} />
                  <Route path="blogs" element={<BlogManagementPage />} />
                </Route>

                <Route
                  path="signin"
                  element={<UserAuthForm type="sign-in" />}
                />
                <Route
                  path="signup"
                  element={<UserAuthForm type={"sign-up"} />}
                />
                <Route path="search/:query" element={<SearchPage />} />

                <Route path="user/:id" element={<ProfilePage />} />
                <Route path="*" element={<FourOFour />} />
                <Route path="blog/:blog_id" element={<BlogPage />} />
              </Route>
            </Routes>
          </userContext.Provider>
        </ThemeContext.Provider>
      </>
    );
}

export default App;