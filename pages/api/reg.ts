import type { NextApiRequest, NextApiResponse } from "next"
import conn from '../../db'
const crypto = require("crypto")

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if(req.method !== 'POST') return res.status(400).json({ error: 'bad request' })

    if(!req.body) return res.status(400).json({ error: 'bad request' })

    try {
        // To hash a password
        let hash_pass = crypto.createHash('md5').update(req.body.pass).digest('hex')

        const query = `INSERT INTO users(email, login, name, password) VALUES($1, $2, $3, $4) RETURNING *, TO_CHAR(regdate, 'YYYY-MM-DD') AS ymd`
        const result = await conn.query(query, [req.body.email, req.body.login, req.body.name, hash_pass]);

        res.status(200).json({ msg: req.body, response: result })
    } catch (err) {
        res.status(500).json({ msg: {error: 'failed to load data', success: ''} })
    }
}