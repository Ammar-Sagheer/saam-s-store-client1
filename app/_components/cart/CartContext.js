"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import toast from "react-hot-toast";
import {
  CheckCircleIcon,
  ArrowPathIcon,
  TrashIcon,
  ShoppingCartIcon,
  SparklesIcon,
} from "@heroicons/react/24/solid";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // ✅ Queue for toasts to be shown after render
  const [toastQueue, setToastQueue] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) setCartItems(JSON.parse(stored));
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // ✅ Process toast queue in a useEffect (after render)
  useEffect(() => {
    if (toastQueue.length === 0) return;

    // Show the latest toast from the queue
    const latestToast = toastQueue[toastQueue.length - 1];
    toast(latestToast.message, latestToast.options);

    // Clear the queue after showing
    setToastQueue([]);
  }, [toastQueue]);

  // ✅ Queue a toast to be shown after render
  function queueToast(message, options = {}) {
    setToastQueue([
      { message, options: { ...options, duration: options.duration || 2500 } },
    ]);
  }

  function addToCart(product) {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        queueToast(`${product.name} quantity increased!`, {
          icon: <ArrowPathIcon className="w-5 h-5 text-primary" />,
        });
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      queueToast(`${product.name} added to cart!`, {
        icon: <CheckCircleIcon className="w-5 h-5 text-success" />,
      });
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsOpen(true);
  }

  function removeFromCart(productId) {
    const item = cartItems.find((item) => item.id === productId);
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
    if (item) {
      queueToast(`${item.name} removed from cart`, {
        icon: <TrashIcon className="w-5 h-5 text-sale" />,
        duration: 2000,
      });
    }
  }

  function updateQuantity(productId, quantity) {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item,
      ),
    );
  }

  const clearCart = useCallback(() => {
    if (cartItems.length === 0) {
      queueToast("Your cart is already empty", {
        icon: <ShoppingCartIcon className="w-5 h-5 text-text-light" />,
        duration: 2000,
      });
      return;
    }
    setCartItems([]);
    queueToast("Cart cleared successfully!", {
      icon: <SparklesIcon className="w-5 h-5 text-primary" />,
      duration: 2000,
    });
  }, [cartItems]);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + (item.sale_price || item.price) * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isOpen,
        setIsOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
