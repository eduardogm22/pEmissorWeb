function obterIconeModal(icone) {
    if (icone === 'erro') return '❌';
    if (icone === 'alerta') return '⚠️';
    if (icone === 'sucesso') return '✅';

    return icone || '';
}

const CHAVE_TEMA = 'pemissor-tema';

function aplicarTema(tema) {
    const temaEscuro = tema === 'escuro';
    document.documentElement.dataset.theme = temaEscuro ? 'escuro' : 'claro';

    const controle = document.getElementById('theme-switch');
    if (controle) {
        controle.setAttribute('aria-checked', String(temaEscuro));
        controle.setAttribute('aria-label', temaEscuro ? 'Mudar para modo claro' : 'Mudar para modo escuro');
        controle.title = temaEscuro ? 'Mudar para modo claro' : 'Mudar para modo escuro';
        controle.querySelector('.theme-switch-label').textContent = temaEscuro ? 'Modo escuro' : 'Modo claro';
    }
}

function alternarTema() {
    const proximoTema = document.documentElement.dataset.theme === 'escuro' ? 'claro' : 'escuro';
    localStorage.setItem(CHAVE_TEMA, proximoTema);
    aplicarTema(proximoTema);
}

function inicializarTema() {
    const temaSalvo = localStorage.getItem(CHAVE_TEMA);
    const prefereEscuro = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    aplicarTema(temaSalvo || (prefereEscuro ? 'escuro' : 'claro'));

    if (document.getElementById('theme-switch')) return;

    const controle = document.createElement('button');
    controle.type = 'button';
    controle.id = 'theme-switch';
    controle.className = 'theme-switch';
    controle.setAttribute('role', 'switch');
    controle.innerHTML = '<span class="theme-switch-icon" aria-hidden="true">☾</span><span class="theme-switch-label"></span><span class="theme-switch-track" aria-hidden="true"><span></span></span>';
    controle.addEventListener('click', alternarTema);

    const topbar = document.querySelector('.topbar');
    if (topbar) {
        const profile = topbar.querySelector('.profile-zone');
        topbar.insertBefore(controle, profile || null);
    } else {
        document.body.appendChild(controle);
        controle.classList.add('theme-switch-login');
    }

    aplicarTema(document.documentElement.dataset.theme);
}

inicializarTema();

function abrirModalMensagem(titulo, mensagem, icone) {
    const dialog = document.getElementById('modal-mensagem-sistema');
    if (!dialog) return;
    document.getElementById('modal-mensagem-icone').textContent = obterIconeModal(icone);
    document.getElementById('modal-mensagem-titulo').textContent = titulo;
    document.getElementById('modal-mensagem-conteudo').textContent = mensagem;
    dialog.showModal();
}

function fecharModalMensagem() {
    const dialog = document.getElementById('modal-mensagem-sistema');
    if (dialog) dialog.close();
}

function abrirModalConfirmacao(titulo, mensagem, icone = 'alerta') {
    return new Promise((resolve) => {
        const dialog = document.createElement('dialog');
        dialog.className = 'modal-message-dialog';
        dialog.innerHTML = `
            <div class="modal-message-card">
                <div class="modal-message-icon"></div>
                <h3></h3>
                <p></p>
                <div class="modal-confirmacao-acoes">
                    <button type="button" class="btn-secondary-muted">Não</button>
                    <button type="button" class="btn-primary-orange">Sim</button>
                </div>
            </div>
        `;

        dialog.querySelector('.modal-message-icon').textContent = obterIconeModal(icone);
        dialog.querySelector('h3').textContent = titulo;
        dialog.querySelector('p').textContent = mensagem;

        const finalizar = (confirmado) => {
            dialog.returnValue = confirmado ? 'true' : 'false';
            dialog.close();
        };

        dialog.querySelector('.btn-secondary-muted').addEventListener('click', () => finalizar(false));
        dialog.querySelector('.btn-primary-orange').addEventListener('click', () => finalizar(true));
        dialog.addEventListener('cancel', (event) => {
            event.preventDefault();
            finalizar(false);
        });
        dialog.addEventListener('close', () => {
            const confirmado = dialog.returnValue === 'true';
            dialog.remove();
            resolve(confirmado);
        }, { once: true });

        document.body.appendChild(dialog);
        dialog.showModal();
    });
}

function obterDadosSessaoAdministrador() {
    try {
        return JSON.parse(sessionStorage.getItem(CREDENCIAIS_ADMINISTRADOR_AUTENTICADO));
    } catch (_) {
        sessionStorage.removeItem(CREDENCIAIS_ADMINISTRADOR_AUTENTICADO);
        return null;
    }
}

function registrarSessaoAdministrador(userField, passwordField) {
    const sessao = {
        userField,
        passwordField,
    };
    sessionStorage.setItem(CREDENCIAIS_ADMINISTRADOR_AUTENTICADO, JSON.stringify(sessao));
}

function encerrarSessaoAdministrador() {
    sessionStorage.removeItem(CREDENCIAIS_ADMINISTRADOR_AUTENTICADO);
}

async function httpRequest(method, url, data = null) {
    try {
        const enviandoFormData = data instanceof FormData;
        const sessaoAdmin = obterDadosSessaoAdministrador();
        const headers = {
            ...(enviandoFormData ? {} : { "Content-Type": "application/json" }),
            ...(sessaoAdmin ? { Authorization: `Bearer ${sessaoAdmin.token}` } : {}),
        };
        const response = await fetch(url, {
            method,
            headers,
            body: data ? (enviandoFormData ? data : JSON.stringify(data)) : null,
        });

        let body = null;
        
        let contentType = response.headers.get("content-type");
        
        if (contentType && contentType.includes("application/json") && response.status !== 204 && response.status !== 401) {
            body = await response.json();
        } else {
            body = await response.text();
        }
        let ok = false;
        if (response.status >= 200 && response.status < 300) {
            ok = true;
        }
        return {
            status: response.status,
            body: body,
            ok: ok
        };
    } catch (error) {
        abrirModalMensagem('Erro!', 'Erro de comunicação, verifique a API: ' + error.message, 'erro');
        return {
            status: 500,
            body: { message: error.message }
        }
    }
}

function obterUsuarioLogado() {
    const dadosUsuario = localStorage.getItem("dadosUsuario");
    return dadosUsuario ? JSON.parse(dadosUsuario) : null;
}

function preencherUsuarioLogado() {
    const usuarioLogado = obterUsuarioLogado();
    if (!usuarioLogado) return;

    const nome = usuarioLogado.nome || 'Usuário';
    obterElemento('usuario-logado-nome').textContent = nome;
    obterElemento('usuario-logado-iniciais').textContent = nome.slice(0, 2).toUpperCase();
    obterElemento('usuario-logado-cargo').textContent = formatarCargo(usuarioLogado.cargo) || '';
}
async function obterDadosEmissaoAPI() {
    const usuarioLogado = obterUsuarioLogado();
    if (!usuarioLogado) return null;

    const resp = await httpRequest('GET', ROTAS_API.dadosEmissao() + '/' + usuarioLogado.id);
    if (!resp.ok) return null;
    
    return resp.body;
}

function salvarDadosEmissaoStorage(dadosEmissao) {
    localStorage.setItem("dadosEmissao", JSON.stringify(dadosEmissao));
}

function obterDadosEmissaoStorage() {
    const dadosEmissao = localStorage.getItem("dadosEmissao");
    return dadosEmissao ? JSON.parse(dadosEmissao) : null;
}

function preencherDadosEmissao() {
    // dadosEmissao = obterDadosEmissaoStorage();

    // const nome = usuarioLogado.nome || 'Usuário';
    // obterElemento('usuario-logado-nome').textContent = nome;
    // obterElemento('usuario-logado-iniciais').textContent = nome.slice(0, 2).toUpperCase();
    // obterElemento('usuario-logado-cargo').textContent = formatarCargo(usuarioLogado.cargo) || '';
}

async function obterCasesAPI(tipoDoc, dosOutros, copiadoDe = '') {
    const usuarioLogado = obterUsuarioLogado();
    if (!usuarioLogado) return null;

    const resp = await httpRequest('GET', ROTAS_API.getCases(tipoDoc, usuarioLogado.id, dosOutros, copiadoDe));
    if (!resp.ok) return null;
    
    return resp.body;
}

async function obterUsuariosAPI() {
    const resp = await httpRequest('GET', ROTAS_API.usuario());
    return resp.ok ? resp.body : [];
}
async function obterCaseAPIPorId(id) {
    const usuarioLogado = obterUsuarioLogado();
    if (!usuarioLogado) return null;

    const resp = await httpRequest('GET', ROTAS_API.cases() + '/' + id);
    if (!resp.ok) return null;
    
    return resp.body;
}
