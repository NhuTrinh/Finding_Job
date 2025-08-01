

import request from 'supertest'
import app from "../../server.js"
import mongoose from 'mongoose'
import { getCandidateToken } from '../setup/token.js'

describe('APPLICATION /api/v1/jobs/:jobId/applications ', () => {
    let token
    let jobId = '68595cabfadf353fb43558d1'

    beforeAll(async () => {
        token = await getCandidateToken()
    }, 10000)

    it('POST should return message apply success', async () => {
        const res = await request(app)
            .post(`/api/v1/jobs/${jobId}/applications`)
            .set('Authorization', `Bearer ${token}`)

        expect(res.statusCode).toBe(201)
    })

    it('GET should return all application of candidate', async () => {
        const res = await request(app)
            .get('/api/v1/applications')
            .set('Authorization', `Bearer ${token}`)

        expect(res.statusCode).toBe(200)
    })
})

afterAll(async () => {
    await mongoose.disconnect()
})