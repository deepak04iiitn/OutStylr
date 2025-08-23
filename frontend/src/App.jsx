import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signoutSuccess } from './redux/user/userSlice';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard';

export default function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const expiry = localStorage.getItem('tokenExpiry');
        if (token && expiry) {
            const timeLeft = Number(expiry) - Date.now();
            if (timeLeft > 0) {
                setTimeout(() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('tokenExpiry');
                    dispatch(signoutSuccess());
                }, timeLeft);
            } else {
                localStorage.removeItem('token');
                localStorage.removeItem('tokenExpiry');
                dispatch(signoutSuccess());
            }
        } else {
            dispatch(signoutSuccess());
        }
    }, [dispatch]);

    return (
        <BrowserRouter>
            <div className="flex flex-col min-h-screen">
                <Header />
                <div className="flex-grow">
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/sign-in' element={<SignIn />} />
                        <Route path='/sign-up' element={<SignUp />} />
                        <Route path='/profile' element={<Profile />} />
                        <Route element={<PrivateRoute />}>
                            <Route path='/dashboard' element={<Dashboard />} />
                        </Route>
                    </Routes>
                </div>
                <Footer />
            </div>
        </BrowserRouter>
    );
}