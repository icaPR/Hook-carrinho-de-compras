import React from "react";
import {
  MdDelete,
  MdAddCircleOutline,
  MdRemoveCircleOutline,
} from "react-icons/md";

import { useCart } from "../../hooks/useCart";
// import { formatPrice } from '../../util/format';
import { Container, ProductTable, Total } from "./styles";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  amount: number;
}

const Cart = (): JSX.Element => {
  const { cart, removeProduct, updateProductAmount } = useCart();

  /*
  const cartFormatted = cart.map((product) => ({
    //   // TODO
  }));*/
  // const total =
  //   formatPrice(
  //     cart.reduce((sumTotal, product) => {
  //       // TODO
  //     }, 0)
  //   );

  function handleProductIncrement(product: Product) {
    const increUpdate = {
      productId: product.id,
      amount: 1,
    };
    updateProductAmount(increUpdate);
    // TODO
  }

  function handleProductDecrement(product: Product) {
    const increUpdate = {
      productId: product.id,
      amount: -1,
    };
    updateProductAmount(increUpdate);
    // TODO
  }

  function handleRemoveProduct(productId: number) {
    removeProduct(productId);
    // TODO
  }

  return (
    <Container>
      {cart.map((productCart) => {
        return (
          <ProductTable key={productCart.id}>
            <thead>
              <tr>
                <th aria-label="product image" />
                <th>PRODUTO</th>
                <th>QTD</th>
                <th>SUBTOTAL</th>
                <th aria-label="delete icon" />
              </tr>
            </thead>
            <tbody>
              <tr data-testid="product">
                <td>
                  <img src={productCart.image} alt={productCart.title} />
                </td>
                <td>
                  <strong>{productCart.title}</strong>
                  <span>{productCart.price}</span>
                </td>
                <td>
                  <div>
                    <button
                      type="button"
                      data-testid="decrement-product"
                      disabled={productCart.amount <= 1}
                      onClick={() => handleProductDecrement(productCart)}
                    >
                      <MdRemoveCircleOutline size={20} />
                    </button>
                    <input
                      type="text"
                      data-testid="product-amount"
                      readOnly
                      value={productCart.amount}
                    />
                    <button
                      type="button"
                      data-testid="increment-product"
                      onClick={() => handleProductIncrement(productCart)}
                    >
                      <MdAddCircleOutline size={20} />
                    </button>
                  </div>
                </td>
                <td>
                  <strong>{productCart.price}</strong>
                </td>
                <td>
                  <button
                    type="button"
                    data-testid="remove-product"
                    onClick={() => handleRemoveProduct(productCart.id)}
                  >
                    <MdDelete size={20} />
                  </button>
                </td>
              </tr>
            </tbody>
          </ProductTable>
        );
      })}
      ;
      <footer>
        <button type="button">Finalizar pedido</button>

        <Total>
          <span>TOTAL</span>
          <strong>R$ 359,80</strong>
        </Total>
      </footer>
    </Container>
  );
};

export default Cart;
