

import request from 'supertest'
import mongoose from 'mongoose'
import connectDB from '../../config/db.js'
import app from '../../server.js'

describe('Register api/v1/accounts/candidate/register', () => {
    it('POST should return new candidate', async () => {
        const res = await request(app)
            .post('/api/v1/accounts/candidate/register')
            .send({
                fullName: 'Test Jest For Candidate',
                email: 'testforcandidate@gmail.com',
                password: '12345678'
            })

        expect(res.statusCode).toBe(201)
    }, 10000)
})

describe('Register /api/v1/accounts/recruiter/register', () => {
    it('POST should return new recruiter', async () => {
        const res = await request(app)
            .post('/api/v1/accounts/recruiter/register')
            .send({
                fullName: 'Test Jest For Recruiter',
                email: 'testforrecruiter@gmail.com',
                password: '12345678',
                company: {
                    name: 'Test Jest',
                    address: {
                        line: '7 Ho Van Long',
                        city: 'Ho Chi Minh',
                        country: 'Viet Nam'
                    }
                }
            })

        expect(res.statusCode).toBe(201)
    }, 10000)
})

describe('Login api/v1/accounts/candidate/login', () => {
    it('POST should return token for candidate', async () => {
        const res = await request(app)
            .post('/api/v1/accounts/candidate/login')
            .send({
                email: 'ungvien3@gmail.com',
                password: '12345678'
            })

        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty('token')
    }, 10000)

})

describe('Login /api/v1/accounts/recruiter/login', () => {
    it('POST should return token for recruiter', async () => {
        const res = await request(app)
            .post('/api/v1/accounts/recruiter/login')
            .send({
                email: 'nhatuyendung5@gmail.com',
                password: '12345678'
            })

        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty('token')
    }, 10000)
})

beforeAll(async () => {
    if (mongoose.connection.readyState !== 1) {
        await connectDB()
    }
})

afterAll(async () => {
    await mongoose.disconnect()
})