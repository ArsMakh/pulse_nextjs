import Head from "next/head"

export function LoginLayout({ children, title = 'PULSE', keywords = '', description = '', user = null }) {
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="keywords" keywords={keywords} />
                <meta name="description" description={description} />

                <link rel="shortcut icon" href="favicon.svg" />

                <link rel="stylesheet" href="/assets/css/login.css" />
            </Head>

            {children}
        </>
    )
}