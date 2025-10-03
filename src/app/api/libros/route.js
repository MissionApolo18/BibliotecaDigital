import clientPromise from "../../../lib/mongodb"; 
import { LibroSchema } from "../../models/libro";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("biblioteca"); 
    const libros = await db.collection("libros").find({}).toArray();

    const librosFormateados = libros.map(l => ({
      idLibro: l.idLibro,
      ISBN: l.ISBN,
      autorId: l.autorId,
      anno: l.anno,
      titulo: l.titulo,
      editorialId: l.editorialId,
      idioma: l.idioma,
      categoriaId: l.categoriaId,
      fechaCarga: l.fechaCarga,
      vistas: l.vistas,
      formato: l.formato,
      paginas: l.paginas,
    }));

    return new Response(JSON.stringify(librosFormateados), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "No se pudieron cargar los libros" }), { status: 500 });
  }
}
