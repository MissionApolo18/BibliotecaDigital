import clientPromise from "../../../lib/mongodb";
import { ArticuloSchema } from "../../models/articulo";

export const POST = async (req) => {
  try {
    const {
      titulo,
      ISSN,
      autorId,
      anno,
      idioma,
      categoriaId,
      publisherId,
      fechaCarga,
      vistas,
      formato,
      paginas,
    } = await req.json();

    // Validación mínima
    if (!titulo || !ISSN || !autorId) {
      return new Response(
        JSON.stringify({ error: "Título, ISSN y autor son obligatorios" }),
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("biblioteca");

    const nuevoArticulo = {
      titulo,
      ISSN,
      autorId,
      anno,
      idioma,
      categoriaId,
      publisherId,
      fechaCarga: fechaCarga ? new Date(fechaCarga) : new Date(),
      vistas: vistas || 0,
      formato,
      paginas,
    };

    const result = await db.collection("articulo").insertOne(nuevoArticulo);

    return new Response(
      JSON.stringify({ message: "Artículo agregado", articuloId: result.insertedId }),
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Error en servidor" }), { status: 500 });
  }
};

export const GET = async () => {
  try {
    const client = await clientPromise;
    const db = client.db("biblioteca");

    const articulos = await db.collection("articulos").find({}).toArray();

    return new Response(JSON.stringify(articulos), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Error al obtener artículos" }), { status: 500 });
  }
};
