
import request from 'supertest'
import app from "../../server.js"
import mongoose from 'mongoose'
import { getCandidateToken } from '../setup/token.js'

describe('CANDIDATE /api/v1/candidates/profile-cv ', () => {
    let token

    beforeAll(async () => {
        token = await getCandidateToken()
    }, 10000)

    it('GET should return candidate profile', async () => {
        const res = await request(app)
            .get('/api/v1/candidates/profile-cv')
            .set('Authorization', `Bearer ${token}`)

        expect(res.statusCode).toBe(200)
    })

    it('PUT should update candidate profile', async () => {
        const res = await request(app)
            .put('/api/v1/candidates/profile-cv')
            .set('Authorization', `Bearer ${token}`)
            .send({
                fullName: "Le Van Test",
            })

        expect(res.statusCode).toBe(200)
    })
})

describe('CANDIDATE /api/v1/candidates/profile-cv/manage-cv ', () => {
    let token

    beforeAll(async () => {
        token = await getCandidateToken()
    }, 10000)

    it('GET should return attachment profile', async () => {
        const res = await request(app)
            .get('/api/v1/candidates/profile-cv/manage-cv')
            .set('Authorization', `Bearer ${token}`)

        expect(res.statusCode).toBe(200)
    })

    it('PUT should update attachment profile', async () => {
        const res = await request(app)
            .put('/api/v1/candidates/profile-cv/manage-cv')
            .set('Authorization', `Bearer ${token}`)
            .send({
                "currentJobLevel": "Junior"
            })

        expect(res.statusCode).toBe(200)
    })
})

afterAll(async () => {
    await mongoose.disconnect()
})