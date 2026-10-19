begin;

alter table public.clientes
  add column if not exists vehiculo_favorito text not null default 'Por definir'
  check (char_length(vehiculo_favorito) between 2 and 100);

update public.clientes
set vehiculo_favorito = case nombre
  when 'Laura Martinez' then 'Ford Mustang GT Need for Speed'
  when 'Carlos Rodriguez' then 'Chevrolet Corvette C8'
  when 'Sofia Hernandez' then 'Ferrari 488 GTB'
  else vehiculo_favorito end
where vehiculo_favorito = 'Por definir';

revoke all on public.clientes from anon;
revoke select (id, nombre, ciudad, tipo_compra, creado_en) on public.clientes from anon;
grant select, insert on public.clientes to authenticated;
drop policy if exists "Consultar clientes AutoSport" on public.clientes;
drop policy if exists "Registrar clientes desde la aplicacion" on public.clientes;

create policy "Consultar clientes propios y demostraciones"
on public.clientes for select to authenticated
using ((select auth.uid()) = usuario_id or usuario_id is null);

create policy "Registrar clientes con sesion"
on public.clientes for insert to authenticated
with check ((select auth.uid()) = usuario_id);

revoke all on public.pedidos from anon;
grant select, insert on public.pedidos to authenticated;
drop policy if exists "Registrar pedidos desde la aplicacion" on public.pedidos;
create policy "Registrar pedidos con sesion"
on public.pedidos for insert to authenticated
with check ((select auth.uid()) = usuario_id and estado = 'en_camino');
create policy "Consultar pedidos propios"
on public.pedidos for select to authenticated
using ((select auth.uid()) = usuario_id);

create index if not exists clientes_usuario_id_idx on public.clientes (usuario_id);
create index if not exists pedidos_usuario_id_idx on public.pedidos (usuario_id);

notify pgrst, 'reload schema';
commit;
