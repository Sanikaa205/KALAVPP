export type UserRole = "ADMIN" | "VENDOR" | "CUSTOMER";
export type ProductType = "PHYSICAL" | "DIGITAL" | "MERCHANDISE";
export type ProductStatus = "DRAFT" | "ACTIVE" | "SOLD_OUT" | "ARCHIVED";
export type OrderStatus = "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";
export type CommissionStatus = "PENDING" | "REQUESTED" | "ACCEPTED" | "IN_PROGRESS" | "REVISION_REQUESTED" | "COMPLETED" | "CANCELLED" | "DELIVERED" | "DISPUTED";
export type VendorStatus = "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
export type ServiceType = "PORTRAIT" | "SCULPTURE" | "MURAL" | "CALLIGRAPHY" | "ILLUSTRATION" | "BRANDING" | "BOOK_COVER" | "EXHIBITION" | "CONSULTANCY" | "WORKSHOP" | "CUSTOM";

export interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
  avatar?: string;
  phone?: string;
  bio?: string;
  role: UserRole;
  createdAt: string;
}

export interface VendorProfile {
  id: string;
  userId: string;
  storeName: string;
  storeSlug: string;
  description?: string;
  bio?: string;
  phone?: string;
  location?: string;
  logo?: string;
  banner?: string;
  specializations: string[];
  status: VendorStatus;
  rating: number;
  totalSales: number;
  totalOrders: number;
  user?: User;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  children?: Category[];
  _count?: { products: number };
}

export interface Product {
  id: string;
  vendorId: string;
  categoryId?: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  type: ProductType;
  status: ProductStatus;
  price: number;
  compareAtPrice?: number;
  currency: string;
  images: string[];
  tags: string[];
  featured: boolean;
  rating: number;
  reviewCount: number;
  viewCount: number;
  stockQuantity?: number;
  medium?: string;
  style?: string;
  artDimensions?: string;
  yearCreated?: number;
  isOriginal: boolean;
  isActive: boolean;
  certificate?: boolean;
  vendor?: VendorProfile;
  category?: Category;
  reviews?: Review[];
  createdAt: string;
}

export interface Service {
  id: string;
  vendorId: string;
  title: string;
  slug: string;
  description: string;
  type: ServiceType;
  basePrice: number;
  startingPrice: number;
  currency: string;
  deliveryDays?: number;
  maxRevisions?: number;
  includes?: string[];
  images: string[];
  tags?: string[];
  rating: number;
  reviewCount: number;
  isActive: boolean;
  vendor?: VendorProfile;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  totalAmount?: number;
  currency: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  items: OrderItem[];
  user?: User;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  title: string;
  price: number;
  quantity: number;
  type: ProductType;
  status: OrderStatus;
  product?: Product;
}

export interface Commission {
  id: string;
  customerId: string;
  vendorId: string;
  serviceId?: string;
  title: string;
  description: string;
  budget: number;
  status: CommissionStatus;
  deadline?: string;
  progress?: number;
  currentRevision?: number;
  maxRevisions?: number;
  createdAt: string;
  customer?: User;
  vendor?: VendorProfile;
  service?: Service;
}

export interface Review {
  id: string;
  userId: string;
  productId?: string;
  serviceId?: string;
  rating: number;
  title?: string;
  comment?: string;
  images: string[];
  isVerified: boolean;
  createdAt: string;
  user?: User;
}

export interface Address {
  id: string;
  userId: string;
  label: string;
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalUsers: number;
  recentOrders: Order[];
  topProducts: Product[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
