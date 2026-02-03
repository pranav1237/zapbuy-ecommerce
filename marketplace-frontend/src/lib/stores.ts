import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'BUYER' | 'VENDOR' | 'ADMIN';
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user: User, token: string) => {
        set({ user, token, isAuthenticated: true });
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      },
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      },
      setUser: (user: User) => {
        set({ user });
        localStorage.setItem('user', JSON.stringify(user));
      },
    }),
    {
      name: 'auth-store',
    }
  )
);

// Cart Store
interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image: string;
  vendor: {
    id: string;
    name: string;
    slug: string;
  };
  inStock: boolean;
}

interface CartStore {
  items: CartItem[];
  vendorId: string | null;
  deliveryOption: 'delivery' | 'pickup';
  setItems: (items: CartItem[]) => void;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  setDeliveryOption: (option: 'delivery' | 'pickup') => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTotalItems: () => number;
  getDeliveryFee: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      vendorId: null,
      deliveryOption: 'delivery',
      setItems: (items) => set({ items }),
      addItem: (item) => {
        const state = get();
        const items = state.items;
        
        // Check if adding from a different vendor (MVP: single vendor cart)
        if (state.vendorId && state.vendorId !== item.vendor.id && items.length > 0) {
          // Clear cart if different vendor
          set({ 
            items: [item], 
            vendorId: item.vendor.id 
          });
          return;
        }
        
        const existingItem = items.find((i) => i.productId === item.productId);
        if (existingItem) {
          set({
            items: items.map((i) =>
              i.id === existingItem.id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          set({ 
            items: [...items, item],
            vendorId: item.vendor.id
          });
        }
      },
      removeItem: (itemId) => {
        const newItems = get().items.filter((i) => i.id !== itemId);
        set({ 
          items: newItems,
          vendorId: newItems.length === 0 ? null : get().vendorId
        });
      },
      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.id === itemId ? { ...i, quantity } : i
          ),
        });
      },
      setDeliveryOption: (option) => set({ deliveryOption: option }),
      clearCart: () => set({ items: [], vendorId: null }),
      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },
      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
      getDeliveryFee: () => {
        const subtotal = get().getSubtotal();
        const deliveryOption = get().deliveryOption;
        if (deliveryOption === 'pickup') return 0;
        if (subtotal >= 500) return 0; // Free delivery above ₹500
        return 40; // Standard delivery fee
      },
      getTotal: () => {
        return get().getSubtotal() + get().getDeliveryFee();
      },
    }),
    {
      name: 'cart-store',
    }
  )
);
