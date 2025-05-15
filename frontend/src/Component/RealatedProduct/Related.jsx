import React, { useContext } from 'react';
import "./related.css";
import { ShopContext } from '../../Context/ShopContext';
import Item from '../Item/Item';

function Related({ currentProduct }) {
  const { all_product } = useContext(ShopContext);

  if (!currentProduct || !currentProduct.category) return null;

  const relatedProducts = all_product
    .filter(item =>
      item.category === currentProduct.category &&
      item.id !== currentProduct.id
    )
    .slice(0, 4);

  return (
    <div className='popular'>
      <h2>RELATED PRODUCTS</h2>
      <hr />
      <div className="popular-item">
        {
          relatedProducts.map((item, i) => (
            <Item
              key={i}
              id={item.id}
              name={item.name}
              img={item.image}
              old_price={item.old_price}
              new_price={item.new_price}
            />
          ))
        }
      </div>
    </div>
  );
}

export default Related;

