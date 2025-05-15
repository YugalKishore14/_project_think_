import React, { useContext } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../Context/ShopContext'
import Breadcrum from '../Component/Breadcrum/Breadcrum'
import ProductDisplay from '../Component/ProductDisplay/ProductDisplay'
import Discrip from '../Component/Descriptionbox/Discrip'
import Related from '../Component/RealatedProduct/Related'

function Product() {

  const { all_product } = useContext(ShopContext)
  const { productId } = useParams()
  const product = all_product.find((e) => e.id === Number(productId))

  return (
    <>
      <div >
        <Breadcrum product={product} />
        <ProductDisplay product={product} />
        <Discrip />
        <Related currentProduct={product} />
      </div>
    </>

  )
}

export default Product


// import React, { useContext } from 'react'
// import { useParams, Navigate } from 'react-router-dom'
// import { ShopContext } from '../Context/ShopContext'
// import Breadcrum from '../Component/Breadcrum/Breadcrum'
// import ProductDisplay from '../Component/ProductDisplay/ProductDisplay'
// import Discrip from '../Component/Descriptionbox/Discrip'
// import Related from '../Component/RealatedProduct/Related'

// function Product() {
//   const { all_product, loading } = useContext(ShopContext) // assuming you have loading state
//   const { productId } = useParams()

//   if (loading) {
//     return <div>Loading product...</div>
//   }

//   const product = all_product?.find((e) => e.id === Number(productId))

//   if (!product) {
//     return <Navigate to="/" />
//   }

//   return (
//     <main>
//       <Breadcrum product={product} />
//       <ProductDisplay product={product} />
//       <Discrip />
//       <Related currentProduct={product} />
//     </main>
//   )
// }

// export default Product
