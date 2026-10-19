export const vehiculos = [
  {
    id: '1',
    marca: 'Mustang',
    modelo: 'Ford Mustang GT Need for Speed',
    version: 'Version real: 2013 Mustang GT Hero Car wide-body',
    precio: '$285.000.000 COP',
    descripcion:
      'Muscle car inspirado en el Mustang de Need for Speed, con carroceria wide-body, estilo agresivo y presencia de pelicula.',
    imagen:
      'https://cdn.shopify.com/s/files/1/0562/3001/9234/files/image1_f46b3451-0d3b-4c40-80b6-3e3d1b8c5825.jpg?v=1648473856',
    imagenLocal: require('../../assets/mustang.jpg'),
  },
  {
    id: '2',
    marca: 'Corvette',
    modelo: 'Chevrolet Corvette C8',
    version: 'Version Stingray V8',
    precio: '$640.000.000 COP',
    descripcion:
      'Deportivo americano de motor central, aceleracion contundente y diseno bajo pensado para alto rendimiento.',
    imagen:
      'https://commons.wikimedia.org/wiki/Special:FilePath/2022%20Chevrolet%20Corvette%20C8%20Stingray%20V8%20Auto.jpg',
    imagenLocal: require('../../assets/corvette.jpg'),
  },
  {
    id: '3',
    marca: 'Ferrari',
    modelo: 'Ferrari 488 GTB',
    version: 'Version coupe berlinetta',
    precio: '$1.450.000.000 COP',
    descripcion:
      'Superdeportivo italiano con motor turbo, acabados premium y una experiencia enfocada en velocidad y precision.',
    imagen:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Ferrari%20488%20GTB.jpg',
    imagenLocal: require('../../assets/ferrari.jpg'),
  },
  {
    id: '4',
    marca: 'Toyota',
    modelo: 'Toyota GR Supra',
    version: 'Version 3.0 turbo',
    precio: '$360.000.000 COP',
    descripcion:
      'Coupe deportivo japones con motor turbo, cabina compacta y equilibrio ideal para manejo urbano y carretera.',
    imagen: 'https://images.holley.com/04-2023-toyota-supra-manual.jpg',
    imagenLocal: require('../../assets/toyota.jpg'),
  },
];

export type Vehiculo = (typeof vehiculos)[number];
