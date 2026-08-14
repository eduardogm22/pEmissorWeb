const _API_URL = 'http://localhost:8080';

const TAMANHO_MAXIMO_FOTO = 5 * 1024 * 1024;
const TIPOS_FOTO_PERMITIDOS = ['image/jpeg', 'image/png'];

let fotoPerfilSelecionada = null;
let urlFotoPreview = null;

const CAMPOS_USUARIO = [
    ['usuario-username', 'Informe um username com ao menos 3 caracteres.'],
    ['usuario-senha', 'Informe uma senha com ao menos 8 caracteres.'],
    ['usuario-nome', 'Informe o nome.'],
    ['usuario-sobrenome', 'Informe o sobrenome.'],
    ['usuario-email', 'Informe um e-mail válido.'],
    ['usuario-equipe', 'Selecione a equipe.'],
    ['usuario-cargo', 'Selecione o cargo.'],
];

const ROTULOS_CARGO = {
    PROGRAMADOR: 'Programador(a)',
    PROGRAMADOR_ESTAGIARIO: 'Programador(a) Estagiário(a)',
    TESTADOR: 'Testador(a)',
    TESTADOR_ESTAGIARIO: 'Testador(a) Estagiário(a)',
    SCRUM_MASTER: 'Scrum Master',
    TECH_LEAD: 'Tech Lead',
    GERENTE: 'Gerente',
    GERENTE_GERAL: 'Gerente Geral',
    LIDER: 'Líder',
    ANALISTA_SUPORTE: 'Analista de Suporte',
    SUPORTE: 'Suporte',
    ESTAGIARIO: 'Estagiário(a)',
};

const ROTAS_API = {
    permissaoAdministrador: () => `${_API_URL}/usuario/login/admin`,
    permissaoUsuario: () => `${_API_URL}/usuario/login`,
    usuario: () => `${_API_URL}/usuario`,

    pontoLeitura: () => `${_API_URL}/pontoLeitura`,
    retornaPontoLeituraPorId: (idPontoLeitura) => `${_API_URL}/pontoLeitura/${idPontoLeitura}`,
    retornaPontoLeituraAtivo: (idUsuario) => `${_API_URL}/pontoLeitura/ativo/${idUsuario}`,
    atualizarPontoLeituraAtivo: (idUsuario, idPontoLeitura) => `${_API_URL}/pontoLeitura/ativo/${idUsuario}/${idPontoLeitura}`,
    retornaPontosLeituraUsuario: (idUsuario) => `${_API_URL}/pontoLeitura/usuario/${idUsuario}`,
    deletarPontoLeitura: (idPontoLeitura) => `${_API_URL}/pontoLeitura/${idPontoLeitura}`,
    
    dadosEmissao: () => `${_API_URL}/dadosEmissao`,
    
    uploadFoto: (idUsuario) => `${_API_URL}/usuario/${idUsuario}/foto`,
    equipes: () => `${_API_URL}/usuario/equipes`,
    cargos: () => `${_API_URL}/usuario/cargos`,
};

CREDENCIAIS_ADMINISTRADOR_AUTENTICADO = 'admin';