import React, { useState } from "react";
import DarkThemeContext from "./DarkThemeContext";

const DarkModeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(false);
  
    const toggleDarkMode = () => {
      setDarkMode(prevMode => !prevMode);
    };
  
    return (
      <DarkThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
        <div className={darkMode ? "dark-mode" : ""}>
          {children}
        </div>
      </DarkThemeContext.Provider>
    );
  };
  

export default DarkModeProvider;
