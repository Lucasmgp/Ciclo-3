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

let compra= models.Compra;
let produto= models.Produto;
let itemcompra= models.ItemCompra;

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
//consulta todos os serviços
app.get('/listaservicos',async(req,res)=>{
    await servico.findAll({
        raw:true
//        order:[['nome', 'ASC']] //desc=decrescente--asc=ascendente
    }).then(function(servicos){
        res.json({servicos})
    });
});

app.get('/ofertaservicos', async(req,res)=>{
    await servico.count('id').then(function(servicos){ //count=contar itens de acordo com o parâmetro definido
        res.json({servicos});
    });
});

app.get('/servico/:id', async(req,res)=>{
    await servico.findByPk(req.params.id)
    .then(serv=>{
        return res.json({
            error:false,
            serv
        });
    }).catch(function(erro){
        return res.status(400).json({
            error:true,
            message:'Erro: código não encontrado.'
        });
    });
});

app.get('/listaclientes', async(req,res)=>{
    await cliente.findAll({
        raw:true
    }).then(function(cliente){
        res.json({cliente})
    });
});

app.get('/listaclientesant',async(req,res)=>{
    await cliente.findAll({
        order:[['clienteDesde', 'ASC']]
    }).then(function(clientes){
        res.json({clientes})
    });    
});

app.get('/listapedidos',async(req,res)=>{
    await pedido.findAll({
        raw:true
    }).then(function(pedidos){
        res.json({pedidos});
    });
});

app.get('/listapedidosmaiormenor',async(req,res)=>{
    await pedido.findAll({
        order:[['id', 'DESC']]
    }).then(function(pedidos){
        res.json({pedidos});
    });
});

app.get('/contaclientes',async(req,res)=>{
    await cliente.count('id').then(function(clientes){
        res.json({clientes});
    });
});
//alteração e atualização
app.put('/atualizaservico',async(req,res)=>{
    await servico.update(req.body,{
        where:{id:req.body.id}
    }).then(function(){
        return res.json({
            error:false,
            message:'Serviço foi alterado com sucesso.'
        });
    }).catch(function(erro){
        return res.status(400).json({
            error:true,
            message:'Erro na alteração do serviço.'
        });
    });
});

app.get('/pedidos/:id', async(req,res)=>{
    await pedido.findByPk(req.params.id,{include:[{all:true}]})
    .then(ped=>{
        return res.json({ped});
    })
});

//o que será alterado
app.put('/pedidos/:id/editaritem', async(req,res)=>{
    const item={
        quantidade:req.body.quantidade,
        valor:req.body.valor
    };
//verificar se o pedido existe
    if(!await pedido.findByPk(req.params.id)){
        return res.status(400).json({
            erro:true,
            mensagem:'Pedido não foi encontrado.'
        });
    };
//verificar se o serviço existe
    if(!await servico.findByPk(req.body.ServicoId)){
        return res.status(400).json({
            erro:true,
            mensagem:'Serviço não foi encontrado.'
        });
    };
//alterar o item pedido
        await itemPedido.update(item,{
        where:Sequelize.and({ServicoId:req.body.ServicoId},
            {PedidoId:req.params.id})
    }).then(function(itens){
        return res.json({
            erro:false,
            mensagem:'Pedido foi alterado com sucesso.',
            itens
        });
    }).catch(function(error){
        return res.status(400).json({
            erro:true,
            mensagem:'Não foi possível alterar.'
        });
    });
});

app.put('/servicos/:id/cliente',async(req,res)=>{
    const cli={
        nome: req.body.nome,
        endereco: req.body.endereco,
        cidade: req.body.cidade,
        uf: req.body.uf,
        nascimento: req.body.nascimento,
        clienteDesde: req.body.clienteDesde,
    };
    if(!await cliente.findByPk(req.params.id)){
        return res.status(400).json({
            erro:true,
            mensagem:'Cliente não encontrado.'
        });
    };
    // if(!await pedido.findByPk(req.body.PedidoId)){
    //     return res.status(400).json({
    //         erro:true,
    //         mensagem:'Pedido não foi encontrado.'
    //     });
    // };
    await cliente.update(cli,{
        where:Sequelize.and({id:req.params.id},
         //   {PedidoId:req.body.PedidoId}
            )
    }).then(function(listacli){
        return res.json({
            erro:false,
            mensagem:'Cliente alterado com sucesso.',
            listacli
        });
    }).catch(function(error){
        return res.status(400).json({
            erro:true,
            mensagem:'Não foi possível alterar.'
        });
    });
});
//excluir cliente pelo código
app.get('/excluircliente',async(req,res)=>{
    cliente.destroy({
        where:{id:2}
    });
});
//excluir cliente por requisição externa
app.get('/excluircliente/:id', async(req,res)=>{
    await cliente.destroy({
        where: {id: req.params.id}
    }).then(function(){
        return res.json({
            erro:false,
            mensagem: 'Cliente foi excluído com sucesso.'
        });
    }).catch(function(error){
        return res.status(400).json({
            erro:true,
            mensagem: 'Erro ao excluir cliente.'
        });
    });
});
//-------------------------------------------------------------------------------------------
//Desafio ciclo 3
//criar compra

app.post('/compras', async(req,res)=>{
    await compra.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: 'Compra cadastrada com sucesso!'
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: 'Não foi possível criar compra!!!'
        });
    });
});

//Criar produto

app.post('/produtos', async(req,res)=>{
    await produto.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: 'Produto criado com sucesso!'
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: 'Não foi possível criar produto!!!'
        });
    });
});

//criar itens compra

app.post('/itemcompra', async(req,res)=>{
    await itemcompra.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: 'Item cadastrado com sucesso!'
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: 'Não foi possível cadastrar item!!!'
        });
    });
});
//Fim de criar

//listar compras
app.get('listacompras', async(req,res)=>{
    await compra.findAll({
        raw: true
    }).then(function(compra){
        res.json({compra})
    });
});

//Listar produtos
app.get('/listaprodutos', async(req,res)=>{
    await produto.findAll({
        raw: true
    }).then(function(produtos){
        res.json({produtos})
    });
});

//lista item compra
app.get('/listaitemcompra', async(req,res)=>{
    await itemcompra.findAll({
        order: [['CompraId', ASC]]
    }).then(function(item){
        res.json({item})
    });
});


//Atualização de compra
app.put('/atualizacompra', async(req,res)=>{
    await compra.update(req.body,{
        where: {id: req.body.id}
    }).then(function(){
        return res.json({
            error: true,
            message: 'Erro na alteração!!!'
        });
    });
});

//atualiza compra por id
app.put('/compra/:id/editaritem', async(req,res)=>{
    const item={
        quantidade: req.body.quantidade,
        valor: req.body.valor
    };

    if(!await compra.findByPk(req.params.id)){
        return res.status(400).json({
            error: true,
            message: 'Compra não encontrada!!!'
        });
    };

    if(!await produto.findByPk(req.body.ProdutoId)){
        return res.status(400).json({
            error: true,
            message: 'Produto não encontrado!!!'
        });
    };

    await itemcompra.update(item, {
        where: Sequelize.and({ProdutoId: req.body.ProdutoId},
            {CompraId: req.params.id})
    }).then(function(itens){
        return res.json({
            error: false,
            message: 'Compra alterada com sucesso!',
            itens
        });
    }).catch(function(erro){
        return res.status(400).json({
        error: true,
        message: 'Não foi possível alterar!!!'
        });
    });
});

//atualização de produto
app.put('/atualizaproduto', async(req,res)=>{
    await produto.update(req.body,{
        where: {id: req.body.id}
    }).then(function(){
        return res.json({
            error: false,
            message: 'Erro na alteração!!!'
        });
    });
});

//excluir compra por id
app.get('excluircompra/:id', async(req,res)=>{
    await compra.destroy({
        where: {id: req.params.id}
    }).then(function(){
        return res.json({
            error: false,
            message: 'Compra excluída com sucesso!'
        });
    }).cathc(function(){
        return res.status(400).json({
            error: true,
            message: 'Erro ao excluir compra!!!'
        });
    });
});

//excluir produto por id
app.get('/excluirproduto/:id', async(req,res)=>{
    await produto.destroy({
        where: {id: req.params.id}
    }).then(function(){
        return res.json({
            error: false,
            message: 'Produto excluido com sucesso!'
        });
    }).catch(function(){
        return res.status(400).json({
            error: true,
            message: 'Erro ao excluir produto!!!'
        });
    });
});

//excluir item por id da compra
app.get('/excluiritemcompra/:CompraId', async(req,res)=>{
    await itemcompra.destroy({
        where: {CompraId: req.params.CompraId}
    }).then(function(){
        return res.json({
            error: false,
            message: 'Item excluído com sucesso!'
        });
    }).catch(function(){
        return res.status(400).json({
            error: true,
            message: 'Erro ao excluir item!!!'
        });
    });
});

let port=process.env.PORT || 3001;

app.listen(port,(req,res)=>{
    console.log('Servidor ativo: http://localhost:3001');
});