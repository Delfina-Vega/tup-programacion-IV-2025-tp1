import express from "express";

const app = express();
const port = 3000;

app.use(express.json());

let tareas = [];
let nextId = 1;

app.get("/", (req, res) => {
    res.send("API sobre Gestión de Tareas");
});


// GET para listado de tareas
app.get("/tareas", (req, res) => {
    let tareasFiltradas = [...tareas];

    // Filtro por tareas completadas
    const completada = req.query.completada;
if (completada !== undefined) {   
if (completada === "true")  
{
       tareasFiltradas = tareasFiltradas.filter((t) => t.completada === true);

}  else if (completada === "false") {
    tareasFiltradas = tareasFiltradas.filter((t) => t.completada === false);
}  else {
          return res.status(400).json({ success: false, message: "Filtro completada inválido" });
}

    }

    res.json({ success: true, data: tareasFiltradas });
});

//GET para entregar detalle de una tarea
app.get("/tareas", (req, res) => {
    let tareasFiltradas = [...tareas];

    // Filtro por estado completada
    const completada = req.query.completada;
    if (completada !== undefined) {
        if (completada === "true") {
            tareasFiltradas = tareasFiltradas.filter((t) => t.completada === true);
    } else if (completada === "false") {
            tareasFiltradas = tareasFiltradas.filter((t) => t.completada === false);
    } else {
            return res.status(400).json({ success: false, message: "Filtro completada invalido" });
           }
    }

res.json({ success: true, data: tareasFiltradas });

});

// GET Para entregar detalle de una tarea
app.get("/tareas/:id", (req, res) => {
    const id = Number(req.params.id);

 if (isNaN(id) || !Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ success: false, message: "Parámetro id inválido" });
}

 const tarea = tareas.find((t) => t.id === id);
 if (!tarea) {
    return res.status(404).json({ success: false, message: "Tarea no encontrada" });
}

    res.json({ success: true, data: tarea });

});

// POST Para crear tarea
app.post("/tareas", (req, res) => {
    const { nombre, completada } = req.body;

// Validar que existan los campos obligatorios
 if (nombre === undefined || completada === undefined) {
     return res.status(400).json({ success: false, message: "Faltan campos: nombre y completada" });
 }

   // Validar el nombre
if (nombre.trim() === "") {
return res.status(400).json({ success: false, message: "El nombre no puede estar vacío" });
}

// Verificar que no se repita el nombre
    const tareaExiste = tareas.find((t) => t.nombre.toLowerCase() === nombre.trim().toLowerCase());
if (tareaExiste) {
     return res.status(400).json({ success: false, message: "Ya existe una tarea con ese nombre" });
}

 // Validar que completada sea booleano
if (typeof completada !== "boolean") {
   return res.status(400).json({ success: false, message: "El campo completada debe ser true o false" });
}
 // Crear nueva tarea
   const nuevaTarea = {
       id: nextId++,
       nombre: nombre.trim(),
       completada: completada
 };

  // Agregar al arreglo
    tareas.push(nuevaTarea);

    res.status(201).json({ success: true, data: nuevaTarea });
});

//PUT para modificar tareas
app.put("/tareas/:id", (req, res) => {
    const id = Number(req.params.id);

if (isNaN(id) || !Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ success: false, message: "Parametro id invalido" });
}

    const tarea = tareas.find((t) => t.id === id);
if (!tarea) {
   return res.status(404).json({ success: false, message: "Tarea no encontrada" });
}

    const { nombre, completada } = req.body;

if (nombre === undefined || completada === undefined) {
    return res.status(400).json({ success: false, message: "Faltan campos: nombre y completada"});
}

if (nombre.trim() === "") {
    return res.status(400).json({ success: false, message: "El campo no puede estar vacio"});
}

    const tareaExiste = tareas.find((t) => 
    t.nombre.toLowerCase() === nombre.trim().toLowerCase() && t.id !== id
);
if (tareaExiste) {
    return res.status(400).json({ success: false, message: "Ya existe otra tarea con ese nombre" });
}

if (typeof completada !== "boolean") {
    return res.status(400).json({ success: false, message: "El campo completada debe ser true o false" });

}
    tareas = tareas.map((t) =>
    t.id === id ? {
    id,
    nombre: nombre.trim(),
    completada: completada
    } : t
);

const tareaModificada = tareas.find((t) => t.id === id);

res.json({ success: true, data: tareaModificada });
});

//DELETE para quitar tarea
app.delete("/tareas/:id", (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id) || !Number.isInteger(id) || id <= 0) {
return res.status(400).json({ success: false, message: "Parametro id invalido" });
}

const tarea = tareas.find((t) => t.id === id);
if (!tarea) {
    return res.status(404).json({ success: false, message: "Tarea no encontrada" });
}

//Quitar tarea del arreglo por su id
tareas = tareas.filter((t) => t.id !== id);

res.json({ success: true, data: tarea });
});

app.listen(port, () => {
  console.log(`La aplicacion esta funcionando en ${port}`)
});