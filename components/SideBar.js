import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { getCookies, setCookie, deleteCookie, getCookie } from 'cookies-next'
import axios from 'axios'

function SubList({ items, route }) {
    return (
        <ul>
            {
                items.map((item, index) => {
                    return (
                        <li key={item.id}>
                            <a href={item.link || '#'}
                                className={(item.classes || '') + ((item.link && route == '/'+item.link) ? ' active' : '')}
                                style={{color: ((item.ready == 0) ? '#ffb404' : '')}}>
                                {item.title}
                                {item.sublist && item.sublist.length > 0 &&
                                    <span className='menuArrow'><i className="fa fa-fw fa-angle-right"></i></span>
                                }
                            </a>
                            {
                                (item.sublist && item.sublist.length > 0)
                                    ? <SubList items={item.sublist} route={route} /> : null
                            }
                        </li>
                    )
                })
            }
        </ul>
    )
}

export default function SideBar() {
    const [dataMenu, setDataMenu] = useState([])

    const router = useRouter()

    function menu_close(){
        document.querySelector('main').classList.remove('opened')
        $("#header_menu").fadeIn();
        deleteCookie('left_sidebar')
    }

    useEffect(() => {
        axios.get('/api/sidebar')
            .then(res => res.data)
            .then(response => {
                setDataMenu(response)

                $("#left_menu>ul>li>ul>li ul li a.active").parents('#left_menu>ul>li>ul li').addClass('opened')
            })
            .catch(error => {
                // handle error
                console.log(error)
            })
            .finally(() => {
                // always executed
            });
    }, []);

    return (
        <aside id="left_menu">
            <ul>
                {
                    dataMenu.map((item, index) => {
                        return (
                            <li key={item.id}>
                                <span className={item.classes}>{item.title}</span>
                                {item.sublist && item.sublist.length > 0 &&
                                    <SubList items={item.sublist} route={router.route} />
                                }
                            </li>
                        )
                    })
                }
            </ul>

            <i className="fa fa-fw fa-times text-danger" id="LeftMenuClose" onClick={menu_close} />
        </aside>
    )
}