import type { NextApiRequest, NextApiResponse } from "next"
import conn from '../../db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const query = `SELECT app.js_list('{"code":"pulse_main","parent_id":null}'::json)`
    const result = await conn.query(query)

    res.status(200).json(result.rows[0].js_list)
}