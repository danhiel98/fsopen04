const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})

  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  if (!body.title || !body.author) {
    return response
      .status(400)
      .json({ error: 'title or author missing' })
  }

  const blog = new Blog(body)

  const createdBlog = await blog.save()
  response.status(201).json(createdBlog)
})

module.exports = blogsRouter