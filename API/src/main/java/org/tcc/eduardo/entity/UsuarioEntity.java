package org.tcc.eduardo.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.tcc.eduardo.enums.Cargo;
import org.tcc.eduardo.enums.Equipe;

import java.util.List;

@Entity
public class UsuarioEntity extends PanacheEntity {
    @NotNull
    @Size(min = 3, max = 100)
    @Column(nullable = false, length = 50, unique = true)
    public String username;

    @Column(nullable = false, length = 50)
    @NotNull
    @Size(min = 2, max = 100)
    public String senha;

    @Column(nullable = false, length = 100)
    @NotNull
    @Size(min = 2, max = 100)
    public String nome;

    @Column(nullable = false, length = 100)
    @NotNull
    @Size(min = 2, max = 100)
    public String sobrenome;

    @Column(length = 150)
    @Size(max = 150)
    public String email;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    public Equipe equipe;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    public Cargo cargo;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ponto_leitura_ativo_id")
    public PontoLeituraEntity pontoLeituraAtivo;

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    public List<PontoLeituraEntity> pontosLeitura;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    public DadosEmissaoEntity dadosEmissaoEntity;

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "proprietario_id")
    public List<CaseEntity> caseEntities;

    public UsuarioEntity(String username, String senha, String nome, String sobrenome, String email, Equipe equipe, Cargo cargo, PontoLeituraEntity pontoLeituraAtivo) {
        this.username = username;
        this.senha = senha;
        this.nome = nome;
        this.sobrenome = sobrenome;
        this.email = email;
        this.equipe = equipe;
        this.cargo = cargo;
        this.pontoLeituraAtivo = pontoLeituraAtivo;
    }

    public static UsuarioEntity findByUsernameSenha(String username, String senha) {
        return find(
                "username = ?1 and senha = ?2",
                username, senha)
                .firstResult();
    }
    public static UsuarioEntity findByUsername(String username) {
        return find(
                "LOWER(username) = LOWER(?1)",
                username)
                .firstResult();
    }
}
