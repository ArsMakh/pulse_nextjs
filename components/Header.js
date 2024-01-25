import Link from "next/link"
import Router from "next/router"
import { useEffect, useState } from "react"
import { getCookies, setCookie, deleteCookie, getCookie } from 'cookies-next'

export default function Header({ user }) {
    const [lang, setLang] = useState(user.lang)

    function logout() {
        fetch('http://localhost/api/logout', {
            method: "POST"
        })
            .then(res => res.json())
            .then(data => {
                if (data.success === true) Router.push('/login')
            })
    }

    function changeLang(){
        if(lang == "en") setLang("ru")
        else if(lang == "ru") setLang("en")
        else setLang("ru")

        fetch('http://localhost/api/change_lang', {
            method: "POST"
        })
            .then(res => res.json())
            .then(data => {
                if (data.success === true) location.reload()
            })
    }

    function menu_open(){
        document.querySelector('main').classList.add('opened')
        $("#header_menu").fadeOut();
        setCookie('left_sidebar', 'opened')
    }

    return (
        <header className="header container-fluid" id="t_Header">
            <a href="/" id="headerHomeImg">
                <img src="/images/logo_home.svg" />
            </a>

            <img src="/images/menu_open.svg" id="header_menu" alt="menu" onClick={menu_open} />

            <div id="headerTop" className="header-branding" role="banner">
                <div id="headerNavBarWrap">
                    <div id="headerNavBar">
                        <div id="headerNavBarBlocks">
                            <div id="headerNavBarButton">
                                <img src="/images/MenuUser.svg" id="MenuUser" alt="img" />
                                {(user && user.name) ?
                                    <span>{user.name}</span>
                                    :
                                    null
                                }
                            </div>
                            <div id="headerNavBarOptions">
                                <ul>
                                    <li>
                                        {(lang && lang == 'en') ?
                                            <span onClick={changeLang} data-lang="en">
                                                <span><img src="/images/us.svg" /></span>
                                                <span>EN</span>
                                            </span>
                                            :
                                            <span onClick={changeLang} data-lang="ru">
                                                <span><img src="/images/ru.svg" /></span>
                                                <span>RU</span>
                                            </span>
                                        }
                                    </li>
                                    <li>
                                        <a href="">
                                            <span><img src="/images/portal_logo_semifull.svg" /></span>
                                            <span>Портал</span>
                                        </a>
                                    </li>
                                    <li>
                                        <span>
                                            <span><span aria-hidden="true" className="fa fa-key" /></span>
                                            <span>Сменить пароль</span>
                                        </span>
                                    </li>
                                    <li>
                                        <span onClick={logout}>
                                            <span><span aria-hidden="true" className="fa fa-sign-out" /></span>
                                            <span>Выход</span>
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <a href="http://www.ibrae.ac.ru/" id="headerIBRAE">
                            <img src="/images/logo_ibrae.svg" />
                        </a>
                    </div>
                </div>
            </div>

            <a href="/" id="headerLogoText">
                <img src="/images/PulseLogo.svg" />
            </a>
        </header>
    )
}