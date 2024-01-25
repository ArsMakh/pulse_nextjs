import Link from "next/link"
import { useEffect, useState } from "react"
import { withSessionSsr } from "../lib/session";
import { MainLayout } from "../layouts/MainLayout"

export const getServerSideProps = withSessionSsr(
    async function getServerSideProps({ req }) {
        return {
            props: {
                page_data: {
                    user: {
                        auth: req.session.user ? req.session.user.auth : false,
                        name: req.session.user ? req.session.user.name : null,
                        lang: req.session.user ? req.session.user.lang : "ru",
                    },
                    msg:{
                        success: '',
                        error: ''
                    }
                },
            }
        }
    }
)

export default function Reg({ page_data }) {
    const [data, setData] = useState(page_data.msg)
    const [user, setUser] = useState(page_data.user)

    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = new URLSearchParams();
        formData.append("email", (document.querySelector('input[name=email]') as HTMLInputElement).value)
        formData.append("login", (document.querySelector('input[name=login]') as HTMLInputElement).value)
        formData.append("name", (document.querySelector('input[name=name]') as HTMLInputElement).value)
        formData.append("pass", (document.querySelector('input[name=pass]') as HTMLInputElement).value)

        fetch('http://localhost/api/reg', {
            method: "POST",
            body: formData.toString(),
            headers: {
                "content-type": "application/x-www-form-urlencoded",
            }
        })
            .then((response) => response.json())
            .then((result) => {
                setData(result)
            });
    };

    return (
        <MainLayout title={"Registration"} user={user}>
            <h1>Registration</h1>
            <p><Link href="/">Home</Link> / Registration</p>
            <hr />

            {(data.msg) ?
                <div>
                    <div className="alert alert-success">
                        <p>Добавлен новый пользователь: <strong>{data.msg.name}</strong></p>
                    </div>
                </div>
                :
                null
            }

            <div className="row justify-content-center">
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-header text-center">Регистрация</div>
                        <div className="card-body d-flex justify-content-center">
                            <form onSubmit={handleSubmit} method="POST">
                                <p>
                                    <label className="d-block fw-bold text-center">E-mail</label>
                                    <input type="email" name="email" className="form-control" required />
                                </p>
                                <p>
                                    <label className="d-block fw-bold text-center">Login</label>
                                    <input type="text" name="login" className="form-control" required />
                                </p>
                                <p>
                                    <label className="d-block fw-bold text-center">Password</label>
                                    <input type="password" name="pass" className="form-control" required />
                                </p>
                                <p>
                                    <label className="d-block fw-bold text-center">Name</label>
                                    <input type="text" name="name" className="form-control" required />
                                </p>
                                <p className="text-center">
                                    <button type="submit" className="btn btn-info w-100 text-white">Регистрация</button>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}