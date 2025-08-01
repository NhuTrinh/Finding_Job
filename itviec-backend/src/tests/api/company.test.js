

import request from 'supertest'
import app from "../../server.js"
import mongoose from 'mongoose'
import { getRecruiterToken } from '../setup/token.js'

describe('COMPANY /api/v1/companies ', () => {
    let token
    let companyId = '685b44346b37314e0439e458'

    beforeAll(async () => {
        token = await getRecruiterToken()
    }, 10000)

    it('GET(allCompanies) should return all company', async () => {
        const res = await request(app)
            .get('/api/v1/companies')

        expect(res.statusCode).toBe(200)
    }, 10000)

    it('GET(companyById) should return company by id', async () => {
        const res = await request(app)
            .get(`/api/v1/companies/${companyId}`)

        expect(res.statusCode).toBe(200)
    }, 10000)

    it('PUT should update the company', async () => {
        const res = await request(app)
            .put(`/api/v1/companies/${companyId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: "Updated test jest",
                address: {
                    line: "6 Linh Trung",
                    city: "Hồ Chí Minh",
                    country: "Việt Nam"
                }
            })

        expect(res.statusCode).toBe(200)
    }, 10000)
})

afterAll(async () => {
    await mongoose.disconnect()
})

