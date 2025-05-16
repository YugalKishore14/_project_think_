// import React from 'react'
// import Navbar from './Component/Navbar/Navbar'
// import { Route, Routes } from 'react-router-dom'
// import Shop from './Pages/Shop'
// import ShopCategory from './Pages/ShopCategory'
// import Product from './Pages/Product'
// import Cart from './Pages/Cart'
// import LoginSignUp from './Pages/LoginSignUp'
// import Footer from './Component/Footer/Footer'
// import men_banner from "./Component/Assest/banner_mens.png"
// import women_banner from "./Component/Assest/banner_women.png"
// import kids_banner from "./Component/Assest/banner_kids.png"


// function App() {
//   return (
//     <>
//       <Navbar />
//       <Routes>
//         <Route path='/' element={<Shop />} />
//         <Route path='/men' element={<ShopCategory banner={men_banner} category="men" />} />
//         <Route path='/women' element={<ShopCategory banner={women_banner} category="women" />} />
//         <Route path='/kids' element={<ShopCategory banner={kids_banner} category="kid" />} />
//         <Route path='/product' element={<Product />}>
//           <Route path=':productId' element={<Product />} />
//         </Route>
//         <Route path='/cart' element={<Cart />} />
//         <Route path='/login' element={<LoginSignUp />} />
//       </Routes>
//       <Footer />
//     </>
//   )
// }

// export default App



import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './Component/Navbar/Navbar';
import Footer from './Component/Footer/Footer';
import Shop from './Pages/Shop';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import LoginSignUp from './Pages/LoginSignUp';
import ShopCategory from './Pages/ShopCategory';
import men_banner from "./Component/Assest/banner_mens.png";
import women_banner from "./Component/Assest/banner_women.png";
import kids_banner from "./Component/Assest/banner_kids.png";
import Admin from './admin/Pages/Admin/Admin';

function App() {
  const role = localStorage.getItem("role");

  return (
    <>
      {role !== "admin" && <Navbar />}
      <Routes>
        <Route path='/' element={<Shop />} />
        <Route path='/men' element={<ShopCategory banner={men_banner} category="men" />} />
        <Route path='/women' element={<ShopCategory banner={women_banner} category="women" />} />
        <Route path='/kids' element={<ShopCategory banner={kids_banner} category="kid" />} />
        <Route path='/product/:productId' element={<Product />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/login' element={<LoginSignUp />} />
        <Route path='/admin' element={role === "admin" ? <Admin /> : <Navigate to="/" />} />
      </Routes>
      {role !== "admin" && <Footer />}
    </>
  );
}

export default App;
