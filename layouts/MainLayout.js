import Head from "next/head"
import { useState, useEffect } from 'react'
import { getCookies, setCookie, deleteCookie, getCookie } from 'cookies-next'

import Header from '../components/Header'
import Footer from '../components/Footer'
import SideBar from '../components/SideBar'

export function MainLayout({ children, title = 'Next App', keywords = '', description = '', user = null }) {
    useEffect(() => {
        if(getCookie('left_sidebar') == 'opened') document.querySelector('main').classList.add('opened')
    }, []);

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="keywords" keywords={keywords} />
                <meta name="description" description={description} />
                
                <link rel="shortcut icon" href="/favicon.svg" />
            </Head>

            <Header user={user} />

            <main className="container-fluid mt-4">
                <SideBar />

                <section>
                    {children}
                </section>
            </main>

            {/* <Footer /> */}

            <style jsx global>{`
                body{
                    padding:0;
                }
            `}</style>
        </>
    )
}