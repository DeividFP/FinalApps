const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const exphbs = require('express-handlebars');
const rest = new (require('rest-mssql-nodejs'))({
    user: 'DavidPruebas',
    password: 'DavidPruebas',
    server: 'DESKTOP-A8FTTBG',
    database: 'PRUEBASAPPS' 
});

let usr = "";

app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
}));
app.set('view engine', 'hbs');

app.get("/", (req, res)=>{
    res.render('start');
});
app.get("/inicio", async (req, res)=>{
    const qry = await rest.executeQuery(`EXEC DAT_CHAT`);
    const ses = await rest.executeQuery(`SELECT ID_USUARIO FROM USUARIOS WHERE NOM_USUARIO = '${usr}'`);
    const sesData = ses.data[0][0];
    const consulta = qry.data[0];
    //console.log(consulta);
    for(let key of consulta){
        if(key.KIND_MSG == 1){
            key.mensaje = true;
        }
        if(key.KIND_MSG == 2){
            key.imagen = true;
        }
    } 
    res.render('chat', {consulta, usr, sesData});
})

io.sockets.on("connection", (socket) => {
    const resp = '/inicio';
    socket.on("username", (username, id) => {
        socket.username =  username;
        socket.id = id;
        io.emit("is_online", `${username} se unio al chat`);
    });
    socket.on('loginReq', async (usuario, password) => {
        const qry = await rest.executeQuery(`EXEC USEREXIST '${usuario}'`);
        if( qry.data[0].length > 0){
            const match = await rest.executeQuery(`EXEC MATCHPASS '${usuario}','${password}'`);
            if(match.data[0].length != 0){
                usr =  usuario;
                io.emit('loginRes', resp);
            }else{
                io.emit('error', 'Contraseña incorrecta');
            }
        }else{
            io.emit('error', 'No existe ese nombre de usuario');
        }
    });
    socket.on('regReq', async (nomb, ap1, ap2, username, pass1, pass2) => {
        if(pass1===pass2){
            const qry = await rest.executeQuery(`EXEC USEREXIST '${username}'`);
            if( qry.data[0].length == 0){
                await rest.executeQuery(`EXEC AGREGADO '${nomb}', '${ap1}', '${ap2}', '${username}', '${pass1}'`);
                usr = username;
                io.emit('loginRes', resp);
            }else{
                io.emit('error', 'Ya existe un nombre de usuario');
            }
        }else{
            io.emit('error', 'Las contraseñas deben coincidir');
        }
        
    });
    socket.on('chat_message', async(message) => {
        await rest.executeQuery(`EXEC INS_CHAT ${socket.id}, 1, '${message}'`);
        io.emit('message_res', socket.username, message);
    });
    socket.on('upload_image', async     (img)=>{
        //insertar img en BD 
        await rest.executeQuery(`EXEC INS_CHAT ${socket.id}, 2, '${img}'`);
        io.emit('uploaded_img', socket.username, img);
    });
});

const server = http.listen(8000, () => {
    console.log("Server started on port 8000");
});