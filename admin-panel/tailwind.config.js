module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}", // Flowbite React
    "node_modules/flowbite/**/*.{js,jsx,ts,tsx}", // Flowbite
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("flowbite/plugin"), // Plugin của Flowbite
    require("@tailwindcss/forms"), // Hỗ trợ form
    require("@tailwindcss/typography"), // Hỗ trợ typography
  ],
};
