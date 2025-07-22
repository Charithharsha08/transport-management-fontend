import {Footer} from "../Footer/Footer.tsx";
import {MainContent} from "../MainContent/MainContent.tsx";
import {Navbar} from "../Navbar/Navbar.tsx";

export function DefaultLayout() {
    return (
        <>
            <div className="default-layout w-full h-screen ">
                <Navbar/>
                <MainContent/>
                <Footer/>
            </div>
        </>
    )
}