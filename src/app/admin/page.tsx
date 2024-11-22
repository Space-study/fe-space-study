import CustomerCard from "@src/core/components/common/CustomerCard";

const mockCustomers = [
  { name: "John Doe", email: "john.doe@example.com", phone: "123-456-7890" },
  { name: "Jane Smith", email: "jane.smith@example.com", phone: "987-654-3210" },
  { name: "Alice Johnson", email: "alice.johnson@example.com", phone: "456-789-1234" },
];

export default async function CustomerPage() {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockCustomers.map((customer, index) => (
          <CustomerCard
            key={index}
            name={customer.name}
            email={customer.email}
            phone={customer.phone}
          />
        ))}
      </div>
    </div>
  );
};
