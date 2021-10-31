const express=require('express');
const cors=require('cors');
const {Sequelize}=require('./models');

const app=express();
app.use(cors());
app.use(express.json());

const models=require('./models');
let cliente=models.Cliente;
let itemPedido=models.ItemPedido;
let pedido=models.Pedido;
let servico=models.Servico;

app.get('/', function(req,res){
    res.send('Olá mundo!')
});

app.get('/area-clientes', function(req,res){
    res.send('Sejam bem vindo(a) a ServicesTI!');
});

app.get('/area-servicos', function(req,res){
    res.send('Seja bem vindo(a) a área de serviços.');
});

app.get('/area-pedidos', function(req,res){
    res.send('Seja bem vindo(a) a área de serviços.');
});

app.post('/servicos', async(req,res)=>{
    await servico.create(
        req.body
    ).then(function(){
        return res.json({
            error:false,
            message:"Serviço criado com sucesso!"
        });
    }).catch(function(erro){
        return res.status(400).json({
            error:true,
            message:"Foi impossível se conectar."
        });
    });
});

app.post('/clientes', async(req,res)=>{
    await cliente.create(
        req.body
    ).then(function(){
        return res.json({
            error:false,
            message:'O cliente foi cadastrado com sucesso.'
        });
    }).catch(function(erro){
        return res.status(400).json({
            error:true,
            message:'Foi impossível conectar ao servidor.'
        });
    });
});

app.post('/pedidos',async(req,res) => {
    await pedido.create(
        req.body
    ).then(function(){ 
        return res.json({
            error: false,
            message: 'O Pedido foi cadastrado com sucesso!'
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: 'Foi impossivel conectar ao servidor'
        });
    });
});

app.post('/itempedidos',async(req,res) => {
    await itemPedido.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: 'O item foi adicionado ao pedido!'
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: 'Foi impossivel conectar ao servidor'
        });
    });
});

let port=process.env.PORT || 3001;

app.listen(port,(req,res)=>{
    console.log('Servidor ativo: http://localhost:3001');
});