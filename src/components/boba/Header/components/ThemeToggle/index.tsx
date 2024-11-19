
import { Button } from '@/components/ui';
import { IconMoon, IconSun } from "@tabler/icons-react";
import { useEffect } from 'react';
import { useDarkMode } from "usehooks-ts";

export const ThemeToggleButton = () => {
  const { isDarkMode, toggle } = useDarkMode({ defaultValue: true, initializeWithValue: true });
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    } else {
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]); // Dependency array ensures this runs when `isDarkMode` changes

  return (
    <Button variant="ghost" size="icon" onClick={toggle}>
      {!isDarkMode ?
        <IconMoon className="h-5 w-5 stroke-gray-600 dark:stroke-dark-gray-100" /> :
        <IconSun className="h-5 w-5 stroke-gray-600 dark:stroke-dark-gray-100" />}
    </Button >
  )
}

export default ThemeToggleButton
