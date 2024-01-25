import { MainLayout } from "../layouts/MainLayout"
import { useEffect, useState } from "react"

import { withSessionSsr } from "../lib/session";

import PulseBlocks from '../components/PulseBlocks'

export const getServerSideProps = withSessionSsr(
    async function getServerSideProps({ req }) {
        if (!(req.session && req.session?.user?.auth === true)) {
            return {
                redirect: {
                    destination: '/login',
                    permanent: false,
                }
            }
        }

        var response = await fetch('http://localhost/api/pulse_blocks', {
            method: 'POST',
            headers: req.headers
        })
        const pulseblocks = await response.json()

        return {
            props: {
                page_data: {
                    user: {
                        auth: req.session.user ? req.session.user.auth : false,
                        name: req.session.user ? req.session.user.name : null,
                        lang: req.session.user ? req.session.user.lang : "ru",
                    }
                },
                pulseblocks
            }
        }
    }
);

export default function Index({ page_data, pulseblocks }) {
    const [user, setUser] = useState(page_data.user)

    return (
        <MainLayout title={"PULSE - Главная страница"} keywords={"PULSE"} description={"Next App for PULSE"} user={user} >
            <PulseBlocks list={pulseblocks} />
        </MainLayout>
    )
}