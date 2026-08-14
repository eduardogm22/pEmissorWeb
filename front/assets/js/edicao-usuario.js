async function editarUsuario(jsonEdicao) {
    return httpRequest('PUT', ROTAS_API.usuario(), jsonEdicao);
}

async function editarDadosEmissao(jsonDadosEmissao) {
    return httpRequest('PUT', ROTAS_API.dadosEmissao(), jsonDadosEmissao);
}

function validarFormularioEdicao() {
    return CAMPOS_USUARIO.reduce((formularioValido, [campoId, mensagem]) => {
        const campo = obterElemento(campoId);
        let invalido = false;
        if (campoId === 'usuario-senha') {
            if (campo.value.trim()) {
                invalido = !campo.checkValidity(); //Apenas valida se não estiver em branco. Caso a senha 
            }                                     //esteja em branco, o backend vai ignorar e deixar a atual.
        } else {
            invalido = !campo.value.trim() || !campo.checkValidity();
        }
        
        campo.classList.toggle('input-invalid', invalido);
        exibirErroCampo(campoId, invalido ? mensagem : '');
        return formularioValido && !invalido;
    }, true);
}

function montarJSONEdicao() {
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

function preencherCamposUsuario() {
    const campos = {
        username: 'usuario-username',
        senha: 'usuario-senha',
        nome: 'usuario-nome',
        sobrenome: 'usuario-sobrenome',
        email: 'usuario-email',
        equipe: 'usuario-equipe',
        cargo: 'usuario-cargo',
    };

    const usuarioLogado = obterUsuarioLogado();
    if (!usuarioLogado) return;

    Object.entries(campos).forEach(([campo, campoId]) => {
        const el = obterElemento(campoId);
        if (!el) return;
        
        const value = usuarioLogado[campo] ?? '';

        el.value = value;
    });
}

async function preencherCamposDadosEmissao() {
    const usuarioLogado = obterUsuarioLogado();
    if (!usuarioLogado) return;

    const resp = await httpRequest('GET', ROTAS_API.dadosEmissao() + usuarioLogado.id);
    if (!resp.ok) return;

    const dadosEmissao = resp.body;

    Object.entries(dadosEmissao).forEach(([k, v]) => {
        const element = obterElemento('usuario-' + k);
        if (!element) return;

        element.value = v;
    });
}

function definirEstadoEditando(editando) {
    const botao = obterElemento('btn-editar-usuario');
    botao.disabled = editando;
    botao.textContent = editando ? 'Editando...' : 'Editar usuário';
}

async function enviarEdicaoUsuario(event) {
    event.preventDefault();
    if (!validarFormularioEdicao()) return;

    definirEstadoEditando(true);
    try {
        const resposta = await  editarUsuario(montarJSONEdicao());
        if (!resposta?.ok) throw new Error(resposta?.message || 'Não foi possível editar o usuário.');

        const usuarioId = resposta.body?.id;
        if (!usuarioId) throw new Error('ID do usuário não retornado na edição.');

        const dadosEmissao = montarJSONDadosEmissao(usuarioId);
        const respostaDadosEmissao = await cadastrarDadosEmissao(dadosEmissao);
        if (!respostaDadosEmissao?.ok) throw new Error(respostaDadosEmissao?.message || 'Não foi possível editar os dados de emissão.');

        if (fotoPerfilSelecionada) {
            const respostaFoto = await uploadFoto(fotoPerfilSelecionada, usuarioId);
            if (!respostaFoto?.ok) throw new Error(respostaFoto?.message || 'Não foi possível enviar a foto de perfil.');
        }
        abrirModalMensagem('Sucesso!', 'Usuário editado com sucesso.', 'sucesso');
    } catch (erro) {
        abrirModalMensagem('Erro!', erro.message || 'Não foi possível editar o usuário.', 'erro');
    } finally {
        definirEstadoEditando(false);
    }
}

function vincularEventosTelaEdicao() {
    obterElemento('form-edicao-usuario').addEventListener('submit', enviarEdicaoUsuario);
    obterElemento('btn-selecionar-foto').addEventListener('click', () => obterElemento('foto-perfil').click());
    obterElemento('foto-perfil').addEventListener('change', tratarFotoSelecionada);
    obterElemento('btn-remover-foto').addEventListener('click', limparFotoPerfil);
}

async function iniciarTelaEdicaoUsuario() {
    if (!obterElemento('form-edicao-usuario')) return;
    
    try {
        const opcoes = await carregarOpcoesCadastroUsuario();
        preencherSelect('usuario-equipe', opcoes.equipes, (equipe) => equipe, formatarEquipe);
        preencherSelect('usuario-cargo', opcoes.cargos, (cargo) => cargo, formatarCargo);
    } catch (erro) {
        abrirModalMensagem('Erro!', erro.message || 'Não foi possível carregar as opções do cadastro.', 'erro');
        return;
    }
    
    preencherUsuarioLogado();
    preencherCamposUsuario();
    preencherCamposDadosEmissao();


    vincularEventosTelaEdicao();
}

document.addEventListener('DOMContentLoaded', iniciarTelaEdicaoUsuario);
