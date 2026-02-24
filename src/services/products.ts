// src/services/products.ts
export interface Product {
  id: string;
  marca: string;
  modelo: string;
  categoria: string;
  precio: number;
  imagen: string;
  talles: string[];
  colores: string[];
  estado: string | null;
  precioOferta?: number | null;
  detalle: string;
}

export async function getProducts(): Promise<Product[]> {
  const SHEET_ID = "1zYdZFcQy6rPkU0au1-oJ7GFM0YIpRqPdpnHzpx1rE6o";
  const url = `https://opensheet.elk.sh/${SHEET_ID}/Productos`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    return data.map((item: any) => {
      // Normalización de campos (Manejo de mayúsculas/minúsculas)
      const rawId = item.id || item.ID || item.Id;
      const rawColor = item.color || item.Color || item.Colores;
      // Buscamos todas las variantes posibles para el detalle
      const rawDetalle = item.detalle || item.Detalle || item.DETALLE || item.descripcion || item.Descripcion || item.Descripción || "Sin descripción disponible.";
      const rawEstado = item.estado || item.Estado;
      const rawPrecioOferta = item.oferta || item.Oferta;

      return {
        id: rawId ? rawId.toString() : Math.random().toString(36).substr(2, 9), // Fallback por seguridad
        marca: item.marca || "",
        modelo: item.modelo || "",
        categoria: item.categoria || "Varios",
        precio: Number(item.precio) || 0,
        imagen: item.imagen || "",
        talles: item.talles ? item.talles.toString().split(',').map((t: string) => t.trim()) : [],
        colores: rawColor ? rawColor.toString().split(',').map((c: string) => c.trim()) : [],
        estado: rawEstado || null,
        precioOferta: Number(rawPrecioOferta) || null,
        detalle: rawDetalle
      };
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}