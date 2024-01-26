import Link from "next/link"
import { useEffect, useState } from "react"
import { withSessionSsr } from "../lib/session";
import { LoginLayout } from "../layouts/LoginLayout"

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
);

function ModalReg() {
    return (
        <div className="modal fade" id="ModalReg" tabIndex={-1} role="dialog" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Modal title</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <p>ModalReg</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary">
                            Save changes
                        </button>
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ModalRemindPass() {
    return (
        <div className="modal fade" id="ModalRemindPass" tabIndex={-1} role="dialog" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Modal title</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <p>ModalRemindPass</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary">
                            Save changes
                        </button>
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function Login({ page_data }) {
    const [data, setData] = useState(page_data.msg)
    const [user, setUser] = useState(page_data.user)

    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = new URLSearchParams();
        formData.append("login", (document.querySelector('input[name=login]') as HTMLInputElement).value)
        formData.append("pass", (document.querySelector('input[name=pass]') as HTMLInputElement).value)
        formData.append("remember", (document.querySelector('input[name=remember]') as HTMLInputElement).value)

        fetch('/api/login', {
            method: "POST",
            body: formData.toString(),
            headers: {
                "content-type": "application/x-www-form-urlencoded",
            },
            // cache: 'no-store', // Отключаем кэш
            // next: {revalidate: 10}, // Обновляем кеш через каждые 10 секунд
        })
            .then((response) => response.json())
            .then((result) => {
                setData(result)
                if (result.user != undefined) setUser(result.user)
                if (result.msg.success){
                    location.href = '/'
                    return false
                }
            });
    };

    return (
        <LoginLayout title={"PULSE | Login"} user={user} >
            <section className="LoginWrapper">
                <div id="wrap_form_login">
                    {(data.msg && data.msg.error) ?
                        <div>
                            <div className="alert alert-danger"
                                dangerouslySetInnerHTML={{ __html: data.msg.error }}>
                            </div>
                        </div>
                        :
                        null
                    }

                    <div id="login_languages">
                        <img id="form_login_logo" src="images/LoginLogo.svg" />
                        <ul>
                            <li><a id="ru_lang" href="#" className="a-LinksList-link active">русский</a></li>
                            <li><a id="en_lang" href="#" className="a-LinksList-link">english</a></li>
                        </ul>
                    </div>
                    
                    <div id="form_login">
                        <form id="form_login_content" onSubmit={handleSubmit} method="POST">
                            <ul>
                                <li>
                                    <img src="images/PulseUser.svg" />
                                    <input type="text" name="login" className="form-control" maxLength={100} required />
                                </li>
                                <li>
                                    <img src="images/PulseKey.svg" />
                                    <input type="password" name="pass" className="form-control" maxLength={100} required />
                                </li>
                            </ul>
                            
                            <div id="div_login_button">
                                <button type="submit" id="login_button">
                                    <img src="images/LoginButtonArrow.svg" alt="IMG" /> ВОЙТИ
                                </button>
                            </div>
                            
                            <div id="login_checkbox_wrapper">
                                <label id="login_checkbox">
                                    <label htmlFor="remember"></label>
                                    <input type="checkbox" id="remember" name="remember" defaultValue="Y" defaultChecked={true} />
                                    <span className="login_checkbox_decor"></span>
                                </label>

                                <label htmlFor="remember">Запомнить пользователя</label>
                            </div>
                            
                            <div className="wrap_sendpass">
                                <span className="sendpass" data-toggle="modal" data-target="#ModalRemindPass">Забыли пароль?</span>
                            </div>
                        </form>
                    </div>
                    
                    <div id="login_info_text">
                        <div>
                            <button type="button" id="reg_button" data-toggle="modal" data-target="#ModalReg">Заявка на регистрацию</button>
                        </div>
                        <div>
                            <span>Сообщить о проблеме:&nbsp;<br />
                            <a href="mailto:tech_portal@ibrae.ac.ru">tech_portal@ibrae.ac.ru</a></span>
                        </div>
                    </div>
                </div>
            </section>

            <ModalReg />
            <ModalRemindPass />
        </LoginLayout>
    )
}