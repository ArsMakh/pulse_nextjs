import { MainLayout } from "../layouts/MainLayout"
import { useEffect, useState } from "react"
import { Fragment } from 'react'

import { withSessionSsr } from "../lib/session"
import { getCookies, setCookie, deleteCookie, getCookie } from 'cookies-next'

import Bredcrumb from '../components/Bredcrumb'

const page_code = 'strategy'
const app_code = 'PULSE'

function Strategy({ list, activeTab, version }) {
    const [data, setList] = useState(list)
    const [searchStr, setSearchStr] = useState('')
    const [openedCarets, setOpenedCarets] = useState([])

    useEffect(() => {
        setOpenedCarets(getCookie('phase_caret_list')?.split(',') ?? [])
        console.log('useEffect1')
        console.log('searchStr1', searchStr)
    },[])

    useEffect(() => {
        console.log('useEffect2')
        console.log('searchStr2', searchStr)
    },[searchStr])

    if (!data.length) {
        return (
            <div className="p-3 text-center">Нет данных</div>
        )
    }

    const actions = []
    data[0].actions.forEach(function (item) {
        actions.push({ id: item.id, name: item.name })
    })

    function phaseСaret(event){
        var obj = event.target
        
        if(obj.classList.contains('fa-caret-right')){
            obj.classList.add("fa-caret-down")
            obj.classList.remove("fa-caret-right")

            document.querySelectorAll('tr[data-strategy-phase-id="'+ obj.getAttribute("data-phase-id") +'"]').forEach(function (item) {
                item.classList.remove('d-none')
            })
        }
        else{
            obj.classList.add("fa-caret-right")
            obj.classList.remove("fa-caret-down")

            document.querySelectorAll('tr[data-strategy-phase-id="'+ obj.getAttribute("data-phase-id") +'"]').forEach(function (item) {
                item.classList.add('d-none')
            })
        }
        
        var arr = []
        document.querySelectorAll('.strategy_phase_caret > span.fa-caret-down').forEach(function (item) {
            arr.push(item.getAttribute("data-phase-id"))
        })
        setOpenedCarets(arr)
        setCookie('phase_caret_list', arr.join(','), { path: '/'+page_code })
    }

    function expandAllPhaseСaret(){
        var arr = []
        document.querySelectorAll('.strategy_phase_caret > span.fa').forEach(function (item) {
            arr.push(item.getAttribute("data-phase-id"))
        })
        setOpenedCarets(arr)
        setCookie('phase_caret_list', arr.join(','), { path: '/'+page_code })
    }

    function collapseAllPhaseСaret(){
        setOpenedCarets([])
        deleteCookie('phase_caret_list', { path: '/'+page_code })
    }

    function funcSearchStr(str){
        fetch('http://localhost/api/strategy_matrix_r', {
            method: "POST",
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                version: version ?? null,
                search_str: str
            })
        })
        .then((response) => response.json())
        .then((data) => {
            if(data?.error) alert(data.error)
            else setList(data?.list ?? [])
        })
    }

    function openCard(event) {
        console.log(event.currentTarget.getAttribute("data-id"))
    }

    return (
        <div className="mt-3">
            {/* Table */}
            <div className={`table-responsive vh-100 ${activeTab == 'table_view' ? "" : "d-none"}`}>
                <table className="table table-bordered">
                    <tbody>
                        <tr>
                            <th className="align-bottom">Мероприятия и действия</th>
                            {
                                data.map((item, index) => {
                                    return (
                                        <th className="align-bottom" key={item.phase.id ?? index}>
                                            Фаза №{item.order_num}<br />{item.phase.name}
                                        </th>
                                    )
                                })
                            }
                        </tr>

                        <tr>
                            <th className="align-middle">Длительность</th>
                            {
                                data.map((item, index) => {
                                    return (
                                        <th className="align-middle" key={item.phase.id ?? index}>
                                            {item.duration.replace('Длительность – ', '').replace(/^[–]/u, '')}
                                        </th>
                                    )
                                })
                            }
                        </tr>

                        {
                            actions.map((item, index) => {
                                return (
                                    <tr key={item.id ?? index}>
                                        <td>{item.name}</td>
                                        {
                                            data.map((el, idx) => {
                                                return (
                                                    <td className="align-middle" key={el.actions[index].id + idx ?? idx}>
                                                        <span className="text-decoration-underline" role="button" onClick={openCard} data-id={el.actions[index].id}>
                                                            {el.actions[index].strategy[0].str.name ?
                                                                (
                                                                    el.actions[index].strategy[0].str.name.replace(/\\r\\n/u, ' ')
                                                                ) : (
                                                                    ''
                                                                )
                                                            }
                                                        </span>
                                                    </td>
                                                )
                                            })
                                        }
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>

            {/* Hierarchy */}
            <div className={`${activeTab == 'hierarchy_view' ? "" : "d-none"}`}>
                <div className="searchBlock p-3 border">
                    <div className="d-flex">
                        <input type="text" className="form-control form-control-sm rounded-0 w-25" id="inputSearch" placeholder="Поиск" />
                        <button type="button" className="btn btn-sm btn-success border rounded-0 ms-1" title="Найти"
                            onClick={() => { funcSearchStr((document.querySelector("#inputSearch") as HTMLInputElement).value) }}>
                            <i className="fa-solid fa-magnifying-glass fa-fw"></i>
                        </button>
                        <button type="button" className="btn btn-sm btn-success border rounded-0 ms-1" title="Сбросить">
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
                
                <div className={`table-responsive vh-100 mt-3`}>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th></th>
                                <th></th>
                                <th>Ключевой результат реализации фазы</th>
                                <th>Документ, отражающий ключевой результат</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.map((item, index) => {
                                    return (
                                        <Fragment key={item.phase.id ?? index}>
                                            <tr className="tr_bg">
                                                <td className="align-middle">
                                                    <button className="btn btn-sm p-0 strategy_phase_caret" type="button">
                                                        <span
                                                            className={`fa fa-fw ${openedCarets.includes(String(item.phase.id)) ? 'fa-caret-down' : 'fa-caret-right'}`}
                                                            data-phase-id={item.phase.id} onClick={phaseСaret} aria-hidden="true"></span>
                                                    </button>
                                                </td>
                                                <th className="align-middle">Фаза №{item.order_num} {item.phase.name}</th>
                                                <td className="align-middle"></td>
                                                <td className="align-middle">{item.duration}</td>
                                            </tr>
                                            {
                                                item.actions.map((el, idx) => {
                                                    return (
                                                        <tr key={el.id ?? idx}
                                                            className={openedCarets.includes(String(item.phase.id)) ? '' : 'd-none'}
                                                            data-strategy-phase-id={item.phase.id}>
                                                            <td></td>
                                                            <td className="align-middle">{el.name}</td>
                                                            <td className="align-middle">
                                                                <span className="badge bg-brown fs-10 lh-1 rounded-1 align-bottom me-1" role="button"
                                                                    onClick={openCard} data-id={el.id}>
                                                                    <i className="fa fa-info" aria-hidden="true" title="Карточка"></i>
                                                                </span>
                                                                {el.strategy[0].str.name}
                                                            </td>
                                                            <td className="align-middle">{el.strategy[0].str.description}</td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </Fragment>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>

            <style>{`
                .tr_bg{
                    background: rgb(255, 250, 250);
                }
                .strategy_phase_caret{
                    font-size: 20px;
                    line-height: inherit;
                    width: 28px;
                    height: 28px;
                }
            `}</style>
        </div>
    )
}

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
            body: JSON.stringify({page_code, app_code, version: getCookie('strategy_version', { req, res }) ?? null})
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
    const [activeTab, setActiveTab] = useState('')
    const [strategyVersion, setStrategyVersion] = useState(page_data.data.version_id)

    useEffect(() => {
        setActiveTab(getCookie('strategy_page_activeTab') ?? 'table_view')
    },[])

    function handleTabClick(event){
        setActiveTab(event.target.getAttribute("data-id"))
        setCookie('strategy_page_activeTab', event.target.getAttribute("data-id"), { path: '/'+page_code })
    }

    function versionChange(event) {
        if(strategyVersion != event.target.getAttribute("data-id")){
            setStrategyVersion(event.target.getAttribute("data-id"))
            setCookie('strategy_version', event.target.getAttribute("data-id"), { path: '/'+page_code })
            location.reload()
        }
    }

    return (
        <MainLayout title={"PULSE - Стратегия создания ПГЗРО"} keywords={""} description={""} user={user} >
            <Bredcrumb data={page_data.bredcrumb_menu} />

            {/* Buttons panel */}
            <div className="d-flex justify-content-between p-3 border">
                <div className="d-flex">
                    <button type="button" onClick={handleTabClick} data-id="table_view"
                        className={`btn btn-sm border rounded-0 ${activeTab == "table_view" ? "btn-success" : "btn-light"}`}>
                        Фазы стратегии таблицей
                    </button>
                    <button type="button" onClick={handleTabClick} data-id="hierarchy_view"
                        className={`btn btn-sm border rounded-0 ms-2 ${activeTab == "hierarchy_view" ? "btn-success" : "btn-light"}`}>
                        Иерархия фаз стратегии
                    </button>
                </div>

                <div className="d-flex justify-content-end align-items-baseline">
                    {page_data.data?.buttons && page_data.data?.buttons.length &&
                        <>Версия: </>
                    }

                    {page_data.data?.buttons && page_data.data?.buttons.length &&
                        page_data.data.buttons.map((item, index) => {
                            return (
                                <button type="button" className={'btn btn-sm border rounded-0 ms-2 ' + (strategyVersion == item.id ? "btn-success" : "btn-light")}
                                    data-id={item.id} key={item.id ?? index} onClick={versionChange} title={item.title}>
                                    {item.version_num}
                                </button>
                            )
                        })
                    }
                </div>
            </div>

            <Strategy list={page_data.data?.list ?? []} activeTab={activeTab} version={strategyVersion} />

            <ModalStrategyCard />
        </MainLayout>
    )
}