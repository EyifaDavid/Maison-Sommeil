import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { MdOutlineShoppingBag } from "react-icons/md";
import Button from "../components/Button";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";

export default function CategoryPage() {
  const { category } = useParams(); // "men", "women", "shop"
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subCategory, setSubCategory] = useState("All");
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);


  const subCategories = ["All", "clothing", "footwear", "accessories"];

  const handleAddToCart = (product) => {
      const item = {
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0],
        countInStock: product.stock,
      };

      const isInCart = cartItems.find((i) => i.id === item.id);

      if (item.countInStock === 0) {
        toast.error("Product is out of stock");
        return;
      }

      if (isInCart && isInCart.quantity >= item.countInStock) {
        toast.error("Not enough stock available");
        return;
      }

      dispatch(addToCart({productId: item.id, quantity:1}));
      toast.success("Added to cart");
    };


  useEffect(() => {
    const API = import.meta.env.VITE_API_BASE_URL;
    let url = `${API}/products`;

     const params = new URLSearchParams();

    if (category === "discounts") {
      params.append("discount", "true");
  } else if (category && category !== "shop" && category !== "undefined") {
    params.append("gender", category);
  }

  if ([...params].length > 0) {
    url += `?${params.toString()}`;
  }

  console.log("Final Fetch URL:", url); // Debug helper

    const fetchProducts = async () => {
      try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.status) {
          setProducts(data.data);
        } else {
          console.error("Error fetching products:", data.message);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const filteredProducts =
    subCategory === "All"
      ? products
      : products.filter((p) => p.category?.toLowerCase() === subCategory);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 capitalize">{category} Collection</h2>

      {/* Filter buttons (only show for shop page) */}
        <div className="mb-6 overflow-x-auto">
      <div className="flex gap-2 md:gap-4 min-w-max">
        {subCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSubCategory(cat)}
            className={`px-4 py-2 rounded-full border whitespace-nowrap ${
              subCategory === cat
                ? "bg-black text-white"
                : "bg-white text-black"
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>
    </div>

      

      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-gray-400"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((item) => (
            <div
              key={item._id}
              className="group min-w-[300px] rounded-lg p-2 overflow-hidden hover:shadow-lg inline-block transition"
            >
              <Link
                to={`/product/${item._id}`}
                state={{ product: item }}
                className="block bg-amber-50 rounded-t"
              >
                <img
                  src={item.images?.[0] || "/placeholder.jpg"}
                  alt={item.name}
                  className="h-full w-full object-contain rounded-t"
                />
              </Link>

              <div className="bg-white p-2 relative">
                <h3 className="mt-4 font-semibold text-lg">{item.name}</h3>
                <div className="flex items-center">
                  <span className="font-semibold">{item.noColors} colors</span>
                  <span className="text-gray-500 px-4">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(item.price)}
                  </span>
                  <span className="hidden group-hover:flex absolute right-8 transition-all duration-300">
                    <Button
                      icon={
                        <MdOutlineShoppingBag
                          size={15}
                          className="hover:cursor-pointer"
                        />
                      }
                      className="bg-black text-white text-sm rounded-full"
                      onClick={() => handleAddToCart(item)}
                    />
                  </span>
                </div>
              </div>

              <div className="hidden group-hover:block mt-4 transition-all duration-300">
                <div className="flex gap-2 mb-2">
                  {item.colors?.slice(0, 4).map((color, index) => (
                    <div
                      key={index}
                      className="w-4 h-4 rounded-full border cursor-pointer"
                      style={{ backgroundColor: color }}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        console.log("Selected color:", color);
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
