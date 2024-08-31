import { useState } from 'react'
import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import IndexPage from './pages/IndexPage.js';
import LoginPage from './pages/LoginPage.js';
import Layout from './Layout';
import Registerpage from './pages/Registerpage.js';
import axios from 'axios';
import { UserContextProvider } from './UserContext';
import ProfilePage from './pages/ProfilePage.js';
import PlacesFormPage from './pages/PlacesFormPage.js';
import ProductCard from './pages/DisplayHotel.js';
import TrendingPlace from './pages/TrendingPlace.js';
import MoreOnHotel from './pages/MoreOnHotel.js';
import WishList from './pages/WishList.js';
import HotelBookingForm from './pages/HotelBookingForm.js';
import CardDetailsConsoleParent from './pages/CardDetailsConsoleParent.js';
import MyBookings from './pages/MyBookings.js';

axios.defaults.withCredentials = true;

function App() {
  const [count, setCount] = useState(0)

  return (
    <UserContextProvider>
      <BrowserRouter>
        <Routes>
        <Route path = "/" element={<Layout/>}>
        <Route path='/' element={<TrendingPlace/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/register' element={<Registerpage/>}/>
        <Route path='/account' element={<ProfilePage/>}/>
        <Route path='/account/places/new' element={<PlacesFormPage/>}/>
        <Route path='/account/places/:id' element={<PlacesFormPage/>}/>
        <Route path='/searchedProduct' element={<ProductCard/>}/>
        <Route path='hotel/:id' element={<MoreOnHotel/>}/>
        <Route path='/account/wishlist' element={<WishList/>}/> 
        <Route path='/hotel/booking/:id' element={<HotelBookingForm/>}/>
        <Route path='/account/bookings' element={<MyBookings/>}/>
        <Route path='/hotel/payment/:hotelId/:totalPrice' element={<CardDetailsConsoleParent/>}/>
        </Route> 
        </Routes>
      </BrowserRouter>
    </UserContextProvider>
  )
}

export default App
