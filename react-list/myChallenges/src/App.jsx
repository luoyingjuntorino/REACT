import { useState } from "react";

const initialProducts = [
  {
    id: 0,
    name: "Baklava",
    count: 1,
  },
  {
    id: 1,
    name: "Cheese",
    count: 5,
  },
  {
    id: 2,
    name: "Spaghetti",
    count: 2,
  },
];

export default function ShoppingCart() {
  const [products, setProducts] = useState(initialProducts);
  const [username, setUsername] = useState("");

  function handleIncreaseClick(productId) {
    const newProducts = products.map((product) => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1,
        };
      }
      return product;
    });

    setProducts(newProducts);
  }

  return (
    <>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} (<b>{product.count}</b>)
            <button
              onClick={() => {
                handleIncreaseClick(product.id);
              }}
            >
              +
            </button>
          </li>
        ))}
      </ul>
      <div>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <button onClick={() => alert(`Hello ${username}`)}>Say Hello</button>
      </div>
    </>
  );
}
