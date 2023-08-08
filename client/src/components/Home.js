import React, { useContext, useEffect, useState } from "react";
import NetworkContext from "../context/NetworkContext";
import Loading from "./Loading";
import { Link } from "react-router-dom";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const networkUrl = useContext(NetworkContext);
  const [products, setProducts] = useState();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch(`${networkUrl}/allproducts`)
      .then((res) => res.json())
      .then((data) => {
        const products = data.products;
        setProducts(products);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const addToCart = (productId) => {
    // Send a POST request to add the selected product to the cart
    fetch(`${networkUrl}/add-to-cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({ productId, quantity: 1, userId: user._id }),
    })
      .then((response) => response.json())
      .then((data) => {
        toast.success(data.message);
      })
      .catch((error) => {
        console.error("Error adding product to cart:", error);
      });
  };

  return (
    <>
      {products ? (
        <div className="bg-white">
          <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10 lg:max-w-7xl lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              All Products
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
              {products.map((product) => (
                <div key={product._id}>
                  <div className="aspect-h-1 border border-sky-700 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                    <img
                      src={product.images[0]}
                      alt={product.imageAlt}
                      className="h-full w-full object-contain object-center lg:h-full lg:w-full"
                    />
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div>
                      <h3 className="text-sm text-gray-700">{product.title}</h3>
                      <Link
                        to={`/productoverview/${product._id}`}
                        className="mt-1 text-sm text-blue-500"
                      >
                        Product Details
                      </Link>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      $ {product.price}
                    </p>
                  </div>
                  <button
                    onClick={() => addToCart(product._id)}
                    className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default Home;
