import { Request, Response, Router } from 'express';
import pool from '../database';
import jwt from 'jsonwebtoken'
// const router = Router();
const nodemailer = require('nodemailer')
const fs = require('fs');
class AppController {

     public sendEmail(req: Request, res: Response) {
          var emailTo="contacto@planta360.cl"
          // var emailTo="felipe.ascencio@virginiogomez.cl"
          var contentHTML: any; 
          const { nombre, email,fono, mensaje } = req.body;
          contentHTML = ` 
          Mensaje de contacto de Planta 360
          Nombre: ${nombre}
          Email: ${email}
          Celular: ${fono}
          Mensaje: ${mensaje}
         `
          console.log(contentHTML)

          let transporter = nodemailer.createTransport({
               host: 'smtp.gmail.com',
               port: 587,
               secure: false,
               requireTLS: true,
               auth: {
                    user: 'contactoplanta360@gmail.com',
                    pass: 'asdq!33C'
               }
          });

          let mailOptions = {
               from: 'contactoplanta360@gmail.com',
               to: emailTo,
               subject: 'Contacto Planta 360 de ' + nombre, //este mensaje debe ir cambiando, asi no quedan todos juntos 
               text: contentHTML
          };

          transporter.sendMail(mailOptions, (error: any, info: any) => {
               if (error) {
                    res.json({ error: error })
               }
               res.json({ text: 'enviado correctamente' })
          });
     } 

//metodos de practica
public async signin(req: any, res: any): Promise<void> {
     const { name,password } = req.body;
     console.log(name)
     console.log(password) 
  
      

     const datos = await pool.query('SELECT * FROM `usuarios`  WHERE nombreUsuario =\'' + name + '\' AND claveUsuario =\'' + password + '\'')
     
      
     if(datos.length > 0){
          console.log('si tiene un dato!')
          console.log(datos[0])
         const data=datos[0];
          const token = jwt.sign({ _id: (datos[0]) }, 'secretkey', {
               expiresIn: "1d" // it will be expired after 10 hours
               //expiresIn: "20d" // it will be expired after 20 days
              //expiresIn: 120 // it will be expired after 120ms
        });
          //aqui el token puede tener mas opciones, como su tiempo de vida, cosa que tengo que modificar, para que calze con la hora de inicio y de termino de un espectaculo
          return res.json({ token,data })
     }else{
          return res.status(401).send("correo o contraseña incorrecta") 
     }
}



public async getInfoSeccionesHome(req: Request, res: Response) {
     // const seccion = pool.query('SELECT * FROM `seccion`');
     // console.log('seccion '+seccion);
     let sqlResult:any = {};
     // res.json(seccion);
     sqlResult['seccion'] = await pool.query('SELECT * FROM `seccion`');
     sqlResult['expositores'] = await pool.query('SELECT * FROM `expositores` where ubicadoEnHome = 1');
     sqlResult['colaboradores'] = await pool.query('SELECT * FROM `colaboradores`');
     sqlResult['footer'] = await pool.query('SELECT * FROM `footer`');
     sqlResult['publicidad'] = await pool.query('SELECT * FROM `publicidad`');
     console.log(sqlResult)
     res.json(sqlResult); 
}


public async getInfoPanelAdministrador(req: Request, res: Response) {
    
     let sqlResult:any = {};
   
     sqlResult['expositores'] = await pool.query('SELECT * FROM `expositores` where visible = 1');
     
     sqlResult['seccion'] = await pool.query('SELECT * FROM `seccion`');
     sqlResult['quienesSomos'] = await pool.query('SELECT * FROM `quienesSomos`');
     sqlResult['colaboradores'] = await pool.query('SELECT * FROM `colaboradores` where visible = 1');
     sqlResult['publicidad'] = await pool.query('SELECT * FROM `publicidad` where visible = 1');
     sqlResult['noticias'] = await pool.query('SELECT * FROM `noticias` where visible = 1');
     
     console.log(sqlResult)
     sqlResult['footer'] = await pool.query('SELECT * FROM `footer`');
     sqlResult['usuarios'] = await pool.query('SELECT * FROM `usuarios` where tipoUsuario = 1 and visible = 1');
     console.log(sqlResult)
     res.json(sqlResult); 
} 


public async getNoticias(req: Request, res: Response) {
     console.log('entro en noticias')
     const data = await pool.query('SELECT * FROM `noticias`');
     console.log(data) 
     res.json(data); 
}


public async getInfoFooter(req: Request, res: Response) {
     console.log('entro en footer')
     const data = await pool.query('SELECT * FROM `footer`');
     console.log(data) 
     res.json(data); 
}


public async getInfoNavbar(req: Request, res: Response) {
     console.log('entro en navbar')
     console.log('entro en navbar')
     console.log('entro en navbar')
     console.log('entro en navbar')
     console.log('entro en navbar')
     console.log('entro en navbar')
     console.log('entro en navbar')
     console.log('entro en navbar')
     const data = await pool.query('SELECT seccionNoticiasVisible FROM `seccion`');
     console.log(data) 
     res.json(data); 
}


public async getInfoServicos(req: Request, res: Response) {
     
     const data = await pool.query('SELECT * FROM `servicios`');
     console.log(data) 
     res.json(data); 
}


public async eliminarExpositor(req: any, res: any): Promise<void> {
     const { idExpositor } = req.body;
     console.log(idExpositor)
     
     const datos = await pool.query('UPDATE `expositores` SET visible = 0  WHERE idExpositor =\'' + idExpositor + '\' ');
     
     res.json({text:"expositor eliminado con exito"});
}

public async eliminarColaborador(req: any, res: any): Promise<void> {
     const { idColaborador } = req.body;
     console.log(idColaborador)

     const datos = await pool.query('UPDATE `colaboradores` SET visible = 0  WHERE idColaborador =\'' + idColaborador + '\' ');
     
     res.json({text:"Colaborador eliminado con exito"});
      
    
}

public async eliminarPublicidad(req: any, res: any): Promise<void> {
     const { idPublicidad } = req.body;
     console.log(idPublicidad)
     
     const datos = await pool.query('UPDATE `publicidad` SET visible = 0  WHERE idPublicidad =\'' + idPublicidad + '\' ');
     
     res.json({text:"Publicidad eliminado con exito"});
      
    
}


public async eliminarNoticia(req: any, res: any): Promise<void> {
     const { idNoticia } = req.body;
     console.log(idNoticia)
     const datos = await pool.query('UPDATE `noticias` SET visible = 0  WHERE idNoticia =\'' + idNoticia + '\' ');
     res.json({text:"Noticia eliminado con exito"});
}


public async eliminarUsuario(req: any, res: any): Promise<void> {
     const { idUsuarios } = req.body;
     console.log(idUsuarios)
     const datos = await pool.query('UPDATE `usuarios` SET visible = 0  WHERE idUsuarios =\'' + idUsuarios + '\' ');
     res.json({text:"Usuario eliminado con exito"});
}

public actualizarBanner(req: any, res: any) {
     pool.query('UPDATE `seccion` SET ?', [req.body]);
     res.json({text:"banner actualizado"});
}


public actualizarParrafoColaboradores(req: any, res: any) {
     pool.query('UPDATE `seccion` SET ?', [req.body]);
     res.json({text:"parrafo colaboradores actualizado"});
}

public actualizarQuienesSomos(req: any, res: any) {
     console.log(req.body)
     pool.query('UPDATE `quienesSomos` SET ? where idQuienesSomos= 1', [req.body]);
     res.json({text:"quienes somos actualizado"});
}


public actualizarNovios(req: any, res: any) {
     pool.query('UPDATE `seccion` SET ?', [req.body]);
     res.json({text:"novios actualizado"});
}

public actualizarComunionesyBautizos(req: any, res: any) {
     pool.query('UPDATE `seccion` SET ?', [req.body]);
     res.json({text:"Comuniones y bautizos actualizado"});
}

public actualizarOtrosEventos(req: any, res: any) {
     pool.query('UPDATE `seccion` SET ?', [req.body]);
     res.json({text:"Otros eventos actualizado"});
}


public actualizarFooter(req: any, res: any) {
     pool.query('UPDATE `footer` SET ?', [req.body]);
     res.json({text:"footer actualizado"});
}

public async getExpositores(req: Request, res: Response) {
     
     const data = await pool.query('SELECT * FROM `expositores`');
     res.json(data);
}


public async getDetalleExpositor(req: Request, res: Response) {
     console.log('id= '+req.params.id);
     var id= req.params.id
     const data = await pool.query('SELECT * FROM `expositores` where idExpositor = '+id+'');
     console.log(data)
     res.json(data);
}


public async getInfoQuienesSomos(req: Request, res: Response) {
     
     const data = await pool.query('SELECT * FROM `quienesSomos`');
     res.json(data);
}

public agregarExpositor(req: any, res: any) {
     pool.query('INSERT INTO `expositores` SET ?', [req.body]);
     res.json({text:"expositor agregada"});
}

public agregarColaborador(req: any, res: any) {
     pool.query('INSERT INTO `colaboradores` SET ?', [req.body]);
     res.json({text:"colaborador agregada"});
}

public agregarPublicidad(req: any, res: any) {
     pool.query('INSERT INTO `publicidad` SET ?', [req.body]);
     res.json({text:"publicidad agregada"});
}

public agregarNoticia(req: any, res: any) {
     pool.query('INSERT INTO `noticias` SET ?', [req.body]);
     res.json({text:"noticia agregada"});
} 


public agregarUsuario(req: any, res: any) {
     pool.query('INSERT INTO `usuarios` SET ?', [req.body]);
     res.json({text:"usuario agregado"});
} 


public async actualizarExpositoresEnBannner(req: any, res: any) {
     console.log('actualizar banners en controller')
     console.log(req.body)
    const data= await pool.query('UPDATE `expositores` SET  ubicadoEnHome = 0');
    
     for (let index = 0; index < req.body.length; index++) {
          console.log('elemento '+req.body[index].idExpositor)
          pool.query('UPDATE `expositores` SET ubicadoEnHome = 1 where idExpositor = '+req.body[index].idExpositor+'');
     }
     res.json({text:"expositores home  editados"}); 
}


public editarExpositor(req: any, res: any) {
     console.log(req.body.idExpositor)
     pool.query('UPDATE `expositores` SET ? where idExpositor = '+req.body.idExpositor+'', [req.body]);
     res.json({text:"expositor editado"}); 
}

public editarColaborador(req: any, res: any) {
     pool.query('UPDATE `colaboradores` SET ? where idColaborador = '+req.body.idColaborador+'', [req.body]);
     res.json({text:"colaborador editado"});
}

public editarPublicidad(req: any, res: any) {
     pool.query('UPDATE `publicidad` SET ? where idPublicidad = '+req.body.idPublicidad+'', [req.body]);
     res.json({text:"publicidad editado"});
}

public editarNoticia(req: any, res: any) {
     pool.query('UPDATE `noticias` SET ? where idNoticias = '+req.body.idNoticias+'', [req.body]);
     res.json({text:"noticia editado"});
} 




public sendFormularioOtros(req: Request, res: Response) {
     var contentHTML: any;
     
     const { nombre, celular,correo, mensaje } = req.body;
     console.log('correo enviado a admin con la info')
     
     contentHTML=`<!doctype html>
               <html lang="en">
               <head>
                 <meta charset="utf-8">
                 <title>Bodas Plasencia</title>
                 <base href="/">
                 <meta name="viewport" content="width=device-width, initial-scale=1">
                 <link rel="icon" type="image/x-icon" href="assets/FAVICON.png">
                 <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">
                 <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
                 <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossorigin="anonymous"></script>
                 <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js" integrity="sha384-B4gt1jrGC7Jh4AgTPSdUtOBvfO8shuf57BaghqFfPlYxofvL8/KUEfYiJOMMV+rV" crossorigin="anonymous"></script>
               
                 <style>
                   .fondo
               {
               background: no-repeat top center fixed;
               -webkit-background-size: cover;
               -moz-background-size: cover;
               -o-background-size: cover;
               background-size: cover;
               min-height: 100vh;
               overflow-x: hidden;
               overflow-y: hidden;
               z-index: 0 !important;
               } 
               
               @media only screen and (min-width:401px) {
          
          .size-p-titulo {
              font-size: 26px !important;
          }

          .size-p {
              font-size: 22px !important;
          }

          .margen-boton {
              margin-top: 50px;
          }

          .alinear-boton {
              text-align: center;
          }

          .width-boton{
              width: 40%;
          }


      }

      @media only screen and (min-width:0px) and (max-width: 400px) {

          .size-p-titulo {
              font-size: 23px !important;
          }

          .size-p {
              font-size: 20px !important;
          }

          .margen-boton {
              margin-top: 50px;
          }

          .alinear-boton {
              text-align: center;
          }

          .width-boton{
              width: 70%;
          }


      }
               </style>
               
               </head>
               
               <body>
                   <div class="fondo p-5" style="color:rgb(134, 134, 134);font-size: 2vw;text-align: justify;padding: 30px;">
               
                    <div class="row mb-4">
                        <div class="col-12 col-md-12 col-lg-12">
                            <img width="100%" height="auto" src="http://nodosoftware.com/images/img2.jpg"
                                alt="">
                            
                        </div>
            
                    </div>
                       <div class="row">
                           <div class="col-12 col-lg-12 mb-4">
                               <p class="size-p-titulo" style="text-align: center;">Atención, solicitan información por Otros eventos
                               </p> 
                           </div>
                           <div class="col-12 col-lg-10">
                               <span class="size-p">
                                   A continuación, se presenta la información ingresada por parte del usuario.
                                   </span>
                           </div>
                   
                       </div>
                       
                       <div class="row mt-4">
                           <div class="col-12 col-lg-7">
                               <span class="size-p">
                                   <ul>
                                       <li>Nombre: `+nombre+`</li>
                                       <li>Celular: `+celular+`</li>
                                       <li>Correo: `+correo+`</li>
                                       <li>Mensaje: `+mensaje+`</li>
                                   </ul>
                                   </span>
                           </div>
                       </div>
                       
               </body>
                
               </html>`

     console.log(contentHTML)
     console.log('antes del transporter')
     let transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          requireTLS: true,
          auth: {
               user: 'productochileoficial@gmail.com',
               pass: 'p@123!..!'
          }
     });





console.log('antes del mail option')
console.log('correo= '+correo)

     let mailOptions = {
          from: 'productochileoficial@gmail.com',
          to: 'samuel.gajardo@sansano.usm.cl', 
          subject: 'Contacto Bodas Plasencia de '+correo,
          html: contentHTML
     };

console.log('antes de send email de admin')
     transporter.sendMail(mailOptions, (error: any, info: any) => {
          if (error) {
               console.log('hubo un error al enviar')
               res.json({ error: error })
          }
          console.log('paso a enviar el correo al usuario')
          contentHTML = `
          <!doctype html>
               <html lang="en">
               <head>
                 <meta charset="utf-8">
                 <title>Bodas Plasencia</title>
                 <base href="/">
                 <meta name="viewport" content="width=device-width, initial-scale=1">
                 <link rel="icon" type="image/x-icon" href="assets/FAVICON.png">
                 <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">
                 <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
                 <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossorigin="anonymous"></script>
                 <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js" integrity="sha384-B4gt1jrGC7Jh4AgTPSdUtOBvfO8shuf57BaghqFfPlYxofvL8/KUEfYiJOMMV+rV" crossorigin="anonymous"></script>
               
                 <style>
                   .fondo
               {
               background: no-repeat top center fixed;
               -webkit-background-size: cover;
               -moz-background-size: cover;
               -o-background-size: cover;
               background-size: cover;
               min-height: 100vh;
               overflow-x: hidden;
               overflow-y: hidden;
               z-index: 0 !important;
               } 
               
               @media only screen and (min-width:401px) {
          
          .size-p-titulo {
              font-size: 26px !important;
          }

          .size-p {
              font-size: 22px !important;
          }

          .margen-boton {
              margin-top: 50px;
          }

          .alinear-boton {
              text-align: center;
          }

          .width-boton{
              width: 40%;
          }


      }

      @media only screen and (min-width:0px) and (max-width: 400px) {

          .size-p-titulo {
              font-size: 23px !important;
          }

          .size-p {
              font-size: 20px !important;
          }

          .margen-boton {
              margin-top: 50px;
          }

          .alinear-boton {
              text-align: center;
          }

          .width-boton{
              width: 70%;
          }


      }
               </style>
               
               </head>
               
               <body>
                   <div class="fondo p-5" style="color:rgb(134, 134, 134);font-size: 2vw;text-align: justify;padding: 30px;">
               
                    <div class="row mb-4">
                        <div class="col-12 col-md-12 col-lg-12">
                            <img width="100%" height="auto" src="http://nodosoftware.com/images/img1.jpg"
                                alt="">
                        </div>
            
                    </div>
                       <div class="row">
                           <div class="col-12 col-lg-12 mb-4">
                               <p class="size-p-titulo" style="text-align: center;">Gracias por solicitar información de nuestros eventos.
                               </p> 
                           </div>
                           <div class="col-12 col-lg-10">
                               <span class="size-p">
                                   Nuestro equipo revisara tu solicitud y se pondra en contacto contigo en las siguientes 72 horas.
                                   </span>
                           </div>
                           <div class="col-12 col-lg-10" style="text-align: right;margin-top: 30px;">
                            <span class="size-p" style="text-align: right;">
                                El equipo de Bodas Plasencia.
                                </span>
                        </div>
                   
                       </div>
                       
                     
                       
               </body>
                
               </html>`
console.log('antes del transporter de usuario');
          let transporter = nodemailer.createTransport({
               host: 'smtp.gmail.com',
               port: 587,
               secure: false,
               requireTLS: true,
               auth: {
                    user: 'productochileoficial@gmail.com',
                    pass: 'p@123!..!'
               }
          });
     
          let mailOptions = {
               from: 'productochileoficial@gmail.com',
               to: correo,
               subject: 'Bodas Plasencia',
               html: contentHTML
          };
     console.log('antes de send usuario')
          transporter.sendMail(mailOptions, (error: any, info: any) => {
               if (error) {
                    console.log('hubo un error en usuario')
                    res.json({ error: error }) 
               }
               res.json({ text: 'enviado correctamente' })
               
          });


     });
}



public sendFormularioNovios(req: Request, res: Response) {
     var contentHTML: any;
    
     const { nombreNovio1, apellidoNovio1,fechaNacimientoNovio1, nombreNovio2,apellidoNovio2,fechaNacimientoNovio2,fechaBoda,numeroInvitados,correo,telefono,direccion,codigoPostal,poblacion,provincia,servicios } = req.body;
     console.log('servicios');
     console.log(servicios)
var listServicios='';
     for (let index = 0; index < servicios.length; index++) {
         
          if(servicios[index].descripcionServicio!=null && servicios[index].descripcionServicio!=false){
               listServicios=listServicios+'<li>Servicio solicitado: '+servicios[index].nombreServicio+'</li>'
          }
         
     }

     console.log('lista')
     console.log(listServicios);

    

     console.log('correo novios enviado a admin con la info')
     
     contentHTML=`<!doctype html>
     <html lang="en">
     <head>
       <meta charset="utf-8">
       <title>Bodas Plasencia</title>
       <base href="/">
       <meta name="viewport" content="width=device-width, initial-scale=1">
       <link rel="icon" type="image/x-icon" href="assets/FAVICON.png">
       <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">
       <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
       <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossorigin="anonymous"></script>
       <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js" integrity="sha384-B4gt1jrGC7Jh4AgTPSdUtOBvfO8shuf57BaghqFfPlYxofvL8/KUEfYiJOMMV+rV" crossorigin="anonymous"></script>
     
       <style>
         .fondo
     {
     background: no-repeat top center fixed;
     -webkit-background-size: cover;
     -moz-background-size: cover;
     -o-background-size: cover;
     background-size: cover;
     min-height: 100vh;
     overflow-x: hidden;
     overflow-y: hidden;
     z-index: 0 !important;
     } 
     
     @media only screen and (min-width:401px) {

.size-p-titulo {
    font-size: 26px !important;
}

.size-p {
    font-size: 22px !important;
}

.margen-boton {
    margin-top: 50px;
}

.alinear-boton {
    text-align: center;
}

.width-boton{
    width: 40%;
}


}

@media only screen and (min-width:0px) and (max-width: 400px) {

.size-p-titulo {
    font-size: 23px !important;
}

.size-p {
    font-size: 20px !important;
}

.margen-boton {
    margin-top: 50px;
}

.alinear-boton {
    text-align: center;
}

.width-boton{
    width: 70%;
}


}
     </style>
     
     </head>
     
     <body>
         <div class="fondo p-5" style="color:rgb(134, 134, 134);font-size: 2vw;text-align: justify;padding: 30px;">
     
          <div class="row mb-4">
              <div class="col-12 col-md-12 col-lg-12">
                  <img width="100%" height="auto" src="http://nodosoftware.com/images/img2.jpg"
                      alt="">
              </div>
  
          </div>
             <div class="row">
                 <div class="col-12 col-lg-12 mb-4">
                     <p class="size-p-titulo" style="text-align: center;">Atención, solicitan información por Boda
                     </p> 
                 </div>
                 <div class="col-12 col-lg-10">
                     <span class="size-p">
                         A continuación, se presenta la información ingresada por parte del usuario.
                         </span>
                 </div>
         
             </div>
             
             <div class="row mt-4">
                 <div class="col-12 col-lg-7">
                     <span class="size-p">
                         <ul>
                             <li>Nombre del novio/a: `+nombreNovio1+`</li>
                             <li>Apellido del novio/a: `+apellidoNovio1+`</li>
                             <li>Fecha nacimiento novio/a: `+fechaNacimientoNovio1+`</li>
                             <li>Nombre de la novio/a: `+nombreNovio2+`</li>
                             <li>Apellido de la novio/a: `+apellidoNovio2+`</li>
                             <li>Fecha nacimiento novio/a: `+fechaNacimientoNovio2+`</li>
                             <li>Fecha del matrimonio (aproximada): `+fechaBoda+`</li>
                             <li>Número de invitados (aproximado): `+numeroInvitados+`</li>
                             <li>Correo electrónico: `+correo+`</li>
                             <li>Número de telefono: `+telefono+`</li>
                             <li>Dirección : `+direccion+`</li>
                             <li>Codigo postal : `+codigoPostal+`</li>
                             <li>Población: `+poblacion+`</li>
                             <li>Provincia: `+provincia+`</li>
                             `+listServicios+`
                         </ul>
                         </span>
                 </div>
             </div>
             
     </body>
      
     </html>`


     console.log(contentHTML)



     console.log('antes del transporter')
     let transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          requireTLS: true,
          auth: {
               user: 'productochileoficial@gmail.com',
               pass: 'p@123!..!'
          }
     });





console.log('antes del mail option')
console.log('correo= '+correo)

     let mailOptions = {
          from: 'productochileoficial@gmail.com',
          to: 'samuel.gajardo@sansano.usm.cl', 
          subject: 'Contacto Bodas Plasencia de '+correo,
          html: contentHTML
     };

console.log('antes de send email de admin')
     transporter.sendMail(mailOptions, (error: any, info: any) => {
          if (error) {
               console.log('hubo un error al enviar')
               res.json({ error: error })
          }
          console.log('paso a enviar el correo al usuario')
          contentHTML = `<!doctype html>
          <html lang="en">
          <head>
            <meta charset="utf-8">
            <title>Bodas Plasencia</title>
            <base href="/">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link rel="icon" type="image/x-icon" href="assets/FAVICON.png">
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">
            <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
            <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossorigin="anonymous"></script>
            <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js" integrity="sha384-B4gt1jrGC7Jh4AgTPSdUtOBvfO8shuf57BaghqFfPlYxofvL8/KUEfYiJOMMV+rV" crossorigin="anonymous"></script>
          
            <style>
              .fondo
          {
          background: no-repeat top center fixed;
          -webkit-background-size: cover;
          -moz-background-size: cover;
          -o-background-size: cover;
          background-size: cover;
          min-height: 100vh;
          overflow-x: hidden;
          overflow-y: hidden;
          z-index: 0 !important;
          } 
          
          @media only screen and (min-width:401px) {
     
     .size-p-titulo {
         font-size: 26px !important;
     }

     .size-p {
         font-size: 22px !important;
     }

     .margen-boton {
         margin-top: 50px;
     }

     .alinear-boton {
         text-align: center;
     }

     .width-boton{
         width: 40%;
     }


 }

 @media only screen and (min-width:0px) and (max-width: 400px) {

     .size-p-titulo {
         font-size: 23px !important;
     }

     .size-p {
         font-size: 20px !important;
     }

     .margen-boton {
         margin-top: 50px;
     }

     .alinear-boton {
         text-align: center;
     }

     .width-boton{
         width: 70%;
     }


 }
          </style>
          
          </head>
          
          <body>
              <div class="fondo p-5" style="color:rgb(134, 134, 134);font-size: 2vw;text-align: justify;padding: 30px;">
          
               <div class="row mb-4">
                   <div class="col-12 col-md-12 col-lg-12">
                       <img width="100%" height="auto" src="http://nodosoftware.com/images/img1.jpg"
                           alt="">
                   </div>
       
               </div>
                  <div class="row">
                      <div class="col-12 col-lg-12 mb-4">
                          <p class="size-p-titulo" style="text-align: center;">Gracias por solicitar información sobre la organización de bodas.
                          </p> 
                      </div>
                      <div class="col-12 col-lg-10">
                          <span class="size-p">
                              Nuestro equipo revisara tu solicitud y se pondra en contacto contigo en las siguientes 72 horas.
                              </span>
                      </div>
                      <div class="col-12 col-lg-10" style="text-align: right;margin-top: 30px;">
                       <span class="size-p" style="text-align: right;">
                           El equipo de Bodas Plasencia.
                           </span>
                   </div>
              
                  </div>
                  
                
                  
          </body>
           
          </html>`
console.log('antes del transporter de usuario');
          let transporter = nodemailer.createTransport({
               host: 'smtp.gmail.com',
               port: 587,
               secure: false,
               requireTLS: true,
               auth: {
                    user: 'productochileoficial@gmail.com',
                    pass: 'p@123!..!'
               }
          });
     
          let mailOptions = {
               from: 'productochileoficial@gmail.com',
               to: correo,
               subject: 'Bodas Plasencia',
               html: contentHTML
          };
     console.log('antes de send usuario')
          transporter.sendMail(mailOptions, (error: any, info: any) => {
               if (error) {
                    console.log('hubo un error en usuario')
                    res.json({ error: error }) 
               }
               res.json({ text: 'enviado correctamente' })
               
          });


     });
}


public sendFormularioExpositor(req: Request, res: Response) {
     var contentHTML: any;
     

     const {nombreEmpresa,
          sectorComercialProfesional,
          nifoDni,
          paginaWeb,
          facebook,
          twitter,
          instagram,
          youtube,
          correo,
          direccion,
          poblacion,
          codigoPostal,
          pais,
          nombrePersonaContacto,
          apellidoPersonaContacto,
          telefonoEmpresa,
          telefonoContacto} = req.body;
     console.log('correo expositor enviado a admin con la info')
     
     contentHTML=`<!doctype html>
     <html lang="en">
     <head>
       <meta charset="utf-8">
       <title>Bodas Plasencia</title>
       <base href="/">
       <meta name="viewport" content="width=device-width, initial-scale=1">
       <link rel="icon" type="image/x-icon" href="assets/FAVICON.png">
       <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">
       <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
       <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossorigin="anonymous"></script>
       <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js" integrity="sha384-B4gt1jrGC7Jh4AgTPSdUtOBvfO8shuf57BaghqFfPlYxofvL8/KUEfYiJOMMV+rV" crossorigin="anonymous"></script>
     
       <style>
         .fondo
     {
     background: no-repeat top center fixed;
     -webkit-background-size: cover;
     -moz-background-size: cover;
     -o-background-size: cover;
     background-size: cover;
     min-height: 100vh;
     overflow-x: hidden;
     overflow-y: hidden;
     z-index: 0 !important;
     } 
     
     @media only screen and (min-width:401px) {

.size-p-titulo {
    font-size: 26px !important;
}

.size-p {
    font-size: 22px !important;
}

.margen-boton {
    margin-top: 50px;
}

.alinear-boton {
    text-align: center;
}

.width-boton{
    width: 40%;
}


}

@media only screen and (min-width:0px) and (max-width: 400px) {

.size-p-titulo {
    font-size: 23px !important;
}

.size-p {
    font-size: 20px !important;
}

.margen-boton {
    margin-top: 50px;
}

.alinear-boton {
    text-align: center;
}

.width-boton{
    width: 70%;
}


}
     </style>
     
     </head>
     
     <body>
         <div class="fondo p-5" style="color:rgb(134, 134, 134);font-size: 2vw;text-align: justify;padding: 30px;">
     
          <div class="row mb-4">
              <div class="col-12 col-md-12 col-lg-12">
                  <img width="100%" height="auto" src="http://nodosoftware.com/images/img2.jpg"
                      alt="">
              </div>
  
          </div>
             <div class="row">
                 <div class="col-12 col-lg-12 mb-4">
                     <p class="size-p-titulo" style="text-align: center;">Atención, solicitan información por registro de expositor
                     </p> 
                 </div>
                 <div class="col-12 col-lg-10">
                     <span class="size-p">
                         A continuación, se presenta la información ingresada por parte del usuario.
                         </span>
                 </div>
         
             </div>
             
             <div class="row mt-4">
                 <div class="col-12 col-lg-7">
                     <span class="size-p">
                         <ul>
                             <li>Nombre de empresa: `+nombreEmpresa+`</li>
                             <li>Sector comercial o profesional: `+sectorComercialProfesional+`</li>
                             <li>Página web: `+paginaWeb+`</li>
                             <li>Facebook : `+facebook+`</li>
                             <li>Twitter : `+twitter+`</li>
                             <li>Instagram: `+instagram+`</li>
                             <li>Youtube: `+youtube+`</li>
                             <li>NIF o DNI de la empresa: `+nifoDni+`</li>
                             <li>Correo electrónico: `+correo+`</li>
                             <li>Dirección: `+direccion+`</li>
                             <li>Población: `+poblacion+`</li>
                             <li>Código Postal: `+codigoPostal+`</li>
                             <li>País: `+pais+`</li>
                             <li>Nombre persona de contacto: `+nombrePersonaContacto+`</li>
                             <li>Apellido persona de contacto: `+apellidoPersonaContacto+`</li>
                             <li>Teléfono de la empresa: `+telefonoEmpresa+`</li>
                             <li>Teléfono móvil de contacto: `+telefonoContacto+`</li>
                         </ul>
                         </span>
                 </div>
             </div>
             
     </body>
      
     </html>`


     console.log(contentHTML)
     console.log('antes del transporter')
     let transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          requireTLS: true,
          auth: {
               user: 'productochileoficial@gmail.com',
               pass: 'p@123!..!'
          }
     });





console.log('antes del mail option')
console.log('correo= '+correo)

     let mailOptions = {
          from: 'productochileoficial@gmail.com',
          to: 'samuel.gajardo@sansano.usm.cl', 
          subject: 'Contacto Bodas Plasencia de '+correo,
          html: contentHTML
     };

console.log('antes de send email de admin')
     transporter.sendMail(mailOptions, (error: any, info: any) => {
          if (error) {
               console.log('hubo un error al enviar')
               res.json({ error: error })
          }
          console.log('paso a enviar el correo al usuario')
          contentHTML = `<!doctype html>
          <html lang="en">
          <head>
            <meta charset="utf-8">
            <title>Bodas Plasencia</title>
            <base href="/">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link rel="icon" type="image/x-icon" href="assets/FAVICON.png">
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">
            <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
            <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossorigin="anonymous"></script>
            <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js" integrity="sha384-B4gt1jrGC7Jh4AgTPSdUtOBvfO8shuf57BaghqFfPlYxofvL8/KUEfYiJOMMV+rV" crossorigin="anonymous"></script>
          
            <style>
              .fondo
          {
          background: no-repeat top center fixed;
          -webkit-background-size: cover;
          -moz-background-size: cover;
          -o-background-size: cover;
          background-size: cover;
          min-height: 100vh;
          overflow-x: hidden;
          overflow-y: hidden;
          z-index: 0 !important;
          } 
          
          @media only screen and (min-width:401px) {
     
     .size-p-titulo {
         font-size: 26px !important;
     }

     .size-p {
         font-size: 22px !important;
     }

     .margen-boton {
         margin-top: 50px;
     }

     .alinear-boton {
         text-align: center;
     }

     .width-boton{
         width: 40%;
     }


 }

 @media only screen and (min-width:0px) and (max-width: 400px) {

     .size-p-titulo {
         font-size: 23px !important;
     }

     .size-p {
         font-size: 20px !important;
     }

     .margen-boton {
         margin-top: 50px;
     }

     .alinear-boton {
         text-align: center;
     }

     .width-boton{
         width: 70%;
     }


 }
          </style>
          
          </head>
          
          <body>
              <div class="fondo p-5" style="color:rgb(134, 134, 134);font-size: 2vw;text-align: justify;padding: 30px;">
          
               <div class="row mb-4">
                   <div class="col-12 col-md-12 col-lg-12">
                       <img width="100%" height="auto" src="http://nodosoftware.com/images/img1.jpg"
                           alt="">
                   </div>
       
               </div>
                  <div class="row">
                      <div class="col-12 col-lg-12 mb-4">
                          <p class="size-p-titulo" style="text-align: center;">Gracias por solicitar registrarte como expositor en Bodas Plasencia.
                          </p> 
                      </div>
                      <div class="col-12 col-lg-10">
                          <span class="size-p">
                              Nuestro equipo revisara tu solicitud y se pondra en contacto contigo en las siguientes 72 horas.
                              </span>
                      </div>
                      <div class="col-12 col-lg-10" style="text-align: right;margin-top: 30px;">
                       <span class="size-p" style="text-align: right;">
                           El equipo de Bodas Plasencia.
                           </span>
                   </div>
              
                  </div>
                  
                
                  
          </body>
           
          </html>`
console.log('antes del transporter de usuario');
          let transporter = nodemailer.createTransport({
               host: 'smtp.gmail.com',
               port: 587,
               secure: false,
               requireTLS: true,
               auth: {
                    user: 'productochileoficial@gmail.com',
                    pass: 'p@123!..!'
               }
          });
     
          let mailOptions = {
               from: 'productochileoficial@gmail.com',
               to: correo,
               subject: 'Bodas Plasencia',
               html: contentHTML 
          };
     console.log('antes de send usuario')
          transporter.sendMail(mailOptions, (error: any, info: any) => {
               if (error) {
                    console.log('hubo un error en usuario')
                    res.json({ error: error }) 
               }
               res.json({ text: 'enviado correctamente' })
               
          });


     });
}





public async getInfoEmpresas(req: Request, res: Response) {
     const data = await pool.query('SELECT * FROM `Empresa` WHERE activo = 1');
     res.json(data);
}

public async getInfoLinks(req: Request, res: Response) {
     const data = await pool.query('SELECT * FROM `Link` WHERE activo = 1');
     res.json(data);
}


public async eliminarEmpresa(req: any, res: any): Promise<void> {
     const { idEmpresa,nombreEmpresa } = req.body;
     console.log(idEmpresa)
     console.log(nombreEmpresa) 
  
       

     const datos = await pool.query('UPDATE `Empresa` SET activo = 0  WHERE idEmpresa =\'' + idEmpresa + '\' ');
     const data = await pool.query('UPDATE `Link` SET activo = 0  WHERE idEmpresa =\'' + idEmpresa + '\' ');
     res.json(datos);
      
    
}


public eliminarLink(req: any, res: any) {
     const { idLink,link } = req.body;
     console.log(idLink)
     console.log(link) 
  
   
     pool.query('UPDATE `Link` SET activo = 0  WHERE idLink =\'' + idLink + '\' '); 
     res.json({text:"eliminado con exito"});
      
    
}

public crearEmpresa(req: any, res: any) {
     pool.query('INSERT INTO `Empresa` SET ?', [req.body]);
     res.json({text:"Empresa agregada"});
}

public crearLink(req: any, res: any) {
     pool.query('INSERT INTO `Link` SET ?', [req.body]);
     res.json({text:"Link agregada"}); 
}


     public async listBanner(req: Request, res: Response) {
          const data = await pool.query('');
          res.json(data);
     }
     public async listSalas(req: Request, res: Response) {
          const data = await pool.query('');
          res.json(data);
     }
     public async listHorarios(req: Request, res: Response) {
          const data = await pool.query('');
          res.json(data);
     }
          

     
     public guardarCompraEvento(req: Request, res: Response) {
          console.log('ingreso en guardar compra de evento en rest api')
          console.log(req);
          console.log(req.body);
          res.json({text:"entro"})
     }

     

     public async signinUsuario(req: any, res: any): Promise<void> {
          console.log('signinUsuario en server')
          const { run, password } = req.body;
          console.log(run)
          console.log(password)
         
          var Productor = {
               idProductor: '',
               admin:''
          }
 
          const productor = await pool.query('SELECT idProductor,admin FROM `productor` WHERE runProductor=\'' + run + '\' AND claveProductor=\'' + password + '\'')
          console.log('productor= '+productor)
          if (productor.length > 0) {
               Productor = productor[0]
               console.log('id= '+Productor.idProductor)
               console.log('admin?= '+Productor.admin)
               const user = jwt.sign({ _id: Productor.idProductor }, 'secretkey')
               return res.status(200).json({ Productor, user })
          } else {
               console.log('datos no coinciden')
               return res.status(401).send("run o password incorrecta")
          }
     }

     public sendEmailContact(req: Request, res: Response) {
          var contentHTML: any;
          const { nombre, email,celular, mensaje } = req.body;
          contentHTML = `
          Mensaje de contacto de cultura para todos
          Nombre: ${nombre}
          Email: ${email}
          Celular: ${celular}
          Mensaje: ${mensaje}
         `
          console.log(contentHTML)

          let transporter = nodemailer.createTransport({
               host: 'smtp.gmail.com',
               port: 587,
               secure: false,
               requireTLS: true,
               auth: {
                    user: 'productochileoficial@gmail.com',
                    pass: 'p@123!..!'
               }
          });

          let mailOptions = {
               from: 'productochileoficial@gmail.com',
               to: 'contacto@culturaparatodos.cl',
               subject: 'Contacto modal CPT de ' + nombre, //este mensaje debe ir cambiando, asi no quedan todos juntos 
               text: contentHTML
          };

          transporter.sendMail(mailOptions, (error: any, info: any) => {
               if (error) {
                    res.json({ error: error })
               }
               res.json({ text: 'enviado correctamente' })
          });
     }

     public async getInfoEspectaculos(req: Request, res: Response) {
          
          

          console.log('getInfoEspectaculos en server')
          const data = await pool.query('SELECT e.idEspectaculo as numeroEspectaculo,e.urlClipVideo, e.nombreEspectaculo as nombre,e.descripcionEspectaculo as descripcionCompleta,e.desdeHorario as horaInicio,e.hastaHorario as horaTermino,e.fechaEspectaculo as fecha,e.descripcionResumida,e.valor as precio,e.valorUSD as precioUSD,e.rutaImagenBanner as rutaBanner,e.rutaImagenAfiche as rutaAfiche,t.nombreTipo as tipoEspectaculo,p.nombreProductor as productor,a.nombreArtistas as artista FROM `espectaculo` e INNER JOIN `tipoespectaculo` t ON e.tipoEspectaculo_idTipoEspectaculo = t.idTipoEspectaculo INNER JOIN `productor` p ON e.productor_idProductor = p.idProductor INNER JOIN `artistas` a ON e.artistas_idArtistas = a.idArtistas WHERE e.visible = 1 order by e.idEspectaculo DESC');
          if (data.length > 0) {
               return res.json(data);
          }else{
               //return res.status(404).json({ text: "no retorna nada" });
               return res.json(data);
          }
          
     } 



     public async getVideoPrueba(req: Request, res: Response) {
          
           

          console.log('getVideoPrueba en server')
          const data = await pool.query('SELECT linkvideo FROM `pantallaPruebas`');
          if (data.length > 0) {
               return res.json(data);
          }else{
               //return res.status(404).json({ text: "no retorna nada" });
               return res.json(data);
          }
          
     } 






     public async getInfoAdministrador(req: Request, res: Response) {
          //retorna todos los eventos
          console.log('getInfoAdministrador en server')
          const data = await pool.query('SELECT e.rutaImagenAfiche as rutaImagen,e.nombreEspectaculo as nombreEvento,e.fechaEspectaculo as fechaEvento,e.desdeHorario as horaInicioEvento,e.hastaHorario as horaTerminoEvento,e.descripcionEspectaculo as descripcionEvento,e.valor as valorEvento,e.valorUSD as valorEventoUSD,p.nombreProductor as productor,a.nombreArtistas as artista,COALESCE(SUM(t.valorTransaccion),0)as totalVentas,COALESCE(SUM(t.valorTransaccionUSD),0)as totalVentasUSD,COUNT(t.idTransaccion) as cantidadTicketsVendidos FROM `espectaculo` e inner JOIN `productor` p ON e.productor_idProductor = p.idProductor inner JOIN `artistas` a ON e.artistas_idArtistas = a.idArtistas left join `transaccion` t ON e.idEspectaculo = t.espectaculo_idEspectaculo WHERE e.visible = 1 group by e.idEspectaculo'); 
          if (data.length > 0) {
               return res.json(data);
          }else{
               return res.status(401).json({ text: "no existen eventos en db" });
          }
           
     } 

     public async getInfoProductor(req: Request, res: Response) {
          console.log('idProductor= '+req.params.id);
          var idProductor= req.params.id
          //retorna los eventos asociados a este productor
          console.log('getInfoProductor en server')
          const data = await pool.query('SELECT e.rutaImagenAfiche as rutaImagen,e.nombreEspectaculo as nombreEvento,e.fechaEspectaculo as fechaEvento,e.desdeHorario as horaInicioEvento,e.hastaHorario as horaTerminoEvento,e.descripcionEspectaculo as descripcionEvento,e.valor as valorEvento,e.valorUSD as valorEventoUSD,p.nombreProductor as productor,a.nombreArtistas as artista,COALESCE(SUM(t.valorTransaccion),0)as totalVentas,COALESCE(SUM(t.valorTransaccionUSD),0)as totalVentasUSD,COUNT(t.idTransaccion) as cantidadTicketsVendidos FROM `espectaculo` e inner JOIN `productor` p ON e.productor_idProductor = p.idProductor inner JOIN `artistas` a ON e.artistas_idArtistas = a.idArtistas left join `transaccion` t ON e.idEspectaculo = t.espectaculo_idEspectaculo WHERE e.visible = 1 and p.idProductor = '+idProductor+' group by e.idEspectaculo');
          if (data.length > 0) {
               return res.json(data);
          }else{
               return res.status(401).json({ text: "productor no posee eventos" });
          }
          
     } 


}

const appController = new AppController();
export default appController;