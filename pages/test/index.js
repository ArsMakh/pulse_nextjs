import { MainLayout } from "../../layouts/MainLayout"
import Link from "next/link"
import Router from "next/router";
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

        var response = await fetch('http://localhost/api/users')
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

function UserList(props) {
    const users = props.users

    const listItems = users.map(({ id, name, login, ymd }) =>
        <tr key={id} scope="row">
            <td>{id}</td>
            <td>{name}</td>
            <td>{login}</td>
            <td>{ymd}</td>
        </tr>
    )

    return (
        <>
            <h4>Список пользователей из БД</h4>
            <table className="table table-striped table-dark">
                <thead>
                    <tr scope="row">
                        <th>ID</th>
                        <th>Name</th>
                        <th>Login</th>
                        <th>RegDate</th>
                    </tr>
                </thead>
                <tbody>
                    {listItems}
                </tbody>
            </table>
        </>
    )
}

const linkClickHandler = () => {
    Router.push('/')
}

export default function Test({ page_data, data }) {
    const [dbData, setDbData] = useState(data)
    const [user, setUser] = useState(page_data.user)

    return (
        <MainLayout title={"Test"} user={user}>
            <h1>Test</h1>
            <p><Link href="/">Home</Link> / Test</p>
            <hr />

            {(user && user.auth === true) ?
                <div>
                    <div className="alert alert-info">
                        Вы авторизованы как "{user.name}"
                    </div>
                </div>
                :
                null
            }

            <p>
                <Link href="/test/empty">Empty</Link> | <Link href="/reg">Registration</Link> | <Link href="/login">Login</Link>
            </p>

            <hr />
            <p>
                <button className='btn btn-sm btn-info me-2' onClick={linkClickHandler}>Go back to home</button>
                <button className='btn btn-sm btn-danger' onClick={() => Router.push('/test/posts')}>Go to posts</button>
            </p>

            <hr />

            {
                dbData && dbData.rows.length > 0
                    ? <UserList users={dbData.rows} />
                    : <p>Загрузка из БД <i className="fa fa-fw fa-spinner fa-spin"></i></p>
            }
        </MainLayout>
    )
}