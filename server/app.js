const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { MONGOURI } = require('./keys');
const PORT = 5000;

mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true 
});

//cuando se establezca la conexión
mongoose.connection.on('connected', () => {
    console.log('connected to mongo !!!');
});

//cuando haya un error
mongoose.connection.on('error', (error) => {
    console.log('error connecting -> ', error);
});


//Schema del usuario
require('./models/user');
//Schema de los posts
require('./models/post');


//alternativa mejorada de express para el body parser
app.use(express.json());


// rutas generadas por el router de express en un archivo aparte
app.use( require('./routes/auth') );
app.use( require('./routes/post') );


app.listen( PORT, () => {
    console.log('listening on port ', PORT);
});














// // los middlewares van antes de las rutas
// const customMiddleware = ( req, res, next ) => {
//     console.log('middleware executed!!!!');
//     next();
// };

// //cuando se necesita que siempre se ejecute el middleware se pone como global scoped
// // app.use(customMiddleware);



// app.get('/', (req, res) => {
//     console.log('hello from get (/)');
//     res.send('Route - /');
// });

// app.get('/about', customMiddleware, (req, res) => {
//     console.log('hello from get (/about)');
//     res.send('Route - /about');
// });

