const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const rest = new (require('rest-mssql-nodejs'))({
    user: 'DavidPruebas',
    password: 'DavidPruebas',
    server: 'DESKTOP-A8FTTBG',
    database: 'PRUEBASAPPS' 
});



setTimeout(async ()=> {
    //await rest.executeQuery(`INSERT INTO USERS (NOMBRE, APELLIDO,DATE_CREATE) VALUES ('Fer', 'Bermudez', CAST ('2016-10-23 20:44:11' AS DATETIME))`);
    const result = await rest.executeQuery('SELECT * FROM USERS');    
    console.log(result.data);
}, 1500);



app.get("/", (req, res)=>{
    console.log(__dirname);
    res.sendFile(__dirname + "/views/index.html");
});
app.post("/", (req, res)=>{

})

io.sockets.on("connection", (socket) => {
    socket.on("username", (username) => {
        socket.username =  username;
        io.emit("is_online", `${username} se unio al chat`);
    });
    socket.on('chat_message', (message) => {

        io.emit('chat_message', `<strong> ${socket.username}: </strong> ${message}`)
    });
    socket.on('upload_image', (img)=>{
        //insertar img en BD 
        
        io.emit('uploaded_img', `<strong> ${socket.username}: </strong>`, img);
    });
});

const server = http.listen(8080, () => {
    console.log("Server started on port 8080");
});