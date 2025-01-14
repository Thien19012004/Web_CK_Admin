import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { getBaseUrl } from "../utils/getBaseUrl";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    username: "Admin",
    avatar: "",
  });

  

  useEffect(() => {
    
    const token = localStorage.getItem("token");
    const fetchUserInfo = async () => {
      try {
        if (token) {
          const res = await axios.get(`${getBaseUrl()}/api/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setUser({
            username: res.data.username || "Admin",
            avatar: res.data.avatar || "",
            email: res.data.email || "",
            role: res.data.role || "admin",
            registrationDate: res.data.registrationDate || "N/A",
          });
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
