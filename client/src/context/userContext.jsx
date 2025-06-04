import React, {createContext, useContext, useState, useEffect} from "react";
import axios from "axios";
const baseUrl = import.meta.env.DEV
  ? ''
  : import.meta.env.VITE_API_BASE_URL;


//creating a context(it cretes a global state object)
const UserContext = createContext();

//creating a provider to share our data
 export const UserProvider = ({children}) => {
   const [user, setUser] = useState(null); // The user state will hold logged in users info
   //This is used to Fetch user on initial load
   useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/users/profile`, { withCredentials: true });
        setUser(res.data);
      } catch (err) {
        setUser(null); // No user or invalid token
        console.log(err);
      }
    };

    fetchUser();
  }, []);
   return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

//Custom hook for easy access , just an helper function to directly access user nd setUser vlues through useUser 
export const useUser = () => useContext(UserContext);

//children = whatever is inside <UserProvider>...</UserProvider>
//Those components (like App, Navbar, Home, etc.) can then use the shared values (user, setUser) from the context.