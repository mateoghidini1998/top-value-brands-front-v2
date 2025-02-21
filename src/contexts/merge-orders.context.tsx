"use client";
import { createContext, useContext, useState } from "react";

interface MergeOrdersContextType {
  isMerging: boolean;
  setIsMerging: React.Dispatch<React.SetStateAction<boolean>>;
  orders: { index: number; orderId: number }[];
  setOrders: React.Dispatch<{ index: number; orderId: number }[]>;
  isTheRowChecked: (orderId: number) => boolean;
}

const MergeOrdersContext = createContext<MergeOrdersContextType | undefined>(
  undefined
);

export function MergeOrdersProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [orders, setOrders] = useState<{ index: number; orderId: number }[]>(
    []
  );
  const [isMerging, setIsMerging] = useState(false);

  const isTheRowChecked = (orderId: number) => {
    return orders.some((order) => order.orderId === orderId);
  };

  console.log(isMerging);
  console.log(orders);

  return (
    <MergeOrdersContext.Provider
      value={{
        isMerging,
        setIsMerging,
        orders,
        setOrders,
        isTheRowChecked,
      }}
    >
      {children}
    </MergeOrdersContext.Provider>
  );
}

export function useMergeOrdersContext() {
  const context = useContext(MergeOrdersContext);
  if (context === undefined) {
    throw new Error("useMergeOrders must be used within a MergeOrdersProvider");
  }
  return context;
}
