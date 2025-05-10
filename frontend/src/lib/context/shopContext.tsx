"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";

export interface CartItem {
  id: string | number;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: { id: string | number } }
  | {
      type: "UPDATE_QUANTITY";
      payload: { id: string | number; quantity: number };
    }
  | { type: "CLEAR_CART" };

interface CartContextType {
  cart: CartState;
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeFromCart: (id: string | number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  clearCart: () => void;
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

// Load cart from localStorage if available
const loadCartFromStorage = (): CartState => {
  if (typeof window === "undefined") return initialState;

  const savedCart = localStorage.getItem("shopping-cart");
  return savedCart ? JSON.parse(savedCart) : initialState;
};

const calculateCartTotals = (
  items: CartItem[]
): Pick<CartState, "totalItems" | "totalPrice"> => {
  return items.reduce(
    (totals, item) => {
      return {
        totalItems: totals.totalItems + item.quantity,
        totalPrice: totals.totalPrice + item.price * item.quantity,
      };
    },
    { totalItems: 0, totalPrice: 0 }
  );
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      let updatedItems: CartItem[];

      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        updatedItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        // New item, add to cart
        updatedItems = [...state.items, action.payload];
      }

      const totals = calculateCartTotals(updatedItems);
      return { ...state, items: updatedItems, ...totals };
    }

    case "REMOVE_ITEM": {
      const updatedItems = state.items.filter(
        (item) => item.id !== action.payload.id
      );
      const totals = calculateCartTotals(updatedItems);
      return { ...state, items: updatedItems, ...totals };
    }

    case "UPDATE_QUANTITY": {
      const updatedItems = state.items.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      const totals = calculateCartTotals(updatedItems);
      return { ...state, items: updatedItems, ...totals };
    }

    case "CLEAR_CART":
      return initialState;

    default:
      return state;
  }
};

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider component
export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cart, dispatch] = useReducer(
    cartReducer,
    initialState,
    loadCartFromStorage
  );

  // Save to localStorage whenever cart changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("shopping-cart", JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = (item: Omit<CartItem, "quantity">, quantity = 1) => {
    dispatch({
      type: "ADD_ITEM",
      payload: { ...item, quantity },
    });
  };

  const removeFromCart = (id: string | number) => {
    dispatch({
      type: "REMOVE_ITEM",
      payload: { id },
    });
  };

  const updateQuantity = (id: string | number, quantity: number) => {
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { id, quantity },
    });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
