document.addEventListener('DOMContentLoaded', function() {
    const listaConversas = document.getElementById('conversationList');
    const areaMensagens = document.getElementById('messages');
    const cabecalhoChat = document.getElementById('currentChat');
    const barraPesquisa = document.createElement('input');
    barraPesquisa.setAttribute('type', 'text');
    barraPesquisa.setAttribute('placeholder', 'Pesquisar contato...');
    barraPesquisa.className = 'search-bar';
    document.querySelector('.sidebar').insertBefore(barraPesquisa, listaConversas);
    
    function criarElemento(tipo, classe = '') {
        const elemento = document.createElement(tipo);
        if (classe) elemento.className = classe;
        return elemento;
    }
    
    async function carregarContatos() {
        try {
            const resposta = await fetch(`https://giovanna-whatsapp.onrender.com/v1/whatsapp/contatos/11987876567`);
            
            if (!resposta.ok) {
                throw new Error(`Erro HTTP: ${resposta.status}`);
            }
            
            const dados = await resposta.json();
            
            if (!dados.dados_contato || !Array.isArray(dados.dados_contato)) {
                throw new Error('Formato de dados inválido');
            }
            
            exibirContatos(dados.dados_contato);
        } catch (erro) {
           return false;
        }
    }
    
    function exibirContatos(contatos) {
        listaConversas.innerHTML = '';
        
        contatos.forEach(contato => {
            const itemContato = criarElemento('div', 'conversation-item');
            
            const containerContato = criarElemento('div', 'contact-container');
            
            const imagem = criarElemento('img', 'contact-img');
            imagem.src = contato.profile || 'https://via.placeholder.com/40';
            imagem.alt = contato.name;
            containerContato.appendChild(imagem);
            
            const containerTexto = criarElemento('div', 'contact-text');
            
            const nomeContato = criarElemento('div', 'contact-name');
            nomeContato.textContent = contato.name;
            containerTexto.appendChild(nomeContato);
            
            const descricao = criarElemento('div', 'contact-desc');
            descricao.textContent = contato.description || 'Sem descrição';
            containerTexto.appendChild(descricao);
            
            containerContato.appendChild(containerTexto);
            itemContato.appendChild(containerContato);
            
            itemContato.addEventListener('click', () => selecionarContato(contato));
            listaConversas.appendChild(itemContato);
        });
    }
    
    barraPesquisa.addEventListener('input', function() {
        const termo = barraPesquisa.value.toLowerCase();
        document.querySelectorAll('.conversation-item').forEach(item => {
            const nome = item.querySelector('.contact-name').textContent.toLowerCase();
            item.style.display = nome.includes(termo) ? 'flex' : 'none';
        });
    });
    
    async function selecionarContato(contato) {
        try {
            cabecalhoChat.textContent = contato.name;
            
            const resposta = await fetch(`https://giovanna-whatsapp.onrender.com/v1/whatsapp/conversas?numero=11987876567&contato=${encodeURIComponent(contato.name)}`);
            
            if (!resposta.ok) {
                throw new Error(`Erro HTTP: ${resposta.status}`);
            }
            
            const dados = await resposta.json();
            
            if (!dados.conversas || dados.conversas.length === 0) {
                return;
            }
            
            const conversa = dados.conversas.find(c => c.name === contato.name);
            exibirMensagens(conversa ? conversa.conversas : []);
        } catch (erro) {
          return false;
        }
    }
    
    function exibirMensagens(mensagens) {
        areaMensagens.innerHTML = '';
        
        mensagens.forEach(msg => {
            const enviada = msg.sender === 'me' || msg.sender === '11987876567';
            const elementoMensagem = criarElemento('div', `message ${enviada ? 'sent' : 'received'}`);
            
            const conteudoMensagem = criarElemento('div', 'message-content');
            conteudoMensagem.textContent = msg.content;
            
            const horarioMensagem = criarElemento('div', 'message-time');
            horarioMensagem.textContent = msg.time;
            
            elementoMensagem.append(conteudoMensagem, horarioMensagem);
            areaMensagens.appendChild(elementoMensagem);
        });
        
        areaMensagens.scrollTop = areaMensagens.scrollHeight;
    }
    
    carregarContatos();
    
    // Botão de alternância para o modo escuro
    const toggleDarkModeBtn = document.createElement('button');
    toggleDarkModeBtn.textContent = 'Modo Escuro';
    toggleDarkModeBtn.style.position = 'absolute';
    toggleDarkModeBtn.style.top = '10px';
    toggleDarkModeBtn.style.right = '10px';
    toggleDarkModeBtn.style.padding = '10px';
    toggleDarkModeBtn.style.background = '#128C7E';
    toggleDarkModeBtn.style.color = 'white';
    toggleDarkModeBtn.style.border = 'none';
    toggleDarkModeBtn.style.borderRadius = '5px';
    toggleDarkModeBtn.style.cursor = 'pointer';
    document.body.appendChild(toggleDarkModeBtn);

    toggleDarkModeBtn.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        toggleDarkModeBtn.textContent = document.body.classList.contains('dark-mode') ? 'Modo Claro' : 'Modo Escuro';
    });
});
