// Syntax named import
import { createContext, useContext, useEffect, useState } from "react";

// Variable for sharing components
const ThemeContext = createContext()

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('paddle-theme') ||
        'light'
    })

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem('paddle-theme', theme)
    }, [theme])

    const toggleTheme = () => {
        setTheme((currentTheme) => 
        currentTheme === 'light' ? 'dark' : 'light')
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    return useContext(ThemeContext)
}