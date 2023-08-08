import { useContext } from "react";

import NetworkContext from "../context/NetworkContext";

const Checkout = ({ products }) => {
  const userDetails = JSON.parse(localStorage.getItem("user"));

  console.log(userDetails);
  console.log(products);
  const networkUrl = useContext(NetworkContext);

  const calculateTotalPrice = (price, quantity) => {
    return price * quantity;
  };

  const calculateSubtotal = () => {
    if (!products) return 0;
    return products.reduce((subtotal, product) => {
      return (
        subtotal +
        calculateTotalPrice(product.productId.price, product.quantity)
      );
    }, 0);
  };

  const checkoutHandler = (amount, product) => {
    console.log("hello");
    let key, order;

    fetch(`${networkUrl}/getkey`)
      .then((response) => response.json())
      .then((data) => {
        key = data.key;
        return fetch(`${networkUrl}/checkout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount }),
        });
      })
      .then((response) => response.json())
      .then((data) => {
        order = data.order;
        const options = {
          key,
          amount: order.amount,
          currency: "INR",

          order_id: order.id,
          callback_url: `${networkUrl}/paymentverification`,
          prefill: {
            name: userDetails.name,
            email: userDetails.email,
            contact: userDetails.number,
          },
          notes: {
            address: {
              ...userDetails.address,
            },
          },
          theme: {
            color: "#121212",
          },
        };
        const razor = new window.Razorpay(options);
        razor.open();
      })
      .catch((error) => {
        console.error("Error occurred during checkout:", error);
        // Handle the error here, if required
      });
  };

  return (
    <div className="mx-auto mt-4 bg-white my-6 max-w-7xl px-4 sm:px-10 lg:px-8">
      <h2 className="text-4xl sm:px-10 font-bold tracking-tight text-gray-900 py-6">
        Checkout
        <br />
        <span className="text-xl text-gray-600">(Order Summary)</span>
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
                      Number of Items :
                      <span className="mt-1 text-sm text-gray-800">
                        {" "}
                        {product.quantity}
                      </span>
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Cost :
                      <span className="mt-1 text-sm text-gray-800">
                        {" "}
                        $ {product.quantity * product.productId.price}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-1 items-end justify-between text-sm"></div>
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
        <p className="mt-0.5 text-sm text-gray-500">Including GST</p>
        <div className="mt-6">
          <button
            onClick={() =>
              checkoutHandler(calculateSubtotal().toFixed(2), products)
            }
            className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            Proceed to payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
