import type { NextApiRequest, NextApiResponse } from "next"
import conn from '../../db'

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        // const query1 = `CREATE TABLE users (id serial primary key, name character varying(30), email character varying(128), regdate date DEFAULT CURRENT_TIMESTAMP, password character varying(128))`
        // const result1 = await conn.query(query1)

        const query = `SELECT * FROM ac."user" ORDER BY id ASC LIMIT 10`
        // const query = `SELECT *, TO_CHAR(regdate, 'YYYY-MM-DD') AS ymd FROM users ORDER BY id ASC`
        const result = await conn.query(query)

        setTimeout(() => {
            res.status(200).json(result)
        }, 1000)
    }
    catch (error) {
        res.status(500).json({ error: 'failed to load data' })
    }
};