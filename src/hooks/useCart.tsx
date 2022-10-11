import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
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
  const [stock, setStock] = useState<Stock[]>([]);
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem("@RocketShoes:cart");
    if (storagedCart) {
      return JSON.parse(storagedCart);
    }
    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const upCart = [...cart];
      const existProductCart = upCart.find(
        (product) => product.id === productId
      );
      const stock = await api.get(`/stock/${productId}`);
      const stockAmount = stock.data.amount;
      const currentAmount = existProductCart ? existProductCart.amount : 0;
      const amount = currentAmount + 1;

      if (stockAmount < amount) {
        toast.error("Quantidade solicitada fora de estoque");
        return;
      }
      if (existProductCart) {
        existProductCart.amount = amount;
      } else {
        const product = await api.get(`/products/${productId}`);
        const newProduct = {
          ...product.data,
          amount: 1,
        };
        upCart.push(newProduct);
      }
      setCart(upCart);
      localStorage.setItem("@RocketShoes:cart", JSON.stringify(upCart));
    } catch {
      toast.error("Erro na adição do produto");
    }
  };

  const removeProduct = (productId: number) => {
    try {
      const deleteItemCart = [...cart];
      const indexDelete = cart.findIndex((product) => product.id === productId);
      if (indexDelete >= 0) {
        deleteItemCart.splice(indexDelete, 1);
        setCart(deleteItemCart);
        localStorage.setItem(
          "@RocketShoes:cart",
          JSON.stringify(deleteItemCart)
        );
      } else {
        throw Error();
      }
    } catch (error) {
      toast.error("Erro na remoção do produto");
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      if (amount <= 0) {
        return;
      }
      const stock = await api.get(`/stock/${productId}`);
      const stockAmount = stock.data.amount;
      if (amount > stockAmount) {
        toast.error("Quantidade solicitada fora de estoque");
        return;
      }
      const updateItemCart = [...cart];
      const existProductCart = updateItemCart.find(
        (product) => product.id === productId
      );

      if (existProductCart) {
        existProductCart.amount = amount;
        setCart(updateItemCart);
        localStorage.setItem(
          "@RocketShoes:cart",
          JSON.stringify(updateItemCart)
        );
      } else {
        throw Error();
      }
    } catch {
      toast.error("Erro na alteração de quantidade do produto");
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
