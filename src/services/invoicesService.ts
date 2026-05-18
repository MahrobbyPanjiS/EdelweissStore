import supabase from './supabaseClient';

export type InvoiceStatus = 'pending' | 'waiting_confirmation' | 'success' | 'canceled';

export interface InvoiceRow {
  id: string;
  user_id?: string | null;
  product_id?: string | null;
  price: number;
  quantity: number;
  status: InvoiceStatus;
  metadata?: any;
  created_at: string;
  updated_at?: string;
}

export async function createInvoice(payload: { user_id?: string | null; product_id?: string | null; price?: number; quantity?: number; metadata?: any; }): Promise<InvoiceRow> {
  const insert = {
    user_id: payload.user_id ?? null,
    product_id: payload.product_id ?? null,
    price: payload.price ?? 0,
    quantity: payload.quantity ?? 1,
    metadata: payload.metadata ?? null,
    status: 'pending'
  } as any;

  const { data, error } = await supabase.from('invoices').insert(insert).select().single();
  if (error) throw error;
  return data as InvoiceRow;
}

export async function updateInvoiceStatus(id: string, status: InvoiceStatus): Promise<InvoiceRow> {
  const { data, error } = await supabase.from('invoices').update({ status, updated_at: new Date().toISOString() }).eq('id', id).select().single();
  if (error) throw error;
  return data as InvoiceRow;
}

export async function getInvoice(id: string): Promise<InvoiceRow | null> {
  const { data, error } = await supabase.from('invoices').select().eq('id', id).single();
  if (error) throw error;
  return data as InvoiceRow;
}

export default {
  createInvoice,
  updateInvoiceStatus,
  getInvoice
};
