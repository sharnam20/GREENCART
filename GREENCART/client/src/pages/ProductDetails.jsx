import { useEffect, useState } from "react";
import { useAppcontext } from "../context/Appcontext";
import { useParams, Link } from "react-router-dom";
import { assets } from "../assets/assets";
import ProductCard from "../components/ProductCard";

const ProductDetails = () => {
  const { products, navigate, currency, addToCart } = useAppcontext();
  const { id } = useParams();

  const [relatedProducts, setrelatedProducts] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);

  const product = products.find((item) => item._id === id);

  useEffect(() => {
    if (products.length > 0 && product) {
      let productsCopy = products.slice();
      productsCopy = productsCopy.filter((item) => product.category === item.category && item._id !== product._id);
      setrelatedProducts(productsCopy.slice(0, 5));
    }
  }, [products, product]);

  useEffect(() => {
    setThumbnail(product?.image?.[0] || null);
  }, [product]);

  // Helper function to handle description display
  const renderDescription = (description) => {
    if (!description) return null;
    
    // If it's already an array, use it as is
    if (Array.isArray(description)) {
      return description.map((desc, index) => (
        <li key={index}>{desc}</li>
      ));
    }
    
    // If it's a string, split by newlines or periods and filter empty strings
    const descArray = description.split(/\n|\./).filter(item => item.trim() !== '');
    
    // If we have multiple sentences, show them as list items
    if (descArray.length > 1) {
      return descArray.map((desc, index) => (
        <li key={index}>{desc.trim()}</li>
      ));
    }
    
    // If it's just one sentence, show it as a single list item
    return <li>{description}</li>;
  };

  return product && (
    <div className="mt-12">
      <p>
        <Link to="/">Home</Link> /
        <Link to="/products"> Products</Link> /
        <Link to={`/products/${product.category.toLowerCase()}`}> {product.category}</Link> /
        <span className="text-green-500"> {product.name}</span>
      </p>

      <div className="flex flex-col md:flex-row gap-16 mt-4">
        <div className="flex gap-3">
          <div className="flex flex-col gap-3">
            {product.image && product.image.map((image, index) => (
              <div key={index} onClick={() => setThumbnail(image)} className="border max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer" >
                <img src={image} alt={`Thumbnail ${index + 1}`} />
              </div>
            ))}
          </div>

          <div className="border border-gray-500/30 max-w-100 rounded overflow-hidden">
            <img src={thumbnail} alt="Selected product" />
          </div>
        </div>

        <div className="text-sm w-full md:w-1/2">
          <h1 className="text-3xl font-medium">{product.name}</h1>

          <div className="flex items-center gap-0.5 mt-1">
            {Array(5).fill('').map((_, i) => (
              <img key={i} src={i < 4 ? assets.star_icon : assets.star_dull_icon} alt="" className="md:w-4 w-3.5" />
            ))}
            <p className="text-base ml-2">(4)</p>
          </div>

          <div className="mt-6">
          <p className="text-gray-500/70 line-through">
  MRP: {currency}{product.price ?? "N/A"}
</p>
<p className="text-2xl font-medium">
  Price: {currency}{product.offerPrice ?? product.price ?? "N/A"}
</p>

            <span className="text-gray-500/70">(inclusive of all taxes)</span>
          </div>

          <p className="text-base font-medium mt-6">About Product</p>
          <ul className="list-disc ml-4 text-gray-500/70">
            {renderDescription(product.description)}
          </ul>

          <div className="flex items-center mt-10 gap-4 text-base">
            <button onClick={() => addToCart(product._id)} className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition" >
              Add to Cart
            </button>
            <button onClick={() => { addToCart(product._id); navigate("/cart"); }} className="w-full py-3.5 cursor-pointer font-medium bg-green-500 text-white hover:bg-green-600 transition" >
              Buy now
            </button>
          </div>
        </div>
      </div>

      {/* Related products */}
      <div className="max-w-screen-xl mx-auto flex flex-col items-center mt-20 px-4">
        <div className="flex flex-col items-center w-max">
          <p className="text-3xl font-medium">Related Products</p>
          <div className="w-20 h-0.5 bg-green rounded-full mt-2"></div>
        </div>
       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-3 md:gap-6 mt-6 w-full">
          {relatedProducts.filter((product) => product.inStock).map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
        <button
          onClick={() => { navigate('/products'); scrollTo(0, 0); }}
          className="mx-auto mt-12 mb-16 px-10 py-2.5 border border-green-500 text-green-600 hover:bg-green-50 rounded transition"
        >
          See More
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;