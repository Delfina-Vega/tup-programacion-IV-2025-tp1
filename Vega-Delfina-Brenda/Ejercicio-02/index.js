import express from "express";

const app = express();
const port = 3000;

app.use(express.json());

let alumnos =[];
let nextId = 1;

app.get("/", (req, res) => {
    res.send("API alumnos");
});

app.get("/alumnos", (req, res) => {
    let alumnosConDatos = [...alumnos];

    alumnosConDatos.forEach(alumno => {
        //Calculo promedio
        let promedio = (alumno.nota1 + alumno.nota2 + alumno.nota3) / 3;
        alumno.promedio = promedio.toFixed(2);

        //Se determina estado
        if (promedio < 6) {
            alumno.estado = "reprobado";
        } else if (promedio >= 6 && promedio < 8) {
            alumno.estado = "aprobado";
        } else {
            alumno.estado = "promocionado";
        }
    });

    res.json({ success: true, data: alumnosConDatos });
});

// GET para obtener un alumno
app.get("/alumnos/:id", (req, res) => {
    const id = Number(req.params.id);

    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ success: false, message: "ID invalido"});
    }

    const alumno = alumnos.find(a => a.id === id);

    if (!alumno) {
        return res.status(404).json({ success: false, message: "Alumno no encontrado" });
    }

    //Copia y se agregan datos calculados 
    const alumnoConDatos = { ...alumno };
    let promedio = (alumno.nota1 + alumno.nota2 + alumno.nota3) / 3;
    alumnoConDatos.promedio = promedio.toFixed(2);

    if (promedio < 6 ) {
        alumnoConDatos.estado = "reprobado";
    }  else if (promedio >= 6 && promedio < 8) {
        alumnoConDatos.estado = "aprobado";
    } else {
        alumnoConDatos.estado = "promocionado";
    }

    res.json({ success: true, data: alumnoConDatos });
});

//Post crear alumno
app.post("/alumnos", (req, res) => {
    const { nombre, nota1, nota2, nota3 } = req.body;

    //Validaciones y verificaciones
    if (!nombre || nota1 === undefined || nota2 === undefined || nota3 === undefined) {
        return res.status(400).json({ success: false, message: "Faltan datos"});
    }

    if (nombre.trim() === "") {
        return res.status(400).json({ success: false, message: "El nombre no puede estar vacío"});
    }

    const yaExiste = alumnos.find(a => a.nombre.toLowerCase() === nombre.toLowerCase());
    if (yaExiste) {
        return res.status(400).json({ success: false, message: "Ya existe un alumno con ese nombre" });
    }

    
    if (isNaN(nota1) || isNaN(nota2) || isNaN(nota3)) {
        return res.status(400).json({ success: false, message: "Las notas deben ser numeros" });
    }

    if (nota1 < 1 || nota1 > 10 || nota2 < 1 || nota2 > 10 ||nota3 < 1 || nota3 > 10) {
        return res.status(400).json({ success: false, message: "Las notas deben estar entre 1 y 10" });
    }

    const nuevoAlumno = {
        id: nextId++,
        nombre: nombre.trim(),
        nota1: parseFloat(nota1),
        nota2: parseFloat(nota2),
        nota3: parseFloat(nota3)
    };

    alumnos.push(nuevoAlumno);

    const alumnoRespuesta = { ...nuevoAlumno };
    let promedio = (nuevoAlumno.nota1 + nuevoAlumno.nota2 + nuevoAlumno.nota3 ) / 3;
    alumnoRespuesta.promedio = promedio.toFixed(2);

    if (promedio < 6) {
        alumnoRespuesta.estado = "reprobado";
    } else if (promedio >= 6 && promedio < 8) {
        alumnoRespuesta.estado = "aprobado";
    } else {
        alumnoRespuesta.estado = "promocionado";
    }

    res.status(201).json({ success: true, data: alumnoRespuesta });


});

//PUT para modificar alumno
app.put("/alumnos/:id", (req, res) => {
    const id = Number(req.params.id);

    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ success: false, message: "ID invalido" });
    }

    const alumnoExiste = alumnos.find(a => a.id === id);
    if (!alumnoExiste) {
        return res.status(404).json({ success: false, message: "Alumno no encontrado" });
    }

    const { nombre, nota1, nota2, nota3 } = req.body;

   if (!nombre || nota1 === undefined || nota2 === undefined || nota3 === undefined) {
        return res.status(400).json({ success: false, message: "Faltan datos" });
    }

    if (nombre.trim() === "") {
        return res.status(400).json({ success: false, message: "El nombre no puede estar vacio" });
    }

    const nombreRepetido = alumnos.find(a => 
        a.nombre.toLowerCase() === nombre.toLowerCase() && a.id !== id
    );
    if (nombreRepetido) {
        return res.status (400).json({ success: false, message: "Ya existe otro alumno con ese nombre"});
    }

    if (isNaN(nota1) || isNaN(nota2) || isNaN(nota3)) {
        return res.status(400).json({ success: false, message: "Las notas debe ser numeros" });
    }
    if (nota1 < 1 || nota1 > 10 || nota2 < 1 || nota2 > 10 ||nota3 < 1 || nota3 > 10) {
        return res.status(400).json({ success: false, message: "Las notas deben estar entre 1 y 10" });
    }

  alumnos = alumnos.map(a =>
    a.id ===id ? {
        id,
        nombre: nombre.trim(),
        nota1: parseFloat(nota1),
        nota2: parseFloat(nota2),
        nota3: parseFloat(nota3)
    } : a
  );


  const alumnoModificado = alumnos.find(a => a.id === id);

  const alumnoRespuesta = { ...alumnoModificado };
  let promedio = (alumnoModificado.nota1 + alumnoModificado.nota2 + alumnoModificado.nota3) / 3;
  alumnoRespuesta.promedio = promedio.toFixed(2);

  if (promedio < 6 ) {
    alumnoRespuesta.estado = "reprobado";
  } else if (promedio >= 6 && promedio < 8) {
    alumnoRespuesta.estado = "aprobado";
  } else {
    alumnoRespuesta.estado = "promocionado";
  }

  res.json({ success: true, data: alumnoRespuesta });
});

//DELETE para quitar alumno
app.delete("/alumnos/:id", (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id) || !Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ success: false, message: "Parametro id invalido" });
    }

    const alumno = alumnos.find((a) => a.id === id);
    if (!alumno) {
        return res
        .status(404)
        .json({ success: false, message: "Alumno no encontrado"});
    }

    alumnos = alumnos.filter((a) => a.id !== id);

    const alumnoConDatos = { ...alumno };
    let promedio = (alumno.nota1 + alumno.nota2 + alumno.nota3) / 3;
    alumnoConDatos.promedio = promedio.toFixed(2);

    if (promedio < 6) {
        alumnoConDatos.estado = "reprobado";
    } else if (promedio >= 6 && promedio < 8) {
        alumnoConDatos.estado = "aprobado";
    } else {
        alumnoConDatos.estado = "promocionado";
    }

    res.json({ success: true, data: alumnoConDatos });

});

app.listen(port, () => {
  console.log(`La aplicacion esta funcionando en ${port}`)
})