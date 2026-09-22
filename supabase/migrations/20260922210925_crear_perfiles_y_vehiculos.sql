create schema if not exists private;

create table public.perfiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nombre text check (nombre is null or char_length(nombre) between 2 and 100),
  telefono text check (telefono is null or char_length(telefono) between 7 and 20),
  ciudad text check (ciudad is null or char_length(ciudad) between 2 and 100),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

alter table public.perfiles enable row level security;
revoke all on table public.perfiles from anon, authenticated;
grant select, update on table public.perfiles to authenticated;

create policy "Cada usuario puede consultar su perfil"
on public.perfiles
for select
to authenticated
using ((select auth.uid()) = id);

create policy "Cada usuario puede actualizar su perfil"
on public.perfiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create or replace function private.crear_perfil_nuevo()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.perfiles (id, nombre)
  values (new.id, new.raw_user_meta_data ->> 'nombre');
  return new;
end;
$$;

revoke all on function private.crear_perfil_nuevo() from public, anon, authenticated;

create trigger crear_perfil_despues_de_registro
after insert on auth.users
for each row execute procedure private.crear_perfil_nuevo();

create table public.vehiculos (
  id text primary key,
  marca text not null,
  modelo text not null,
  version text not null,
  precio_cop bigint not null check (precio_cop > 0),
  descripcion text not null,
  imagen_url text,
  activo boolean not null default true,
  creado_en timestamptz not null default now()
);

alter table public.vehiculos enable row level security;
revoke all on table public.vehiculos from anon, authenticated;
grant select on table public.vehiculos to anon, authenticated;

create policy "Catalogo publico de vehiculos activos"
on public.vehiculos
for select
to anon, authenticated
using (activo = true);

insert into public.vehiculos (
  id, marca, modelo, version, precio_cop, descripcion, imagen_url
)
values
  (
    '1',
    'Mustang',
    'Ford Mustang GT Need for Speed',
    '2013 Mustang GT Hero Car wide-body',
    285000000,
    'Muscle car inspirado en el Mustang de Need for Speed, con carroceria wide-body.',
    'https://cdn.shopify.com/s/files/1/0562/3001/9234/files/image1_f46b3451-0d3b-4c40-80b6-3e3d1b8c5825.jpg?v=1648473856'
  ),
  (
    '2',
    'Corvette',
    'Chevrolet Corvette C8',
    'Stingray V8',
    640000000,
    'Deportivo americano de motor central y aceleracion contundente.',
    null
  ),
  (
    '3',
    'Ferrari',
    'Ferrari 488 GTB',
    'Coupe berlinetta',
    1450000000,
    'Superdeportivo italiano con motor turbo y acabados premium.',
    null
  ),
  (
    '4',
    'Toyota',
    'Toyota GR Supra',
    '3.0 turbo',
    360000000,
    'Coupe deportivo japones con motor turbo y cabina compacta.',
    'https://images.holley.com/04-2023-toyota-supra-manual.jpg'
  );

alter table public.clientes
add column usuario_id uuid references auth.users (id) on delete set null;

alter table public.pedidos
add column usuario_id uuid references auth.users (id) on delete set null;
