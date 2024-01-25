import type { NextApiRequest, NextApiResponse } from "next";
import conn from '../../db'
import { withSessionRoute } from "../../lib/session";
import * as fn from "../../lib/myFunctions"

export default withSessionRoute(
    async (req: NextApiRequest, res: NextApiResponse) => {
        if (req.method !== 'POST') return res.status(400).json({ error: 'bad request' })

        if (!req.body) return res.status(400).json({ error: 'bad request' })

        try {
            var msg_success = ''
            var msg_error = ''

            let p_json = {
                login: req.body.login,
                password: req.body.pass,
                real_ip: fn.get_ip(req),
                lang: 'ru',
                app: 'PULSE'
            }
            let json_stringify = JSON.stringify(p_json)

            const query = `SELECT security.js_login($1::text)`
            const result = await conn.query(query, [json_stringify])
            const Qdata = result.rows[0].js_login
            if (result.rows.length && Qdata.success === 1) {
                msg_success += 'Вы успешно авторизованы'
                req.session.user = {
                    auth: true,
                    name: Qdata.data.username || "unknown",
                    db_sess_id: Qdata.data.session_id || null,
                    token: Qdata.data.token || null,
                    lang: "ru"
                };
                await req.session.save();
            }
            else {
                msg_error += Qdata.error_text

                // req.session.destroy();
            }

            res.status(200).json({
                msg: {
                    success: msg_success,
                    error: msg_error
                },
                user: {
                    auth: req.session.user ? req.session.user.auth : false,
                    name: req.session.user ? req.session.user.name : null,
                    lang: req.session.user ? req.session.user.lang : "ru",
                }
            })
        } catch (err) {
            res.status(500).json({ msg: {error: 'failed to load data', success: ''} })
        }
    }
)