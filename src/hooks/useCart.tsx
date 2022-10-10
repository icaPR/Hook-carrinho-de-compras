import { createContext, ReactNode, useContext, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../services/api";
import { Product, Stock } from "../types";

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem("@RocketShoes:cart");
    if (storagedCart) {
      const auxStoragedCard = JSON.parse(storagedCart);
      return auxStoragedCard;
    } else {
      return [];
    }
  });

  const addProduct = async (productId: number) => {
    try {
      const storagedCartText: Product = JSON.parse(
        localStorage.getItem("@RocketShoes:cart") || "{}"
      );
      const auxExistInCart = cart.find(
        (existInCart) => existInCart.id === productId
      );
      if (!auxExistInCart) {
        storagedCartText.amount = 1;
        setCart([...cart, storagedCartText]);
        localStorage.setItem("@RocketShoes:cart", JSON.stringify(cart));
      } else {
        const updateCart = {
          productId: productId,
          amount: 1,
        };
        updateProductAmount(updateCart);
      }
    } catch {}
  };

  const removeProduct = (productId: number) => {
    try {
      const deleteCartCart = cart.filter(
        (deleteCart) => deleteCart.id !== productId
      );
      console.log("DELETE: ", deleteCartCart);
      setCart(deleteCartCart);
      localStorage.setItem("@RocketShoes:cart", JSON.stringify(cart));
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      const addCartUpdate = cart.findIndex((addUpdate) => {
        return addUpdate.id === productId;
      });
      console.log("UPDATE: ", cart[addCartUpdate].amount);
      cart[addCartUpdate].amount = cart[addCartUpdate].amount + amount;
      setCart([...cart]);
      localStorage.setItem("@RocketShoes:cart", JSON.stringify(cart));
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
