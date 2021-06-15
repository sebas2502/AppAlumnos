const express = require('express');
const app = express();
const mysql = require('mysql');
const path = require('path');

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

/*Configuarmos el directorio donde estarán los archivos estaticos*/
app.use(express.static('public'));

/*Middleware para traer informacion desde formularios*/
app.use(express.urlencoded({extended:false}));
app.use(express.json());

/*Creando la conexion a la base de datos*/
const conexion = mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'',
        database:'alumnosMariana'
});


/*Conectando a la base de datos*/
conexion.connect((error)=>{
    if(!error){
        console.log('Conectado a marianaAlumnos');
    }else{
        console.log('No se pudo conectar a la base de datos');
    }
});





/*Listando todos los alumnos*/
app.get('/alumnos',(req,res)=>{
    conexion.query('SELECT * FROM alumnos',(error,resultados)=>{
        if(error){
            res.send('Ha ocurrido un error al recuperar los datos');
        }else{
            
            res.render('index',{data:resultados});
        }
    });    
});

app.post('/insertarAlumno',(req,res)=>{
    const alum = {
        dni:req.body.dni,
        apellido: req.body.apellido,
        nombre: req.body.nombre,
        curso: req.body.curso,
        celular: req.body.celular,
        descripcion: req.body.descripcion,
        
     };

     console.log(alum);
    conexion.query('INSERT into alumnos set ?',[alum],(error,resultado)=>{
        if(error){
            throw error;
        }else{
            res.redirect('/alumnos');
        }
    });


});


/*Eliminar Alumno*/
app.get('/eliminarAlumno/:dni',(req,res)=>{
    const dniAlum = req.params.dni;
    conexion.query('DELETE  FROM alumnos where dni = ?',[dniAlum],(error,resultado)=>{
        if(error){
            console.log('No se pudo eliminar el registro indicado');
        }else {

            res.redirect('/alumnos');
            console.log('Registro eliminado');
        }
    }); 
});




/*Vista de alumno a editar*/
app.get('/editarAlumno/:dni',(req,res)=>{
    const dniAlum = req.params.dni;
    console.log(dniAlum);
    conexion.query('SELECT * FROM alumnos WHERE dni = ?',[dniAlum],(error,resultados)=>{
        if(error){
            console.log('Error en la busqueda en la base de datos');
        }else{
            console.log(resultados[0]);
            res.render('editarAlumnos',{dataE:resultados});
        }
    });
});


app.post('/guardarCambioAlumno/:dni',(req,res)=>{

    const dni = req.params.dni;
    const apellido = req.body.apellidoE;
    const nombre = req.body.nombreE;
    const curso = req.body.cursoE;
    const celular = req.body.celularE;
    const descripcion = req.body.descripcionE;
    const asistencias = req.body.asistenciasE;

    conexion.query('UPDATE alumnos set dni=?, apellido=?, nombre=?, curso=?, celular=?, descripcion=?, asistencias=? WHERE dni = ?',[dni,apellido,nombre,curso,celular,descripcion,asistencias,dni],(error,resultado)=>{
        if(error){
            console.log('Error al actualizar el registro indicado');
        }else{
            res.redirect('/alumnos');
        }
    });

});


app.get('/sumarAsistencia/:dni',(req,res)=>{

    let dni = req.params.dni;

    conexion.query('select * from alumnos where dni = ?',[dni],(error,resultado)=>{
        if(!error){
            let nuevaAsistencia = resultado[0].asistencias;
            nuevaAsistencia++;
            conexion.query('UPDATE alumnos set asistencias = ? WHERE dni = ?',[nuevaAsistencia,dni],(err,result)=>{
                if(err){
                    console.log('Ha ocurrido un error al intentar actualizar el registro indicado');
                }else{
                    res.redirect('/alumnos');
                }
            });
            
           
        }
    });
    

});


app.listen(3000,(error)=>{
    if(!error){
        console.log('Servidor corriendo en puero 3000');
    }else{
        throw error;
    };
});