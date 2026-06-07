/** Etiquetas UI compartidas para estados de pedido (API OrderStatus). */
export const ORDER_STATUS_LABELS: Record<string, string> = {
  open: 'Abierto',
  in_progress: 'En cocina',
  ready: 'Listo',
  ready_for_payment: 'Listo para cobro',
  paid: 'Pagado',
  cancelled: 'Cancelado',
  delivered: 'Entregado en mostrador',
  out_for_delivery: 'En camino',
};

export function orderStatusLabel(
  status: string,
  channel?: string | null,
): string {
  if (status === 'delivered' && channel === 'takeaway') {
    return 'Entregado en mostrador';
  }
  if (status === 'delivered' && channel === 'delivery') {
    return 'Entregado';
  }
  return ORDER_STATUS_LABELS[status] ?? status.replace(/_/g, ' ');
}

export type OrderChannel = 'dine_in' | 'takeaway' | 'delivery';

export const ORDER_CHANNEL_LABELS: Record<OrderChannel, string> = {
  dine_in: 'Salón',
  takeaway: 'Para llevar',
  delivery: 'Domicilio',
};

export type ApiOrderStatus =
  | 'open'
  | 'in_progress'
  | 'ready'
  | 'ready_for_payment'
  | 'paid'
  | 'cancelled'
  | 'delivered'
  | 'out_for_delivery';

export type FulfillmentTiming = 'asap' | 'scheduled';
