var restify = require('restify');
var builder = require('botbuilder');

// Levantar restify
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// No te preocupes por estas credenciales por ahora, luego las usaremos para conectar los canales.
var connector = new builder.ChatConnector({
    appId: '',
    appPassword: ''
});

// Ahora utilizamos un UniversalBot
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//INICIO DEL DIALOGO
bot.dialog('/', [ //El alcance solo llega a un dialogo
    function (session) {
        session.send('Buenas noches bienvenido a la pizeria fausto');//Preguntamos 
        session.send("![pizeria fausto](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXP6Sd1Yc1bCj5dcIMpsObB_fi1-nK-kc_w-VPQhrJnUFNNVTOJQ)");
        builder.Prompts.text(session, '¿Desea la carta?');
    }, 
        function (session, results) {
        session.dialogData.lugar = results.response;// // Este valor solo recide en este dialogo
        session.endConversation('En un momento le tomo el pedido');// terminamos una conversacion 
        session.beginDialog('/carta');// enlaza la siguiente linea de conversación
         
    },
    
]);

bot.dialog('/carta', [ // inicia la siguinte line de conversación 
    function (session) {
        builder.Prompts.text(session, "![carta](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7nZwqEPclvHjeXiDAde4GQfrm-JWz5YNavwG8h2xBnDtk1Llx)");
        session.send("![minutos despues](http://dynamic.pixton.com/comic/j/p/i/b/jpibsn3culrpyd8t_v2_.png)");  
        session.send('Que desea pedir');
    },
    function (session, results) {
        session.userData.carta = results.response;//almacena la informacion de la conversación
        session.beginDialog('/preguntarporciones');
        
    }
]);

bot.dialog('/preguntarporciones', [
    function (session) {
        session.send("![pizza](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS51XyUX-hatT938tar5QXFp3BipGogNNMiG_Idu3vo0BKgbsmN)");
        builder.Prompts.text(session, '¿cuantas porciones?');
    },
    function (session, results) {
        session.conversationData.porciones = results.response;
        session.beginDialog('/mesero')
        
    }
]);
bot.dialog('/mesero', [
    function (session) {
       builder.Prompts.text(session, 'con mucho gusto');
    },
    function (session, results) {
        session.dialogData.lugar = results.response;// Este valor solo recide en este dialogo
        session.beginDialog('/costo')
        
    }
]);
bot.dialog('/costo', [
    function (session) {
        session.send('$ 15.000');
        builder.Prompts.text(session, '¿algo mas?');
        
    },
    function (session, results) {
        session.userData.gaseosa = results.response;// almacena la información
        session.beginDialog('/algomas')
        
    }
]);
bot.dialog('/algomas', [
    function (session) {
        session.send('con mucho gusto');
        builder.Prompts.text(session, '¿algo mas?');
    },
    function (session, results) {
        session.beginDialog('/confirmar')
        
    }
]);
bot.dialog('/confirmar', [
    function (session) {
        builder.Prompts.text(session,'le confirmo el pedido');
        
    },
    function (session, results) {
        session.dialogData.lugar = results.response;
        session.beginDialog('/confirmar_pedido')
        
    }
]);
bot.dialog('/confirmar_pedido', [// ALMACENAR LA INFORMACION
    function (session) {
        builder.Prompts.text(session,'Su pedido es: ');
        session.send(`Usted solcito ${session.userData.carta} dividida en ${session.conversationData.porciones} porciones `);
        session.send(`ademas de beber solicito ${session.userData.gaseosa}`);
        session.send('¿Es correcto?');
       
    },
    function (session, results) {
        session.dialogData.lugar = results.response;
        session.beginDialog('/pedircuenta')
        
    }
]);
bot.dialog('/pedircuenta', [
    function (session) {
        builder.Prompts.text(session,'con mucho gusto, son $ 18.000');
        
    },
    function (session, results) {
        session.dialogData.lugar = results.response;
        session.beginDialog('/tipotarjeta')
        
    }
]);
bot.dialog('/tipotarjeta', [
    function (session) {
        builder.Prompts.text(session,'¿debito o credito?');
        session.send("![tarjeta](http://1.bp.blogspot.com/-6n_B6xxACcs/TnA9rmKMvcI/AAAAAAAABEs/rjs6zovjww0/s1600/tarjeta-de-debito.gif)");
    },
    function (session, results) {
        session.dialogData.lugar = results.response;
        session.beginDialog('/respuesta')
 
    }
]);
bot.dialog('/respuesta', [
    function (session) {
        builder.Prompts.text(session,'ok, ¿Desea copia del recibo?');
        
    },
    function (session, results) {
        session.dialogData.lugar = results.response;
        session.send("![hasta pronto](http://www.canalgif.net/Gifs-animados/Expresiones/Hasta-luego/Imagen-animada-Hasta-luego-08.gif)");
        //session.send("![hasta pronto](https://www.letslearnspanish.co.uk/wp-content/uploads/2014/04/hasta-pronto-300x169-1.jpg)");
        session.endDialog('estamos para servirle')
        session.cancelDialog('')

        
    }
]);
