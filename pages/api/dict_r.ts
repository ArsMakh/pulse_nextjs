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
                lang_id: body.lang_id,
                sym: body.sym,
                fulltext_search: body.fulltext_search
            }

            // console.log(p_session_id, p_json)

            const query = `SELECT app_pulse.dict_r($1, $2)`
            const result = await conn.query(query, [p_session_id, JSON.stringify(p_json)])
            if(result?.rows && result.rows.length && result.rows[0]?.dict_r){
                const Qdata = result.rows[0].dict_r

                res.status(200).json({data: Qdata ?? []})
            }
            else res.status(204).json({ error: 'No Content (нет содержимого)' })
        }
        catch (err) {
            res.status(500).json({ error: 'failed to load data' })
        }
    }
)