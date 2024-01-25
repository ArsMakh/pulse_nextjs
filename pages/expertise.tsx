import { MainLayout } from "../layouts/MainLayout"
import { useEffect, useState } from "react"
import { Fragment } from 'react'

import { withSessionSsr } from "../lib/session"
import { getCookies, setCookie, deleteCookie, getCookie } from 'cookies-next'

import Bredcrumb from '../components/Bredcrumb'

function Table({ data, addexp }) {
    // const [openedCarets, setOpenedCarets] = useState([])

    // useEffect(() => {
    //     setOpenedCarets(getCookie('phase_caret_list')?.split(',') ?? [])
    // },[])

    if (!data.length) {
        return (
            <div className="p-3 text-center">Нет данных</div>
        )
    }

    function openCard(event) {
        console.log(event.currentTarget.getAttribute("data-id"))
    }

    return (
        <div className="mt-3">
            {/* Table */}
            <div className={`table-responsive vh-100`}>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th></th>
                            <th></th>
                            <th className="align-middle">№ п/п</th>
                            <th className="align-middle">Экспертиза</th>
                            <th className="align-middle">Эксперты</th>
                            <th className="align-middle">Фаза проекта</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map((item, index) => {
                                return (
                                    <tr key={item.id ?? index}>
                                        <td></td>
                                        <td className="align-middle">
                                            <span className="badge bg-brown fs-10 lh-1 rounded-1 align-bottom" role="button"
                                                onClick={openCard} data-id={item.id}>
                                                <i className="fa fa-info" aria-hidden="true" title="Карточка"></i>
                                            </span>
                                        </td>
                                        <td></td>
                                        <td className="align-middle">{item.name}</td>
                                        <td></td>
                                        <td className="align-middle">{item.phase}</td>
                                        <td className="align-middle">
                                            <span className="fa fa-fw fa-circle-plus" role="button" title={addexp}></span>
                                        </td>
                                        <td></td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>

            <style>{``}</style>
        </div>
    )
}

function ModalCard() {
    return (
        <div className="modal fade" id="ModalCard" tabIndex={-1} role="dialog" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-xl" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Modal title</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <p>Modal Content</p>
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

        const page_code = 'expertise'
        const app_code = 'PULSE'

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
    const [user, setUser] = useState(page_data.user)

    console.log(page_data)

    useEffect(() => {},[])

    return (
        <MainLayout title={"PULSE - Экспертиза"} keywords={""} description={""} user={user} >
            <Bredcrumb data={page_data.bredcrumb_menu} />

            <div className="searchBlock p-3 border mt-3">
                <div className="d-flex">
                    <input type="text" className="form-control form-control-sm rounded-0 w-25" placeholder={page_data.data.page_label.page.fulltext_search} />
                    <button type="button" className="btn btn-sm btn-outline-dark rounded-0 ms-1" title="Найти">
                        <i className="fa-solid fa-magnifying-glass fa-fw"></i>
                    </button>
                    <button type="button" className="btn btn-sm btn-outline-dark rounded-0 ms-1" title="Сбросить">
                        <i className="fa-solid fa-rotate-left fa-fw"></i>
                    </button>
                </div>
            </div>

            <Table data={page_data.data?.list ?? []} addexp={page_data.data.page_label.page.addexp} />

            <ModalCard />
        </MainLayout>
    )
}