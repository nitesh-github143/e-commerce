import React from "react";

const Profile = () => {
  const userDetails = JSON.parse(localStorage.getItem("user"));
  console.log(userDetails);
  const user = {
    name: userDetails.name,
    email: userDetails.email,
    address: userDetails.address.street + " , " + userDetails.address.zip,
    phone: "+91 " + userDetails.number,
  };
  return (
    <div className="container mx-auto mt-8">
      <div className="max-w-md mx-auto bg-white p-8 border shadow-lg rounded-lg">
        <h2 className="text-xl font-bold mb-4">User Details</h2>
        <div className="mb-4">
          <label className="text-sm font-bold">Name:</label>
          <p className="text-gray-800">{user.name}</p>
        </div>
        <div className="mb-4">
          <label className="text-sm font-bold">Email:</label>
          <p className="text-gray-800">{user.email}</p>
        </div>
        <div className="mb-4">
          <label className="text-sm font-bold">Address:</label>
          <p className="text-gray-800">{user.address}</p>
        </div>
        <div className="mb-4">
          <label className="text-sm font-bold">Phone:</label>
          <p className="text-gray-800">{user.phone}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
