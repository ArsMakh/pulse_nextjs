import { MainLayout } from "../../layouts/MainLayout"
import Link from "next/link"
import { useEffect, useState } from "react"
import { withSessionSsr } from "../../lib/session";

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

        return {
            props: {
                page_data: {
                    user: {
                        auth: req.session.user ? req.session.user.auth : false,
                        name: req.session.user ? req.session.user.name : null,
                        lang: req.session.user ? req.session.user.lang : "ru",
                    }
                },
            },
        }
    }
)

export default function Empty({page_data}) {
    const [user, setUser] = useState(page_data.user)

    return (
        <MainLayout title={"Author Page"} user={user}>
            <h1>Empty</h1>
            <p><Link href="/">Home</Link> / <Link href="/test">Test</Link> / Empty</p>
            <hr />

            <p>Empty...</p>
        </MainLayout>
    )
}