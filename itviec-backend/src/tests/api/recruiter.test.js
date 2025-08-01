
import request from 'supertest'
import app from "../../server.js"
import mongoose from 'mongoose'
import { getRecruiterToken } from '../setup/token.js'

describe('RECRUITER /api/v1/recruiters/profile ', () => {
    let token

    beforeAll(async () => {
        token = await getRecruiterToken()
    }, 10000)

    it('GET should return recruiter profile', async () => {
        const res = await request(app)
            .get('/api/v1/recruiters/profile')
            .set('Authorization', `Bearer ${token}`)

        expect(res.statusCode).toBe(200)
    })

    it('PUT should update recruiter profile', async () => {
        const res = await request(app)
            .put('/api/v1/recruiters/profile')
            .set('Authorization', `Bearer ${token}`)
            .send({
                recruiterTitle: "HR"
            })

        expect(res.statusCode).toBe(200)
    })
})

afterAll(async () => {
    await mongoose.disconnect()
})