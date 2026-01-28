import axios, { AxiosInstance, AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests
    this.client.interceptors.request.use((config) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle responses
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Clear auth and redirect to login
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/auth/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth
  async signup(data: any) {
    return this.client.post('/auth/signup', data);
  }

  async signin(data: any) {
    return this.client.post('/auth/signin', data);
  }

  // Vendors
  async createVendor(data: any) {
    return this.client.post('/vendors', data);
  }

  async getVendor(vendorId: string) {
    return this.client.get(`/vendors/${vendorId}`);
  }

  async getVendorBySlug(slug: string) {
    return this.client.get(`/vendors/slug/${slug}`);
  }

  async updateVendor(vendorId: string, data: any) {
    return this.client.put(`/vendors/${vendorId}`, data);
  }

  async getVendorDashboard(vendorId: string) {
    return this.client.get(`/vendors/${vendorId}/dashboard`);
  }

  async getNearbyVendors(latitude: number, longitude: number, radius?: number) {
    return this.client.get('/vendors', {
      params: { latitude, longitude, radius },
    });
  }

  // Products
  async createProduct(data: any) {
    return this.client.post('/products', data);
  }

  async searchProducts(query: string, filters?: any) {
    return this.client.get('/products/search', {
      params: { q: query, ...filters },
    });
  }

  async getProduct(productId: string) {
    return this.client.get(`/products/${productId}`);
  }

  async getProductBySlug(slug: string) {
    return this.client.get(`/products/slug/${slug}`);
  }

  async updateProduct(productId: string, data: any) {
    return this.client.put(`/products/${productId}`, data);
  }

  async publishProduct(productId: string) {
    return this.client.post(`/products/${productId}/publish`);
  }

  // Cart
  async getCart() {
    return this.client.get('/cart');
  }

  async getCartSummary() {
    return this.client.get('/cart/summary');
  }

  async addToCart(productId: string, quantity: number) {
    return this.client.post('/cart/items', { productId, quantity });
  }

  async updateCartItem(itemId: string, quantity: number) {
    return this.client.put(`/cart/items/${itemId}`, { quantity });
  }

  async removeFromCart(itemId: string) {
    return this.client.delete(`/cart/items/${itemId}`);
  }

  async clearCart() {
    return this.client.post('/cart/clear');
  }

  // Orders
  async createCheckout(data: any) {
    return this.client.post('/orders/checkout', data);
  }

  async selectPaymentMethod(orderId: string, paymentMethod: string) {
    return this.client.post(`/orders/${orderId}/select-payment`, {
      paymentMethod,
    });
  }

  async confirmPayment(orderId: string) {
    return this.client.post(`/orders/${orderId}/confirm-payment`);
  }

  async getOrder(orderId: string) {
    return this.client.get(`/orders/${orderId}`);
  }

  async getBuyerOrders(page?: number, limit?: number) {
    return this.client.get('/orders', {
      params: { page, limit },
    });
  }

  async getVendorOrders(vendorId: string, page?: number, limit?: number) {
    return this.client.get(`/orders/vendor/${vendorId}`, {
      params: { page, limit },
    });
  }

  async updateVendorOrderStatus(vendorOrderId: string, status: string) {
    return this.client.put(`/orders/vendor-orders/${vendorOrderId}/status`, {
      status,
    });
  }

  // Reviews
  async createReview(data: any) {
    return this.client.post('/reviews', data);
  }

  async getProductReviews(productId: string, page?: number, limit?: number) {
    return this.client.get(`/reviews/product/${productId}`, {
      params: { page, limit },
    });
  }

  async getVendorReviews(vendorId: string, page?: number, limit?: number) {
    return this.client.get(`/reviews/vendor/${vendorId}`, {
      params: { page, limit },
    });
  }
}

export const apiClient = new ApiClient();
