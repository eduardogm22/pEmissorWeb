package org.tcc.eduardo.service;

import io.quarkus.security.UnauthorizedException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.ClientErrorException;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.tcc.eduardo.dto.UsuarioInDTO;
import org.tcc.eduardo.dto.UsuarioOutDTO;
import org.tcc.eduardo.entity.UsuarioEntity;
import org.tcc.eduardo.enums.Cargo;
import org.tcc.eduardo.enums.Equipe;

import java.util.List;
import java.util.stream.Stream;

@ApplicationScoped
public class UsuarioService {
    @ConfigProperty(name = "admin.username")
    String adminUsername;

    @ConfigProperty(name = "admin.password")
    String adminPassword;

    public UsuarioOutDTO verificaLogin(String username, String senha) {
        UsuarioEntity usuarioEntity = UsuarioEntity.findByUsernameSenha(username, senha);

        if (usuarioEntity == null) throw new UnauthorizedException();

        return UsuarioOutDTO.fromEntity(usuarioEntity);
    }
    public boolean verificaLoginAdmin(String username, String senha) {
        return adminUsername.equals(username) && adminPassword.equals(senha);
    }
    @Transactional
    public UsuarioOutDTO cadastra(UsuarioInDTO usuarioIn) {
        if ( UsuarioEntity.findByUsername(usuarioIn.username()) != null ) {
            throw new ClientErrorException("Username não está disponível. Escolha outro.", Response.Status.CONFLICT);
        }
        UsuarioEntity usuarioEntity = new UsuarioEntity(
            usuarioIn.username(),
            usuarioIn.senha(),
            usuarioIn.nome(),
            usuarioIn.sobrenome(),
            usuarioIn.email(),
            usuarioIn.equipe(),
            usuarioIn.cargo(),
            null
        );
        usuarioEntity.persist();
        return UsuarioOutDTO.fromEntity(usuarioEntity);
    }

    @Transactional
    public UsuarioOutDTO atualiza(Long id, UsuarioInDTO usuarioInDTO) {
        UsuarioEntity usuarioEntity = UsuarioEntity.findById(id);
        if (usuarioEntity == null) {
            throw new NotFoundException("Usuário não encontrado!");
        }

        if (!usuarioEntity.username.equals(usuarioInDTO.username()) && UsuarioEntity.findByUsername(usuarioInDTO.username()) != null) {
            throw new ClientErrorException("Username não está disponível. Escolha outro.", Response.Status.CONFLICT);
        }
        if ( usuarioInDTO.senha() != null ) {
            if (!usuarioInDTO.senha().isBlank()) {
                usuarioEntity.senha = usuarioInDTO.senha();
            }
        }
        usuarioEntity.username = usuarioInDTO.username();
        usuarioEntity.nome = usuarioInDTO.nome();
        usuarioEntity.sobrenome = usuarioInDTO.sobrenome();
        usuarioEntity.email = usuarioInDTO.email();
        usuarioEntity.equipe = usuarioInDTO.equipe();
        usuarioEntity.cargo = usuarioInDTO.cargo();
//        usuarioInDTO.idPontoLeitura() nao implementado a atualizacao disso aq, mas tem no dto caso precise futuramente

        return UsuarioOutDTO.fromEntity(usuarioEntity);
    }

    public List<UsuarioOutDTO> retornaTodos() {
        try (Stream<UsuarioEntity> stmUsuarios = UsuarioEntity.streamAll()) {
            List<UsuarioOutDTO> lstUsuarios = stmUsuarios
                    .map(UsuarioOutDTO::fromEntity)
                    .toList();

        if (lstUsuarios.isEmpty()) { throw new NotFoundException(); }

        return lstUsuarios;
        }
    }
    public Cargo[] retornaCargos() {
        return Cargo.values();
    }
    public Equipe[] retornaEquipes() {
        return Equipe.values();
    }
}
