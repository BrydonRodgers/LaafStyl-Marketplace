import { create } from 'zustand';
import { User } from './supabase';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));

interface CartItem {
  product_id: string;
  quantity: number;
  price: number;
  name: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (product_id: string) => void;
  updateQuantity: (product_id: string, quantity: number) => void;
  clear: () => void;
  total: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (item) => {
    const state = get();
    const existing = state.items.find((i) => i.product_id === item.product_id);
    if (existing) {
      set({
        items: state.items.map((i) =>
          i.product_id === item.product_id
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        ),
      });
    } else {
      set({ items: [...state.items, item] });
    }
  },
  removeItem: (product_id) =>
    set((state) => ({
      items: state.items.filter((i) => i.product_id !== product_id),
    })),
  updateQuantity: (product_id, quantity) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.product_id === product_id ? { ...i, quantity } : i
      ),
    })),
  clear: () => set({ items: [] }),
  total: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
}));
