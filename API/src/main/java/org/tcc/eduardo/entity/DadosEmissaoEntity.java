package org.tcc.eduardo.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

@Entity
public class DadosEmissaoEntity extends PanacheEntity {
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    public UsuarioEntity usuarioEntity;

    @Column(nullable = false)
    public Long proxNumeroNFe;

    @Column(nullable = false)
    public Long proxNumeroNFCe;

    @Column(nullable = false)
    public Long proxNumeroCTe;

    @Column(nullable = false)
    public Long proxNumeroNFSe;

    @Column(nullable = false)
    public Long proxNumeroMDFe;

    @Column(nullable = false)
    public Integer serie;

    @Column
    public String cpfCnpjEmissor;

    @Column
    public String ieEmissor;

    @Column
    public String imEmissor;

    @Column
    public String cUFEmissor;

    @Column
    public String cidadeEmissor;

    public DadosEmissaoEntity(UsuarioEntity usuarioEntity, Long proxNumeroNFe, Long proxNumeroNFCe, Long proxNumeroCTe, Long proxNumeroNFSe, Long proxNumeroMDFe, Integer serie, String cpfCnpjEmissor, String ieEmissor, String imEmissor, String cUFEmissor, String cidadeEmissor) {
        this.usuarioEntity = usuarioEntity;
        this.proxNumeroNFe = proxNumeroNFe;
        this.proxNumeroNFCe = proxNumeroNFCe;
        this.proxNumeroCTe = proxNumeroCTe;
        this.proxNumeroNFSe = proxNumeroNFSe;
        this.proxNumeroMDFe = proxNumeroMDFe;
        this.serie = serie;
        this.cpfCnpjEmissor = cpfCnpjEmissor;
        this.ieEmissor = ieEmissor;
        this.imEmissor = imEmissor;
        this.cUFEmissor = cUFEmissor;
        this.cidadeEmissor = cidadeEmissor;
    }

    public static DadosEmissaoEntity findByUsuario_id(Long usuario_id) {
        return DadosEmissaoEntity.find(
                "usuarioEntity.id",
                usuario_id)
                .firstResult();
    }
}
