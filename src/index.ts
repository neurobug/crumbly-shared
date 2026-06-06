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

export const paymentMethodSchema = z.enum(['cash', 'card', 'transfer', 'mixed']);

export type PaymentMethod = z.infer<typeof paymentMethodSchema>;

export const paymentCreateSchema = z.object({
  orderId: z.string().min(1),
  method: paymentMethodSchema,
  amount: z.number().positive(),
  tip: z.number().min(0).optional(),
});

export type PaymentCreateDto = z.infer<typeof paymentCreateSchema>;

export const paymentResponseSchema = z.object({
  payment: z.object({
    id: z.string(),
    method: paymentMethodSchema,
    amount: z.number(),
    tip: z.number(),
  }),
  order: z.object({
    id: z.string(),
    status: z.string(),
    total: z.number(),
  }),
});

export type PaymentResponse = z.infer<typeof paymentResponseSchema>;

export const syncPushEventSchema = z.object({
  clientEventId: z.string().min(1),
  eventType: z.string().min(1),
  payload: z.record(z.unknown()),
});

export const syncPushSchema = z.object({
  deviceId: z.string().min(1),
  events: z.array(syncPushEventSchema).min(1),
});

export type SyncPushDto = z.infer<typeof syncPushSchema>;

export const syncPushResultSchema = z.object({
  results: z.array(
    z.object({
      clientEventId: z.string(),
      status: z.enum(['pending', 'processed', 'failed']),
      error: z.string().optional(),
    }),
  ),
});

export type SyncPushResult = z.infer<typeof syncPushResultSchema>;

export const registerOpenSchema = z.object({
  locationId: z.string().min(1),
  openingCash: z.number().min(0),
});

export type RegisterOpenDto = z.infer<typeof registerOpenSchema>;

export const registerSummarySchema = z.object({
  session: z.object({
    id: z.string(),
    openedAt: z.string(),
    openingCash: z.number(),
  }),
  summary: z.object({
    paymentCount: z.number(),
    cashTotal: z.number(),
    cardTotal: z.number(),
    transferTotal: z.number(),
    tipsTotal: z.number(),
    expectedCash: z.number(),
  }),
});

export type RegisterSummaryDto = z.infer<typeof registerSummarySchema>;

export const registerCloseSchema = z.object({
  countedCash: z.number().min(0),
  notes: z.string().optional(),
});

export type RegisterCloseDto = z.infer<typeof registerCloseSchema>;

export const supervisorPinSchema = z.object({
  pin: z.string().min(4).max(8),
});

export type SupervisorPinDto = z.infer<typeof supervisorPinSchema>;
