const { test, after, beforeEach } = require('note:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  //
})

after(async () => {
  await mongoose.connection.close()
})