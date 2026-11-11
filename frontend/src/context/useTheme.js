import { useContext } from "react";
import { ThemeContext } from "./themeContextObject";

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used in a Theme provider');
    }
    return context
}
