import type { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "../../lib/session";

export default withSessionRoute(
    async (req: NextApiRequest, res: NextApiResponse) => {
        if (req.method !== 'POST') return res.status(400).json({ error: 'bad request' })

        req.session.destroy()
    
        res.status(200).json({ success: true })
    }
)