async function protegerTelaCadastroUsuario() {
    let admin = await sessaoAdministradorValida();
    if (admin) return true;

    window.location.replace('../index.html');
    return false;
}

async function cadastrarUsuario(jsonCadastro) {
    return httpRequest('POST', ROTAS_API.usuario(), jsonCadastro);
}

async function cadastrarDadosEmissao(jsonDadosEmissao) {
    return httpRequest('POST', ROTAS_API.dadosEmissao(), jsonDadosEmissao);
}

async function carregarOpcoesCadastroUsuario() {
    const [respostaEquipes, respostaCargos] = await Promise.all([
        httpRequest('GET', ROTAS_API.equipes()),
        httpRequest('GET', ROTAS_API.cargos()),
    ]);

    if (!respostaEquipes.ok || !respostaCargos.ok) {
        throw new Error('Não foi possível carregar as opções de equipe e cargo.');
    }

    return {
        equipes: Array.isArray(respostaEquipes.body) ? respostaEquipes.body : [],
        cargos: Array.isArray(respostaCargos.body) ? respostaCargos.body : [],
    };
}

async function uploadFoto(file, idUsuario) {
    const fotoFormData = new FormData();
    fotoFormData.append('foto', file);

    // TODO: enviar imagem para endpoint de upload quando existir.
    return httpRequest('POST', ROTAS_API.uploadFoto(idUsuario), fotoFormData);
}

function formatarTextoEmTitleCase(valor) {
    return String(valor ?? '')
        .toLocaleLowerCase('pt-BR')
        .replace(/[_\s-]+/g, ' ')
        .replace(/(^|\s)\p{L}/gu, (inicioOuLetra) => inicioOuLetra.toLocaleUpperCase('pt-BR'));
}

function formatarCargo(cargo) {
    return ROTULOS_CARGO[cargo] || formatarTextoEmTitleCase(cargo);
}

function formatarEquipe(equipe) {
    return formatarTextoEmTitleCase(equipe);
}

function obterElemento(id) {
    return document.getElementById(id);
}

function preencherSelect(selectId, itens, obterValor = (item) => item, obterTexto = (item) => item) {
    const select = obterElemento(selectId);
    select.innerHTML = '<option value="">Selecione uma opção</option>';

    itens.forEach((item) => {
        const option = document.createElement('option');
        option.value = obterValor(item);
        option.textContent = obterTexto(item);
        select.appendChild(option);
    });
}

function exibirErroCampo(campoId, mensagem = '') {
    const erro = document.querySelector(`[data-error-for="${campoId}"]`);
    if (erro) erro.textContent = mensagem;
}

function validarFormularioCadastro() {
    return CAMPOS_USUARIO.reduce((formularioValido, [campoId, mensagem]) => {
        const campo = obterElemento(campoId);
        const invalido = !campo.value.trim() || !campo.checkValidity();
        campo.classList.toggle('input-invalid', invalido);
        exibirErroCampo(campoId, invalido ? mensagem : '');
        return formularioValido && !invalido;
    }, true);
}

function limparFotoPerfil() {
    if (urlFotoPreview) URL.revokeObjectURL(urlFotoPreview);

    fotoPerfilSelecionada = null;
    urlFotoPreview = null;
    obterElemento('foto-perfil').value = '';
    obterElemento('foto-preview').innerHTML = '👤';
    obterElemento('foto-preview').classList.remove('has-photo');
    obterElemento('btn-remover-foto').style.display = 'none';
    obterElemento('erro-foto').textContent = '';
}

function exibirPreviewFoto(arquivo) {
    if (urlFotoPreview) URL.revokeObjectURL(urlFotoPreview);

    fotoPerfilSelecionada = arquivo;
    urlFotoPreview = URL.createObjectURL(arquivo);
    const preview = obterElemento('foto-preview');
    const imagem = document.createElement('img');
    imagem.src = urlFotoPreview;
    imagem.alt = 'Pré-visualização da foto de perfil';
    preview.replaceChildren(imagem);
    preview.classList.add('has-photo');
    obterElemento('btn-remover-foto').style.display = 'inline-flex';
}

function tratarFotoSelecionada(event) {
    const arquivo = event.target.files?.[0];
    const erro = obterElemento('erro-foto');
    erro.textContent = '';
    if (!arquivo) return;

    if (!TIPOS_FOTO_PERMITIDOS.includes(arquivo.type)) {
        limparFotoPerfil();
        erro.textContent = 'Selecione uma imagem JPG, JPEG ou PNG.';
        return;
    }

    if (arquivo.size > TAMANHO_MAXIMO_FOTO) {
        limparFotoPerfil();
        erro.textContent = 'A imagem deve ter no máximo 5 MB.';
        return;
    }

    exibirPreviewFoto(arquivo);
}

function montarJSONCadastro() {
    const dados = {};
    const campos = {
        username: 'usuario-username',
        senha: 'usuario-senha',
        nome: 'usuario-nome',
        sobrenome: 'usuario-sobrenome',
        email: 'usuario-email',
        equipe: 'usuario-equipe',
        cargo: 'usuario-cargo',
    };

    Object.entries(campos).forEach(([campo, campoId]) => {
        const el = obterElemento(campoId);
        if (!el) return;
        const value = String(el.value ?? '').trim();
        if (value === '') return;
        dados[campo] = value;
    });

    return dados;
}

function montarJSONDadosEmissao(usuarioId) {
    const parseNumberValue = (id) => {
        const el = obterElemento(id);
        if (!el) return 0;
        const value = String(el.value ?? '').trim();
        const n = Number(value);
        return Number.isNaN(n) ? 0 : n;
    };

    return {
        usuario_id: usuarioId,
        proxNumeroNFe: parseNumberValue('usuario-proxNumeroNFe'),
        proxNumeroNFCe: parseNumberValue('usuario-proxNumeroNFCe'),
        proxNumeroCTe: parseNumberValue('usuario-proxNumeroCTe'),
        proxNumeroNFSe: parseNumberValue('usuario-proxNumeroNFSe'),
        proxNumeroMDFe: parseNumberValue('usuario-proxNumeroMDFe'),
        serie: parseNumberValue('usuario-serie'),
        dhEmissao: null,
        cpfCnpjEmissor: '',
        ieEmissor: '',
        imEmissor: '',
        cUFEmissor: '',
        cidadeEmissor: '',
    };
}

function definirEstadoEnvio(emEnvio) {
    const botao = obterElemento('btn-cadastrar-usuario');
    botao.disabled = emEnvio;
    botao.textContent = emEnvio ? 'Cadastrando...' : 'Cadastrar usuário';
}

async function enviarCadastroUsuario(event) {
    event.preventDefault();
    if (!validarFormularioCadastro()) return;

    definirEstadoEnvio(true);
    try {
        const resposta = await cadastrarUsuario(montarJSONCadastro());
        if (!resposta?.ok) throw new Error(resposta?.message || 'Não foi possível cadastrar o usuário.');

        const usuarioId = resposta.body?.id;
        if (!usuarioId) throw new Error('ID do usuário não retornado pelo cadastro.');

        const dadosEmissao = montarJSONDadosEmissao(usuarioId);
        const respostaDadosEmissao = await cadastrarDadosEmissao(dadosEmissao);
        if (!respostaDadosEmissao?.ok) throw new Error(respostaDadosEmissao?.message || 'Não foi possível cadastrar os dados de emissão.');

        if (fotoPerfilSelecionada) {
            const respostaFoto = await uploadFoto(fotoPerfilSelecionada, usuarioId);
            if (!respostaFoto?.ok) throw new Error(respostaFoto?.message || 'Não foi possível enviar a foto de perfil.');
        }

        obterElemento('form-cadastro-usuario').reset();
        limparFotoPerfil();
        abrirModalMensagem('Sucesso!', 'Usuário cadastrado com sucesso.', 'sucesso');
    } catch (erro) {
        abrirModalMensagem('Erro!', erro.message || 'Não foi possível cadastrar o usuário.', 'erro');
    } finally {
        definirEstadoEnvio(false);
    }
}

function voltarParaInicio() {
    encerrarSessaoAdministrador();
    window.location.href = '../index.html';
}

function preencherUsuarioLogadoAdmin() {
    const nome = 'Administrador';
    obterElemento('usuario-logado-nome').textContent = nome;
    obterElemento('usuario-logado-iniciais').textContent = nome.slice(0, 2).toUpperCase();
}

function vincularEventosTelaCadastro() {
    obterElemento('form-cadastro-usuario').addEventListener('submit', enviarCadastroUsuario);
    obterElemento('btn-selecionar-foto').addEventListener('click', () => obterElemento('foto-perfil').click());
    obterElemento('foto-perfil').addEventListener('change', tratarFotoSelecionada);
    obterElemento('btn-remover-foto').addEventListener('click', limparFotoPerfil);
}

async function iniciarTelaCadastroUsuario() {
    if (!obterElemento('form-cadastro-usuario') || !protegerTelaCadastroUsuario()) return;

    preencherUsuarioLogadoAdmin();
    try {
        const opcoes = await carregarOpcoesCadastroUsuario();
        preencherSelect('usuario-equipe', opcoes.equipes, (equipe) => equipe, formatarEquipe);
        preencherSelect('usuario-cargo', opcoes.cargos, (cargo) => cargo, formatarCargo);
    } catch (erro) {
        abrirModalMensagem('Erro!', erro.message || 'Não foi possível carregar as opções do cadastro.', 'erro');
        return;
    }

    vincularEventosTelaCadastro();
}

document.addEventListener('DOMContentLoaded', iniciarTelaCadastroUsuario);
