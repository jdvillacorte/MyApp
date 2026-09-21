create table public.clientes (
  id uuid primary key default gen_random_uuid(),
  nombre text not null check (char_length(nombre) between 2 and 100),
  correo text not null check (correo like '%@%'),
  telefono text not null check (char_length(telefono) between 7 and 20),
  ciudad text not null check (char_length(ciudad) between 2 and 100),
  creado_en timestamptz not null default now()
);

create table public.pedidos (
  id uuid primary key default gen_random_uuid(),
  vehiculo_id text not null,
  marca text not null,
  modelo text not null,
  precio text not null,
  nombre text not null check (char_length(nombre) between 2 and 100),
  telefono text not null check (char_length(telefono) between 7 and 20),
  ciudad text not null check (char_length(ciudad) between 2 and 100),
  financiado boolean not null default false,
  estado text not null default 'en_camino' check (estado in ('en_camino', 'entregado', 'cancelado')),
  creado_en timestamptz not null default now()
);

alter table public.clientes enable row level security;
alter table public.pedidos enable row level security;

revoke all on table public.clientes from anon, authenticated;
revoke all on table public.pedidos from anon, authenticated;
grant insert on table public.clientes to anon, authenticated;
grant insert on table public.pedidos to anon, authenticated;

create policy "Registrar clientes desde la aplicacion"
on public.clientes
for insert
to anon, authenticated
with check (
  char_length(nombre) between 2 and 100
  and correo like '%@%'
  and char_length(telefono) between 7 and 20
  and char_length(ciudad) between 2 and 100
);

create policy "Registrar pedidos desde la aplicacion"
on public.pedidos
for insert
to anon, authenticated
with check (
  char_length(nombre) between 2 and 100
  and char_length(telefono) between 7 and 20
  and char_length(ciudad) between 2 and 100
  and estado = 'en_camino'
);
