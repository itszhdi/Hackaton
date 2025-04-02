import {BrowserRouter, Routes, Route} from 'react-router-dom';
import { useState } from 'react';

import Nav from '../Components/Nav/Nav';
import Footer from '../Components/Footer/Footer';

import HomePage from '../Pages/HomePage';
import Profile from '../Pages/Profile';
import Budget from '../Pages/Budget';
import Targets from '../Pages/Targets';
import Notifications from '../Pages/Notifications';

import Login from '../Components/Login/Login';

export default function Router() {
    const [showLogin, setShowLogin] = useState(false);
    
    return (
        <BrowserRouter>
            {showLogin ? <Login setShowLogin={setShowLogin} /> : null}
            <div className="app-container">
                <Nav setShowLogin={setShowLogin} />
                <main className="content">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/budget" element={<Budget />} />
                        <Route path="/targets" element={<Targets />} />
                        <Route path="/notifications" element={<Notifications />} />
                    </Routes>
                    <Footer />
                </main>
            </div>
        </BrowserRouter>
    );
}
