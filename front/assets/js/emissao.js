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
        "Gerenciamento de Cases (Templates)";
    document.getElementById("view-gerenciar-cases").classList.add("active");
    atualizarTabelaCasesMock();
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
    atualizarTabelaCasesMock();
}

function atualizarTabelaCasesMock() {
    const filtroDoc = document.getElementById("case-filter-doc").value;
    const tbody = document.getElementById("tbody-cases");
    tbody.innerHTML = "";

    const casesFiltrados = databaseCases.filter((c) => {
        const bateDoc = c.doc === filtroDoc;
        const eMeu = c.dono === "Eduardo G.";
        return bateDoc && (mostrandoCasesProprios ? eMeu : !eMeu);
    });

    if (casesFiltrados.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--text-muted); padding: 24px;">Nenhum Case encontrado.</td></tr>`;
        return;
    }

    casesFiltrados.forEach((c) => {
        let botoesAcao = "";
        let avatarClass =
            c.dono === "Eduardo G." ? "table-avatar me" : "table-avatar";
        let nomeExibicao = c.favorito ? `⭐ ${c.nome}` : c.nome;

        if (mostrandoCasesProprios) {
            botoesAcao = `
                <button class="btn-table-action edit" onclick="exibirFormularioCase(true, ${c.id})">✏️ Editar</button>
                <button class="btn-table-action delete" onclick="excluirCaseDoBanco(${c.id})">🗑️ Deletar</button>
            `;
        } else {
            botoesAcao = `
                <button class="btn-table-action edit" onclick="visualizarCasePrompt(${c.id})">👁️ Ver TXT</button>
                <button class="btn-table-action clone" onclick="clonarCaseDeTerceiro(${c.id})">👯 Clonar</button>
            `;
        }

        tbody.innerHTML += `
            <tr>
                <td style="font-weight:600;">${nomeExibicao}</td>
                <td><span class="badge-user" style="background-color:#fff7ed; color:var(--primary);">${c.doc}</span></td>
                <td>
                    <div class="owner-cell">
                        <div class="${avatarClass}">${c.iniciais}</div>
                        <span style="font-weight: 500;">${c.dono}</span>
                    </div>
                </td>
                <td style="text-align: right;"><div class="table-actions" style="justify-content: flex-end;">${botoesAcao}</div></td>
            </tr>
        `;
    });
}

/* --- LÓGICA DA NOVA TELA DE ADIÇÃO E EDIÇÃO --- */
function exibirFormularioCase(isEdicao, id = null) {
    document.getElementById("panel-cases-lista").style.display = "none";
    document.getElementById("panel-cases-form").style.display = "flex";

    if (isEdicao && id) {
        document.getElementById("form-case-title").innerText = "✏️ Editar Case";
        const item = databaseCases.find((c) => c.id === id);
        document.getElementById("form-case-id").value = item.id;
        document.getElementById("form-case-doc").value = item.doc;
        document.getElementById("form-case-nome").value = item.nome;
        document.getElementById("form-case-favorito").checked =
            item.favorito || false;
        document.getElementById("form-case-obs").value = item.obs || "";
        document.getElementById("form-case-txt").value = item.txt;
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

function salvarFormularioCaseDoBanco() {
    const id = document.getElementById("form-case-id").value;
    const doc = document.getElementById("form-case-doc").value;
    const nome = document.getElementById("form-case-nome").value.trim();
    const favorito = document.getElementById("form-case-favorito").checked;
    const obs = document.getElementById("form-case-obs").value.trim();
    const txt = document.getElementById("form-case-txt").value;

    if (!nome) {
        alert("Por favor, digite um nome para identificar o seu case.");
        return;
    }

    if (id) {
        // Modo Edição
        const index = databaseCases.findIndex((c) => c.id == id);
        if (index !== -1) {
            databaseCases[index].doc = doc;
            databaseCases[index].nome = nome;
            databaseCases[index].favorito = favorito;
            databaseCases[index].obs = obs;
            databaseCases[index].txt = txt;
        }
    } else {
        // Modo Inserção
        const novoCase = {
            id: Date.now(),
            nome: nome,
            doc: doc,
            dono: "Eduardo G.",
            iniciais: "EG",
            txt: txt,
            favorito: favorito,
            obs: obs,
        };
        databaseCases.push(novoCase);
    }

    fecharFormularioCase();
    atualizarTabelaCasesMock();
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
        atualizarTabelaCasesMock();
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

function abrirModalSelecaoRapida() {
    const contextoDoc = document
        .getElementById("page-title-context")
        .innerText.replace("Emissor de ", "");
    const templatesDisponiveis = databaseCases.filter(
        (c) => c.doc === contextoDoc,
    );

    if (templatesDisponiveis.length === 0) {
        alert(`Nenhum case cadastrado para ${contextoDoc}.`);
        return;
    }

    let menuOpcoes = `Escolha um template de ${contextoDoc}:\n\n`;
    templatesDisponiveis.forEach((c, index) => {
        let prefixo = c.favorito ? "⭐ " : "";
        menuOpcoes += `${index + 1} - ${prefixo}${c.nome} (${c.dono})\n`;
    });

    const escolha = prompt(menuOpcoes);
    if (escolha && escolha > 0 && escolha <= templatesDisponiveis.length) {
        const caseEscolhido = templatesDisponiveis[escolha - 1];
        document.getElementById("active-case-text").innerText =
            caseEscolhido.nome;
        document.getElementById("btn-clear-case").style.display =
            "inline-block";
        document.getElementById("editor-txt").value = caseEscolhido.txt;
    }
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
    const tipoBanco = document.getElementById("cfg-tipo-banco");
    const nomeBanco = document.getElementById("cfg-nome-bd");
    const ipv4_bd = document.getElementById("cfg-ipv4-banco");
    const porta = document.getElementById("cfg-porta-banco");
    const usuario_bd = document.getElementById("cfg-usuario-banco");
    const senha_bd = document.getElementById("cfg-senha-banco");
    const ipv4_pasta = document.getElementById("cfg-ipv4-pasta");
    const usuario_pasta = document.getElementById("cfg-usuario-windows");
    const senha_pasta = document.getElementById("cfg-senha-windows");
    const dominio = document.getElementById("cfg-dominio");

    if (idPontoLeitura == null) {
        nomePonto_bd.value = "";
        nomePonto_pasta.value = "";
        tipoBanco.value = "";
        nomeBanco.value = "";
        ipv4_bd.value = "";
        porta.value = "";
        usuario_bd.value = "";
        senha_bd.value = "";
        ipv4_pasta.value = "";
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
                        ipv4_pasta.value = ponto.ipv4 || "";
                        dominio.value = ponto.dominio || "";

                        nomePonto_bd.value = "";
                        porta.value = "";
                        usuario_bd.value = "";
                        senha_bd.value = "";
                        tipoBanco.value = "";
                        nomeBanco.value = "";
                        ipv4_bd.value = "";
                    } else {
                        alternarFilaConfiguracao("fila-banco");

                        nomePonto_bd.value = ponto.nome || "";
                        porta.value = ponto.porta || "";
                        usuario_bd.value = ponto.usuario || "";
                        senha_bd.value = ponto.senha || "";
                        tipoBanco.value = ponto.tipoBanco || "";
                        nomeBanco.value = ponto.nomeBanco || "";
                        ipv4_bd.value = ponto.ipv4 || "";

                        nomePonto_pasta.value = "";
                        usuario_pasta.value = "";
                        senha_pasta.value = "";
                        ipv4_pasta.value = "";
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
            ipv4: document.getElementById("cfg-ipv4-banco").value.trim(),
            porta: document.getElementById("cfg-porta-banco").value.trim(),
            usuario: document.getElementById("cfg-usuario-banco").value.trim(),
            senha: document.getElementById("cfg-senha-banco").value,
            dominio: "",
        };
    }

    return {
        nome: document.getElementById("cfg-nome-ponto-pasta").value.trim(),
        tipoFila,
        tipoBanco: "",
        ipv4: document.getElementById("cfg-ipv4-pasta").value.trim(),
        porta: "",
        usuario: document.getElementById("cfg-usuario-windows").value.trim(),
        senha: document.getElementById("cfg-senha-windows").value,
        dominio: document.getElementById("cfg-dominio").value.trim(),
    };
}

function validarPontoLeitura(dados) {
    const camposObrigatorios = [
        [dados.nome, "Por favor, digite um nome para o ponto de leitura."],
        [dados.tipoFila, "Por favor, selecione um tipo de fila."],
        [dados.ipv4, "Por favor, informe o endereço IPv4."],
        [dados.usuario, "Por favor, informe o usuário."],
        [dados.senha.trim(), "Por favor, informe a senha."],
    ];

    if (dados.tipoFila === "fila-banco") {
        camposObrigatorios.push(
            [dados.tipoBanco, "Por favor, selecione um tipo de banco de dados."],
            [dados.porta, "Por favor, informe a porta do banco de dados."],
        );
    }

    const campoInvalido = camposObrigatorios.find(([valor]) => !valor);
    if (campoInvalido) {
        abrirModalMensagem("Atenção!", campoInvalido[1], "alerta");
        return false;
    }

    if (!["fila-pasta", "fila-banco"].includes(dados.tipoFila)) {
        abrirModalMensagem("Atenção!", "Selecione um tipo de fila válido.", "alerta");
        return false;
    }

    if (dados.ipv4.length > 15 || !/^(?:25[0-5]|2[0-4]\d|1?\d?\d)(?:\.(?:25[0-5]|2[0-4]\d|1?\d?\d)){3}$/.test(dados.ipv4)) {
        abrirModalMensagem("Atenção!", "Informe um endereço IPv4 válido, como 192.168.1.36.", "alerta");
        return false;
    }

    if (dados.tipoFila === "fila-banco" && (!/^\d{1,5}$/.test(dados.porta) || Number(dados.porta) < 1 || Number(dados.porta) > 65535)) {
        abrirModalMensagem("Atenção!", "A porta deve conter de 1 a 5 dígitos e estar entre 1 e 65535.", "alerta");
        return false;
    }

    const campoComLimiteExcedido = [
        [dados.nome, "O nome do ponto de leitura"],
        [dados.tipoFila, "O tipo de fila"],
        [dados.tipoBanco, "O tipo de banco"],
        [dados.usuario, "O usuário"],
        [dados.senha, "A senha"],
        [dados.dominio, "O domínio"],
    ].find(([valor]) => valor.length > 255);

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
        console.log(resp.body == "");
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
        console.log(resp.body == "");
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
    console.log("Iniciando o salvamento dos dados do emissor...");
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
