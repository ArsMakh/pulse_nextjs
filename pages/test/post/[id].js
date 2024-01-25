import { useRouter } from "next/router"
import Link from "next/link"
import { MainLayout } from "../../../layouts/MainLayout"
import { useEffect, useState } from "react"
import { withSessionSsr, getSession } from "../../../lib/session";

// export const getServerSideProps = async (ctx) => { // Отрабатывает только на сервере
//     const res = await fetch('https://jsonplaceholder.org/posts/' + ctx.query.id)
//     const data = await res.json()
//     return { props: { data } }
// }

export const getServerSideProps = withSessionSsr(
    async function getServerSideProps({ req, query }) {
        if (!(req.session && req.session?.user?.auth === true)) {
            return {
                redirect: {
                    destination: '/login',
                    permanent: false,
                }
            }
        }

        var response = await fetch('https://jsonplaceholder.org/posts/' + query.id)
        const data = await response.json()

        return {
            props: {
                page_data: {
                    user: {
                        auth: req.session.user ? req.session.user.auth : false,
                        name: req.session.user ? req.session.user.name : null,
                        lang: req.session.user ? req.session.user.lang : "ru",
                    }
                },
                data
            },
        }
    }
)

export default function Post({ page_data, data }) {
    const router = useRouter()

    const [post, setPost] = useState(data)
    const [user, setUser] = useState(page_data.user)

    useEffect(() => {
        async function load() {
            var response = await fetch('https://jsonplaceholder.org/posts/' + router.query.id)
            const json = await response.json()

            setPost(json)
        }

        if (!data) load()
    }, [])

    if (!post) {
        return (
            <MainLayout title={"Post " + router.query.id} user={user} >
                <p>Loading ...</p>
            </MainLayout>
        )
    }

    return (
        <MainLayout title={"Post " + router.query.id} user={user} >
            <article>
                <h1>Post {router.query.id}</h1>

                <p><Link href="/">Home</Link> / <Link href="/test/posts">Posts</Link> / ...</p>

                <hr />

                <h4>{post.title}</h4>

                <div>{post.content}</div>

                <hr />

                <p>
                    <button type="button" className="btn btn-sm btn-primary me-2" onClick={() => router.back()}>
                        <i className="fa fa-fw fa-arrow-left"></i> Back
                    </button>
                    <button type="button" className="btn btn-sm btn-secondary" onClick={() => router.reload()}>
                        <i className="fa fa-fw fa-arrow-left-rotate"></i> Reload
                    </button>
                </p>
            </article>
        </MainLayout>
    )
}