$(document).ready(function(){
    cardapio.eventos.init();
})

var cardapio = {};

var MEU_CARRINHO = [];

cardapio.eventos = {
 init: () =>{
    cardapio.metodos.obterItensCardapio();
 }
}

cardapio.metodos = {

    //Obtem a lista de itens do cardapio
    obterItensCardapio: (categoria = 'burgers', vermais=false) =>{
        var filtro = MENU[categoria];

        if(!vermais){
            $("#itensCardapio").html('');
            $('#btnVerMais').removeClass('hidden');
        }
       
        $.each(filtro, (i, e)=>{
            let temp = cardapio.templates.item.replace(/\${img}/g, e.img)
            .replace(/\${nome}/g, e.name)
            .replace(/\${preco}/g, e.price.toFixed(2).replace(".", ","))
            .replace(/\${id}/g, e.id)
            //botão ver mais foi clicado (12 itens)
            if(vermais && i>=8 && i<12){
                $("#itensCardapio").append(temp);
            }

            if(!vermais && i < 8){
                $("#itensCardapio").append(temp);
            }

            
        })

        //remove o ativo
        $(".container-menu a").removeClass('active');

        //seta o menu para ativo
        $("#menu-"+categoria).addClass('active');
    },

    verMais: ()=>{
        var ativo = $('.container-menu a.active').attr('id').split('menu-')[1];
        cardapio.metodos.obterItensCardapio(ativo, true);
        $('#btnVerMais').addClass('hidden');
    },

    diminuirQuantidade: (id)=>{
        let qntdAtual = parseInt($("#qntd-"+id).text());
        if(qntdAtual>0){
            $("#qntd-"+id).text(qntdAtual-1);
        }

    },

    aumentarQuantidade: (id)=>{
        let qntdAtual = parseInt($("#qntd-"+id).text());
        $("#qntd-"+id).text(qntdAtual+1);
        
    },

    //Adicionar ao carrinho o item do carpadio
    adicionarAoCarrinho:(id)=>{
        let qntdAtual = parseInt($("#qntd-"+id).text());
        if(qntdAtual>0){
            //obter a categoria ativa
            var categoria =  $('.container-menu a.active').attr('id').split('menu-')[1];
            
            //obter lista de itens
            let filtro = MENU[categoria];
            //obter o item
            let item = $.grep(filtro, (e, i)=>{return e.id == id})

            if(item.length>0){

                //validar se já existe esse item no carrinho
                let existe = $.grep(MEU_CARRINHO, (elem, index)=>{return elem.id == id});

                //caso já exista o item no carrinho, só altera a quantidade
                if(existe.length>0){
                    let objIndex = MEU_CARRINHO.findIndex((obj=> obj.id == id));
                    MEU_CARRINHO[objIndex].qntd = MEU_CARRINHO[objIndex].qntd + qntdAtual;
                }
                //caso ainda não exista o item no carrinho, adicionar ele
                else{
                    item[0].qntd = qntdAtual;
                    MEU_CARRINHO.push(item[0])
                }

                $("#qntd-"+id).text(0);
                

                
            }
        }
    }
    
}

cardapio.templates = {
    item: `
        <div class="col-3 mb-5">
            <div class="card card-item" id="\${id}">
                <div class="img-produto">
                    <img src="\${img}"/>
                </div>
                <p class="title-produto text-center mt-4">
                    <b>\${nome}</b>
                </p>
                <p class="price-produto text-center">
                    <b>\${preco}</b>
                </p>
                <div class="add-carinho">
                    <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidade('\${id}')"><i class="fas fa-minus"></i></span>
                    <span class="add-numero-itens" id="qntd-\${id}">0</span>
                    <span class="btn-mais"  onclick="cardapio.metodos.aumentarQuantidade('\${id}')"><i class="fas fa-plus"></i></span>
                    <span class="btn btn-add" onclick="cardapio.metodos.adicionarAoCarrinho('\${id}')"><i class="fas fa-shopping-bag"></i></span>
                </div>
            </div>
        </div>
    `
}