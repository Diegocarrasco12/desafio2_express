const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Ruta para servir la página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta para devolver las canciones
app.get('/canciones', (req, res) => {
    fs.readFile('repertorio.json', 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error al leer el archivo');
        res.json(JSON.parse(data));
    });
});

// Ruta para agregar una canción
app.post('/canciones', (req, res) => {
    const nuevaCancion = req.body;
    fs.readFile('repertorio.json', 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error al leer el archivo');
        const canciones = JSON.parse(data);
        canciones.push(nuevaCancion);
        fs.writeFile('repertorio.json', JSON.stringify(canciones, null, 2), (err) => {
            if (err) return res.status(500).send('Error al escribir el archivo');
            res.status(201).send('Canción agregada con éxito');
        });
    });
});

// Ruta para actualizar una canción
app.put('/canciones/:id', (req, res) => {
    const id = req.params.id;
    const datosActualizados = req.body;
    fs.readFile('repertorio.json', 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error al leer el archivo');
        let canciones = JSON.parse(data);
        canciones = canciones.map(c => (c.id === id ? { ...c, ...datosActualizados } : c));
        fs.writeFile('repertorio.json', JSON.stringify(canciones, null, 2), (err) => {
            if (err) return res.status(500).send('Error al escribir el archivo');
            res.send('Canción actualizada con éxito');
        });
    });
});

// Ruta para eliminar una canción
app.delete('/canciones/:id', (req, res) => {
    const id = req.params.id;
    fs.readFile('repertorio.json', 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error al leer el archivo');
        const canciones = JSON.parse(data).filter(c => c.id !== id);
        fs.writeFile('repertorio.json', JSON.stringify(canciones, null, 2), (err) => {
            if (err) return res.status(500).send('Error al escribir el archivo');
            res.send('Canción eliminada con éxito');
        });
    });
});

// Levantar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
