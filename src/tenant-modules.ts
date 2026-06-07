import { z } from 'zod';

export const TENANT_MODULE_KEYS = [
  'pos.dine_in',
  'pos.takeaway',
  'pos.counter',
  'kitchen.kds',
  'production.plant',
  'production.auto_requests',
  'catalog.modifiers',
  'catalog.bundles',
  'finance.register',
  'finance.staff_checkout',
  'finance.mixed_payments',
  'finance.dian',
  'public.menu',
  'public.menu_orders',
  'public.reviews',
  'fulfillment.scheduled',
  'fulfillment.delivery',
  'ops.inventory',
  'ops.recipes',
  'ops.shifts',
  'ops.reports',
] as const;

export type TenantModuleKey = (typeof TENANT_MODULE_KEYS)[number];

export const tenantModuleKeySchema = z.enum(TENANT_MODULE_KEYS);

export type TenantFeatureEntry = {
  enabled: boolean;
  config?: Record<string, unknown>;
};

export type TenantFeaturesMap = Record<TenantModuleKey, TenantFeatureEntry>;

export type ModuleGovernanceTier = 'self_service' | 'owner_confirm' | 'platform_only';

export type TenantModuleMeta = {
  key: TenantModuleKey;
  group: string;
  label: string;
  description: string;
  apps: Array<'pos' | 'admin' | 'production' | 'menu' | 'api'>;
  dependsOn?: TenantModuleKey[];
  dependsOnAny?: TenantModuleKey[];
  requiresPlatform?: boolean;
  governanceTier?: ModuleGovernanceTier;
};

export function getModuleGovernanceTier(meta: TenantModuleMeta): ModuleGovernanceTier {
  return meta.governanceTier ?? 'self_service';
}

export const TENANT_MODULE_CATALOG: TenantModuleMeta[] = [
  {
    key: 'pos.dine_in',
    group: 'pos',
    label: 'Salón con mesas',
    description: 'Mapa de mesas y pedidos en mesa.',
    apps: ['pos', 'admin'],
  },
  {
    key: 'pos.takeaway',
    group: 'pos',
    label: 'Para llevar',
    description: 'Cola de turnos y pedidos para llevar.',
    apps: ['pos', 'admin'],
  },
  {
    key: 'pos.counter',
    group: 'pos',
    label: 'Mostrador',
    description: 'Pedidos rápidos en mostrador sin mesa.',
    apps: ['pos'],
  },
  {
    key: 'kitchen.kds',
    group: 'kitchen',
    label: 'Pantalla de cocina (KDS)',
    description: 'Pedidos activos en cocina.',
    apps: ['production'],
    dependsOnAny: ['pos.dine_in', 'pos.takeaway', 'fulfillment.delivery'],
  },
  {
    key: 'production.plant',
    group: 'production',
    label: 'Planta de producción',
    description: 'Solicitudes de producción en planta.',
    apps: ['production', 'admin'],
  },
  {
    key: 'production.auto_requests',
    group: 'production',
    label: 'Solicitudes automáticas',
    description: 'Alertas a planta cuando el inventario baja del mínimo.',
    apps: ['api', 'production'],
    dependsOn: ['production.plant', 'ops.inventory'],
  },
  {
    key: 'catalog.modifiers',
    group: 'catalog',
    label: 'Modificadores',
    description: 'Opciones extra en líneas de pedido.',
    apps: ['pos', 'admin'],
  },
  {
    key: 'catalog.bundles',
    group: 'catalog',
    label: 'Combos',
    description: 'Paquetes de productos con precio fijo.',
    apps: ['pos', 'admin'],
  },
  {
    key: 'finance.register',
    group: 'finance',
    label: 'Caja registradora',
    description: 'Apertura, arqueo y cierre de caja.',
    apps: ['pos'],
  },
  {
    key: 'finance.staff_checkout',
    group: 'finance',
    label: 'Cobro por mesera',
    description: 'Permite que meseros con permiso cobren desde el POS.',
    apps: ['pos', 'admin'],
    dependsOn: ['finance.register'],
    governanceTier: 'owner_confirm',
  },
  {
    key: 'finance.mixed_payments',
    group: 'finance',
    label: 'Pagos mixtos',
    description: 'Dividir un cobro entre varios métodos.',
    apps: ['pos'],
    dependsOn: ['finance.register'],
    governanceTier: 'owner_confirm',
  },
  {
    key: 'finance.dian',
    group: 'finance',
    label: 'Facturación DIAN',
    description: 'Emisión de factura electrónica Colombia.',
    apps: ['api', 'admin'],
    requiresPlatform: true,
    governanceTier: 'platform_only',
  },
  {
    key: 'public.menu',
    group: 'public',
    label: 'Menú público',
    description: 'Menú web por slug del negocio.',
    apps: ['menu'],
  },
  {
    key: 'public.menu_orders',
    group: 'public',
    label: 'Pedidos por menú QR',
    description: 'Clientes piden desde el menú público.',
    apps: ['menu', 'api'],
    dependsOn: ['public.menu'],
  },
  {
    key: 'public.reviews',
    group: 'public',
    label: 'Reseñas',
    description: 'Reseñas de clientes en el menú público.',
    apps: ['menu', 'admin'],
    dependsOn: ['public.menu'],
  },
  {
    key: 'fulfillment.scheduled',
    group: 'fulfillment',
    label: 'Pedidos programados',
    description: 'Encargos con fecha de recogida o entrega.',
    apps: ['pos', 'admin', 'menu', 'api'],
    dependsOnAny: ['pos.takeaway', 'public.menu_orders', 'fulfillment.delivery'],
  },
  {
    key: 'fulfillment.delivery',
    group: 'fulfillment',
    label: 'Domicilios',
    description: 'Pedidos a domicilio con dirección y cola de despacho.',
    apps: ['pos', 'admin', 'menu', 'api'],
    dependsOnAny: ['pos.takeaway', 'public.menu_orders'],
    governanceTier: 'owner_confirm',
  },
  {
    key: 'ops.inventory',
    group: 'ops',
    label: 'Inventario',
    description: 'Stock de ingredientes por local.',
    apps: ['admin', 'api'],
  },
  {
    key: 'ops.recipes',
    group: 'ops',
    label: 'Recetas y costos',
    description: 'Recetas, ingredientes y margen.',
    apps: ['admin'],
    dependsOn: ['ops.inventory'],
  },
  {
    key: 'ops.shifts',
    group: 'ops',
    label: 'Turnos de staff',
    description: 'Turnos y rendimiento por empleado.',
    apps: ['admin'],
  },
  {
    key: 'ops.reports',
    group: 'ops',
    label: 'Reportes',
    description: 'Reportes de ventas y export CSV.',
    apps: ['admin'],
  },
];

export function getModuleMeta(key: TenantModuleKey): TenantModuleMeta | undefined {
  return TENANT_MODULE_CATALOG.find((item) => item.key === key);
}

export const PLATFORM_ONLY_MODULE_KEYS = TENANT_MODULE_KEYS.filter((key) => {
  const meta = getModuleMeta(key);
  return meta && getModuleGovernanceTier(meta) === 'platform_only';
});

export type TenantFeatureProfile =
  | 'bakery_full'
  | 'cafe_counter'
  | 'minimal'
  | 'restaurant_delivery';

const ALL_OFF: TenantFeaturesMap = Object.fromEntries(
  TENANT_MODULE_KEYS.map((key) => [key, { enabled: false }]),
) as TenantFeaturesMap;

function withEnabled(keys: TenantModuleKey[]): TenantFeaturesMap {
  const map = { ...ALL_OFF };
  for (const key of TENANT_MODULE_KEYS) {
    map[key] = { enabled: keys.includes(key) };
  }
  return map;
}

export const DEFAULT_FEATURES_BY_PROFILE: Record<TenantFeatureProfile, TenantFeaturesMap> = {
  minimal: withEnabled(['public.menu', 'pos.counter']),
  cafe_counter: withEnabled([
    'pos.counter',
    'pos.takeaway',
    'finance.register',
    'public.menu',
    'public.reviews',
    'ops.reports',
  ]),
  bakery_full: withEnabled([
    'pos.dine_in',
    'pos.takeaway',
    'pos.counter',
    'kitchen.kds',
    'production.plant',
    'production.auto_requests',
    'catalog.modifiers',
    'catalog.bundles',
    'finance.register',
    'finance.mixed_payments',
    'public.menu',
    'public.menu_orders',
    'public.reviews',
    'ops.inventory',
    'ops.recipes',
    'ops.shifts',
    'ops.reports',
  ]),
  restaurant_delivery: withEnabled([
    'pos.takeaway',
    'pos.counter',
    'kitchen.kds',
    'finance.register',
    'finance.mixed_payments',
    'public.menu',
    'public.menu_orders',
    'fulfillment.scheduled',
    'fulfillment.delivery',
    'ops.reports',
  ]),
};

export function emptyFeaturesMap(): TenantFeaturesMap {
  return { ...ALL_OFF };
}

export function mergeFeatureOverrides(
  base: TenantFeaturesMap,
  overrides: Partial<Record<TenantModuleKey, boolean | TenantFeatureEntry>>,
): TenantFeaturesMap {
  const next = { ...base };
  for (const key of TENANT_MODULE_KEYS) {
    const value = overrides[key];
    if (value === undefined) continue;
    if (typeof value === 'boolean') {
      next[key] = { enabled: value };
    } else {
      next[key] = { ...next[key], ...value };
    }
  }
  return next;
}

export function resolveEffectiveFeatures(
  raw: Partial<Record<TenantModuleKey, TenantFeatureEntry | boolean>>,
  options?: {
    planCeiling?: Partial<Record<TenantModuleKey, boolean>>;
    platformEnabled?: Partial<Record<TenantModuleKey, boolean>>;
  },
): TenantFeaturesMap {
  const base = emptyFeaturesMap();
  for (const key of TENANT_MODULE_KEYS) {
    const value = raw[key];
    if (value === undefined) continue;
    base[key] = typeof value === 'boolean' ? { enabled: value } : { ...value };
  }

  for (const key of TENANT_MODULE_KEYS) {
    if (options?.planCeiling?.[key] === false) {
      base[key].enabled = false;
    }
    if (options?.platformEnabled?.[key] === false) {
      base[key].enabled = false;
    }
  }

  for (const meta of TENANT_MODULE_CATALOG) {
    if (!base[meta.key].enabled) continue;

    if (meta.dependsOn?.some((dep) => !base[dep].enabled)) {
      base[meta.key].enabled = false;
    }
    if (meta.dependsOnAny?.length) {
      const anyOk = meta.dependsOnAny.some((dep) => base[dep].enabled);
      if (!anyOk) base[meta.key].enabled = false;
    }
  }

  return base;
}

export function featuresMapToCompact(
  map: TenantFeaturesMap,
): Array<{ key: TenantModuleKey; enabled: boolean }> {
  return TENANT_MODULE_KEYS.map((key) => ({ key, enabled: map[key].enabled }));
}

export function compactToFeaturesMap(
  compact: Array<{ key: string; enabled: boolean }>,
): TenantFeaturesMap {
  const raw: Partial<Record<TenantModuleKey, boolean>> = {};
  for (const row of compact) {
    const parsed = tenantModuleKeySchema.safeParse(row.key);
    if (parsed.success) raw[parsed.data] = row.enabled;
  }
  return resolveEffectiveFeatures(raw);
}

export const updateTenantFeaturesSchema = z.object({
  modules: z.array(
    z.object({
      key: tenantModuleKeySchema,
      enabled: z.boolean(),
      config: z.record(z.unknown()).optional(),
    }),
  ),
});

export type UpdateTenantFeaturesDto = z.infer<typeof updateTenantFeaturesSchema>;

export const STAFF_CHECKOUT_MODULE: TenantModuleKey = 'finance.staff_checkout';
