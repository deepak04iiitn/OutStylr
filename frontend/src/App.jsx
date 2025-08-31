import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
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
import Outfit from './pages/Outfit';
import Cart from './pages/Cart';
import OutfitDetails from './pages/OutfitDetails';
import Trending from './pages/Trending';

import { useDispatch, useSelector } from 'react-redux';
import { checkTokenExpiry } from './utils/tokenUtils';


// Create a wrapper component to access useLocation
function AppContent() {
    const location = useLocation();
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);


    useEffect(() => {
        let tokenCheckInterval;
        
        if (currentUser) {
            // Start checking token expiry
            tokenCheckInterval = checkTokenExpiry(dispatch);
        }
        
        return () => {
            if (tokenCheckInterval) {
                clearInterval(tokenCheckInterval);
            }
        };
    }, [currentUser, dispatch]);
    
    // Pages where header should be hidden
    const hideHeaderRoutes = ['/dashboard'];
    const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

    return (
        <OutStylrBackground variant="default" intensity="medium">
            <div className="flex flex-col min-h-screen">
                {/* Conditionally render Header */}
                {!shouldHideHeader && <Header />}
                
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
                        <Route path='/outfit' element={<Outfit />} />
                        <Route path='/outfit/:id' element={<OutfitDetails />} />
                        <Route path='/trending' element={<Trending />} />
                        <Route path='/cart' element={<Cart />} />
                    </Routes>
                </div>
                
                {/* Footer remains on all pages */}
                <Footer />
            </div>
        </OutStylrBackground>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}