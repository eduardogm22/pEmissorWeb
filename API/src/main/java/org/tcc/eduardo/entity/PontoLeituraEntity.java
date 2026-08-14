package org.tcc.eduardo.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
public class PontoLeituraEntity extends PanacheEntity {
    @NotNull
    @Column(nullable = false, unique = true)
    public String nome;
    @NotNull
    @Column(nullable = false)
    public String tipoFila;
    @Column
    public String tipoBanco;
    @Column
    public String nomeBanco;
    @NotNull
    @Column(nullable = false, length = 15)
    public String ipv4;
    @Column(length = 5)
    public String porta;
    @NotNull
    @Column(nullable = false)
    public String usuario;
    @NotNull
    @Column(nullable = false)
    public String senha;
    @Column
    public String dominio;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    public UsuarioEntity usuarioEntity;

    public PontoLeituraEntity(String nome, String tipoFila, String tipoBanco, String nomeBanco, String ipv4, String porta, String usuario, String senha, String dominio, UsuarioEntity usuarioEntity) {
        this.nome = nome;
        this.tipoFila = tipoFila;
        this.tipoBanco = tipoBanco;
        this.nomeBanco = nomeBanco;
        this.ipv4 = ipv4;
        this.porta = porta;
        this.usuario = usuario;
        this.senha = senha;
        this.dominio = dominio;
        this.usuarioEntity = usuarioEntity;
    }

    public static PontoLeituraEntity findByName(String nome) {
        return find(
                "nome = ?1", nome)
                .firstResult();
    }
}
