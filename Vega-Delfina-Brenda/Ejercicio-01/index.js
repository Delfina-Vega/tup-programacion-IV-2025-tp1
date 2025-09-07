import express from "express";

const app = express();
const port = 3000;

app.use(express.json());

let rectangulos = [];
let nextId = 1;


app.get("/", (req, res) => {
    res.send("API de calculos de rectangulos");
});

// GET para obtener todos las rectangulos 
app.get("/rectangulos", (req, res) => {
    let rectangulosConTipo = rectangulos.map(rectangulo => ({
        ...rectangulo,
        tipo: rectangulo.base === rectangulo.altura ? "cuadrado" : "rectangulo"
    }));

    res.json({ success: true, data: rectangulosConTipo });
});

// GET para obtener un rectangulo en especifico por id
app.get("/rectangulos/:id", (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id) || !Number.isInteger(id) || id <= 0) {
        return res
        .status(400)
        .json({ success: false, message: "Prametro id invalido" });
    }

    const rectangulo = rectangulos.find((r) => r.id === id);
    if (!rectangulo) {
        return res
        .status(404)
        .json({ success: false, message: "Rectangulo no encontrado" });
    }

    const rectangulosConTipo = {
        ...rectangulo,
        tipo: rectangulo.base === rectangulo.altura ? "cuadrado" : "rectangulo"
    };

    res.json({ success: true, data: rectangulosConTipo });

    });

    // POST para crear un nuevo rectangulo 
app.post("/rectangulos", (req, res) => {
    const { base, altura } = req.body;

    // Validaciones de campos 
    if (base === undefined || altura === undefined) {
        return res
        .status(400)
        .json({ success: false, message: "Faltan campos obligatorios: Base y altura" });
    }

    //Validacion de tipo numerico
     if (isNaN(base) || isNaN(altura)) {
        return res
        .status(400)
        .json({ success: false, message: "Base y altura deben ser numeros "});
    }

    //Validacion de numeros positivos 
    if ( base <= 0 || altura <= 0) {
        return res
        .status(400)
        .json({ success: false, message: "Base y altura deben ser numeros positivos"});
    }

    const baseNum = parseFloat(base);
    const alturaNum = parseFloat(altura);

    const perimetro = 2 * (baseNum + alturaNum);
    const superficie = baseNum * alturaNum;


    const nuevoRectangulo = {
        id: nextId++,
        base: baseNum,
        altura: alturaNum,
        perimetro: perimetro,
        superficie: superficie
    };

    //Agregar al arreglo
    rectangulos.push(nuevoRectangulo);

    const rectanguloConTipo = {
        ...nuevoRectangulo,
    tipo: nuevoRectangulo.base === nuevoRectangulo.altura ? "cuadrado" : "rectangulo"
    };

    res.status(201).json({ success: true, data: rectanguloConTipo });
});

// PUT para modificar un rectangulo ya existente
app.put("/rectangulos/:id", (req, res) => {
    const id = Number(req.params.id);

    if (isNaN(id) || !Number.isInteger(id) || id <= 0) {
        return res
        .status(400)
        .json({ success: false, message: "Parametro id invalido" });
    }

    let rectanguloEncontrado = rectangulos.find((r) => r.id === id);
    if (!rectanguloEncontrado) {
        return res
        .status(404)
        .json({success: false, message: "Rectangulo no encontrado"});
    }

    const { base, altura } = req.body;
    
    //Validacion de campos obligatorios
    if (base === undefined || altura === undefined) {
        return res
        .status(400)
        .json({ success: false, message: "Faltan campos obligatorios: base y altura" });
    }

    //Validacion de tipo numerico
     if (isNaN(base) || isNaN(altura)) {
        return res
        .status(400)
        .json({ success: false, message: "Base y altura deben ser numeros "});
    }

    //Validacion de numeros positivos 
    if ( base <= 0 || altura <= 0) {
        return res
        .status(400)
        .json({ success: false, message: "Base y altura deben ser numeros positivos"});
    }

    const baseNum = parseFloat(base);
    const alturaNum = parseFloat(altura);

    const perimetro = 2 * (baseNum + alturaNum);
    const superficie = baseNum * alturaNum;

//Modificamos el rectangulo con map
rectangulos = rectangulos.map((r) =>
r.id === id ? {
    id, 
    base: baseNum,
    altura: alturaNum,
    perimetro: perimetro,
    superficie: superficie
} : r
);

const rectanguloConTipo = {
    id,
    base: baseNum,
    altura: alturaNum,
    perimetro: perimetro,
    superficie: superficie,
    tipo: baseNum === alturaNum ? "cuadrado" : "rectangulo"
};


res.json({ success: true, data: rectanguloConTipo });
});

//DELETE para quitar un rectangulo 
app.delete("/rectangulos/:id", (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id) || !Number.isInteger(id) || id <= 0) {
        return res
        .status(400)
        .json({ success: false, message: "Parametro id invalido" });
    }

    let rectanguloEncontrado = rectangulos.find((r) => r.id === id);
    if (!rectanguloEncontrado) {
        return res
        .status(404)
        .json({ success: false, message: "Rectangulo no encontrado" });
    }

    rectangulos = rectangulos.filter((r) => r.id !== id);

    const rectanguloConTipo = {
        ...rectanguloEncontrado,
        tipo: rectanguloEncontrado.base === rectanguloEncontrado.altura ? "cuadrado" : "rectangulo"
    };

    res.json({ success: true, data: rectanguloConTipo });
});


app.listen(port, () => {
    console.log(`La aplicación está funcionando en el puerto ${port}`);
});