import {useEffect, useState} from "react";

import {NavBar, Products} from "./components";
import {commerce} from "./lib/commerce";

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const {data} = await commerce.products.list();

    setProducts(data);
  }

  return (
    <div>
      <NavBar />
      <Products products={products}/>
    </div>
  );
}

export default App;
