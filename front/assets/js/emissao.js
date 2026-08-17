async function atualizarDadosEmissao() {
    //preencher nos proximos numeros de cada doc
}
atualizarDadosEmissao();
// --- BANCO MOCKADO LOCAL DE CASES ---
let databaseCases = [
    {
        id: 1,
        nome: "Venda_Padrao_RS",
        doc: "NF-e",
        dono: "Eduardo G.",
        iniciais: "EG",
        txt: "NOTA|1\nEMIT|MinhaEmpresa\nDEST|ClienteGaucho\nPROD|Item_01|QTD:1|VLR:150.00",
        favorito: true,
        obs: "Cenário básico de venda interna rs",
    },
    {
        id: 2,
        nome: "Devolucao_Insumos",
        doc: "NF-e",
        dono: "Eduardo G.",
        iniciais: "EG",
        txt: "NOTA|2\nEMIT|MinhaEmpresa\nDEST|FornecedorSP\nPROD|Insumo_XYZ|QTD:10",
        favorito: false,
        obs: "",
    },
    {
        id: 3,
        nome: "Prestacao_Servico_TI",
        doc: "NFS-e",
        dono: "Eduardo G.",
        iniciais: "EG",
        txt: "NFS|TOMADOR:EmpresaA|SERVICO:Consultoria|VALOR:4500.00",
        favorito: false,
        obs: "",
    },
    {
        id: 4,
        nome: "Nota_Importacao_USA",
        doc: "NF-e",
        dono: "Rodrigo Silva",
        iniciais: "RS",
        txt: "NOTA|99\nEMIT|FornecedorUSA\nDEST|MinhaEmpresa\nDI|NumeroDI_123",
        favorito: false,
        obs: "",
    },
    {
        id: 5,
        nome: "Cupom_Frente_Caixa",
        doc: "NFC-e",
        dono: "Jessica Souza",
        iniciais: "JS",
        txt: "NFCE|CAIXA:01|VENDA_CONSUMIDOR_FINAL\nPROD|Refrigerante|1|5.00",
        favorito: false,
        obs: "",
    },
];

let mostrandoCasesProprios = true;
let casesDisponiveisParaSelecao = [];
let usuariosDisponiveisParaSelecao = [];
let ordenacaoSelecaoCases = { campo: "dhUltimaEmissao", direcao: "desc" };

function sincronizarDataHora(inputId) {
    const agora = new Date();
    const ano = agora.getFullYear();
    const mes = String(agora.getMonth() + 1).padStart(2, "0");
    const dia = String(agora.getDate()).padStart(2, "0");
    const horas = String(agora.getHours()).padStart(2, "0");
    const minutos = String(agora.getMinutes()).padStart(2, "0");
    document.getElementById(inputId).value =
        `${ano}-${mes}-${dia}T${horas}:${minutos}`;
}
sincronizarDataHora("emission-time");
sincronizarDataHora("event-time");

function resetarViewsOcultas() {
    document.getElementById("view-core-operacional").style.display = "none";
    document.getElementById("view-gerenciar-cases").classList.remove("active");
    document.getElementById("view-configuracoes").style.display = "none";
    document
        .querySelectorAll(".nav-item-btn")
        .forEach((btn) => btn.classList.remove("active"));
    fecharFormularioCase();
}

function navegar(tipoDocumento, botaoClicado) {
    resetarViewsOcultas();
    document.getElementById("op-tabs-bar").style.display = "flex";
    document.getElementById("view-core-operacional").style.display = "flex";
    botaoClicado.classList.add("active");
    document.getElementById("page-title-context").innerText =
        `Emissor de ${tipoDocumento}`;
    mudarOperacao("emissao", document.getElementById("tab-emissao-default"));
}

function mudarOperacao(operacao, botaoAba) {
    document
        .querySelectorAll(".tab-btn")
        .forEach((btn) => btn.classList.remove("active"));
    botaoAba.classList.add("active");
    document
        .querySelectorAll(".dynamic-form-section")
        .forEach((section) => section.classList.remove("active"));
    document.getElementById(`tab-view-${operacao}`).classList.add("active");
}

function abrirGerenciarCases(botaoClicado) {
    resetarViewsOcultas();
    botaoClicado.classList.add("active");
    document.getElementById("op-tabs-bar").style.display = "none";
    document.getElementById("page-title-context").innerText =
        "Gerenciamento de Cases";
    document.getElementById("view-gerenciar-cases").classList.add("active");
    atualizarTabelaCases();
}

function alternarOrigemCases(proprios) {
    mostrandoCasesProprios = proprios;
    document
        .getElementById("tab-sub-proprio")
        .classList.toggle("active", proprios);
    document
        .getElementById("tab-sub-outros")
        .classList.toggle("active", !proprios);
    document.getElementById("btn-add-new-case").style.display = proprios
        ? "flex"
        : "none";
    fecharFormularioCase();
    atualizarTabelaCases();
}

function retornaIniciais(nome) {
    let result = '';
    if (nome.indexOf(' ') !== -1) {
        palavras = nome.split(' ');
        result = palavras[0][0] + palavras[1][0];
    } else {
        result = nome.substring(0, 2);
    }
    return result.toUpperCase();
}

async function atualizarTabelaCases() {
    const tipoDoc = document.getElementById("case-filter-doc").value;
    const tbody = document.getElementById("tbody-cases");
    tbody.innerHTML = "";

    const cases = await obterCasesAPI(tipoDoc, !mostrandoCasesProprios);
    if (!cases) return;

    if (cases.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--text-muted); padding: 24px;">Nenhum Case encontrado.</td></tr>`;
        return;
    }

    cases.forEach((c) => {
        let botoesAcao = "";
        let avatarClass = mostrandoCasesProprios ? "table-avatar me" : "table-avatar";

        let iniciais;
        let dono;

        let nomeExibicao = c.favorito ? `⭐ ${c.nome}` : c.nome;
        if (mostrandoCasesProprios) {
            botoesAcao = `
                <button class="btn-table-action edit" onclick="exibirFormularioCase(true, ${c.id})">✏️ Editar</button>
                <button class="btn-table-action delete" onclick="excluirCaseDoBanco(${c.id})">🗑️ Deletar</button>
            `;
            nomeCopProp = c.nomeCopiadoDe;
            if (!nomeCopProp) {
                avatarClass = '';
            }
            document.getElementById('th-copiado-proprietario').innerText = 'COPIADO DE';
        } else {
            botoesAcao = `
            <button class="btn-table-action edit" onclick="visualizarCasePrompt(${c.id})">👁️ Ver TXT</button>
            <button class="btn-table-action clone" onclick="clonarCaseDeTerceiro(${c.id})">👯 Clonar</button>
            `;
            nomeCopProp = c.nomeProprietario;
            document.getElementById('th-copiado-proprietario').innerText = 'PROPRIETÁRIO';
        }
        iniciais = retornaIniciais(nomeCopProp);
        
        qtdUsos = c.qtdUsos === null ? 0 : c.qtdUsos;
        dhUltimaEmissao = c.dhUltimaEmissao === null ? 'Nunca usado' : c.dhUltimaEmissao;

        document.getElementById('form-case-id').value = c.id;

        tbody.innerHTML += `
            <tr>
                <td style="font-weight:600;">${nomeExibicao}</td>
                <td style="text-align: center;"><button class="btn-table-action clone" onclick="clonarCaseDeTerceiro(${c.id})">👁️‍🗨️</button></td>
                <td>
                    <div class="owner-cell">
                        <div class="${avatarClass}">${iniciais}</div>
                        <span style="font-weight: 500;">${nomeCopProp}</span>
                    </div>
                </td>
                <td style="text-align: center;" style="font-weight:600;">${dhUltimaEmissao}</td>
                <td style="text-align: center;" style="font-weight:600;">${qtdUsos}</td>
                <td style="text-align: center;"><div class="table-actions" style="justify-content: flex-end;">${botoesAcao}</div></td>
            </tr>
        `;
    });
}

/* --- LÓGICA DA NOVA TELA DE ADIÇÃO E EDIÇÃO --- */
async function exibirFormularioCase(isEdicao, id = null) {
    document.getElementById("panel-cases-lista").style.display = "none";
    document.getElementById("panel-cases-form").style.display = "flex";

    if (isEdicao && id) {
        document.getElementById("form-case-title").innerText = "✏️ Editar Case";

        const caseEdit = await obterCaseAPIPorId(id);
        if (!caseEdit) return;

        document.getElementById("form-case-id").value = caseEdit.id;
        document.getElementById("form-case-doc").value = caseEdit.tipoDoc;
        document.getElementById("form-case-nome").value = caseEdit.nome;
        document.getElementById("form-case-favorito").checked =
            caseEdit.favorito || false;
        document.getElementById("form-case-obs").value = caseEdit.descricao || "";
        document.getElementById("form-case-txt").value = caseEdit.conteudo;
    } else {
        document.getElementById("form-case-title").innerText =
            "➕ Adicionar Novo Case";
        document.getElementById("form-case-id").value = "";
        document.getElementById("form-case-doc").value =
            document.getElementById("case-filter-doc").value;
        document.getElementById("form-case-nome").value = "";
        document.getElementById("form-case-favorito").checked = false;
        document.getElementById("form-case-obs").value = "";
        document.getElementById("form-case-txt").value = "";
    }
}

function fecharFormularioCase() {
    document.getElementById("panel-cases-form").style.display = "none";
    document.getElementById("panel-cases-lista").style.display = "block";
}

async function cadastrarEditarCase() {
    const id = document.getElementById("form-case-id").value;
    const tipoDoc = document.getElementById("form-case-doc").value;
    const nome = document.getElementById("form-case-nome").value.trim();
    const favorito = document.getElementById("form-case-favorito").checked;
    const descricao = document.getElementById("form-case-obs").value.trim();
    const conteudo = document.getElementById("form-case-txt").value;
    const idProprietario = obterUsuarioLogado().id;

    if (!nome) {
        abrirModalMensagem("Alerta!","Por favor, digite um nome para identificar o seu case.", "alerta");
        return;
    }
    if (!tipoDoc) {
        abrirModalMensagem("Alerta!","Por favor, selecione um tipo de documento.", "alerta");
        return;
    }
    if (!conteudo) {
        abrirModalMensagem("Alerta!","Por favor, preencha a estrutura do case.", "alerta");
        return;
    }
    if (id) {
        // Edição
        const index = databaseCases.findIndex((c) => c.id == id);
        if (index !== -1) {
            databaseCases[index].doc = doc;
            databaseCases[index].nome = nome;
            databaseCases[index].favorito = favorito;
            databaseCases[index].obs = obs;
            databaseCases[index].txt = txt;
        }
    } else {
        // Inserção
        const novoCase = {
            nome: nome,
            descricao: descricao,
            conteudo: conteudo,
            tipoDoc: tipoDoc,
            idProprietario: idProprietario,
            favorito: favorito
        };
        resp = await httpRequest('POST', ROTAS_API.cases(), novoCase);

        if (resp.ok) {
            abrirModalMensagem('Sucesso!', 'Case cadastrado com sucesso!', 'sucesso');
        } else {
            let erro = resp.body.message;
            abrirModalMensagem('Erro!', 'Erro ao cadastrar case: ' + erro, 'erro');
        }
    }

    fecharFormularioCase();
    atualizarTabelaCases();
}

function visualizarCasePrompt(id) {
    const item = databaseCases.find((c) => c.id === id);
    alert(
        `Estrutura [${item.nome}]\nObservações: ${item.obs || "Nenhuma"}\n\n${item.txt}`,
    );
}

function excluirCaseDoBanco(id) {
    if (confirm("Deseja deletar este case?")) {
        databaseCases = databaseCases.filter((c) => c.id !== id);
        atualizarTabelaCases();
    }
}

function clonarCaseDeTerceiro(id) {
    const original = databaseCases.find((c) => c.id === id);
    const clone = {
        id: Date.now(),
        nome: `${original.nome}_COPIA`,
        doc: original.doc,
        dono: "Eduardo G.",
        iniciais: "EG",
        txt: original.txt,
        favorito: false,
        obs: `Clonado de ${original.dono}`,
    };
    databaseCases.push(clone);
    alert(`Template "${original.nome}" clonado com sucesso!`);
    alternarOrigemCases(true);
}

function escaparHtml(valor) {
    return String(valor ?? "").replace(/[&<>'"]/g, (caractere) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", '"': "&quot;",
    })[caractere]);
}

function obterTipoDocumentoAtual() {
    const documento = document.getElementById("page-title-context").innerText.replace("Emissor de ", "");
    return { "NF-e": "NFE", "NFS-e": "NFSE", "NFC-e": "NFCE", "CT-e": "CTE" }[documento];
}

function obterCopiadoDe(caseItem) {
    return caseItem.nomeCopiadoDe || "Não copiado";
}

function obterValorOrdenacaoData(data) {
    if (!data) return 0;
    const valor = new Date(data).getTime();
    return Number.isNaN(valor) ? 0 : valor;
}

function atualizarIndicadoresOrdenacaoSelecao() {
    const indicadorData = document.getElementById("case-sort-date-indicator");
    const indicadorUsos = document.getElementById("case-sort-uses-indicator");
    if (!indicadorData || !indicadorUsos) return;

    indicadorData.textContent = ordenacaoSelecaoCases.campo === "dhUltimaEmissao"
        ? (ordenacaoSelecaoCases.direcao === "asc" ? "↑" : "↓") : "↕";
    indicadorUsos.textContent = ordenacaoSelecaoCases.campo === "qtdUsos"
        ? (ordenacaoSelecaoCases.direcao === "asc" ? "↑" : "↓") : "↕";
}

function alternarOrdenacaoSelecaoCases(campo) {
    ordenacaoSelecaoCases.direcao = ordenacaoSelecaoCases.campo === campo && ordenacaoSelecaoCases.direcao === "desc"
        ? "asc" : "desc";
    ordenacaoSelecaoCases.campo = campo;
    renderizarTabelaSelecaoCases();
}

function popularFiltroCopiadoDe() {
    const select = document.getElementById("case-selection-copiado-de");
    const valorSelecionado = select.value;
    const usuarios = [...usuariosDisponiveisParaSelecao].sort((a, b) => {
        const nomeA = `${a.nome || ""} ${a.sobrenome || ""}`.trim();
        const nomeB = `${b.nome || ""} ${b.sobrenome || ""}`.trim();
        return nomeA.localeCompare(nomeB, "pt-BR");
    });
    select.innerHTML = '<option value="">Todos</option>' + usuarios
        .map((usuario) => {
            const nome = `${usuario.nome || ""} ${usuario.sobrenome || ""}`.trim() || usuario.username;
            return `<option value="${escaparHtml(usuario.id)}">${escaparHtml(nome)}</option>`;
        })
        .join("");
    select.value = usuarios.some((usuario) => String(usuario.id) === valorSelecionado) ? valorSelecionado : "";
}

function renderizarTabelaSelecaoCases() {
    const tbody = document.getElementById("tbody-selecao-cases");
    if (!tbody) return;

    const pesquisa = document.getElementById("case-selection-search").value.trim().toLocaleLowerCase("pt-BR");
    const copiadoDe = document.getElementById("case-selection-copiado-de").value;
    const { campo, direcao } = ordenacaoSelecaoCases;
    const multiplicador = direcao === "asc" ? 1 : -1;
    const cases = casesDisponiveisParaSelecao
        .filter((caseItem) => caseItem.nome.toLocaleLowerCase("pt-BR").includes(pesquisa))
        // Compatibilidade enquanto versões antigas da API ainda não aplicam ?copiadoDe=.
        .filter((caseItem) => !copiadoDe || String(caseItem.idCopiadoDe) === copiadoDe)
        .sort((a, b) => {
            // Favoritos permanecem sempre no início, mesmo quando há ordenação.
            if (Boolean(a.favorito) !== Boolean(b.favorito)) return a.favorito ? -1 : 1;
            const valorA = campo === "dhUltimaEmissao" ? obterValorOrdenacaoData(a[campo]) : Number(a[campo] || 0);
            const valorB = campo === "dhUltimaEmissao" ? obterValorOrdenacaoData(b[campo]) : Number(b[campo] || 0);
            if (valorA !== valorB) return (valorA - valorB) * multiplicador;
            return a.nome.localeCompare(b.nome, "pt-BR");
        });

    atualizarIndicadoresOrdenacaoSelecao();
    if (!cases.length) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:var(--text-muted); padding:24px;">Nenhum Case encontrado.</td></tr>';
        return;
    }

    tbody.innerHTML = cases.map((caseItem) => {
        const id = Number(caseItem.id);
        const nome = `${caseItem.favorito ? "⭐ " : ""}${caseItem.nome}`;
        const data = caseItem.dhUltimaEmissao || "Nunca usado";
        const usos = caseItem.qtdUsos ?? 0;
        const copiadoDeCase = obterCopiadoDe(caseItem);
        return `<tr>
            <td style="font-weight:600;">${escaparHtml(nome)}</td>
            <td style="text-align:center;"><button class="btn-table-action edit" type="button" onclick="abrirDetalhesCase(${id})">👁️ Ver detalhes</button></td>
            <td style="text-align:center;">${escaparHtml(copiadoDeCase)}</td>
            <td style="text-align:center;">${escaparHtml(data)}</td>
            <td style="text-align:center; font-weight:600;">${usos}</td>
            <td style="text-align:center;"><button class="btn-primary-orange" type="button" onclick="selecionarCase(${id})">Selecionar</button></td>
        </tr>`;
    }).join("");
}

async function carregarCasesParaSelecao(copiadoDe = "") {
    const tipoDoc = obterTipoDocumentoAtual();
    if (!tipoDoc) return;

    const [meusCases, casesDosOutros] = await Promise.all([
        obterCasesAPI(tipoDoc, false, copiadoDe),
        obterCasesAPI(tipoDoc, true, copiadoDe),
    ]);
    casesDisponiveisParaSelecao = [...(meusCases || []), ...(casesDosOutros || [])];
    renderizarTabelaSelecaoCases();
}

async function filtrarCasesPorCopiadoDe() {
    const copiadoDe = document.getElementById("case-selection-copiado-de").value;
    await carregarCasesParaSelecao(copiadoDe);
}

async function abrirModalSelecaoRapida() {
    const tipoDoc = obterTipoDocumentoAtual();
    if (!tipoDoc) return;

    usuariosDisponiveisParaSelecao = await obterUsuariosAPI();
    document.getElementById("modal-selecionar-case-subtitulo").textContent = `Cases disponíveis para ${document.getElementById("page-title-context").innerText.replace("Emissor de ", "")}.`;
    document.getElementById("case-selection-search").value = "";
    popularFiltroCopiadoDe();
    await carregarCasesParaSelecao();
    document.getElementById("modal-selecionar-case").showModal();
}

function fecharModalSelecaoCase() {
    document.getElementById("modal-selecionar-case").close();
}

async function selecionarCase(id) {
    const caseResumo = casesDisponiveisParaSelecao.find((caseItem) => caseItem.id === id);
    const caseCompleto = await obterCaseAPIPorId(id);
    const caseEscolhido = caseCompleto || caseResumo;
    if (!caseEscolhido) return;

    document.getElementById("active-case-text").innerText = caseEscolhido.nome;
    document.getElementById("btn-clear-case").style.display = "inline-block";
    document.getElementById("editor-txt").value = caseEscolhido.conteudo || caseEscolhido.txt || "";
    fecharModalSelecaoCase();
}

async function abrirDetalhesCase(id) {
    const caseResumo = casesDisponiveisParaSelecao.find((caseItem) => caseItem.id === id);
    const caseCompleto = await obterCaseAPIPorId(id);
    const caseItem = caseCompleto || caseResumo;
    if (!caseItem) return;

    document.getElementById("modal-detalhes-case-titulo").textContent = caseItem.nome;
    document.getElementById("modal-detalhes-case-subtitulo").textContent = `Copiado de: ${obterCopiadoDe(caseItem)} · Usos: ${caseItem.qtdUsos ?? 0} · Última emissão: ${caseItem.dhUltimaEmissao || "Nunca usado"}`;
    document.getElementById("case-details-content").value = caseItem.conteudo || caseItem.txt || "";
    document.getElementById("modal-detalhes-case").showModal();
}

function fecharModalDetalhesCase() {
    document.getElementById("modal-detalhes-case").close();
}

function deselecionarCaseAtivo() {
    document.getElementById("active-case-text").innerText =
        "Nenhum case selecionado";
    document.getElementById("btn-clear-case").style.display = "none";
    document.getElementById("editor-txt").value = "";
}

async function popularSelectPontosLeitura() {
    const select = document.getElementById("cfg-ponto-leitura-select");
    if (!select) return;

    select.innerHTML = "";
    select.insertAdjacentHTML(
        "beforeend",
        '<option value="novo">Cadastrar novo ponto de leitura</option>',
    );

    resp = await httpRequest(
        "GET",
        ROTAS_API.retornaPontosLeituraUsuario(JSON.parse(localStorage.getItem("dadosUsuario")).id)
    );
    if (resp.ok) {
        pontosLeitura = resp.body;
        pontosLeitura.forEach((ponto) => {
            select.insertAdjacentHTML(
                "beforeend",
                `<option value="${ponto.id}">${ponto.nome}</option>`,
            );
        });
        pontoAtivo = await httpRequest('GET', ROTAS_API.retornaPontoLeituraAtivo(JSON.parse(localStorage.getItem("dadosUsuario")).id));
        select.value = pontoAtivo.body.id || "novo";
    } else if (resp.status == 404) {
        select.value = "novo";
    } else {
        abrirModalMensagem(
            "Erro!",
            "Erro ao buscar pontos de leitura: " + resp.body.message,
            "erro",
        );
        select.value = "novo";
    }

    onSelecionarPontoLeitura(select.value);
}

function preencherDadosPontoLeitura(idPontoLeitura) {
    const nomePonto_bd = document.getElementById("cfg-nome-ponto-bd");
    const nomePonto_pasta = document.getElementById("cfg-nome-ponto-pasta");
    const nomePonto_api_xpress = document.getElementById("cfg-nome-ponto-api-xpress");
    const URL_api_xpress = document.getElementById("cfg-url-api-xpress");
    const tipoBanco = document.getElementById("cfg-tipo-banco");
    const nomeBanco = document.getElementById("cfg-nome-bd");
    const url_bd = document.getElementById("cfg-url-banco");
    const porta = document.getElementById("cfg-porta-banco");
    const usuario_bd = document.getElementById("cfg-usuario-banco");
    const senha_bd = document.getElementById("cfg-senha-banco");
    const url_pasta = document.getElementById("cfg-url-pasta");
    const usuario_pasta = document.getElementById("cfg-usuario-windows");
    const senha_pasta = document.getElementById("cfg-senha-windows");
    const dominio = document.getElementById("cfg-dominio");

    if (idPontoLeitura == null) {
        nomePonto_bd.value = "";
        nomePonto_pasta.value = "";
        nomePonto_api_xpress.value = "";
        URL_api_xpress.value = "";
        tipoBanco.value = "";
        nomeBanco.value = "";
        url_bd.value = "";
        porta.value = "";
        usuario_bd.value = "";
        senha_bd.value = "";
        url_pasta.value = "";
        usuario_pasta.value = "";
        senha_pasta.value = "";
        dominio.value = "";
    } else {
        httpRequest("GET", ROTAS_API.retornaPontoLeituraPorId(idPontoLeitura)).then(
            (resp) => {
                if (resp.ok) {
                    const ponto = resp.body;

                    if (ponto.tipoFila === "fila-pasta") {
                        nomePonto_pasta.value = ponto.nome || "";
                        alternarFilaConfiguracao("fila-pasta");

                        usuario_pasta.value = ponto.usuario || "";
                        senha_pasta.value = ponto.senha || "";
                        url_pasta.value = ponto.url || "";
                        dominio.value = ponto.dominio || "";

                        nomePonto_bd.value = "";
                        porta.value = "";
                        usuario_bd.value = "";
                        senha_bd.value = "";
                        tipoBanco.value = "";
                        nomeBanco.value = "";
                        url_bd.value = "";

                        nomePonto_api_xpress.value = "";
                        URL_api_xpress.value = "";
                    } else if (ponto.tipoFila === "fila-banco") {
                        alternarFilaConfiguracao("fila-banco");

                        nomePonto_bd.value = ponto.nome || "";
                        porta.value = ponto.porta || "";
                        usuario_bd.value = ponto.usuario || "";
                        senha_bd.value = ponto.senha || "";
                        tipoBanco.value = ponto.tipoBanco || "";
                        nomeBanco.value = ponto.nomeBanco || "";
                        url_bd.value = ponto.url || "";

                        nomePonto_pasta.value = "";
                        usuario_pasta.value = "";
                        senha_pasta.value = "";
                        url_pasta.value = "";
                        dominio.value = "";

                        nomePonto_api_xpress.value = "";
                        URL_api_xpress.value = "";
                    } else {
                        alternarFilaConfiguracao("api-xpress");

                        nomePonto_api_xpress.value = ponto.nome || "";
                        URL_api_xpress.value = ponto.url || "";

                        nomePonto_bd.value = "";
                        porta.value = "";
                        usuario_bd.value = "";
                        senha_bd.value = "";
                        tipoBanco.value = "";
                        nomeBanco.value = "";
                        url_bd.value = "";

                        nomePonto_pasta.value = "";
                        usuario_pasta.value = "";
                        senha_pasta.value = "";
                        url_pasta.value = "";
                        dominio.value = "";
                    }
                }
            },
        );
    }
}

function onSelecionarPontoLeitura(valor) {
    const cadastrarBtn = document.getElementById("btn-cadastrar-ponto");
    const atualizarBtn = document.getElementById("btn-atualizar-ponto");
    const excluirBtn = document.getElementById("btn-excluir-ponto");

    if (!cadastrarBtn || !atualizarBtn || !excluirBtn) return;

    const mostrarAcoesEdicao = valor && valor !== "" && valor !== "novo";
    cadastrarBtn.style.display = mostrarAcoesEdicao ? "none" : "inline-flex";
    atualizarBtn.style.display = mostrarAcoesEdicao ? "inline-flex" : "none";
    excluirBtn.style.display = mostrarAcoesEdicao ? "inline-flex" : "none";

    if (valor !== "" && valor !== "novo") {
        httpRequest(
            "POST",
            ROTAS_API.atualizarPontoLeituraAtivo(JSON.parse(localStorage.getItem("dadosUsuario")).id, valor)
        );
        preencherDadosPontoLeitura(valor);
    } else {
        preencherDadosPontoLeitura(null);
    }
}

function obterDadosPontoLeitura() {
    const tipoFila = document.querySelector(".config-sub-tab-btn.active")
        ?.dataset.tab;

    if (tipoFila == "fila-banco") {
        return {
            nome: document.getElementById("cfg-nome-ponto-bd").value.trim(),
            tipoFila,
            tipoBanco: document.getElementById("cfg-tipo-banco").value.trim(),
            nomeBanco: document.getElementById("cfg-nome-bd").value.trim(),
            url: document.getElementById("cfg-url-banco").value.trim(),
            porta: document.getElementById("cfg-porta-banco").value.trim(),
            usuario: document.getElementById("cfg-usuario-banco").value.trim(),
            senha: document.getElementById("cfg-senha-banco").value,
            dominio: "",
        };
    }

    if (tipoFila == "fila-banco") {
        return {
            nome: document.getElementById("cfg-nome-ponto-pasta").value.trim(),
            tipoFila,
            tipoBanco: "",
            url: document.getElementById("cfg-url-pasta").value.trim(),
            porta: "",
            usuario: document.getElementById("cfg-usuario-windows").value.trim(),
            senha: document.getElementById("cfg-senha-windows").value,
            dominio: document.getElementById("cfg-dominio").value.trim(),
        };
    }

    return {
        nome : document.getElementById("cfg-nome-ponto-api-xpress").value.trim(),
        url: document.getElementById("cfg-url-api-xpress").value.trim(),
        tipoFila
    }
}

function validarPontoLeitura(dados) {
    const camposObrigatorios = [
        [dados.nome, "Por favor, digite um nome para o ponto de leitura."],
        [dados.url, "Por favor, informe a URL."],
        [dados.tipoFila, "Por favor, selecione um tipo de fila."],
    ];
    const camposTestarLimite = [
        [dados.nome, "O nome do ponto de leitura"],
        [dados.tipoFila, "O tipo de fila"]        
    ];
    
    if (dados.tipoFila === "api-xpress") {
        camposTestarLimite.push(
            [dados.url, "A URL"]
        );
    }
    
    if (dados.tipoFila === "fila-banco" || dados.tipoFila === "fila-pasta") {
        camposObrigatorios.push(           
            [dados.usuario, "Por favor, informe o usuário."],
            [dados.senha.trim(), "Por favor, informe a senha."],
        );
        camposTestarLimite.push(
            [dados.usuario, "O usuário"],
            [dados.senha, "A senha"],
        );
    }

    if (dados.tipoFila === "fila-banco") {
        camposObrigatorios.push(
            [dados.tipoBanco, "Por favor, selecione um tipo de banco de dados."],
            [dados.porta, "Por favor, informe a porta do banco de dados."],
        );
        camposTestarLimite.push(
            [dados.tipoBanco, "O tipo de banco"],
        );
    }

    if (dados.tipoFila === "fila-pasta") {
        camposTestarLimite.push(
            [dados.dominio, "O domínio"],
        );
    }

    const campoInvalido = camposObrigatorios.find(([valor]) => !valor);
    if (campoInvalido) {
        abrirModalMensagem("Atenção!", campoInvalido[1], "alerta");
        return false;
    }

    if (!["fila-pasta", "fila-banco", "api-xpress"].includes(dados.tipoFila)) {
        abrirModalMensagem("Atenção!", "Selecione um tipo de fila válido.", "alerta");
        return false;
    }

    if (dados.tipoFila !== "api-xpress" && 
        dados.url !== "localhost" && 
        (dados.url.length > 15 || !/^(?:25[0-5]|2[0-4]\d|1?\d?\d)(?:\.(?:25[0-5]|2[0-4]\d|1?\d?\d)){3}$/.test(dados.url))) {
        abrirModalMensagem("Atenção!", "Informe um endereço IPv4 válido, como 192.168.1.36 ou informe localhost.", "alerta");
        return false;
    }

    if (dados.tipoFila === "fila-banco" && (!/^\d{1,5}$/.test(dados.porta) || Number(dados.porta) < 1 || Number(dados.porta) > 65535)) {
        abrirModalMensagem("Atenção!", "A porta deve conter de 1 a 5 dígitos e estar entre 1 e 65535.", "alerta");
        return false;
    }


    const campoComLimiteExcedido = camposTestarLimite.find(([valor]) => valor.length > 255);

    if (campoComLimiteExcedido) {
        abrirModalMensagem("Atenção!", `${campoComLimiteExcedido[1]} deve ter no máximo 255 caracteres.`, "alerta");
        return false;
    }

    return true;
}

function dadosPontoLeituraParaEnvio() {
    const dados = obterDadosPontoLeitura();
    if (!validarPontoLeitura(dados)) return null;

    return {
        ...dados,
        idUsuario: JSON.parse(localStorage.getItem("dadosUsuario")).id,
    };
}

async function cadastrarPontoLeitura() {
    const dados = dadosPontoLeituraParaEnvio();
    if (!dados) return;

    const resp = await httpRequest("POST", ROTAS_API.pontoLeitura(), dados);
    if (resp.ok) {
        abrirModalMensagem(
            "Sucesso!",
            "Ponto de leitura cadastrado com sucesso!",
            "sucesso",
        );
        const comboPontoLeitura = document.getElementById(
            "cfg-ponto-leitura-select",
        );
        comboPontoLeitura.insertAdjacentHTML(
            "beforeend",
            `<option value="${resp.body.id}">${resp.body.nome}</option>`,
        );
        comboPontoLeitura.value = resp.body.id;
        onSelecionarPontoLeitura(resp.body.id);
    } else {
        abrirModalMensagem(
            "Erro!",
            "Erro ao cadastrar ponto de leitura: " +
                (resp.body == ""
                    ? "HTTP Error " + resp.status
                    : resp.body.message),
            "erro",
        );
    }
}

async function atualizarPontoLeitura() {
    const select = document.getElementById("cfg-ponto-leitura-select");
    if (
        !select ||
        !select.value ||
        select.value === "novo" ||
        select.value === ""
    )
        return;
    const dados = dadosPontoLeituraParaEnvio();
    if (!dados) return;

    const resp = await httpRequest("PUT", ROTAS_API.pontoLeitura() + "/" + select.value, dados);
    if (resp.ok) {
        abrirModalMensagem(
            "Sucesso!",
            "Ponto de leitura atualizado com sucesso!",
            "sucesso",
        );
        popularSelectPontosLeitura();
    } else {
        abrirModalMensagem(
            "Erro!",
            "Erro ao atualizar ponto de leitura: " +
                (resp.body == ""
                    ? "HTTP Error " + resp.status
                    : resp.body.message),
            "erro",
        );
    }
}

async function excluirPontoLeitura() {
    const select = document.getElementById("cfg-ponto-leitura-select");
    if (
        !select ||
        !select.value ||
        select.value === "novo" ||
        select.value === ""
    )
        return;

    const confirmou = await abrirModalConfirmacao('Atenção!', `Deseja realmente excluir o ponto de leitura "${select.options[select.selectedIndex].text}"?`);
    
    if (confirmou) {
        await httpRequest("POST", ROTAS_API.atualizarPontoLeituraAtivo(JSON.parse(localStorage.getItem("dadosUsuario")).id, -1));
        resp = await httpRequest("DELETE",  ROTAS_API.deletarPontoLeitura(select.value));
        if (resp.ok) {
            abrirModalMensagem(
                "Sucesso!",
                "Ponto de leitura excluído com sucesso!",
                "sucesso",
            );
            popularSelectPontosLeitura();
        } else {
            abrirModalMensagem(
                "Erro!",
                "Erro ao excluir ponto de leitura: " +
                    (resp.body == ""
                        ? "HTTP Error " + resp.status
                        : resp.body.message),
                "erro",
            );
        }
    }
}

function mostrarOpcaoConfiguracao(opcao, botaoClicado = null) {
    document
        .querySelectorAll(".config-option-btn")
        .forEach((btn) =>
            btn.classList.toggle("active", btn.dataset.option === opcao),
        );
    document
        .querySelectorAll(".config-option-panel")
        .forEach((panel) =>
            panel.classList.toggle(
                "active",
                panel.id === `config-panel-${opcao}`,
            ),
        );
    if (botaoClicado) {
        botaoClicado.classList.add("active");
    }
}

function alternarFilaConfiguracao(tipo, botaoClicado = null) {
    document
        .querySelectorAll(".config-sub-tab-btn")
        .forEach((btn) =>
            btn.classList.toggle("active", btn.dataset.tab === tipo),
        );
    document
        .querySelectorAll(".config-sub-panel")
        .forEach((panel) =>
            panel.classList.toggle("active", panel.id === `config-${tipo}`),
        );
    if (botaoClicado) {
        botaoClicado.classList.add("active");
    }
}

function alternarAjudaCompartilhamento() {
    const helpBox = document.getElementById("help-compartilhamento");
    if (helpBox) {
        helpBox.style.display =
            helpBox.style.display === "block" ? "none" : "block";
    }
}

function abrirConfiguracoes(botaoClicado) {
    resetarViewsOcultas();
    botaoClicado.classList.add("active");
    document.getElementById("op-tabs-bar").style.display = "none";
    document.getElementById("view-configuracoes").style.display = "flex";
    document.getElementById("page-title-context").innerText =
        "Configurações do Sistema";
    mostrarOpcaoConfiguracao("ponto-leitura");
    alternarFilaConfiguracao("fila-pasta");
    popularSelectPontosLeitura();
}

function voltarParaEmissao() {
    document.getElementById("btn-doc-nfe").click();
}

let dadosEmissorAtual = null;

function preencherFormularioEmissor(dados = {}) {
    document.getElementById("emissor-cpf-cnpj").value = dados.cpfCnpj || dados.cnpj || "";
    document.getElementById("emissor-inscricao-estadual").value =
        dados.inscricaoEstadual || "";
    document.getElementById("emissor-inscricao-municipal").value =
        dados.inscricaoMunicipal || "";
    document.getElementById("emissor-codigo-ibge-cidade").value =
        dados.codigoIbgeCidade || "";
    document.getElementById("emissor-uf").value = dados.uf || "";
}

async function abrirModalDadosEmissor() {
    const modal = document.getElementById("modal-dados-emissor");
    const usuario = obterUsuarioLogado();

    if (!modal || !usuario) {
        abrirModalMensagem("Atenção!", "Não foi possível identificar o usuário logado.", "alerta");
        return;
    }

    dadosEmissorAtual = null;
    preencherFormularioEmissor();
    modal.showModal();

    const resp = await httpRequest("GET", ROTAS_API.dadosEmissao() + `/${usuario.id}`);
    if (!modal.open) return;

    if (resp.ok && resp.body) {
        dadosEmissorAtual = resp.body;
        preencherFormularioEmissor(dadosEmissorAtual);
    } else if (resp.status !== 404) {
        fecharModalDadosEmissor();
        abrirModalMensagem(
            "Erro!",
            "Não foi possível carregar os dados do emissor: " + (resp.body.message || resp.body),
            "erro",
        );
    }
}

function fecharModalDadosEmissor() {
    const modal = document.getElementById("modal-dados-emissor");
    if (modal && modal.open) modal.close();
}

async function salvarDadosEmissor() {
    const usuario = obterUsuarioLogado();
    const botaoSalvar = document.getElementById("btn-salvar-dados-emissor");
    if (!usuario) return;

    const dados = {
        cpfCnpj: document.getElementById("emissor-cpf-cnpj").value.trim(),
        inscricaoEstadual: document.getElementById("emissor-inscricao-estadual").value.trim(),
        inscricaoMunicipal: document.getElementById("emissor-inscricao-municipal").value.trim(),
        codigoIbgeCidade: document.getElementById("emissor-codigo-ibge-cidade").value.trim(),
        uf: document.getElementById("emissor-uf").value,
        idUsuario: usuario.id,
    };

    botaoSalvar.disabled = true;
    const resp = dadosEmissorAtual && dadosEmissorAtual.id
        ? await httpRequest("PUT", `${ROTAS_API.dadosEmissao}/${dadosEmissorAtual.id}`, dados)
        : await httpRequest("POST", `${ROTAS_API.dadosEmissao}`, dados);
    botaoSalvar.disabled = false;

    if (resp.ok) {
        dadosEmissorAtual = resp.body || { ...dados, id: dadosEmissorAtual?.id };
        fecharModalDadosEmissor();
        abrirModalMensagem("Sucesso!", "Dados do emissor salvos com sucesso.", "sucesso");
    } else {
        abrirModalMensagem(
            "Erro!",
            "Não foi possível salvar os dados do emissor: " + (resp.body.message || resp.body),
            "erro",
        );
    }
}
function gerarTxtEventoAutomático() {
    document.getElementById("editor-txt-eventos").value = `EVENTO|MOCK`;
}
function gerarTxtImpressao() {
    document.getElementById("editor-txt-impressao").value =
        `IMPRIME|CHAVE:${document.getElementById("print-chave").value}`;
}
function enviarFil(op) {
    alert(`Enviado para -FIL!`);
}

async function acessarEdicaoUsuario() {
    window.location.href = 'edicao-usuario.html';
    return;
};

popularSelectPontosLeitura();
