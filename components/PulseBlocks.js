import { useState, useEffect } from 'react'
import Link from "next/link"

function PulseBlocksList({ items }) {
    return (
        <ul>
            {
                items.map((item, index) => {
                    return (
                        <li key={item.id}>
                            <Link href={`${item.link || ""}`} className={item.class}>
                                {item.text}
                            </Link>
                        </li>
                    )
                })
            }
        </ul>
    )
}

export default function PulseBlocks(props) {
    const [list, setList] = useState(props.list)

    return (
        <div id="card_pulse" className="card-pulse">
            {
                list.map((item, index) => {
                    return (
                        <div className="column-pulse" key={item.id}>
                            <div className="column-pulse_div">
                                <div className="column-pulse_card_header">{item.title}</div>
                                <div className="column-pulse_left">
                                    {(item.list && item.list.length > 0) ? <PulseBlocksList items={item.list} /> : null}
                                </div>
                                <div className="column-pulse_right">
                                    <div>
                                        {(item.description) ? <div dangerouslySetInnerHTML={{ __html: item.description }} /> : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}