/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/gatsby-config/
 */

module.exports = {
  siteMetadata: {
    title: "Shivang P Swain",
    author: "Shivang P Swain",
    description: "Hi! My name is Shivang P Swain and this is my digital conscience...",
    siteUrl: "https://shivangswain.com/",
    social: {
      github:  "shivangswain",
      linkedin: "shivangswain",
      twitter: "shivangswain"
    },
    plugins: [
      "gatsby-plugin-image",
      {
        resolve: "gatsby-plugin-manifest",
        options: {
          name: "Shivang P Swain",
          icon: "src/images/ahr-favicon.svg"
        },
      },
      "gatsby-plugin-postcss",
      "gatsby-plugin-sharp",
      "gatsby-plugin-typescript",
      "gatsby-transformer-sharp"
    ]
  }
}