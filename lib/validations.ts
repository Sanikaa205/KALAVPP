import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  role: z.enum(["CUSTOMER", "VENDOR"]).default("CUSTOMER"),
});

export const productSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  shortDescription: z.string().optional(),
  type: z.enum(["PHYSICAL", "DIGITAL", "MERCHANDISE"]),
  price: z.number().positive("Price must be positive"),
  compareAtPrice: z.number().positive().optional(),
  categoryId: z.string().optional(),
  images: z.array(z.string()).min(1, "At least one image is required"),
  tags: z.array(z.string()).optional(),
  stockQuantity: z.number().int().min(0).optional(),
  weight: z.number().positive().optional(),
  medium: z.string().optional(),
  style: z.string().optional(),
  artDimensions: z.string().optional(),
  yearCreated: z.number().int().optional(),
  isOriginal: z.boolean().optional(),
});

export const serviceSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  type: z.enum([
    "PORTRAIT",
    "SCULPTURE",
    "MURAL",
    "CALLIGRAPHY",
    "ILLUSTRATION",
    "BRANDING",
    "BOOK_COVER",
    "EXHIBITION",
    "CONSULTANCY",
    "WORKSHOP",
    "CUSTOM",
  ]),
  basePrice: z.number().positive("Price must be positive"),
  deliveryDays: z.number().int().positive().optional(),
  images: z.array(z.string()).optional(),
});

export const commissionSchema = z.object({
  serviceId: z.string().optional(),
  vendorId: z.string(),
  title: z.string().min(3),
  description: z.string().min(20),
  budget: z.number().positive(),
  deadline: z.string().optional(),
  requirements: z.record(z.unknown()).optional(),
});

export const addressSchema = z.object({
  label: z.string().default("Home"),
  fullName: z.string().min(2),
  line1: z.string().min(5),
  line2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  postalCode: z.string().min(5),
  country: z.string().default("India"),
  phone: z.string().optional(),
  isDefault: z.boolean().optional(),
});

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type ServiceInput = z.infer<typeof serviceSchema>;
export type CommissionInput = z.infer<typeof commissionSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
