async function executarLogin() {
    encerrarSessaoAdministrador();
    const userField = document.getElementById("login-user").value.trim();
    const passwordField = document.getElementById("login-password").value;
    const errorMsg = document.getElementById("login-error-msg");

    errorMsg.style.display = "none";

    const resp = await httpRequest("POST", ROTAS_API.permissaoUsuario(), { username: userField, senha: passwordField });
    
    if (resp.status == 200) {
        errorMsg.textContent = "✅ Login efetuado com sucesso!";
        errorMsg.style.display = "block";
        localStorage.setItem("dadosUsuario", JSON.stringify(resp.body));
        window.location.href = "pages/emissao.html";
    } else if (resp.status === 401) {
        localStorage.removeItem("dadosUsuario");
        errorMsg.textContent = "⚠️ Usuário ou senha incorretos.";
    } else {
        localStorage.removeItem("dadosUsuario");
        errorMsg.textContent = "❌ Erro de comunicação, verifique a API! " + resp.body.message;
    } 
    errorMsg.style.display = "block";
}

async function autenticarAdministrador(username, senha) {
    return httpRequest('POST', ROTAS_API.permissaoAdministrador(), { username, senha });
}

async function acessarCadastroUsuarios() {
    
    const userField = document.getElementById('login-user').value.trim();
    const passwordField = document.getElementById('login-password').value;
    const errorMsg = document.getElementById('login-error-msg');

    errorMsg.style.display = 'none';

    if (!userField || !passwordField) {
        errorMsg.textContent = '⚠️ Informe o usuário e a senha de administrador.';
        errorMsg.style.display = 'block';
        return;
    }

    const resp = await autenticarAdministrador(userField, passwordField);

    if (resp.ok) {
        registrarSessaoAdministrador(userField, passwordField);
        window.location.href = 'cadastro-usuarios.html';
        return;
    }

    if (resp.status === 401) {
        encerrarSessaoAdministrador();
        errorMsg.textContent = '⚠️ Usuário ou senha de administrador incorretos.';
    } else {
        encerrarSessaoAdministrador();
        errorMsg.textContent = '❌ Erro de comunicação, verifique a API! ' + (resp.body?.message || '');
    }
    errorMsg.style.display = 'block';
}

async function sessaoAdministradorValida() {
    sessao = obterDadosSessaoAdministrador();
    if (!sessao) return false;

    const { userField, passwordField } = sessao;
    if (!userField || !passwordField) return false;

    resp = await autenticarAdministrador(userField, passwordField);
    if (!resp) return false;

    return resp.ok;
}
