import type { NextApiRequest, NextApiResponse } from "next";
import conn from '../../db'
import { withSessionRoute } from "../../lib/session";

export default withSessionRoute(
    async (req: NextApiRequest, res: NextApiResponse) => {
        if (req.method !== 'POST') return res.status(400).json({ error: 'bad request' })
    
        const query = `SELECT app_pulse.main_r($1, null::json)`
        const result = await conn.query(query, [req.session?.user?.db_sess_id])

        res.status(200).json(result.rows[0].main_r.data)
    }
)