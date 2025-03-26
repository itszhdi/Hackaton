import {BrowserRouter, Routes, Route} from 'react-router-dom';

import Nav from '../Components/Nav/Nav';
import Footer from '../Components/Footer/Footer';
import HomePage from '../Pages/HomePage';

export default function Router() {
    return(
        <BrowserRouter>
        <Nav/>
            <Routes>
                <Route path='/' element={<HomePage />}/>
            </Routes>
        <Footer/>
        </BrowserRouter>
    );
}
