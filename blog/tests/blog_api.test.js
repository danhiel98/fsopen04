const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const { blogsInDb, initialBlogs } = require('./blog_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  for (blog of initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

test('return the correct amount of blogs in the db', async () => {
  const blogs = await blogsInDb()

  assert.strictEqual(blogs.length, initialBlogs.length)
})

test('verify identifier', async () => {
  const blogs = await blogsInDb()

  assert(blogs.every(el => el.id))
})

test('add a new blog', async () => {
  const newBlog = {
    title: 'FSOpen Daily',
    author: 'Cristopher Jhones',
    url: 'https://fsopendaily.com',
    likes: 925
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAfter = await blogsInDb()
  assert.strictEqual(blogsAfter.length, initialBlogs.length + 1)

  const titles = blogsAfter.map(blog => blog.title)
  assert(titles.includes('FSOpen Daily'))
})

test('missing likes property sets default to 0', async () => {
  await Blog.deleteMany()

  const newBlog = {
    title: 'NoLikes',
    author: 'Daniel Garcia',
    url: 'https://nolikesblog.com',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAfter = await blogsInDb()
  assert.strictEqual(blogsAfter[0].likes, 0)
})

test('blog without title is not added', async () => {
  const newBlog = {
    author: 'Daniel Garcia',
    url: 'https://nolikesblog.com',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAfter = await blogsInDb()

  assert.strictEqual(blogsAfter.length, initialBlogs.length)
})

test('blog without author is not added', async () => {
  const newBlog = {
    title: 'Title of example',
    url: 'https://nolikesblog.com',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAfter = await blogsInDb()

  assert.strictEqual(blogsAfter.length, initialBlogs.length)
})

after(async () => {
  await mongoose.connection.close()
})