export type Cliente = {
  id: string;
  nombre: string;
  correo: string;
  telefono: string;
  ciudad: string;
  vehiculo_favorito: string;
  tipo_compra: string;
  creado_en: string;
};

export const camposCliente = 'id,nombre,correo,telefono,ciudad,vehiculo_favorito,tipo_compra,creado_en';
