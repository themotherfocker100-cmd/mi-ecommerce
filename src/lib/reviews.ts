export interface Review {
  name: string;
  text: string;
  rating: number;
}

export const reviews: Review[] = [
  {
    name: "María García",
    text: "Experiencia increíble. El lugar es precioso y muy bien mantenido.",
    rating: 5,
  },
  {
    name: "Carlos López",
    text: "Perfecto para pasar un fin de semana en familia. Todo estaba impecable.",
    rating: 5,
  },
  {
    name: "Ana Rodríguez",
    text: "Los vinos son excelentes y la casa tiene todo lo necesario. Volveremos.",
    rating: 5,
  },
];
