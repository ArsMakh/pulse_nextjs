import Link from "next/link"

export default function Footer() {
    return (
        <footer className="container-fluid pt-3">
            <div className="row">
                <div className="col-12">
                    <div className="footer">
                        <div className="row">
                            <div className="col d-flex">
                                <div className="footer_logo_wrap">
                                    <Link href="http://www.ibrae.ac.ru/" target="_blank" rel="noreferrer">
                                        <img src="/images/footer_logo.svg" alt="www.ibrae.ac.ru" />
                                    </Link>
                                </div>
                                <div>
                                    Сайт был разработан, поддерживается и развивается ИБРАЭ РАН
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}