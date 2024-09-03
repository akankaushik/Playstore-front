import React from 'react'
import "./App.css";
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import UserLogin from './pages/UserLogin/UserLogin';
import AdminLogin from './pages/AdminLogin/AdminLogin.jsx';
import ProtectedUserRoute from './components/ProtectedUserRoute';
import UserProfile from './pages/UserProfile/UserProfile';
import AdminProfile from './pages/AdminProfile/AdminProfile.jsx';
import ProtectedAdminRoute from './components/ProtectedAdminRoute.js';
import AddApplication from './pages/AddApplication/AddApplication.jsx';
import Search from './pages/Search/Search.jsx';
import CategoryApplications from './pages/Category/Category.jsx';
import UpdateApplication from './pages/Update/UpdateApplication.jsx';
import ListApplication from './pages/AllApps/ListApplication.jsx';
import UserRegister from './pages/RegisterUser/UserRegister.jsx';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/user-login' element={<UserLogin />} />
        <Route path='/admin-login' element={<AdminLogin />} />
        <Route path='/search' element={<Search />} />
        <Route path='/user-register' element={<UserRegister />} />
        <Route path="/applications/category" element={<CategoryApplications />} />
        
        <Route element={<ProtectedUserRoute />}>
          <Route path='/user-profile' element={<UserProfile />} />


        </Route>
        <Route element={<ProtectedAdminRoute />}>
          <Route path='/admin-profile' element={<AdminProfile />} />
          <Route path='/add-application' element={<AddApplication />} />
          <Route path='/update-application' element={<UpdateApplication />} />
          <Route path='/all-application' element={<ListApplication />} /> 
        </Route>
      </Routes>
    </div>
  )
}

export default App