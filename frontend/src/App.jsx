import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import OutStylrBackground from './components/OutStylrBackground';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard';
import AboutUs from './pages/AboutUs';

export default function App() {
    return (
        <BrowserRouter>
            <OutStylrBackground variant="default" intensity="medium">
                <div className="flex flex-col min-h-screen">
                    <Header />
                    <div className="flex-grow">
                        <Routes>
                            <Route path='/' element={<Home />} />
                            <Route path='/sign-in' element={<SignIn />} />
                            <Route path='/sign-up' element={<SignUp />} />
                            <Route path='/profile' element={<Profile />} />
                            <Route path='/about-us' element={<AboutUs />} />
                            <Route element={<PrivateRoute />}>
                                <Route path='/dashboard' element={<Dashboard />} />
                            </Route>
                        </Routes>
                    </div>
                    <Footer />
                </div>
            </OutStylrBackground>
        </BrowserRouter>
    );
}
