import React, { createContext, useState, useEffect } from "react";
export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/profile`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (data && data.username) {
          setUserInfo(data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
}
