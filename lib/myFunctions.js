export function get_ip(req) {
    return req.headers["x-real-ip"] || req.connection.remoteAddress

    // if (req.headers["x-forwarded-for"]) return req.headers["x-forwarded-for"].split(',')[0]
    // else if (req.headers["x-real-ip"]) return req.connection.remoteAddress
    // else return req.connection.remoteAddress
}