import {useState, useEffect, useMemo} from "react"
import {db} from '../db/db'

export const useCart = () => {

  const initialCart = () => {
    const localStorageCart = localStorage.getItem('cart')
    return localStorage ? JSON.parse(localStorageCart) : []
  }

  const [data] = useState(db)
  //const [cart, setCart] = useState([])
  const [cart, setCart] = useState(initialCart)
  const MAX_ITEM = 5
  const MIN_ITEM = 1

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  function addToCart(item) {
    const itemExist = cart.findIndex(guitar => guitar.id === item.id)

    if (itemExist >= 0) {// existe en el carrito
      //console.log('Ya existe');
      const updateCart = [...cart]
      updateCart[itemExist].quantity++
      setCart(updateCart)
    } else {
      //no existe en el carrito
      item.quantity = 1;
      setCart(prevCart => [...prevCart, item])
    }
  }

  function removeFromCart(id) {
    //console.log('eliminando cart', id);
    setCart(prevCart => prevCart.filter(guitar => guitar.id !== id))
  }

  function increaseQuantity(id) {
    const updatedCart = cart.map(item => {
      if (item.id === id && item.quantity < MAX_ITEM) {
        return {
          ...item,
          quantity: item.quantity + 1
        }
      }
      return item
    })
    setCart(updatedCart)
  }

  function decreaseQuantity(id) {
    const updatedCart = cart.map(item => {
      if (item.id === id && item.quantity > MIN_ITEM) {
        return {
          ...item,
          quantity: item.quantity - 1
        }
      }
      return item
    })
    setCart(updatedCart)
  }

  function clearCart() {
    setCart([])
  }

  //state derivado, depende de cart
  const isEmpty = useMemo(() => cart.length === 0, [cart])
  //para q funcione tenemos q llamarlos como funcion sino no se llamaran, nameFun()
  const cartTotal = useMemo(() => cart.reduce((total, item) => total + (item.quantity * item.price), 0), [cart])

  return {
    data,
    cart,
    addToCart,
    removeFromCart,
    decreaseQuantity,
    increaseQuantity,
    clearCart,
    isEmpty,
    cartTotal
  }
}
