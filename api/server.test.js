const server = require('../api/server.js');
const request = require('supertest');
const db = require('../data/dbConfig');

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

afterAll(async () => {
  await db.destroy()
})

test('sanity', () => {
  expect(true).toBe(true)
})

describe('[POST] api/auth/register', () => {
  it('adds a user to the database', async() => {
    await request(server).post("/api/auth/register").send({ "username": "Captain Marvel", "password": "foobar" })
    const users = await db('users')
    expect(users).toHaveLength(1)
  })
  it('responds with "username and password required" if missing credentials', async () => {
    const res = await request(server).post("/api/auth/register").send({ "username": "Captain Marvel" })
    expect(res.body.message).toMatch(/username and password required/i)
  })
  it('responds with "username taken" if username is taken', async () => {
    await request(server).post("/api/auth/register").send({ "username": "Captain Marvel", "password": "foobar" })
    const res2 = await request(server).post("/api/auth/register").send({ "username": "Captain Marvel", "password": "1234" })
    expect(res2.body.message).toMatch(/username taken/i)
  })
})

describe('[POST] api/auth/login', () => {
  it('responds with "username and password required" if missing either field', async () => {
    const res = await request(server).post("/api/auth/login").send({ "username": "Captain Marvel" })
    expect(res.body.message).toMatch(/username and password required/i)
  })
  it('responds with welcome and a token on success', async () => {
    const res = await request(server).post("/api/auth/login").send({ "username": "Captain Marvel", "password": "foobar" })
    expect(res.body.message).toMatch(/welcome, Captain Marvel/i)
    expect(res.body.token).toBeTruthy()
  })
  it('responds with "username and password required" if missing credentials', async () => {
    const res = await request(server).post("/api/auth/login").send({ "username": "Captain Marvel" })
    expect(res.body.message).toMatch(/username and password required/i)
  })
  it('responds with "invalid credentials" when username does not exist in database', async () => {
    const res = await request(server).post("/api/auth/login").send({ "username": "Iron Man", "password": "JARVIS" })
    expect(res.body.message).toMatch(/invalid credentials/i)
  })
  it('responds with "invalid credentials" when password is incorrect', async () => {
    const res = await request(server).post("/api/auth/login").send({ "username": "Captain Marvel", "password": "09876" })
    expect(res.body.message).toMatch(/invalid credentials/i)
  })
})

describe('[GET] /api/jokes', () => {
  it('responds with "token required" if no token', async () => {
    const res = await request(server).get('/api/jokes')
    expect(res.body.message).toMatch(/token required/i)
  })
  it('responds with "token invalid" if invalid or expired token', async () => {
    const res = await request(server).get('/api/jokes').set('Authorization', 'notAToken')
    expect(res.body.message).toMatch(/token invalid/i)
  })
  it('responds with jokes data if correct token', async () => {
    let res = await request(server).post("/api/auth/login").send({ "username": "Captain Marvel", "password": "foobar" })
    res = await request(server).get('/api/jokes').set('Authorization', res.body.token)
    expect(res.body).toHaveLength(3)
  })
})
