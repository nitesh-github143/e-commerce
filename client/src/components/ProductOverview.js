import { Fragment, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NetworkContext from "../context/NetworkContext";
import Loading from "./Loading";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductOverview = () => {
  const networkUrl = useContext(NetworkContext);

  const [product, setProduct] = useState();
  const user = JSON.parse(localStorage.getItem("user"));

  const id = useParams();
  useEffect(() => {
    fetch(`${networkUrl}/product/${id.id}`)
      .then((res) => res.json())
      .then((result) => {
        console.log(result.product);
        setProduct(result.product);
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
      {product ? (
        <>
          <div className="bg-white">
            <div className="mx-auto grid max-w-xl grid-cols-1 items-center gap-x-4 gap-y-8 px-4 py-12 sm:px-6 sm:py-10 lg:max-w-5xl lg:grid-cols-2 lg:px-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  {product.title}
                </h2>
                <p className="mt-4 text-gray-500">{product.description}</p>

                <dl className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:gap-x-8">
                  <div className="border-t border-gray-200 pt-4">
                    <dt className="font-medium text-gray-900">
                      {product.brand}
                    </dt>
                    <dt className="mt-4 text-gray-500">{product.category}</dt>
                  </div>
                </dl>

                <div className="mt-6">
                  <h3 className="sr-only">Reviews</h3>
                  <div className="flex items-center">
                    <p className="mt-4 text-gray-700 ">
                      {product.rating} out of 5 stars
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 grid-rows-2 gap-4 sm:gap-6 lg:gap-8">
                <img
                  src={product.images[0]}
                  alt={product.images[1]}
                  className="rounded-lg bg-gray-100"
                />
                <img
                  src={product.images[1]}
                  alt={product.images[2]}
                  className="rounded-lg bg-gray-100"
                />
                <img
                  src={product.images[2]}
                  alt={product.images[3]}
                  className="rounded-lg bg-gray-100"
                />
                <img
                  src={product.images[0]}
                  alt={product.images[1]}
                  className="rounded-lg bg-gray-100"
                />
              </div>

              <button
                onClick={() => addToCart(product._id)}
                className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default ProductOverview;
