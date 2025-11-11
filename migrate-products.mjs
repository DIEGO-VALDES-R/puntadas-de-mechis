import { drizzle } from "drizzle-orm/mysql2";
import { galleryProducts } from "./drizzle/schema.ts";

const db = drizzle(process.env.DATABASE_URL);

const productsToMigrate = [
  {
    title: "Virgen de Fátima",
    description: "Amigurumi religioso con detalles dorados",
    details: "• Luz LED incorporada\n• Denarios en rodio y acero\n• Corona metálica tejida\n• Altura: 20cm aprox",
    imageUrl: "/gallery/1002478157.jpg",
    price: 0,
    isActive: true,
  },
  {
    title: "Virgen de Fátima en Cúpula",
    description: "Presentación en cúpula de vidrio con base de madera",
    details: "• Luz LED incorporada\n• Denarios en rodio y acero\n• Corona metálica\n• Cúpula de vidrio incluida",
    imageUrl: "/gallery/1002481107.jpg",
    price: 0,
    isActive: true,
  },
  {
    title: "Virgen de Guadalupe",
    description: "Amigurumi con detalles en plata",
    details: "• Luz LED incorporada\n• Denarios en acero\n• Corona tejida\n• Altura: 22cm aprox",
    imageUrl: "/gallery/1002474791.png",
    price: 0,
    isActive: true,
  },
  {
    title: "Virgen de Guadalupe en Cúpula",
    description: "Con iluminación LED incorporada",
    details: "• Luz LED incorporada\n• Denarios en rodio y acero\n• Corona metálica tejida\n• Cúpula de vidrio con base",
    imageUrl: "/gallery/1002490163.jpg",
    price: 0,
    isActive: true,
  },
  {
    title: "Virgen María Personalizada",
    description: "Amigurumi religioso con detalles dorados",
    details: "• Luz LED incorporada\n• Denarios en rodio\n• Corona metálica\n• Personalizable en colores",
    imageUrl: "/gallery/1002474906.png",
    price: 0,
    isActive: true,
  },
  {
    title: "Conejo Floral",
    description: "Amigurumi con flores y detalles delicados",
    details: "• Flores tejidas\n• Detalles en hilo de colores\n• Altura: 18cm aprox\n• Personalizable",
    imageUrl: "/gallery/1002075872.png",
    price: 0,
    isActive: true,
  },
  {
    title: "Caja de Presentación",
    description: "Empaque profesional con logo PUNTADAS DE MECHIS",
    details: "• Caja de cartón kraft\n• Papel de regalo incluido\n• Logo personalizado\n• Tarjeta de agradecimiento",
    imageUrl: "/gallery/1002478191.jpg",
    price: 0,
    isActive: true,
  },
  {
    title: "Gato Personalizado",
    description: "Amigurumi de gato con empaque especial",
    details: "• Detalles tejidos\n• Ojos de seguridad\n• Altura: 15cm aprox\n• Empaque profesional",
    imageUrl: "/gallery/1002384650.jpg",
    price: 0,
    isActive: true,
  },
];

async function migrateProducts() {
  try {
    console.log("Iniciando migración de productos...");
    
    for (const product of productsToMigrate) {
      await db.insert(galleryProducts).values(product);
      console.log(`✓ Producto migrado: ${product.title}`);
    }
    
    console.log("✓ Migración completada exitosamente");
    process.exit(0);
  } catch (error) {
    console.error("Error durante la migración:", error);
    process.exit(1);
  }
}

migrateProducts();
