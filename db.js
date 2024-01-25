import { Pool } from "pg";

let conn;

if (!conn) {
    conn = new Pool({
        // host: 'localhost',
        // port: 5432,
        // database: 'postgres',

        // host: 'pgdb',
        // port: 5432,
        // database: 'postgres',

        host: '91.238.190.94',
        port: 5678,
        database: 'portal',

        // host: 'host.docker.internal', // для соединения к локальной БД через докер-контейнер

        user: 'postgres',
        password: 'formula306',
        // max: 20, // set pool max size to 20
        // idleTimeoutMillis: 30000, // close idle clients after 1 second
        // connectionTimeoutMillis: 2000, // return an error after 1 second if connection could not be established
        // maxUses: 7500, // close (and replace) a connection after it has been used 7500 times (see below for discussion)
    });
}

export default conn;