import type { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "../../lib/session";

export default withSessionRoute(
    async (req: NextApiRequest, res: NextApiResponse) => {
        if (req.method !== 'POST') return res.status(400).json({ error: 'bad request' })
    
        if(req.session.user.lang == "ru") req.session.user.lang = "en"
        else req.session.user.lang = "ru"

        await req.session.save()

        res.status(200).json({ success: true })
    }
)