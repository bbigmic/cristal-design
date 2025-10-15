export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  dimensions: string
  material: string
  features: string[]
  images: string[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  email: string
  name?: string
  role: 'USER' | 'ADMIN'
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  id: string
  userId: string
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  totalAmount: number
  shippingAddress: string
  notes?: string
  createdAt: Date
  updatedAt: Date
  orderItems: OrderItem[]
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  quantity: number
  price: number
  product: Product
}

export interface CartItem {
  id: string
  product: Product
  quantity: number
  price: number
}

export interface CartContextType {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  isInCart: (productId: string) => boolean
}
