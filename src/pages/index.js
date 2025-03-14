import React from "react";
import { graphql, Link } from "gatsby"
import Blog from "../components/Blog"
import Base from "../layouts/base"
import Seo from "../components/seo"

export default function BlogPage({ data }) {
  const { nodes: blogs, pageInfo } = data.blogs
  const pages = blogs.map(blog => (
    <Blog data={blog} key={blog.id}/>
  ))
  const { pageCount, hasPreviousPage, currentPage } = pageInfo
  const hasNextPage = currentPage < pageCount
  return (
    <Base>
      <Seo />
      <div>
        {pages}
        <div className="flex justify-center mt-8">
          {hasPreviousPage && <Link to={`/page/${currentPage - 1}`} className="w-32 text-center px-4 py-1 border mx-4 border-gray-800 border-solid">Previous</Link>}
          {hasNextPage && <Link to={`/page/${currentPage + 1}`} className="w-32 text-center px-4 py-1 border mx-4 border-gray-800 border-solid">Next</Link>}
        </div>
      </div>
    </Base>
  )
}

export const pageQuery = graphql`
  query QueryFirstBlogPages { 
    site(siteMetadata: {title: {}}) {
      siteMetadata {
        title
      }
    }
    blogs: allMarkdownRemark(
      sort: { fields: frontmatter___date, order: DESC }
      limit: 3
      skip: 0
    ) {
      nodes {
        id
        frontmatter {
          title
          date(formatString: "YYYY MMMM-DD")
        }
        html
        fields {
          slug_without_date
        }
      }
      pageInfo {
        pageCount
        hasPreviousPage
        currentPage
      }
    }
  }
`;
