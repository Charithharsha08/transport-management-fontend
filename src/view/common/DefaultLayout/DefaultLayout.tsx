import {Footer} from "../Footer/Footer.tsx";
import {MainContent} from "../MainContent/MainContent.tsx";
import {Navbar} from "../Navbar/Navbar.tsx";

export function DefaultLayout() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Navbar/>

            <main className="flex-grow">
                <MainContent/>
            </main>

            <Footer/>
        </div>
    )
}