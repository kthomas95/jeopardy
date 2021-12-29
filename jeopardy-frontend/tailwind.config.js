module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                "jep-blue": "#010a78",
            },
            fontFamily: {
                sans: ['"IBM Plex Sans"', "sans-serif"],
            },
        },
    },
    plugins: [],
};
