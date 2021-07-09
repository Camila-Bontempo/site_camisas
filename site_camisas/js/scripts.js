
// Objeto para pegar os preços e as fotos das camisetas

var camisetas = {
    'branca': {
        
        'gola_v': {
            'sem_estampa': {
                'preco_unit': 5.12,
                'foto': 'v-white.jpg' 
            },
            'com_estampa': {
                'preco_unit': 8.95,
                'foto': 'v-white-personalized.jpg' 
            }
        },
        
        'gola_normal': {
            'sem_estampa': {
                'preco_unit': 4.99,
                'foto': 'normal-white.jpg' 
            },
            'com_estampa': {
                'preco_unit': 8.77,
                'foto': 'normal-white-personalized.jpg' 
            }
        }
    },
    
    'colorida': {
        'gola_v': {
            'sem_estampa': {
                'preco_unit': 6.04,
                'foto': 'v-color.jpg' 
            },
            'com_estampa': {
                'preco_unit': 9.47,
                'foto': 'v-color-personalized.png' 
            }
        },
        
        'gola_normal': {
            'sem_estampa': {
                'preco_unit': 5.35,
                'foto': 'normal-color.jpg' 
            },
            'com_estampa': {
                'preco_unit': 9.28,
                'foto': 'normal-color-personalized.jpg' 
            }
        }
    }
}


// parâmetros da pesquisa

var parametros_pesquisa = {
    "quantidade": 10,
    "cor": "colorida",
    "gola": "gola_v",
    "qualidade": "q150",
    "estampa": "com_estampa",
    "embalagem": "bulk"
}

// parâmetros de pesquisa de texto

var textos_pesquisa = {
    "quantidade": "",
    "cor": "",
    "gola": "",
    "qualidade": "",
    "estampa": "",
    "embalagem": ""
}

// Document ready
$(function(){

    // Função que calcula o preço através das regras de negocio de cada camisa;
    function calculaPreco ()
    {
        var valorCamisetaUnit = (camisetas[parametros_pesquisa.cor][parametros_pesquisa.gola][parametros_pesquisa.estampa].preco_unit);

        if (parametros_pesquisa.qualidade === "q190")
        {
            valorCamisetaUnit = parseFloat((valorCamisetaUnit * 1.12).toFixed(2));
        }
        
        if (parametros_pesquisa.embalagem === "unitaria")
        {
            valorCamisetaUnit = valorCamisetaUnit + 0.15;
        }

        if (parametros_pesquisa.quantidade >= 100 && parametros_pesquisa.quantidade <= 499)
        {
            var desconto = valorCamisetaUnit * 0.05;
            valorCamisetaUnit = valorCamisetaUnit - desconto;
        }

        if (parametros_pesquisa.quantidade >= 500 && parametros_pesquisa.quantidade <= 999)
        {
            var desconto = valorCamisetaUnit * 0.1;
            valorCamisetaUnit = valorCamisetaUnit - desconto;
        }

        if (parametros_pesquisa.quantidade >= 1000)
        {
            var desconto = valorCamisetaUnit * 0.15;
            valorCamisetaUnit = valorCamisetaUnit - desconto;
        }

        return (valorCamisetaUnit * parametros_pesquisa.quantidade).toLocaleString("pt-BR", {minimumFractionDigits: 2, maximumSignificantDigits: 2});
        
    }



    // função usada para retornar as fotos certas, de acordo com cada seleção no filtro
    function trocarFoto ()
    {
        var foto = (camisetas[parametros_pesquisa.cor][parametros_pesquisa.gola][parametros_pesquisa.estampa].foto);

        $("#foto-produto").attr("src", ("img/" + foto));

        
    }

    // Função usada para chamar as outras funções dentro do timeSet do spinner
    function tratarMudancaFiltro ()
    {
        $(".refresh-loader").show(function()
        {
            // $(this).hide();
            setTimeout(function()
            { 
                $("#valor-total").text(calculaPreco());
                trocarFoto();

                $("#result_gola").text(textos_pesquisa.gola);
                $("#result_estampa").text(textos_pesquisa.estampa);
                $("#result_qualidade").text(textos_pesquisa.qualidade);
                $("#result_cor").text(textos_pesquisa.cor);
                $("#result_embalagem").text(textos_pesquisa.embalagem);
                $("#result_quantidade").text(textos_pesquisa.quantidade);

                $(".refresh-loader").hide(); 
            }, 500);
        });

    }

    // Seleção de Quantidade
    $("#quantidade").change(function () { 
        debugger;
        parametros_pesquisa.quantidade = $(this).val();
        textos_pesquisa.quantidade = $(this).val();
        window.localStorage.setItem("quantidade", parametros_pesquisa.quantidade);
        tratarMudancaFiltro();
        
    });

    //Seleção de cor camiseta, Seleção de Gola,Qualidade do tecido
    $(".option-filter > .option-button").click(function () { 
        $(this).addClass("selected");
        $(this).siblings().removeClass("selected");
        
        var valor = $(this).attr("id");
        var campo = $(this).parent().attr("id");

        
        parametros_pesquisa[campo] = valor;
        textos_pesquisa[campo] = $(this).text();

        window.localStorage.setItem(campo, valor);

        tratarMudancaFiltro();
    });

    // Seleção de estampa
    $("#estampa").change(function () { 
        var estampaSelect = $(this).val();
        var campo = $(this).attr("id");
        var textoSelecionado = $(this).find("[value=" + $(this).val() + "]").text();

        parametros_pesquisa[campo] = estampaSelect;
        

        textos_pesquisa[campo] = textoSelecionado;

        window.localStorage.setItem(campo, estampaSelect);

        tratarMudancaFiltro();
    });

    // Seleção de embalagem
    $("#embalagem").change(function () { 
        var embalagemSelect = $("#embalagem").val();
        var campo = $(this).attr("id");
        var textoSelecionado = $(this).find("[value=" + $(this).val() + "]").text();
        
        parametros_pesquisa[$(this).attr("id")] = embalagemSelect;

        textos_pesquisa[campo] = textoSelecionado;

        window.localStorage.setItem(campo, embalagemSelect);
        
        tratarMudancaFiltro();
    });

    // Teste para saber se há algo salvo no localstore, e setar o valor nos campos.
    if (localStorage.cor) {
        parametros_pesquisa.cor = localStorage.cor;
        $("#" + parametros_pesquisa.cor).click();
    }
    
    if (localStorage.gola) {
        parametros_pesquisa.gola = localStorage.gola;
        $("#" + parametros_pesquisa.gola).click();
    }

    if (localStorage.qualidade) {
        parametros_pesquisa.qualidade = localStorage.qualidade;
        $("#" + parametros_pesquisa.qualidade).click();
    }

    if (localStorage.quantidade) {
        parametros_pesquisa.quantidade = parseFloat(localStorage.quantidade);
        $("#quantidade").val(parseFloat(localStorage.quantidade)).trigger("change");
    }

    if (localStorage.estampa) {
        parametros_pesquisa.estampa = localStorage.estampa;
        $("#estampa").val(localStorage.estampa).trigger("change");
    }

    if (localStorage.embalagem) {
        parametros_pesquisa.embalagem = localStorage.embalagem;
        $("#embalagem").val(localStorage.embalagem).trigger("change");
    }
});


// Sugestão de etapas da resolução


    // 5. Crie a funcionalidade do localStorage e ao carregar a página, consulte o localStorage, 
    // atualize a variável "parametros_pesquisa" e rode a função de cálculo de preço


    

// Regras adicionais para o orçamento:

// 1. Verificar se há em localStorage os parâmetros do último orçamento e se houver, carregar a página com eles.

// 2. A camisa de qualidade alta (190g/m2) deve acrescer o preço unitário em 12%.

// 3. A embalagem unitária tem um custo de 0.15 por unidade

// 4. Após cálculo do preço, há que se aplicar um desconto por quantidade, sendo: 
    // faixa 1: acima de 1.000 - Desconto de 15%
    // faixa 2: acima de 500 - Desconto de 10%
    // faixa 3: acima de 100 - Desconto de 5%

// Resolução do desafio:


// Se quiser uma sugestão dos passos a seguir para a resolução, veja mais abaixo.

// 1. Crie uma função para calcular o preço baseado nos parâmetros da variável "parametros_pesquisa" e solte o 
// valor no console para testar se está certo.


// 2. Faça os eventos click e change para os filtros.
    // a. Faça o evento click para os filtros do tipo botão (.option-filter). Sempre que houver um click, 
    // remova a classe "selected" dos botões do grupo e depois aplique-a apenas ao que foi clicado para
    // que ele fique azul.

    // b. Faça o evento change para os filtros do tipo <select> e para o <input> de quantidade.

    // c. Sempre que um dos eventos acima ocorrer, atualize a variável "parametros_pesquisa" e rode a função para 
    // calcular o preço

// 3. Altere a função do cálculo do preço. Em vez de soltar os valores no console, atualize as informações
// nos elementos "result_", atualize o preço no elemento "valor-total" e mude o atributo "src" do elemento 
// "foto-produto" para alterar a imagem mostrada (todas as imagens estão na pasta img).

// 4. Adicione a funcionalidade de hide e show do spinner (elemento "refresh-loader") à função de cálculo de preço. 
// Como não estamos consultando dados externos, o cálculo acaba sendo rápido demais, portanto use um setTimeout 
// para deixar ele aparecer por pelo menos 2 segundos.