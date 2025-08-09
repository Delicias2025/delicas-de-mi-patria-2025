import { Product, Category, ShippingOption } from "@/types";

// Transformar las categorías actuales al nuevo formato
export const categories: Category[] = [
  {
    id: 1,
    name: 'Bebidas Refrescantes',
    description: 'Refrescantes bebidas típicas para calmar la sed',
    image: '/images/categories/bebidas.jpg',
    slug: 'bebidas'
  },
  {
    id: 2,
    name: 'Antojitos Deliciosos',
    description: 'Los mejores antojitos tradicionales',
    image: '/images/DeliciousSnacks.jpg',
    slug: 'antojitos'
  },
  {
    id: 3,
    name: 'Café',
    description: 'Delicioso café de alta calidad',
    image: '/images/Coffee.jpg',
    slug: 'cafe'
  },
  {
    id: 4,
    name: 'Golosinas',
    description: 'Dulces y golosinas tradicionales',
    image: '/images/TraditionalSweets.jpg',
    slug: 'golosinas'
  },
  {
    id: 5,
    name: 'Comida y Consomés',
    description: 'Platillos típicos y consomés caseros',
    image: '/images/Food.jpg',
    slug: 'comida'
  },
  {
    id: 6,
    name: 'Medicina',
    description: 'Remedios tradicionales y naturales',
    image: '/images/TraditionalRemedies.jpg',
    slug: 'medicina'
  }
];

// Función para mapear de categoría string a categoryId
const getCategoryId = (categorySlug: string): number => {
  const category = categories.find(c => c.slug === categorySlug);
  return category ? category.id : 0;
};

// Transformar los productos actuales al nuevo formato
export const products: Product[] = [
  // Bebidas Refrescantes
  {
    id: 1,
    name: 'Horchata',
    description: 'Deliciosa bebida refrescante de arroz con canela',
    price: 25,
    categoryId: getCategoryId('bebidas'),
    image: '/images/Ricedrink.jpg',
    featured: true,
    stock: 50
  },
  {
    id: 2,
    name: 'Jamaica',
    description: 'Agua de flor de jamaica natural',
    price: 20,
    categoryId: getCategoryId('bebidas'),
    image: '/images/Hibiscus.jpg',
    stock: 40
  },
  {
    id: 3,
    name: 'Tamarindo',
    description: 'Refrescante agua de tamarindo natural',
    price: 22,
    categoryId: getCategoryId('bebidas'),
    image: '/images/TamarindDrink.jpg',
    stock: 35
  },
  
  // Antojitos
  {
    id: 4,
    name: 'Alboroto',
    description: 'Delicioso snack crujiente para disfrutar',
    price: 4.20,
    categoryId: getCategoryId('antojitos'),
    image: 'https://via.placeholder.com/150/MDURKL/FFFFFF?text=Alboroto',
    featured: true,
    stock: 100
  },
  {
    id: 5,
    name: 'Espumillas',
    description: 'Snack tradicional con textura ligera',
    price: 4.08,
    categoryId: getCategoryId('antojitos'),
    image: 'https://via.placeholder.com/150/GAFD21/FFFFFF?text=Espimillas',
    stock: 80
  },
  {
    id: 6,
    name: 'Leche Condensada',
    description: 'Deliciosa leche condensada para postres y aperitivos',
    price: 3.49,
    categoryId: getCategoryId('antojitos'),
    image: 'https://via.placeholder.com/150/65MSUA/FFFFFF?text=Leche+Condensada',
    stock: 60
  },
  {
    id: 7,
    name: 'Chocolate Para Chocos',
    description: 'Chocolate especial para preparar chocos tradicionales',
    price: 2.80,
    categoryId: getCategoryId('antojitos'),
    image: 'https://via.placeholder.com/150/663821/FFFFFF?text=Chocolate+Para+Chocos',
    stock: 75
  },
  {
    id: 8,
    name: 'Tostadas Charras',
    description: 'Crujientes tostadas estilo charro para botanas',
    price: 10.50,
    categoryId: getCategoryId('antojitos'),
    image: 'https://via.placeholder.com/150/M98RKL/FFFFFF?text=Tostadas+Charras',
    stock: 45
  },
  {
    id: 9,
    name: 'Jarabe Para Minutas Coco',
    description: 'Delicioso jarabe sabor coco para minutas',
    price: 10.50,
    categoryId: getCategoryId('antojitos'),
    image: 'https://via.placeholder.com/150/GA0021/FFFFFF?text=Jarabe+Para+Minutas',
    stock: 30
  },
  {
    id: 10,
    name: 'Jarabe Para Minutas Uva',
    description: 'Refrescante jarabe sabor uva para minutas',
    price: 10.50,
    categoryId: getCategoryId('antojitos'),
    image: 'https://via.placeholder.com/150/653SUA/FFFFFF?text=Jarabe+Para+Minutas',
    stock: 28
  },
  {
    id: 11,
    name: 'Jarabe Para Minutas Piña',
    description: 'Exquisito jarabe sabor piña para minutas',
    price: 10.50,
    categoryId: getCategoryId('antojitos'),
    image: 'https://via.placeholder.com/150/66KAF1/FFFFFF?text=Jarabe+Para+Minutas',
    stock: 32
  },
  
  // Café
  {
    id: 12,
    name: 'Café de Altura',
    description: 'Café gourmet cultivado en altura',
    price: 80,
    categoryId: getCategoryId('cafe'),
    image: '/images/Coffee.jpg',
    featured: true,
    stock: 25
  },
  {
    id: 13,
    name: 'Café Orgánico',
    description: 'Café 100% orgánico y sustentable',
    price: 90,
    categoryId: getCategoryId('cafe'),
    image: '/images/OrganicCoffee.jpg',
    stock: 20
  },
  
  // Golosinas
  {
    id: 14,
    name: 'Dulce de Leche',
    description: 'Tradicional dulce de leche artesanal',
    price: 45,
    categoryId: getCategoryId('golosinas'),
    image: '/images/DulcedeLeche.jpg',
    stock: 40
  },
  {
    id: 15,
    name: 'Cocadas',
    description: 'Deliciosas cocadas caseras',
    price: 20,
    categoryId: getCategoryId('golosinas'),
    image: '/images/CoconutTreats.jpg',
    featured: true,
    stock: 55
  },
  
  // Comida y Consomés
  {
    id: 16,
    name: 'Pozole',
    description: 'Tradicional pozole rojo listo para preparar',
    price: 75,
    categoryId: getCategoryId('comida'),
    image: '/images/Pozole.jpg',
    featured: true,
    stock: 15
  },
  {
    id: 17,
    name: 'Consomé de Pollo',
    description: 'Consomé de pollo casero, listo para servir',
    price: 60,
    categoryId: getCategoryId('comida'),
    image: '/images/ChickenBroth.jpg',
    stock: 20
  },
  
  // Medicina
  {
    id: 18,
    name: 'Té de Manzanilla',
    description: 'Té natural de manzanilla para calmar malestares',
    price: 35,
    categoryId: getCategoryId('medicina'),
    image: '/images/ChamomileTea.jpg',
    stock: 40
  },
  {
    id: 19,
    name: 'Hierbas Digestivas',
    description: 'Mezcla de hierbas para mejorar la digestión',
    price: 40,
    categoryId: getCategoryId('medicina'),
    image: '/images/DigestiveHerbs.jpg',
    featured: true,
    stock: 30
  },
  {
    id: 20,
    name: 'Tabcin Gripe y Tos',
    description: 'Medicamento para aliviar síntomas de gripe y tos',
    price: 5,
    categoryId: getCategoryId('medicina'),
    image: 'https://via.placeholder.com/150/ADD8E6/FFFFFF?text=Tabcin',
    stock: 50
  },
  {
    id: 21,
    name: 'Virogrip Día',
    description: 'Alivio de síntomas de gripe durante el día',
    price: 4.5,
    categoryId: getCategoryId('medicina'),
    image: 'https://via.placeholder.com/150/FFD700/FFFFFF?text=Virogrip+Dia',
    stock: 42
  },
  {
    id: 22,
    name: 'Virogrip Noche',
    description: 'Alivio de síntomas de gripe para uso nocturno',
    price: 4.5,
    categoryId: getCategoryId('medicina'),
    image: 'https://via.placeholder.com/150/4682B4/FFFFFF?text=Virogrip+Noche',
    stock: 38
  },
  {
    id: 23,
    name: 'Novalgina',
    description: 'Analgésico para dolores leves y moderados',
    price: 5,
    categoryId: getCategoryId('medicina'),
    image: 'https://via.placeholder.com/150/FF6347/FFFFFF?text=Novalgina',
    stock: 55
  },
  {
    id: 24,
    name: 'Mariguanol',
    description: 'Ungüento medicinal para dolores musculares',
    price: 12,
    categoryId: getCategoryId('medicina'),
    image: 'https://via.placeholder.com/150/008000/FFFFFF?text=Mariguanol',
    stock: 25
  },
  {
    id: 25,
    name: 'Cofal Fuerte',
    description: 'Analgésico potente para dolores intensos',
    price: 12,
    categoryId: getCategoryId('medicina'),
    image: 'https://via.placeholder.com/150/B22222/FFFFFF?text=Cofal+Fuerte',
    stock: 30
  },
  {
    id: 26,
    name: 'Neurobion Inyeccion',
    description: 'Complejo de vitaminas B para uso inyectable',
    price: 25,
    categoryId: getCategoryId('medicina'),
    image: 'https://via.placeholder.com/150/HDFG58/FFFFFF?text=Neurobion+Inyeccion',
    stock: 15
  },
  {
    id: 27,
    name: 'Bedoyecta',
    description: 'Complejo vitamínico para mejorar el sistema nervioso',
    price: 25,
    categoryId: getCategoryId('medicina'),
    image: 'https://via.placeholder.com/150/AKAFE6/FFFFFF?text=Bedoyecta',
    stock: 12
  },
  {
    id: 28,
    name: 'Vital Fuerte',
    description: 'Suplemento vitamínico para energía y vitalidad',
    price: 25,
    categoryId: getCategoryId('medicina'),
    image: 'https://via.placeholder.com/150/FF2630/FFFFFF?text=Vital+Fuerte',
    stock: 18
  },
  {
    id: 29,
    name: 'Amoxicilina',
    description: 'Antibiótico para diversas infecciones, caja con 10 tabletas',
    price: 15,
    categoryId: getCategoryId('medicina'),
    image: 'https://via.placeholder.com/150/48900B4/FFFFFF?text=Amoxicilina',
    stock: 20
  },
  {
    id: 30,
    name: 'Tetraciclina',
    description: 'Antibiótico de amplio espectro, caja con 10 tabletas',
    price: 15,
    categoryId: getCategoryId('medicina'),
    image: 'https://via.placeholder.com/150/FF6347/FFFFFF?text=Tetraciclina',
    stock: 18
  },
  {
    id: 31,
    name: 'Sudagrip',
    description: 'Alivio rápido para síntomas de resfriado común',
    price: 2,
    categoryId: getCategoryId('medicina'),
    image: 'https://via.placeholder.com/150/228748/FFFFFF?text=Sudagrip',
    stock: 75
  },
  {
    id: 32,
    name: 'Ampicilina',
    description: 'Antibiótico para tratar diversas infecciones, caja con 10 tabletas',
    price: 15,
    categoryId: getCategoryId('medicina'),
    image: 'https://via.placeholder.com/150/B37222/FFFFFF?text=Ampicilina',
    stock: 22
  },
  {
    id: 33,
    name: 'Doloneurobion',
    description: 'Combinación analgésica con vitaminas del complejo B',
    price: 25,
    categoryId: getCategoryId('medicina'),
    image: 'https://via.placeholder.com/150/H00G58/FFFFFF?text=Dolo+Neurobion',
    stock: 16
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

// Inicializar los servicios con los datos
import { productService } from '@/lib/product-service';
import { categoryService } from '@/lib/category-service';
import { initPromotions } from './promotions-data';

import { initializeSiteContent } from '@/lib/site-content-service';

export const initializeData = () => {
  productService.initializeProductsIfEmpty(products);
  categoryService.initializeCategoriesIfEmpty(categories);
  initPromotions();
  initializeSiteContent();
};