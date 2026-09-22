alter table public.clientes
add column tipo_compra text not null default 'Otro'
check (tipo_compra in ('Contado', 'Credito', 'Leasing', 'Permuta', 'Otro'));

grant select (id, nombre, ciudad, tipo_compra, creado_en)
on public.clientes to anon, authenticated;

create policy "Consultar clientes AutoSport"
on public.clientes
for select
to anon, authenticated
using (true);

insert into public.clientes (nombre, correo, telefono, ciudad, tipo_compra)
values
  ('Laura Martinez', 'laura.autosport@example.com', '3001112233', 'Bogota', 'Contado'),
  ('Carlos Rodriguez', 'carlos.autosport@example.com', '3014445566', 'Medellin', 'Credito'),
  ('Sofia Hernandez', 'sofia.autosport@example.com', '3027778899', 'Cali', 'Leasing');
