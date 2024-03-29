const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'The new world',
    author: 'Richard Smith',
    url: 'https://thenewworldblog.com',
    likes: 500
  },
  {
    title: 'Smashing the code',
    author: 'Robert Stones',
    url: 'https://smashthecode.io',
    likes: 855
  },
  {
    title: 'SpiderTech',
    author: 'Alisson Lopez',
    url: 'https://thespidertech.com',
    likes: 1200
  },
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, blogsInDb
}