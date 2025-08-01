import request from 'supertest'
import app from "../../server.js"
import mongoose from 'mongoose'
import { getRecruiterToken } from '../setup/token.js'

describe('JOB /api/v1/jobs ', () => {
    let token
    let jobId

    beforeAll(async () => {
        token = await getRecruiterToken()
    }, 10000)

    it('POST should create a new job', async () => {
        const res = await request(app)
            .post('/api/v1/jobs')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: "Test Jest for Jobs 2 ",
                jobTitle: "Test Jest for Jobs  2",
                salaryMin: 1000,
                salaryMax: 3000,
                address: {
                    "city": "DN",
                    "country": "Viet Nam"
                },
                employmentType: "Full-time",
                skills: ["Java", "Javascript"],
                jobExpertise: "Kỹ sư fullstack",
                jobDomain: "Dịch vụ Web",
                description: "Công việc hấp dẵn"
            })

        expect(res.statusCode).toBe(201)
        jobId = res.body._id
    }, 10000)

    it('GET(allJobs) should return all job', async () => {
        const res = await request(app)
            .get('/api/v1/jobs')

        expect(res.statusCode).toBe(200)
    }, 10000)

    it('GET(jobById) should return job by id', async () => {
        const res = await request(app)
            .get(`/api/v1/jobs/${jobId}`)

        expect(res.statusCode).toBe(200)
    }, 10000)

    it('PUT should update the job', async () => {
        const res = await request(app)
            .put(`/api/v1/jobs/${jobId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Updated Test Job',
            })

        expect(res.statusCode).toBe(200)
    }, 10000)

    it('DELETE should return message success', async () => {
        const res = await request(app)
            .delete(`/api/v1/jobs/${jobId}`)
            .set('Authorization', `Bearer ${token}`)

        expect(res.statusCode).toBe(200)
    }, 10000)
})

afterAll(async () => {
    await mongoose.disconnect()
})