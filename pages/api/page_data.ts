import type { NextApiRequest, NextApiResponse } from "next";
import conn from '../../db'
import { withSessionRoute } from "../../lib/session";
import * as fn from "../../lib/myFunctions"

export default withSessionRoute(
    async (req: NextApiRequest, res: NextApiResponse) => {
        if (req.method !== 'POST') return res.status(400).json({ error: 'bad request' })

        const body = JSON.parse(req.body)

        try {
            let p_json = {
                auth: {
                    token: req.session.user.token,
                    ip: fn.get_ip(req)
                },
                data: {
                    search_str: null,
                    parent_id: null,
                    exp_id: null,
                    question_id: null,
                    version_id: body.version,
                    page_version_id: null,
                }
            }

            const query = `SELECT app.js_render($1::json, $2::text, $3)`
            const result = await conn.query(query, [JSON.stringify(p_json), body.page_code, body.app_code])
            if(result?.rows && result.rows.length && result.rows[0]?.js_render){
                const Qdata = result.rows[0].js_render

                if(Qdata?.auth?.success === 1)
                    res.status(200).json(Qdata?.page ?? {})
                else if(Qdata?.auth?.success === 0)
                    res.status(401).json({ error: Qdata.auth.error_text ?? 'Unauthorized (не авторизован (не представился))' })
                else
                    res.status(511).json({ error: 'Network Authentication Required (требуется сетевая аутентификация)' })
            }
            else res.status(204).json({ error: 'No Content (нет содержимого)' })
        }
        catch (err) {
            res.status(500).json({ error: 'failed to load data' })
        }
    }
)