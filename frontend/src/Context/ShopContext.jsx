import React, { createContext, useEffect, useState } from "react";
import all_product from "../Component/Assest/all_product"; ////////////////////////

export const ShopContext = createContext(null);

const getDefaultcart = () => {
    let cart = {};
    for (let index = 0; index < 300 + 1; index++) {
        cart[index] = 0;
    }
    return cart;
};

const ShopContextProvider = (props) => {
    const [all_productt, setAll_product] = useState([]);   ////////////////////////////
    const [cartItems, setCartItems] = useState(getDefaultcart());

    ////////////////////////////////////////////////////
    useEffect(() => {
        fetch('https://project-think-backend.onrender.com/allproducts')
            .then((Response) => Response.json())
            .then((data) => setAll_product(data))
    }, [])
    ///////////////////////////////////////////////////////



    ////////////////////////////////////////////////////////////////////
    const addTocartt = (itemId) => {
        setCartItems((prev) => {
            const updatedCart = {
                ...prev,
                [itemId]: (prev[itemId] || 0) + 1
            };
            return updatedCart;
        });

        if (localStorage.getItem('auth-token')) {
            fetch('https://project-think-backend.onrender.com/addtocart', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('auth-token')
                },
                body: JSON.stringify({ id: itemId })
            })
                .then(response => response.json())
                .then(data => console.log(data))
                .catch(err => console.error("Add to cart error:", err));
        }
    };

    const removeFromCartt = (itemId) => {
        setCartItems((prev) => {
            const updatedCart = { ...prev, [itemId]: prev[itemId] - 1 };
            return updatedCart;
        });
    };

    const getTotalPricee = () => {
        let totalPrice = 0;
        for (let item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = all_productt.find(product => product.id === Number(item))
                totalPrice += itemInfo.new_price * cartItems[item]

            }
        }
        return totalPrice;

    }
    const getTotalItemm = () => {
        let totalItem = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                totalItem += cartItems[item]
            }
        }
        return totalItem

    }
    //////////////////////////////////////////////////////////////////




    const addTocart = (itemId) => {
        setCartItems((prev) => {
            const updatedCart = { ...prev, [itemId]: prev[itemId] + 1 };

            /////////////////////////////////////////////////
            if (localStorage.getItem('auth-token')) {

            }
            /////////////////////////////////////////////////
            return updatedCart;
        });
    };

    const removeFromCart = (itemId) => {
        setCartItems((prev) => {
            const updatedCart = { ...prev, [itemId]: prev[itemId] - 1 };
            return updatedCart;
        });
    };

    const getTotalPrice = () => {
        let totalPrice = 0;
        for (let item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = all_product.find(product => product.id === Number(item))
                totalPrice += itemInfo.new_price * cartItems[item]

            }
        }
        return totalPrice;

    }
    const getTotalItem = () => {
        let totalItem = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                totalItem += cartItems[item]
            }
        }
        return totalItem

    }

    const contextValue = { getTotalItem, getTotalPrice, all_product, cartItems, addTocart, removeFromCart, all_productt, addTocartt, removeFromCartt, getTotalPricee, getTotalItemm };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
