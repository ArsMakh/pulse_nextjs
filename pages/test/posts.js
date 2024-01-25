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

        var response = await fetch('https://jsonplaceholder.org/posts/')
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

export default function Posts({ page_data, data }) {
    const [posts, setPosts] = useState(data)
    const [user, setUser] = useState(page_data.user)

    useEffect(() => {
        async function load() {
            var response = await fetch('https://jsonplaceholder.org/posts')
            const json = await response.json()
            setPosts(json)
        }

        if (!data) load()
    }, [])

    if (!posts) {
        return (
            <MainLayout title={"Posts"} user={user}>
                <p>Loading ...</p>
            </MainLayout>
        )
    }

    return (
        <MainLayout title={"Posts"} user={user}>
            <h1>Posts</h1>
            <p><Link href="/">Home</Link> / <Link href="/test">Test</Link> / Posts</p>
            <hr />

            <div className="row">
                {(posts && posts.length > 0) ?
                    posts.map((item, index) => {
                        return (
                            <div className="col-md-3 mb-4" key={item.id} index={index}>
                                <div className="card h-100">
                                    <div className="card-header text-center">
                                        <Link href={"/test/post/" + item.id}>Post #{item.id} Page</Link>
                                    </div>

                                    <img src={item.thumbnail} className="w-100" alt="" />

                                    <div className="card-body text-center">{item.title}</div>

                                    <div className="card-footer text-center">
                                        <Link href={"/test/post/" + item.id} legacyBehavior>
                                            <a className="btn btn-primary">Read More</a>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )
                    })

                    :

                    <p>Нет постов...</p>
                }
            </div>
        </MainLayout>
    )
}