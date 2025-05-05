import React, { createContext, useContext, useState, ReactNode } from "react";

interface CustomerContextType {
  customerName: string;
  setCustomerName: (name: string) => void;
  hasOrderedDrink: boolean;
  setHasOrderedDrink: (hasOrdered: boolean) => void;
}

const CustomerContext = createContext<CustomerContextType | undefined>(
  undefined
);

export const CustomerProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [customerName, setCustomerName] = useState("");
  const [hasOrderedDrink, setHasOrderedDrink] = useState(false);

  return (
    <CustomerContext.Provider
      value={{
        customerName,
        setCustomerName,
        hasOrderedDrink,
        setHasOrderedDrink,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = (): CustomerContextType => {
  const context = useContext(CustomerContext);
  if (context === undefined) {
    throw new Error("useCustomer must be used within a CustomerProvider");
  }
  return context;
};
