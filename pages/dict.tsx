import { MainLayout } from "../layouts/MainLayout"
import { useEffect, useState } from "react"
import { Fragment } from 'react'

import { withSessionSsr } from "../lib/session"
import { getCookies, setCookie, deleteCookie, getCookie } from 'cookies-next'

import Bredcrumb from '../components/Bredcrumb'

const page_code = 'dict'
const app_code = 'PULSE'

export const getServerSideProps = withSessionSsr(
    async function getServerSideProps({ req, res }) {
        if (!(req.session && req.session?.user?.auth === true)) {
            return {
                redirect: {
                    destination: '/login',
                    permanent: false,
                }
            }
        }

        // BREDCRUMB
        var response = await fetch('http://localhost/api/bredcrumb_menu', {
            method: 'POST',
            headers: req.headers,
            body: JSON.stringify([page_code, app_code, 'pulse_main'])
        })
        const bredcrumb_menu = await response.json()

        var response = await fetch('http://localhost/api/page_data', {
            method: 'POST',
            headers: req.headers,
            body: JSON.stringify({page_code, app_code})
        })
        const data = await response.json()

        if(data?.error == 'Session not exists'){
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
                    },
                    bredcrumb_menu,
                    data,
                }
            }
        }
    }
)

export default function Page({ page_data }) {
    // console.log('page_data', page_data.data.alpha)

    const [user, setUser] = useState(page_data.user)
    const [lang, setLang] = useState(2);
    const [sym, setSym] = useState('~');
    const [search, setSearch] = useState('');
    const [data, setData] = useState(page_data.data);

    // console.log('data1', data.alpha)

    useEffect(() => {
        console.log('useEffect1')
    },[])

    useEffect(() => {
        console.log('useEffect2')
    })

    function updatePageData(){
        console.log('updatePageData')

        console.log('lang:', lang)
        console.log('sym:', sym)
        console.log('search:', search)

        fetch('http://localhost/api/dict_r', {
            method: "POST",
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                lang_id: Number(lang),
                sym: sym,
                fulltext_search: search
            })
        })
        .then((response) => response.json())
        .then((data) => {
            console.log('new_data:', data.data)
            if(data?.error) alert(data.error)
            else setData(data.data)
        })
    }

    function dictChangeLang(event) {
        console.log('dictChangeLang:', event.currentTarget.value)
        setLang(Number(event.currentTarget.value))
        setSym('')
        setSearch('')

        updatePageData()
    }

    function funcsearch(str){
        console.log('funcsearch')
        setSearch(str)

        updatePageData()
    }

    function changeSym(event){
        console.log('changeSym:', event.currentTarget.value)
        setSym(event.currentTarget.value)

        updatePageData()
    }

    return (
        <MainLayout title={"PULSE - Глоссарий"} keywords={""} description={""} user={user} >
            <Bredcrumb data={page_data.bredcrumb_menu} />

            <div className="row mt-3">
                <div className="col-md-4">
                    <button type="button" className="btn btn-sm btn-light border rounded-0 w-100">
                        Глоссарий PULSE: геология
                    </button>
                </div>
                <div className="col-md-4">
                    <button type="button" className="btn btn-sm btn-light border rounded-0 w-100">
                        Глоссарий PULSE: величины
                    </button>
                </div>
                <div className="col-md-4">
                    <button type="button" className="btn btn-sm btn-light border rounded-0 w-100">
                        Глоссарий PULSE
                    </button>
                </div>
            </div>

            <div className="searchBlock p-3 border mt-3">
                <div className="d-flex">
                    <input type="text" className="form-control form-control-sm rounded-0 w-25" id="inputSearch" placeholder="Поиск" />
                    <button type="button" className="btn btn-sm btn-light border rounded-0 ms-1" title="Найти"
                        onClick={() => { funcsearch((document.querySelector("#inputSearch") as HTMLInputElement).value) }}>
                        <i className="fa-solid fa-magnifying-glass fa-fw"></i>
                    </button>
                    <button type="button" className="btn btn-sm btn-light border rounded-0 ms-1" title="Сбросить">
                        <i className="fa-solid fa-rotate-left fa-fw"></i>
                    </button>
                    <button type="button" className="btn btn-sm btn-light border rounded-0 ms-1" title="Выгрузить список на экран">
                        <i className="fa-solid fa-download fa-fw"></i>
                    </button>
                </div>
            </div>

            {data?.lang_id &&
                <div className="mt-3">
                {
                    data?.lang_id.map((item, index) => {
                        return (
                            <label key={item.id} className="fs-9 fw-bold label_checkbox me-2" role="button">
                                <input type="radio" name="dict_lang" role="button"
                                    value={item.id}
                                    checked={item.id == lang || item.curr == 'Y'}
                                    onChange={dictChangeLang} />
                                {item.dname}
                            </label>
                        )
                    })
                }
                </div>
            }

            {data?.alpha &&
                <div className="mt-3">
                {
                    data?.alpha.map((item, index) => {
                        return (
                            <button key={index} type="button"
                                className={`btn btn-sm btn-light border rounded-0 me-1 ${(item.val == sym || item.curr == 1) ? "active" : ""}`}
                                title="Перейти к списку"
                                value={item.syn}
                                onClick={changeSym}>
                                {item.val}
                            </button>
                        )
                    })
                }
                </div>
            }

            {data?.list &&
                <div className="mt-3 row">
                {
                    data?.list.map((item, index) => {
                        return (
                            <div className="col-md-4 fs-8" key={index}>
                                <input type="checkbox" value={item.id} onChange={(event) => {console.log(event.currentTarget.value)}} />
                                <span className="ms-1 text-decoration-underline text-blue"
                                    data-id={item.id}
                                    role="button"
                                    onClick={(event) => {console.log(event.currentTarget.getAttribute("data-id"))}}>
                                    {item.name}
                                </span>
                            </div>
                        )
                    })
                }
                </div>
            }
        </MainLayout>
    )
}