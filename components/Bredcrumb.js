import { useRouter } from 'next/router'

function SubList({ items, route }) {
    return (
        <ul>
            {
                items.map((item, index) => {
                    return (
                        <li key={item.id}>
                            <a href={item.page_code || '#'} className={(item.page_code && route == '/'+item.page_code) ? ' active' : ''}>{item.name}</a>
                        </li>
                    )
                })
            }
        </ul>
    )
}

export default function Bredcrumb({ data }) {
    const router = useRouter()
    
    return (
        <div id="wrapper_ul_breadcrumbs" className="mb-3">
            <ul id="ul_breadcrumbs">
                {
                    data.map((item, index) => {
                        return (
                            <li key={item.id ?? index} className={index == (data.length - 1) ? "active" : ""}>
                                {index > 0 &&
                                    <span>
                                        <i className="fa-solid fa-arrow-right-long me-2" />
                                    </span>
                                }

                                {item.page_code ?
                                    (
                                        <a href={item.page_code}>{item.name}</a>
                                    ) : (
                                        <span className={index == 0 ? "fw-bold" : ""}>{item.name}</span>
                                    )
                                }

                                {item.sublist && item.sublist.length > 0 &&
                                    <SubList items={item.sublist} route={router.route} />
                                }
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}