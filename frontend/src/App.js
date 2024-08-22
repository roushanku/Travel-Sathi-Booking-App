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
import Placespage from './pages/PlacesPage.js';
import PlacesFormPage from './pages/PlacesFormPage.js';
import PlacePage from './pages/PlacePage.js';
import BookingsPage from './pages/BookingsPage.js';
import BookingPage from './pages/BookingPage.js';
import ProductCard from './pages/DisplayHotel.js';
import TrendingPlace from './pages/TrendingPlace.js';
import MoreOnHotel from './pages/MoreOnHotel.js';

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
        <Route path='/account/places' element={<Placespage/>}/>
        <Route path='/account/places/new' element={<PlacesFormPage/>}/>
        <Route path='/account/places/:id' element={<PlacesFormPage/>}/>
        <Route path='/place/:id' element={<PlacePage/>}/> 
        <Route path='/account/bookings' element={<BookingsPage/>}/>
        <Route path='/account/bookings/:id' element={<BookingPage/>}/>
        <Route path='/searchedProduct' element={<ProductCard/>}/>
        <Route path='hotel/:id' element={<MoreOnHotel/>}/>
        </Route> 
        </Routes>
      </BrowserRouter>
    </UserContextProvider>
  )
}

export default App
