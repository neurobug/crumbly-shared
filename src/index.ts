import { z } from 'zod';

export const slugSchema = z
  .string()
  .min(3)
  .max(50)
  .regex(/^[a-z0-9-]+$/, 'Slug inválido');

export const registerTenantSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  businessName: z.string().min(2),
  slug: slugSchema,
});

export type RegisterTenantDto = z.infer<typeof registerTenantSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type LoginDto = z.infer<typeof loginSchema>;

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

export type RefreshTokenDto = z.infer<typeof refreshTokenSchema>;

export const themeTokensSchema = z.object({
  displayName: z.string().min(1),
  logoUrl: z.string().url().nullable().optional(),
  faviconUrl: z.string().url().nullable().optional(),
  primaryColor: z.string().min(4),
  secondaryColor: z.string().min(4),
  accentColor: z.string().min(4),
  fontFamily: z.string().min(1),
  borderRadius: z.string().min(1),
  darkModeDefault: z.boolean().optional(),
});

export type ThemeTokens = z.infer<typeof themeTokensSchema>;

export const updateTenantSchema = z.object({
  displayName: z.string().min(2).optional(),
  allowStaffCheckout: z.boolean().optional(),
});

export type UpdateTenantDto = z.infer<typeof updateTenantSchema>;

export const jwtPayloadSchema = z.object({
  sub: z.string(),
  tenantId: z.string(),
  role: z.string(),
  canCheckout: z.boolean(),
  canCloseRegister: z.boolean(),
});

export type JwtPayload = z.infer<typeof jwtPayloadSchema>;
