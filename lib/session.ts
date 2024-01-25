import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";
import { serialize, parse } from 'cookie';

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      auth: boolean;
      name: string;
      db_sess_id: string;
      token: string;
      lang: string;
    };
  }
}

const sessionOptions = {
  cookieName: "login",
  // password: "complex_password_at_least_32_characters_long",
  password: process.env.SECRET_COOKIE_PASSWORD,
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export function withSessionRoute(handler) {
  return withIronSessionApiRoute(handler, sessionOptions);
}

export function withSessionSsr(handler) {
  return withIronSessionSsr(handler, sessionOptions);
}

// export function setSession(req, res, sessionData) {
//     const session = { ...req.session, ...sessionData };
//     const serializedSession = serialize(sessionOptions.cookieName, session, sessionOptions.cookieOptions);
//     res.setHeader('Set-Cookie', serializedSession);
// }

// export function getSession(req) {
//     return parse(req.headers.cookie ?? '')[sessionOptions.cookieName] ?? {};
// }