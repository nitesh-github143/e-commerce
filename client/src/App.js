// App.js
import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Signup from "./components/Signup";
import Cart from "./components/Cart";
import Profile from "./components/Profile";
import NetworkContext from "./context/NetworkContext";
import Checkout from "./components/Checkout";
import ProductOverview from "./components/ProductOverview";
import PaymentSuccess from "./components/PaymentSuccess";

function App() {
  // const networkUrl = "http://localhost:4000";
  const networkUrl = "https://e-comm-backend-1eg9.onrender.com";

  const [user, setUser] = useState(null); // Initialize user state to null
  const [checkout, setCheckout] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
    if (!storedUser) {
      navigate("/login");
    }
  }, []);

  const handleLogin = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <NetworkContext.Provider value={networkUrl}>
      {user ? <Navbar onLogout={handleLogout} /> : null}
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route
          exact
          path="/productoverview/:id"
          element={<ProductOverview />}
        />

        {user ? (
          <>
            <Route path="/cart" element={<Cart setCheckout={setCheckout} />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/paymentsuccess" element={<PaymentSuccess />} />
            <Route
              path="/checkout"
              element={<Checkout products={checkout} />}
            />
          </>
        ) : (
          <>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/signup" element={<Signup />} />
          </>
        )}
      </Routes>
    </NetworkContext.Provider>
  );
}

export default App;
