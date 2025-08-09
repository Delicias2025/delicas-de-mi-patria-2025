import { Product, Category, ShippingOption } from "@/types";

export const categories: Category[] = [
  {
    id: 'bebidas',
    name: 'Bebidas Refrescantes',
    description: 'Refrescantes bebidas típicas para calmar la sed',
    image: '/images/categories/bebidas.jpg'
  },
  {
    id: 'antojitos',
    name: 'Antojitos Deliciosos',
    description: 'Los mejores antojitos tradicionales',
    image: '/images/DeliciousSnacks.jpg'
  },
  {
    id: 'cafe',
    name: 'Café',
    description: 'Delicioso café de alta calidad',
    image: '/images/Coffee.jpg'
  },
  {
    id: 'golosinas',
    name: 'Golosinas',
    description: 'Dulces y golosinas tradicionales',
    image: '/images/TraditionalSweets.jpg'
  },
  {
    id: 'comida',
    name: 'Comida y Consomés',
    description: 'Platillos típicos y consomés caseros',
    image: '/images/Food.jpg'
  },
  {
    id: 'medicina',
    name: 'Medicina',
    description: 'Remedios tradicionales y naturales',
    image: '/images/TraditionalRemedies.jpg'
  }
];

export const products: Product[] = [
  // Bebidas Refrescantes
  {
    id: "beb1", 
    name: "Colashampan 20oz", 
    price: 1.16, 
    category: 'bebidas',
    image: "https://via.placeholder.com/150/FF5733/FFFFFF?text=Colashampan",
    featured: true
  },
  {
    id: "beb2", 
    name: "Shakalaka Fresa", 
    price: 1.46, 
    category: 'bebidas',
    image: "https://via.placeholder.com/150/FF33A1/FFFFFF?text=Shakalaka+Fresa"
  },
  {
    id: "beb3", 
    name: "Shakalaka Chocolate", 
    price: 1.46, 
    category: 'bebidas',
    image: "https://via.placeholder.com/150/8B4513/FFFFFF?text=Shakalaka+Chocolate"
  },
  {
    id: "beb4", 
    name: "Shakalaka Vainilla", 
    price: 1.46, 
    category: 'bebidas',
    image: "https://via.placeholder.com/150/F5DEB3/FFFFFF?text=Shakalaka+Vainilla"
  },
  {
    id: "beb5", 
    name: "Jugo Naturas Pera", 
    price: 1.50, 
    category: 'bebidas',
    image: "https://via.placeholder.com/150/4682B4/FFFFFF?text=Jugo+Naturas+Pera"
  },
  {
    id: "beb6", 
    name: "Chocolate Abuelita Barra 19oz", 
    price: 7.70, 
    category: 'bebidas',
    image: "https://via.placeholder.com/150/8B0513/FFFFFF?text=Chocolate+Abuelita"
  },
  {
    id: "beb7", 
    name: "Jugo Naturas Manzana", 
    price: 1.50, 
    category: 'bebidas',
    image: "https://via.placeholder.com/150/A020F0/FFFFFF?text=Jugo+Naturas+Manzana"
  },
  {
    id: "beb8", 
    name: "Jugo Naturas Piña", 
    price: 1.50, 
    category: 'bebidas',
    image: "https://via.placeholder.com/150/D2B48C/FFFFFF?text=Jugo+Naturas+Piña"
  },
  {
    id: "beb9", 
    name: "Jugo Naturas Melocoton", 
    price: 1.50, 
    category: 'bebidas',
    image: "https://via.placeholder.com/150/FF69B4/FFFFFF?text=Jugo+Naturas+Melocoton"
  },
  {
    id: "beb10", 
    name: "Maizena Vainilla 14oz", 
    price: 3.33, 
    category: 'bebidas',
    image: "https://via.placeholder.com/150/F0E68C/FFFFFF?text=Maizena+Vainilla"
  },
  {
    id: "beb11", 
    name: "Maicena Atole Fresa", 
    price: 1.28, 
    category: 'bebidas',
    image: "https://via.placeholder.com/150/F8F8FF/FFFFFF?text=Maicena+Atole+Fresa"
  },
  {
    id: "beb12", 
    name: "Maicena Atol Vainilla", 
    price: 1.28, 
    category: 'bebidas',
    image: "https://via.placeholder.com/150/F8F8FF/FFFFFF?text=Maicena+Atole+Vainilla"
  },
  {
    id: "beb13", 
    name: "Cocacola Vidrio 1.25l", 
    price: 4.00, 
    category: 'bebidas',
    image: "https://via.placeholder.com/150/FFD700/FFFFFF?text=Cocacola+Vidrio"
  },
  {
    id: "beb14", 
    name: "Fresisula", 
    price: 1.87, 
    category: 'bebidas',
    image: "https://via.placeholder.com/150/8B0000/FFFFFF?text=Fresisula"
  },
  {
    id: "beb15", 
    name: "Chocopanda Bolsa", 
    price: 1.93, 
    category: 'bebidas',
    image: "https://via.placeholder.com/150/CD853F/FFFFFF?text=Chocopanda+Bolsa"
  },
  
  // Antojitos
  {
    id: 'ant1',
    name: 'Alboroto',
    description: 'Delicioso snack crujiente para disfrutar',
    price: 4.20,
    category: 'antojitos',
    image: 'https://via.placeholder.com/150/MDURKL/FFFFFF?text=Alboroto',
    featured: true
  },
  {
    id: 'ant2',
    name: 'Espumillas',
    description: 'Snack tradicional con textura ligera',
    price: 4.08,
    category: 'antojitos',
    image: 'https://via.placeholder.com/150/GAFD21/FFFFFF?text=Espimillas'
  },
  {
    id: 'ant3',
    name: 'Leche Condensada',
    description: 'Deliciosa leche condensada para postres y aperitivos',
    price: 3.49,
    category: 'antojitos',
    image: 'https://via.placeholder.com/150/65MSUA/FFFFFF?text=Leche+Condensada'
  },
  {
    id: 'ant4',
    name: 'Chocolate Para Chocos',
    description: 'Chocolate especial para preparar chocos tradicionales',
    price: 2.80,
    category: 'antojitos',
    image: 'https://via.placeholder.com/150/663821/FFFFFF?text=Chocolate+Para+Chocos'
  },
  {
    id: 'ant5',
    name: 'Tostadas Charras',
    description: 'Crujientes tostadas estilo charro para botanas',
    price: 10.50,
    category: 'antojitos',
    image: 'https://via.placeholder.com/150/M98RKL/FFFFFF?text=Tostadas+Charras'
  },
  {
    id: 'ant6',
    name: 'Jarabe Para Minutas Coco',
    description: 'Delicioso jarabe sabor coco para minutas',
    price: 10.50,
    category: 'antojitos',
    image: 'https://via.placeholder.com/150/GA0021/FFFFFF?text=Jarabe+Para+Minutas'
  },
  {
    id: 'ant7',
    name: 'Jarabe Para Minutas Uva',
    description: 'Refrescante jarabe sabor uva para minutas',
    price: 10.50,
    category: 'antojitos',
    image: 'https://via.placeholder.com/150/653SUA/FFFFFF?text=Jarabe+Para+Minutas'
  },
  {
    id: 'ant8',
    name: 'Jarabe Para Minutas Piña',
    description: 'Exquisito jarabe sabor piña para minutas',
    price: 10.50,
    category: 'antojitos',
    image: 'https://via.placeholder.com/150/66KAF1/FFFFFF?text=Jarabe+Para+Minutas'
  },
  
  // Café
  {
    id: "caf1", 
    name: "Café Coscafe", 
    price: 3.50, 
    category: 'cafe',
    description: 'Café de primera calidad, aromático y con gran sabor',
    image: "https://via.placeholder.com/150/654321/FFFFFF?text=Cafe+Coscafe",
    featured: true
  },
  {
    id: "caf2", 
    name: "Café Listo", 
    price: 3.00, 
    category: 'cafe',
    description: 'Café instantáneo para preparación rápida y conveniente',
    image: "https://via.placeholder.com/150/654321/FFFFFF?text=Cafe+Listo"
  },
  {
    id: "caf3", 
    name: "Café Musun", 
    price: 4.00, 
    category: 'cafe',
    description: 'Café premium de cultivo tradicional con sabor intenso',
    image: "https://via.placeholder.com/150/654321/FFFFFF?text=Cafe+Musun"
  },
  {
    id: "caf4", 
    name: "Café Rico", 
    price: 3.80, 
    category: 'cafe',
    description: 'Café tostado medio con notas achocolatadas',
    image: "https://via.placeholder.com/150/654321/FFFFFF?text=Cafe+Rico"
  },
  
  // Golosinas
  {
    id: "gol1",
    name: "Jalapeños Diana", 
    price: 2.51, 
    category: 'golosinas',
    description: 'Sabrosos snacks con sabor a jalapeño',
    image: "https://via.placeholder.com/150/FFD700/FFFFFF?text=Jalapeños+Diana"
  },
  {
    id: "gol2",
    name: "Yucatekas", 
    price: 2.51, 
    category: 'golosinas',
    description: 'Deliciosas botanas estilo yucateco',
    image: "https://via.placeholder.com/150/FF69B4/FFFFFF?text=Yucatecas"
  },
  {
    id: "gol3",
    name: "Nachos", 
    price: 2.51, 
    category: 'golosinas',
    description: 'Crujientes nachos para disfrutar',
    image: "https://via.placeholder.com/150/FF00FF/FFFFFF?text=Nachos"
  },
  {
    id: "gol4",
    name: "Bacorns", 
    price: 2.51, 
    category: 'golosinas',
    description: 'Crujientes botanas de maíz con sabor a tocino',
    image: "https://via.placeholder.com/150/FF33A1/FFFFFF?text=Bacorns"
  },
  {
    id: "gol5",
    name: "Candy Corn", 
    price: 2.51, 
    category: 'golosinas',
    description: 'Dulces de maíz tradicionales',
    image: "https://via.placeholder.com/150/33FF57/FFFFFF?text=Candy+Corn",
    featured: true
  },
  {
    id: "gol6",
    name: "Maiz Chino", 
    price: 2.51, 
    category: 'golosinas',
    description: 'Maíz frito estilo oriental',
    image: "https://via.placeholder.com/150/8B4513/FFFFFF?text=Maiz+Chino"
  },
  {
    id: "gol7",
    name: "Quesitos", 
    price: 2.51, 
    category: 'golosinas',
    description: 'Botanas con sabor a queso',
    image: "https://via.placeholder.com/150/FF0000/FFFFFF?text=Quesitos"
  },
  {
    id: "gol8",
    name: "Yuca Chips", 
    price: 2.51, 
    category: 'golosinas',
    description: 'Crujientes chips de yuca',
    image: "https://via.placeholder.com/150/FF0000/FFFFFF?text=Yuca+chips"
  },
  {
    id: "gol9",
    name: "Pachanga Mix", 
    price: 2.51, 
    category: 'golosinas',
    description: 'Mezcla de botanas para fiestas',
    image: "https://via.placeholder.com/150/008080/FFFFFF?text=Pachanga+Mix"
  },
  {
    id: "gol10",
    name: "Corn Chips", 
    price: 2.51, 
    category: 'golosinas',
    description: 'Crujientes chips de maíz',
    image: "https://via.placeholder.com/150/FFA500/FFFFFF?text=Corn+Chips"
  },
  {
    id: "gol11",
    name: "Churritos", 
    price: 2.51, 
    category: 'golosinas',
    description: 'Deliciosos churritos crujientes',
    image: "https://via.placeholder.com/150/FFD700/FFFFFF?text=Churritos"
  },
  {
    id: "gol12",
    name: "Anillitos", 
    price: 3.21, 
    category: 'golosinas',
    description: 'Anillos de harina crujientes',
    image: "https://via.placeholder.com/150/FFD700/FFFFFF?text=Anillitos"
  },
  {
    id: "gol13",
    name: "Totis", 
    price: 0.01, 
    category: 'golosinas',
    description: 'Clásicas botanas crujientes',
    image: "https://via.placeholder.com/150/FF4500/FFFFFF?text=Totis"
  },
  {
    id: "gol14",
    name: "Centavitos", 
    price: 3.00, 
    category: 'golosinas',
    description: 'Deliciosas botanas circulares',
    image: "https://via.placeholder.com/150/B22222/FFFFFF?text=Centavitos"
  },
  {
    id: "gol15",
    name: "Zambos Ceviche", 
    price: 0.01, 
    category: 'golosinas',
    description: 'Chips de plátano con sabor a ceviche',
    image: "https://via.placeholder.com/150/FFD700/FFFFFF?text=Zambos+Ceviche"
  },
  {
    id: "gol16",
    name: "Zambos Chile Limon", 
    price: 0.01, 
    category: 'golosinas',
    description: 'Chips de plátano con sabor a chile limón',
    image: "https://via.placeholder.com/150/008000/FFFFFF?text=Zambos+Chile+Limon"
  },
  {
    id: "gol17",
    name: "Zambos Maduritos", 
    price: 0.01, 
    category: 'golosinas',
    description: 'Chips de plátano maduro',
    image: "https://via.placeholder.com/150/B22222/FFFFFF?text=Zambos+Maduritos"
  },
  {
    id: "gol18",
    name: "Zambos Originales", 
    price: 0.01, 
    category: 'golosinas',
    description: 'Chips de plátano originales',
    image: "https://via.placeholder.com/150/8B4513/FFFFFF?text=Zambos+Originales"
  },
  {
    id: "gol19",
    name: "Toztecas", 
    price: 2.51, 
    category: 'golosinas',
    description: 'Tostadas de maíz estilo tradicional',
    image: "https://via.placeholder.com/150/A0522D/FFFFFF?text=Toztecas"
  },
  {
    id: "gol20",
    name: "Palitos", 
    price: 2.51, 
    category: 'golosinas',
    description: 'Palitos crujientes de harina',
    image: "https://via.placeholder.com/150/D2B48C/FFFFFF?text=Palitos"
  },
  {
    id: "gol21",
    name: "Mani Limon", 
    price: 1.60, 
    category: 'golosinas',
    description: 'Maní con sabor a limón',
    image: "https://via.placeholder.com/150/FFD700/FFFFFF?text=Mani+Limon"
  },
  {
    id: "gol22",
    name: "Mani Sal", 
    price: 1.60, 
    category: 'golosinas',
    description: 'Maní con sal',
    image: "https://via.placeholder.com/150/ADD8E6/FFFFFF?text=Mani+Sal"
  },
  {
    id: "gol23",
    name: "Takis Fuego", 
    price: 2.60, 
    category: 'golosinas',
    description: 'Totopos enrollados sabor chile picante',
    image: "https://via.placeholder.com/150/FF4500/FFFFFF?text=Takis+Fuego"
  },
  {
    id: "gol24",
    name: "Tortrix", 
    price: 2.92, 
    category: 'golosinas',
    description: 'Tostadas crujientes de maíz',
    image: "https://via.placeholder.com/150/FFD700/FFFFFF?text=Tortrix"
  },
  {
    id: "gol25",
    name: "Boligomas Tira", 
    price: 3.98, 
    category: 'golosinas',
    description: 'Tiras de goma dulce de frutas',
    image: "https://via.placeholder.com/150/FF6347/FFFFFF?text=Boligomas+Tira"
  },
  {
    id: "gol26",
    name: "Marsmallows", 
    price: 2.24, 
    category: 'golosinas',
    description: 'Esponjosos dulces de malvavisco',
    image: "https://via.placeholder.com/150/D2B48C/FFFFFF?text=Marsmellows"
  },
  {
    id: "gol27",
    name: "Huevitos", 
    price: 1.96, 
    category: 'golosinas',
    description: 'Dulces en forma de huevos pequeños',
    image: "https://via.placeholder.com/150/FFD700/FFFFFF?text=Huevitos"
  },
  {
    id: "gol28",
    name: "Botonetas Tira", 
    price: 2.65, 
    category: 'golosinas',
    description: 'Tiras de chocolates de colores',
    image: "https://via.placeholder.com/150/D2B48C/FFFFFF?text=Botonetas+Tira"
  },
  {
    id: "gol29",
    name: "Bubbaloo Menta", 
    price: 8.39, 
    category: 'golosinas',
    description: 'Chicles rellenos sabor menta',
    image: "https://via.placeholder.com/150/8B4513/FFFFFF?text=Bubbaloo+Menta"
  },
  {
    id: "gol30",
    name: "Bubbaloo Yerba Buena", 
    price: 8.39, 
    category: 'golosinas',
    description: 'Chicles rellenos sabor yerba buena',
    image: "https://via.placeholder.com/150/33FF57/FFFFFF?text=Bubbaloo+Yerba+Buena"
  },
  {
    id: "gol31",
    name: "Bubbaloo Mora Acida", 
    price: 8.39, 
    category: 'golosinas',
    description: 'Chicles rellenos sabor mora ácida',
    image: "https://via.placeholder.com/150/MCFF57/FFFFFF?text=Bubbaloo+Mora+Acida"
  },
  {
    id: "gol32",
    name: "Bubbaloo Mora Azul", 
    price: 8.39, 
    category: 'golosinas',
    description: 'Chicles rellenos sabor mora azul',
    image: "https://via.placeholder.com/150/HR33A1/FFFFFF?text=Bubbaloo+Mora+Azul"
  },
  {
    id: "gol33",
    name: "Chocogol Bote", 
    price: 8.17, 
    category: 'golosinas',
    description: 'Bote de chocolates variados',
    image: "https://via.placeholder.com/150/JSGF76/FFFFFF?text=Chocogol+Bote"
  },
  
  // Comida y Consomés
  {
    id: "com1",
    name: "Frijol La Chula Rojos 35oz",
    price: 2.80, 
    category: 'comida',
    description: 'Frijoles rojos enlatados de alta calidad',
    image: "https://via.placeholder.com/150/000000/FFFFFF?text=Frijol+La+Chula+Rojo",
    featured: true
  },
  {
    id: "com3",
    name: "Sardina La Sirena",
    price: 2.62, 
    category: 'comida',
    description: 'Sardinas enlatadas en aceite vegetal',
    image: "https://via.placeholder.com/150/4682B4/FFFFFF?text=Sardina+Sirena"
  },
  {
    id: "com7",
    name: "Maseca",
    price: 5.88, 
    category: 'comida',
    description: 'Harina de maíz para tortillas y tamales',
    image: "https://via.placeholder.com/150/DAA520/FFFFFF?text=Maseca"
  },
  {
    id: "com8",
    name: "Frijoles Naturas Rojo 800g",
    price: 7.00, 
    category: 'comida',
    description: 'Frijoles rojos premium envasados',
    image: "https://via.placeholder.com/150/8B0000/FFFFFF?text=Frijoles+Naturas+Rojo"
  },
  {
    id: "com9",
    name: "Frijoles La Chula Negros 35oz",
    price: 4.08, 
    category: 'comida',
    description: 'Frijoles negros enlatados tradicionales',
    image: "https://via.placeholder.com/150/000000/FFFFFF?text=Frijoles+La+Chula+Negros"
  },
  {
    id: "con1",
    name: "Mayonesa B&B",
    price: 6.07, 
    category: 'comida',
    description: 'Mayonesa cremosa para acompañar tus platillos',
    image: "https://via.placeholder.com/150/FF0000/FFFFFF?text=Mayonesa"
  },
  {
    id: "con2",
    name: "Salsa Naturas Queso",
    price: 2.30, 
    category: 'comida',
    description: 'Salsa con queso para nachos y botanas',
    image: "https://via.placeholder.com/150/FFD700/FFFFFF?text=Salsa+Queso"
  },
  {
    id: "con3",
    name: "Salsa Naturas Ranchera",
    price: 2.30, 
    category: 'comida',
    description: 'Tradicional salsa ranchera para huevos y más',
    image: "https://via.placeholder.com/150/8B4513/FFFFFF?text=Salsa+Ranchera"
  },
  {
    id: "con4",
    name: "Salsa Naturas Sofito Criollo",
    price: 2.30, 
    category: 'comida',
    description: 'Mezcla de ingredientes para dar sabor a tus platillos',
    image: "https://via.placeholder.com/150/A0522D/FFFFFF?text=Salsa+Sofrito+Criollo"
  },
  {
    id: "con5",
    name: "Salsa Valentina Roja 12oz",
    price: 2.10, 
    category: 'comida',
    description: 'Salsa picante tradicional para botanas',
    image: "https://via.placeholder.com/150/FFD700/FFFFFF?text=Salsa+Valentina"
  },
  {
    id: "con6",
    name: "Jalapeños Enteros La Costeña 12oz",
    price: 3.00, 
    category: 'comida',
    description: 'Chiles jalapeños enteros en escabeche',
    image: "https://via.placeholder.com/150/A0522D/FFFFFF?text=Jalapeños+Enteros"
  },
  {
    id: "con7",
    name: "Sopa Maggi costilla",
    price: 1.50, 
    category: 'comida',
    description: 'Sopa instantánea sabor costilla',
    image: "https://via.placeholder.com/150/FFD700/FFFFFF?text=Sopa+Maggi+Gallina"
  },
  {
    id: "con8",
    name: "Sopa Maggi Pollo",
    price: 1.50, 
    category: 'comida',
    description: 'Sopa instantánea sabor pollo',
    image: "https://via.placeholder.com/150/FFD700/FFFFFF?text=Sopa+Maggi+Pollo"
  },
  {
    id: "con9",
    name: "Consomé Camarón Malher 227g",
    price: 6.42, 
    category: 'comida',
    description: 'Consomé de camarón para sazonar tus platillos',
    image: "https://via.placeholder.com/150/FF4500/FFFFFF?text=Consome+Camaron"
  },
  {
    id: "con10",
    name: "Consomé Carne Malher 227g",
    price: 6.42, 
    category: 'comida',
    description: 'Consomé de carne para dar sabor a tus comidas',
    image: "https://via.placeholder.com/150/A0522D/FFFFFF?text=Consome+Carne"
  },
  {
    id: "con11",
    name: "Consomé Pollo Malher 227g",
    price: 6.42, 
    category: 'comida',
    description: 'Consomé de pollo para realzar el sabor de tus platillos',
    image: "https://via.placeholder.com/150/FFD700/FFFFFF?text=Consome+Pollo"
  },
  {
    id: "con12",
    name: "Sazonador 908g",
    price: 9.22, 
    category: 'comida',
    description: 'Sazonador completo para todo tipo de platillos',
    image: "https://via.placeholder.com/150/D2B48C/FFFFFF?text=Sazonador"
  },
  {
    id: "con13",
    name: "Sopa Maggi Res",
    price: 1.50, 
    category: 'comida',
    description: 'Sopa instantánea sabor res',
    image: "https://via.placeholder.com/150/ADD8E6/FFFFFF?text=Sopa+Maggi+Res"
  },
  {
    id: "con14",
    name: "Sopa Maggi Gallina",
    price: 1.50, 
    category: 'comida',
    description: 'Sopa instantánea sabor gallina',
    image: "https://via.placeholder.com/150/FFD700/FFFFFF?text=Sopa+Gallina+Maggi+Gallina"
  },
  {
    id: "con15",
    name: "Sopa maggi Mariscos",
    price: 1.50, 
    category: 'comida',
    description: 'Sopa instantánea sabor mariscos',
    image: "https://via.placeholder.com/150/FF0000/FFFFFF?text=Sopa+Maggi+Mariscos"
  },
  
  // Medicina
  {
    id: 'med1',
    name: 'Tabcin Gripe y Tos',
    description: 'Medicamento para aliviar síntomas de gripe y tos',
    price: 5,
    category: 'medicina',
    image: 'https://via.placeholder.com/150/ADD8E6/FFFFFF?text=Tabcin'
  },
  {
    id: 'med2',
    name: 'Virogrip Día',
    description: 'Alivio de síntomas de gripe durante el día',
    price: 4.5,
    category: 'medicina',
    image: 'https://via.placeholder.com/150/FFD700/FFFFFF?text=Virogrip+Dia'
  },
  {
    id: 'med3',
    name: 'Virogrip Noche',
    description: 'Alivio de síntomas de gripe para uso nocturno',
    price: 4.5,
    category: 'medicina',
    image: 'https://via.placeholder.com/150/4682B4/FFFFFF?text=Virogrip+Noche'
  },
  {
    id: 'med4',
    name: 'Novalgina',
    description: 'Analgésico para dolores leves y moderados',
    price: 5,
    category: 'medicina',
    image: 'https://via.placeholder.com/150/FF6347/FFFFFF?text=Novalgina'
  },
  {
    id: 'med5',
    name: 'Mariguanol',
    description: 'Ungüento medicinal para dolores musculares',
    price: 12,
    category: 'medicina',
    image: 'https://via.placeholder.com/150/008000/FFFFFF?text=Mariguanol'
  },
  {
    id: 'med6',
    name: 'Cofal Fuerte',
    description: 'Analgésico potente para dolores intensos',
    price: 12,
    category: 'medicina',
    image: 'https://via.placeholder.com/150/B22222/FFFFFF?text=Cofal+Fuerte'
  },
  {
    id: 'med7',
    name: 'Neurobion Inyeccion',
    description: 'Complejo de vitaminas B para uso inyectable',
    price: 25,
    category: 'medicina',
    image: 'https://via.placeholder.com/150/HDFG58/FFFFFF?text=Neurobion+Inyeccion'
  },
  {
    id: 'med8',
    name: 'Bedoyecta',
    description: 'Complejo vitamínico para mejorar el sistema nervioso',
    price: 25,
    category: 'medicina',
    image: 'https://via.placeholder.com/150/AKAFE6/FFFFFF?text=Bedoyecta'
  },
  {
    id: 'med9',
    name: 'Vital Fuerte',
    description: 'Suplemento vitamínico para energía y vitalidad',
    price: 25,
    category: 'medicina',
    image: 'https://via.placeholder.com/150/FF2630/FFFFFF?text=Vital+Fuerte'
  },
  {
    id: 'med10',
    name: 'Amoxicilina',
    description: 'Antibiótico para diversas infecciones, caja con 10 tabletas',
    price: 15,
    category: 'medicina',
    image: 'https://via.placeholder.com/150/48900B4/FFFFFF?text=Amoxicilina'
  },
  {
    id: 'med11',
    name: 'Tetraciclina',
    description: 'Antibiótico de amplio espectro, caja con 10 tabletas',
    price: 15,
    category: 'medicina',
    image: 'https://via.placeholder.com/150/FF6347/FFFFFF?text=Tetraciclina'
  },
  {
    id: 'med12',
    name: 'Sudagrip',
    description: 'Alivio rápido para síntomas de resfriado común',
    price: 2,
    category: 'medicina',
    image: 'https://via.placeholder.com/150/228748/FFFFFF?text=Sudagrip'
  },
  {
    id: 'med13',
    name: 'Ampicilina',
    description: 'Antibiótico para tratar diversas infecciones, caja con 10 tabletas',
    price: 15,
    category: 'medicina',
    image: 'https://via.placeholder.com/150/B37222/FFFFFF?text=Ampicilina'
  },
  {
    id: 'med14',
    name: 'Doloneurobion',
    description: 'Combinación analgésica con vitaminas del complejo B',
    price: 25,
    category: 'medicina',
    image: 'https://via.placeholder.com/150/H00G58/FFFFFF?text=Dolo+Neurobion'
  }
];

export const shippingOptions: ShippingOption[] = [
  {
    id: 'standard',
    name: 'Envío Estándar',
    price: 0,
    description: 'Entrega entre 5-7 días hábiles',
    estimatedDelivery: '5-7 días hábiles'
  },
  {
    id: 'express',
    name: 'Envío Express',
    price: 15,
    description: 'Entrega entre 1-3 días hábiles',
    estimatedDelivery: '1-3 días hábiles'
  }
];