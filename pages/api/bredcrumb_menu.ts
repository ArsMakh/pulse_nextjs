import type { NextApiRequest, NextApiResponse } from "next";
import conn from '../../db'
import { withSessionRoute } from "../../lib/session";

export default withSessionRoute(
    async (req: NextApiRequest, res: NextApiResponse) => {
        if (req.method !== 'POST') return res.status(400).json({ error: 'bad request' })

        const body = JSON.parse(req.body)
    
        const query = `SELECT app.js_bredcrumb_menu($1, $2, $3)`
        const result = await conn.query(query, [body[0], body[1], body[2]])

        res.status(200).json(result.rows[0].js_bredcrumb_menu ?? [])
    }
)