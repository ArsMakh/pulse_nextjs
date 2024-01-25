import { MainLayout } from "../layouts/MainLayout"
import { useEffect, useState } from "react"
import { Fragment } from 'react'

import { withSessionSsr } from "../lib/session"
import { getCookies, setCookie, deleteCookie, getCookie } from 'cookies-next'

import Bredcrumb from '../components/Bredcrumb'

const page_title = 'PULSE - Планируемые эксперименты'
const page_code = 'experiment'
const app_code = 'PULSE'

function ModalStrategyCard() {
    return (
        <div className="modal fade" id="ModalStrategyCard" tabIndex={-1} role="dialog" aria-hidden="true">
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
                        sess_id: req.session.user ? req.session.user.db_sess_id : null,
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
    const [data, setList] = useState(page_data.data?.list ?? [])
    const [searchStr, setSearchStr] = useState('')
    const [openedCarets, setOpenedCarets] = useState([])

    useEffect(() => {
        setOpenedCarets(getCookie('experiment_caret_list')?.split(',') ?? [])
    },[])

    if (!data.length) {
        return (
            <div className="p-3 text-center">Нет данных</div>
        )
    }

    function phaseСaret(event){
        var obj = event.target
        
        if(obj.classList.contains('fa-caret-right')){
            obj.classList.add("fa-caret-down")
            obj.classList.remove("fa-caret-right")

            document.querySelectorAll('tr[data-id="'+ obj.getAttribute("data-phase-id") +'"]').forEach(function (item) {
                item.classList.remove('d-none')
            })
        }
        else{
            obj.classList.add("fa-caret-right")
            obj.classList.remove("fa-caret-down")

            document.querySelectorAll('tr[data-id="'+ obj.getAttribute("data-phase-id") +'"]').forEach(function (item) {
                item.classList.add('d-none')
            })
        }
        
        var arr = []
        document.querySelectorAll('.exp_phase_caret > span.fa-caret-down').forEach(function (item) {
            arr.push(item.getAttribute("data-phase-id"))
        })
        setOpenedCarets(arr)
        setCookie('experiment_caret_list', arr.join(','), { path: '/'+page_code })
    }

    function expandAllPhaseСaret(){
        var arr = []
        document.querySelectorAll('.exp_phase_caret > span.fa').forEach(function (item) {
            arr.push(item.getAttribute("data-phase-id"))
        })
        setOpenedCarets(arr)
        setCookie('experiment_caret_list', arr.join(','), { path: '/'+page_code })
    }

    function collapseAllPhaseСaret(){
        setOpenedCarets([])
        deleteCookie('experiment_caret_list', { path: '/'+page_code })
    }

    function funcSearchStr(str){
        // fetch('http://localhost/api/exp_matrix_r', {
        //     method: "POST",
        //     headers: {
        //         'Content-type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         version: version ?? null,
        //         search_str: str
        //     })
        // })
        // .then((response) => response.json())
        // .then((data) => {
        //     if(data?.error) alert(data.error)
        //     else setList(data?.list ?? [])
        // })
    }

    function openCard(event) {
        console.log(event.currentTarget.getAttribute("data-id"))
    }

    return (
        <MainLayout title={page_title} keywords={""} description={""} user={user} >
            <Bredcrumb data={page_data.bredcrumb_menu} />

            {/* Search block */}
            <div className="searchBlock p-3 border">
                <div className="d-flex">
                    <input type="text" className="form-control form-control-sm rounded-0 w-25" id="inputSearch" placeholder={page_data.data.page_label.page.fulltext_search} />
                    <button type="button" className="btn btn-sm btn-success border rounded-0 ms-1" title={page_data.data.page_label.page.findtext}
                        onClick={() => { funcSearchStr((document.querySelector("#inputSearch") as HTMLInputElement).value) }}>
                        <i className="fa-solid fa-magnifying-glass fa-fw"></i>
                    </button>
                    <button type="button" className="btn btn-sm btn-success border rounded-0 ms-1" title={page_data.data.page_label.page.cleartext}>
                        <i className="fa-solid fa-rotate-left fa-fw"></i>
                    </button>
                    <button type="button" className="btn btn-sm btn-light border rounded-0 ms-1" title="Развернуть все"
                        onClick={expandAllPhaseСaret}>
                        <i className="fa-solid fa-up-right-and-down-left-from-center fa-fw"></i>
                    </button>
                    <button type="button" className="btn btn-sm btn-light border rounded-0 ms-1" title="Свернуть все"
                        onClick={collapseAllPhaseСaret}>
                        <i className="fa-solid fa-down-left-and-up-right-to-center fa-fw"></i>
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="mt-3">
                <div className={`table-responsive vh-100 mt-3`}>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th></th>
                                <th>{page_data.data.page_label.list.ordr}</th>
                                <th>{page_data.data.page_label.list.name}</th>
                                <th>{page_data.data.page_label.list.expert}</th>
                                <th>{page_data.data.page_label.list.phase}</th>
                                <th></th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.map((item, index) => {
                                    return (
                                        <tr key={item.id ?? index} className={`${item.dep_level_color == 1 ? "tr_bg" : ""}`} data-id={item.id}>
                                            <td className="align-middle">
                                                {item.dep_level_color == 1 &&
                                                    <button className="btn btn-sm p-0 exp_phase_caret" type="button"
                                                        style={{ 'marginLeft': ((item.lvl - 1) * 10)+'px' }}>
                                                        <span
                                                            className={`fa fa-fw ${openedCarets.includes(String(item.id)) ? 'fa-caret-down' : 'fa-caret-right'}`}
                                                            data-phase-id={item.id} onClick={phaseСaret} aria-hidden="true"></span>
                                                    </button>
                                                }
                                            </td>
                                            <td className="align-middle">
                                                {item.card !== null &&
                                                    <span className="badge bg-brown fs-10 lh-1 rounded-1 align-bottom me-1" role="button"
                                                        onClick={openCard} data-id={item.id}>
                                                        <i className="fa fa-info" aria-hidden="true" title="Карточка"></i>
                                                    </span>
                                                }

                                                {item.name}
                                            </td>
                                            <td className="align-middle">{item.object}</td>
                                            <td className="align-middle">{item.duration}</td>
                                            <td className="align-middle">{item.type}</td>
                                            <td className="align-middle">
                                                <span className={`fa-fw ${item.del2.icon.code}`} title={item.del2.icon.hint}
                                                    style={{ 'fontSize': item.del2.icon.size, 'color': item.del2.icon.color }}></span>
                                            </td>
                                            <td className="align-middle">
                                                {item.addgroup == 1 &&
                                                    <span className={`fa-fw fa fa-level-down`} title="Добавить подгруппу"
                                                        style={{ 'color': item.del2.icon.color }}></span>
                                                }
                                            </td>
                                            <td className="align-middle">
                                                {item.addexp == 1 &&
                                                    <span className={`fa-fw fa fa-list`} title={page_data.data.page_label.page.addexp}
                                                        style={{ 'color': item.del2.icon.color }}></span>
                                                }
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>

            <ModalStrategyCard />

            <style>{`
                .tr_bg{
                    background: rgb(255, 250, 250);
                }
                .exp_phase_caret{
                    font-size: 20px;
                    line-height: inherit;
                    width: 28px;
                    height: 28px;
                }
            `}</style>
        </MainLayout>
    )
}