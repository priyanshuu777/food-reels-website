import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import UserRegister from '../pages/UserRegister'
import UserLogin from '../pages/UserLogin'
import PartnerRegister from '../pages/PartnerRegister'
import PartnerLogin from '../pages/PartnerLogin'
import Home from '../general/Home'
import CreateFood from '../pages/food-partner/CreateFood'
import PartnerProfile from '../pages/food-partner/PartnerProfile'
import Saved from '../general/Saved'
import Checkout from '../pages/Checkout'
import BottomNav from '../components/BottomNav'

const AppRoutes = () => {
  return (
    
        <Router>
            <Routes>
                <Route path='/user/register' element={<UserRegister />} /> 
                <Route path='/user/login' element={<UserLogin />} />
                <Route path='/food-partner/register' element={<PartnerRegister />} />
                <Route path='/food-partner/login' element={<PartnerLogin />} />
                <Route path='/' element={<Home />} />
                <Route path='/create-food' element={<CreateFood />} />
                <Route path='/food-partner/:id' element={<PartnerProfile />} />
               <Route path="/saved" element={<Saved />} />
               <Route path="/checkout/:id" element={<Checkout />} />
               <Route path="/checkout/:id/*" element={<Checkout />} />
               <Route path="*" element={<Home />} />
            </Routes>
            <BottomNav />
        </Router>
   
  )
}

export default AppRoutes