import Link from "next/link"
import { MainLayout } from "../layouts/MainLayout"

export default function Custom404() {
    return (
        <MainLayout title={"404 - Page Not Found"}>
            <p><Link href="/">Home</Link> / 404 - Page Not Found</p>
            <hr />

            <div className="py-5 text-center">
                <h1>404 - Page Not Found</h1>
            </div>
        </MainLayout>
    )
}