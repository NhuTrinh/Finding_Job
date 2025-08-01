

import request from 'supertest'
import app from '../../server.js'
import connectDB from '../../config/db.js'
import mongoose from 'mongoose'

export async function getCandidateToken() {
    if (mongoose.connection.readyState !== 1) {
        await connectDB()
    }
    const res = await request(app)
        .post('/api/v1/accounts/candidate/login')
        .send({
            email: 'ungvien3@gmail.com',
            password: '12345678',
        })

    if (res.statusCode !== 200) {
        throw new Error(`Candidate login failed: ${res.body.message}`)
    }

    return res.body.token
}

export async function getRecruiterToken() {
    if (mongoose.connection.readyState !== 1) {
        await connectDB()
    }

    const res = await request(app)
        .post('/api/v1/accounts/recruiter/login')
        .send({
            email: 'nhatuyendung5@gmail.com',
            password: '12345678',
        })

    if (res.statusCode !== 200) {
        throw new Error(`Recruiter login failed: ${res.body.message}`)
    }

    return res.body.token
}
