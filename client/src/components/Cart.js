import { Fragment, useContext, useEffect, useState } from "react";
import NetworkContext from "../context/NetworkContext";
import { Link, useNavigate } from "react-router-dom";
import Loading from "./Loading";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Cart = ({ setCheckout }) => {
  const networkUrl = useContext(NetworkContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch(`${networkUrl}/cart/${user._id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const deleteItem = (itemId) => {
    fetch(`${networkUrl}/deleteitem/${itemId}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const newCart = result.remainingItems;
        setProducts(newCart);

        toast.success(result.message);
      });
  };

  const updateQuantity = (itemId, newQuantity) => {
    fetch(`${networkUrl}/updateitem/${itemId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({ quantity: newQuantity }),
    })
      .then((res) => res.json())
      .then((result) => {
        const updatedCart = products.map((product) =>
          product._id === itemId
            ? { ...product, quantity: newQuantity }
            : product
        );
        setProducts(updatedCart);
      })
      .catch((error) => {
        console.error("Error updating quantity:", error);
      });
  };

  // Calculate total price for each item (price * quantity)
  const calculateTotalPrice = (price, quantity) => {
    return price * quantity;
  };

  // Calculate the subtotal by summing up the total prices of all items
  const calculateSubtotal = () => {
    if (!products) return 0;
    return products.reduce((subtotal, product) => {
      return (
        subtotal +
        calculateTotalPrice(product.productId.price, product.quantity)
      );
    }, 0);
  };

  return (
    <>
      {products ? (
        <>
          <div className="mx-auto mt-4 bg-white my-6 max-w-7xl px-4 sm:px-10 lg:px-8">
            <h2 className="text-4xl sm:px-10 font-bold tracking-tight text-gray-900 py-6">
              Cart
            </h2>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flow-root">
                <ul className="-my-6 divide-y divide-gray-200">
                  {products.map((product) => (
                    <li key={product.productId._id} className="flex py-6">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <img
                          src={product.productId.images[0]}
                          alt={product.productId.images[1]}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>

                      <div className="ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3>{product.productId.title}</h3>
                            <p className="ml-4">$ {product.productId.price}</p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            {product.productId.brand}
                          </p>
                        </div>
                        <div className="flex flex-1 items-end justify-between text-sm">
                          <div className="text-gray-500">
                            <label
                              htmlFor={`quantity-${product._id}`}
                              className="inline mr-5 text-sm font-medium leading-6 text-gray-900"
                            >
                              Qty
                            </label>
                            <select
                              id={`quantity-${product._id}`}
                              value={product.quantity}
                              onChange={(e) =>
                                updateQuantity(
                                  product._id,
                                  parseInt(e.target.value)
                                )
                              }
                            >
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5</option>
                              <option value="6">6</option>
                              <option value="7">7</option>
                              <option value="8">8</option>
                              <option value="9">9</option>
                            </select>
                          </div>

                          <button
                            onClick={() => deleteItem(product._id)}
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
              <div className="flex justify-between text-base font-medium text-gray-900">
                <p>Subtotal</p>
                <p>${calculateSubtotal().toFixed(2)}</p>
              </div>
              <div className="mt-6">
                <button
                  onClick={() => {
                    setCheckout(products);
                    navigate("/checkout");
                  }}
                  className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                >
                  Checkout
                </button>
              </div>
              <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                <p>
                  or
                  <Link to="/">
                    <button
                      type="button"
                      className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Continue Shopping
                      <span aria-hidden="true"> &rarr;</span>
                    </button>
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default Cart;
