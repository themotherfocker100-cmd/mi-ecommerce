'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@king/components/shop/ProductCard';
import { Product } from '@king/lib/types';

type CategoryFilter = 'all' | 'wines' | 'general';

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts(category);
  }, [products, category]);

  async function fetchProducts() {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  }

  function filterProducts(cat: CategoryFilter) {
    if (cat === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter((p) => p.category === cat));
    }
    setCategory(cat);
  }

  return (
    <div className="bg-gray-50 py-16 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Tienda Los Palomos</h1>
          <p className="text-xl text-gray-600">Vinos premium y productos gourmet para disfrutar</p>
        </div>

        {/* Category Filters */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          <button
            onClick={() => filterProducts('all')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              category === 'all'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-green-600'
            }`}
          >
            Todos los Productos
          </button>
          <button
            onClick={() => filterProducts('wines')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              category === 'wines'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-green-600'
            }`}
          >
            🍷 Vinos
          </button>
          <button
            onClick={() => filterProducts('general')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              category === 'general'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-green-600'
            }`}
          >
            🍱 Productos Gourmet
          </button>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">Cargando productos...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No hay productos en esta categoría</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
