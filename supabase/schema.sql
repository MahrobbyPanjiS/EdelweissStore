-- Supabase schema for EdelweissStore
-- Run these statements in the Supabase SQL editor

-- 1) ENUM type for invoice status
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'invoice_status') THEN
    CREATE TYPE invoice_status AS ENUM ('pending', 'waiting_confirmation', 'success', 'canceled');
  END IF;
END$$;

-- 2) Table: products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price integer not null default 0,
  description text,
  image_url text,
  category text,
  is_premium boolean not null default false,
  stats jsonb,
  metadata jsonb,
  created_at timestamptz default now()
);

-- 2b) Add is_premium column if it doesn't exist (migration safe)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'is_premium'
  ) THEN
    ALTER TABLE public.products ADD COLUMN is_premium boolean not null default false;
  END IF;
END$$;

-- 3) Table: invoices
create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  product_id uuid references public.products(id) on delete set null,
  price integer not null default 0,
  quantity integer not null default 1,
  status invoice_status default 'pending',
  metadata jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4) Optional: slides (homepage slider)
create table if not exists public.slides (
  id bigserial primary key,
  url text not null,
  alt text,
  created_at timestamptz default now()
);

-- 5) Optional: news (homepage news)
create table if not exists public.news (
  id bigserial primary key,
  title text not null,
  tag text,
  content text,
  created_at timestamptz default now()
);

-- 6) Indexes for performance
create index if not exists idx_products_category on public.products(category);
create index if not exists idx_invoices_status on public.invoices(status);
