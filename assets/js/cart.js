/**
 * Lógica de E-commerce - Loja IFPR TB Info
 * Preparado para futura integração com Print on Demand (POD)
 */

// 1. Banco de Dados Simulado dos Produtos (Catálogo Fixo)
const catalogoProdutos = [
    {
        id: 'p1',
        nome: 'Camiseta Oficial Orca',
        preco: 59.90,
        icone: 'ph-t-shirt',
        temTamanho: true
    },
    {
        id: 'p2',
        nome: 'Moletom Canguru Premium',
        preco: 149.90,
        icone: 'ph-hoodie',
        temTamanho: true
    },
    {
        id: 'p3',
        nome: 'Tirante Exclusivo',
        preco: 25.00,
        icone: 'ph-identification-badge',
        temTamanho: false
    },
    {
        id: 'p4',
        nome: 'Caneca + Tirante (Combo)',
        preco: 55.00,
        icone: 'ph-coffee',
        temTamanho: false
    }
];

// Estado do Carrinho (Array que guarda os itens adicionados)
let carrinho = [];

// Elementos da DOM
const productsGrid = document.getElementById('productsGrid');
const cartOverlay = document.getElementById('cartOverlay');
const cartDrawer = document.getElementById('cartDrawer');
const cartOpenBtn = document.getElementById('cartOpenBtn');
const cartCloseBtn = document.getElementById('cartCloseBtn');
const cartBadge = document.getElementById('cartBadge');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartTotalValue = document.getElementById('cartTotalValue');
const checkoutBtn = document.getElementById('checkoutBtn');

// 2. Função para Renderizar o Catálogo na Tela
function renderizarCatalogo() {
    productsGrid.innerHTML = ''; // Limpa a grade

    catalogoProdutos.forEach(produto => {
        // Cria o HTML do seletor de tamanho apenas se o produto exigir
        let seletorTamanhoHTML = '';
        if (produto.temTamanho) {
            seletorTamanhoHTML = `
                <div class="product-options">
                    <select class="size-selector" id="tamanho-${produto.id}">
                        <option value="P">Tamanho: P</option>
                        <option value="M" selected>Tamanho: M</option>
                        <option value="G">Tamanho: G</option>
                        <option value="GG">Tamanho: GG</option>
                    </select>
                </div>
            `;
        }

        // Monta o Card HTML
        const cardHTML = `
            <div class="product-card">
                <div class="product-image">
                    <i class="ph ${produto.icone}"></i>
                </div>
                <div class="product-info">
                    <h3 class="product-title">${produto.nome}</h3>
                    <p class="product-price">R$ ${produto.preco.toFixed(2).replace('.', ',')}</p>
                    ${seletorTamanhoHTML}
                    <button class="btn-add" onclick="adicionarAoCarrinho('${produto.id}')">
                        Adicionar <i class="ph ph-shopping-cart-simple"></i>
                    </button>
                </div>
            </div>
        `;
        productsGrid.innerHTML += cardHTML;
    });
}

// 3. Controle do Carrinho Lateral (Abrir/Fechar)
function abrirCarrinho() {
    cartOverlay.classList.add('active');
    cartDrawer.classList.add('active');
    document.body.style.overflow = 'hidden'; // Evita scroll na página de fundo
}

function fecharCarrinho() {
    cartOverlay.classList.remove('active');
    cartDrawer.classList.remove('active');
    document.body.style.overflow = 'auto';
}

cartOpenBtn.addEventListener('click', abrirCarrinho);
cartCloseBtn.addEventListener('click', fecharCarrinho);
cartOverlay.addEventListener('click', fecharCarrinho);

// 4. Adicionar Item ao Carrinho
window.adicionarAoCarrinho = function(idProduto) {
    const produto = catalogoProdutos.find(p => p.id === idProduto);
    let variacao = '';

    // Se tiver tamanho, pega o valor selecionado
    if (produto.temTamanho) {
        const selectElement = document.getElementById(`tamanho-${idProduto}`);
        variacao = selectElement.value;
    }

    // Cria identificador único para o carrinho (ex: p1-M, p1-G)
    const idCarrinho = variacao ? `${idProduto}-${variacao}` : idProduto;

    // Verifica se já existe no carrinho para apenas somar quantidade (futuro upgrade). 
    // Por enquanto, vamos simplificar adicionando como item único.
    
    carrinho.push({
        idCarrinho: idCarrinho + '-' + Date.now(), // ID único para poder remover itens iguais
        produto: produto,
        variacao: variacao
    });

    atualizarInterfaceCarrinho();
    abrirCarrinho(); // Abre a gaveta automaticamente para dar feedback
};

// 5. Remover Item do Carrinho
window.removerDoCarrinho = function(idUnico) {
    carrinho = carrinho.filter(item => item.idCarrinho !== idUnico);
    atualizarInterfaceCarrinho();
};

// 6. Atualizar a Interface do Carrinho (Números, Lista, Total)
function atualizarInterfaceCarrinho() {
    // Atualiza a bolinha de notificação
    cartBadge.textContent = carrinho.length;

    // Calcula Total
    let total = 0;
    
    // Limpa a lista
    if (carrinho.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-msg">
                <i class="ph ph-shopping-cart-simple"></i>
                <p>Seu carrinho está vazio.</p>
            </div>
        `;
    } else {
        cartItemsContainer.innerHTML = ''; // Limpa para refazer
        
        carrinho.forEach(item => {
            total += item.produto.preco;
            
            const variacaoTexto = item.variacao ? `Tamanho: ${item.variacao}` : 'Tamanho Único';
            
            const itemHTML = `
                <div class="cart-item">
                    <div class="cart-item-img">
                        <i class="ph ${item.produto.icone}"></i>
                    </div>
                    <div class="cart-item-info">
                        <h4 class="cart-item-title">${item.produto.nome}</h4>
                        <p class="cart-item-meta">${variacaoTexto}</p>
                        <p class="cart-item-price">R$ ${item.produto.preco.toFixed(2).replace('.', ',')}</p>
                    </div>
                    <button class="remove-item" onclick="removerDoCarrinho('${item.idCarrinho}')" title="Remover">
                        <i class="ph ph-trash"></i>
                    </button>
                </div>
            `;
            cartItemsContainer.innerHTML += itemHTML;
        });
    }

    // Atualiza valor total na tela
    cartTotalValue.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

// 7. Ação de Checkout (Simulando Integração POD)
checkoutBtn.addEventListener('click', () => {
    if (carrinho.length === 0) {
        alert("Adicione produtos ao carrinho antes de finalizar!");
        return;
    }

    // Aqui entrará a lógica da API da Printful/Reserva INK etc no futuro.
    // Por enquanto, mostramos a notificação de preparação:
    
    checkoutBtn.innerHTML = '<i class="ph ph-spinner-gap"></i> Processando...';
    checkoutBtn.style.opacity = '0.7';
    
    setTimeout(() => {
        alert("🚀 Em breve: Integração direta com nossa fábrica sob demanda (POD)! Você será redirecionado para o ambiente seguro de pagamento e cálculo de frete.");
        
        // Reseta o botão
        checkoutBtn.innerHTML = 'Finalizar Compra <i class="ph ph-lock-key"></i>';
        checkoutBtn.style.opacity = '1';
    }, 1500);
});

// Inicialização
renderizarCatalogo();