const React = require("react")

exports.onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    React.createElement("link", {
      key: "favicon-32",
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: "/favicon-32.png",
    }),
    React.createElement("link", {
      key: "favicon-16",
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      href: "/favicon-16.png",
    }),
    React.createElement("link", {
      key: "apple-touch-icon",
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "/favicon-180.png",
    }),
    React.createElement("link", {
      key: "gf-preconnect-1",
      rel: "preconnect",
      href: "https://fonts.googleapis.com",
    }),
    React.createElement("link", {
      key: "gf-preconnect-2",
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "anonymous",
    }),
    React.createElement("link", {
      key: "gf-fonts",
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Anton&family=Caveat:wght@500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap",
    }),
  ])
}
