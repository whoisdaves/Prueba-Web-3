const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const fileupload = require('express-fileupload');

const app = express();
const port = 3000;

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'play-station1',
    database: 'ProyectoDCD'
});

connection.connect(err => {
    if (err) throw err;
    console.log('Conexion Exitosa.');
});

app.use(express.static(path.join(__dirname, 'Pagina')));

app.use(express.urlencoded({ extended: true }));

app.post('/registrar_usuario', (req, res) => {
    const { correo, contraseña, rol } = req.body;

    try{
        const imagenProductoLocal = req.files.fotoperfil;
        const nombreimagen = req.files.fotoperfil.name;

        rutaImagenesLocal = __dirname + '/pagina/img/' + nombreimagen;

        imagenProductoLocal.mv(rutaImagenesLocal, (err) => {})

        var rutaImagenes = 'img/' + nombreimagen;

    }

    catch{
        rutaImagenes = '/img/ftperfil.png';
    }

    finally{
    const query = 'INSERT INTO usuarios (correo, contraseña, rol, ftperfil) VALUES (?, ?, ?, ?)';
    connection.query(query, [correo, contraseña, rol, rutaImagenes], (err, result) => {
        if (err) {
            res.send('Error de registro.');
        } else {
            console.log('Registro Exitoso.');
            res.redirect('/');
        }
    });
}
});

app.get('/logear_usuario', (req, res) => {
    const { nombre, contraseña } = req.body;

    res.sendFile(__dirname +'/administrador.html')

});

app.get('/usuarios', (req, res) => {
    const query = 'SELECT * FROM usuarios';

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener informacion.', err);
            res.send('Error con los usuarios.');
        } else {
            res.json(results);
        }
    });
});

app.get('/usuarios/:id', (req, res) => {
    const { id } = req.params;

    const query = 'SELECT * FROM usuarios WHERE id = ?';
    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error respecto a detalles de usuario.', err);
            res.status(500).send('Error respecto a detalles de usuarios.');
        } else {
            res.json(result[0]);
        }
    });
});

app.delete('/eliminar_usuario/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM usuarios WHERE id = ?';
    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error con eliminacion', err);
            res.status(500).send('Error con eliminacion');
        } else {
            res.status(200).send('Eliminado Exitosamente.');
        }
    });
});

app.get('/agregar_anime', (req, res) =>{
    const query = 'INSERT INTO Anime (nombreAnime, descripcion , fechaEstreno, categoria) VALUES (?, ?, ?, ?)';
})

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});

