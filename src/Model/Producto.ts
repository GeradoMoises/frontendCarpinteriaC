export interface Producto {
  id: number; // viene como "id" por @JsonProperty("id") en backend
  nombre: string;

  descripcionCard?: string;
  descripcionCorta?: string;
  descripcionLarga?: string;

  precio?: number; // BigDecimal -> number
  etiquetaPrecio?: string;

  largo?: number;
  ancho?: number;
  altura?: number;
  peso?: number;

  material?: string;

  imagen1?: string;
  imagen2?: string;
  imagen3?: string;

  destacado?: boolean;
  activo?: boolean;

  fechaCreacion?: string;
  fechaModificacion?: string;

  // relaciones (backend manda objetos)
  categoria?: { id: number; nombre?: string };
  lineaDiseno?: { id: number; nombre?: string };
}
