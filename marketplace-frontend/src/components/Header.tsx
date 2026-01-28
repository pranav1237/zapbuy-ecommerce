import React from 'react';

interface HeaderProps {
  onCartClick: () => void;
  cartCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onCartClick, cartCount }) => {
  return (
    <header className="sticky top-0 z-50 bg-white shadow">
      <div className="container-main flex items-center justify-between py-4">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold text-blue-600">LocalMarket</h1>
          <nav className="hidden md:flex gap-6">
            <a href="/" className="hover:text-blue-600 transition">Home</a>
            <a href="/vendors" className="hover:text-blue-600 transition">Vendors</a>
            <a href="/shop" className="hover:text-blue-600 transition">Shop</a>
            <a href="/about" className="hover:text-blue-600 transition">About</a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <a href="/auth/login" className="btn-outline">Sign In</a>
          <button onClick={onCartClick} className="btn-primary relative">
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
