import { useDarkMode } from "usehooks-ts";
import { darkColors, ThemeColors } from "./colors";
const ColorTiles = () => {

  const { isDarkMode } = useDarkMode()

  return (
    <div className="p-6 grid grid-cols-5 sm:grid-cols-5 md:grid-cols-5 gap-6">
      {Object.entries(ThemeColors).map(([colorGroup, shades]) => (
        <div key={colorGroup}>
          <h3 className="mb-2 text-lg font-semibold capitalize">{colorGroup}</h3>
          {Object.entries(shades).map(([shade, hex]) => (
            <div key={shade} className="flex items-center mb-2">
              <div
                className="w-12 h-12 rounded shadow"
                style={{ backgroundColor: isDarkMode ? hex : darkColors[colorGroup][shade] }}
              />
              <div className="ml-4">
                <p className="text-sm font-medium">{shade}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{isDarkMode ? hex : darkColors[colorGroup][shade]}</p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default ColorTiles;