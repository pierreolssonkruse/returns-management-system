import { createContext } from "react";

const DarkThemeContext = createContext({
  darkMode: false,
  toggleDarkMode: () => {}
});

export default DarkThemeContext;
