import React from "react";

type CustomerCardProps = {
  name: string;
  email: string;
  phone: string;
};

const CustomerCard: React.FC<CustomerCardProps> = ({ name, email, phone }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-bold text-gray-800">{name}</h2>
      <p className="text-sm text-gray-600">Email: {email}</p>
      <p className="text-sm text-gray-600">Phone: {phone}</p>
    </div>
  );
};

export default CustomerCard;
