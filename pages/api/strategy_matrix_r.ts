import type { NextApiRequest, NextApiResponse } from "next";
import conn from '../../db'
import { withSessionRoute } from "../../lib/session";
import * as fn from "../../lib/myFunctions"

export default withSessionRoute(
    async (req: NextApiRequest, res: NextApiResponse) => {
        if (req.method !== 'POST') return res.status(400).json({ error: 'bad request' })

        const body = req.body

        var p_session_id = req.session.user.db_sess_id

        try {
            let p_json = {
                version_id: body.version,
                fulltext_search: body.search_str
            }

            const query = `SELECT app_pulse.strategy_matrix_r($1, $2)`
            const result = await conn.query(query, [p_session_id, JSON.stringify(p_json)])
            if(result?.rows && result.rows.length && result.rows[0]?.strategy_r){
                const Qdata = result.rows[0].strategy_r

                res.status(200).json({list: Qdata?.list ?? []})
            }
            else res.status(204).json({ error: 'No Content (нет содержимого)' })
        }
        catch (err) {
            res.status(500).json({ error: 'failed to load data' })
        }
    }
)