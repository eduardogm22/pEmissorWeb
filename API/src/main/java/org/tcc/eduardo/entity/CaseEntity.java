package org.tcc.eduardo.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.tcc.eduardo.enums.TipoDoc;
import java.time.LocalDateTime;

@Entity
@Table(indexes = {
        @Index(name = "idx_case_proprietario", columnList = "proprietario_id"),
        @Index(name = "idx_case_copiadoDe", columnList = "copiadode_id"),
        @Index(name = "idx_case_case", columnList = "ativo"),
        @Index(name = "idx_case_tipoDoc", columnList = "tipoDoc"),
})
public class CaseEntity extends PanacheEntity {
    @NotNull
    @Size(min = 5)
    @Column(nullable = false)
    public String nome;

    @Column
    public String descricao;

    @NotNull
    @Lob
    @Column(nullable = false)
    public String conteudo;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    public TipoDoc tipoDoc;

    @ManyToOne(fetch = FetchType.LAZY)
    public UsuarioEntity proprietario;

    @ManyToOne(fetch = FetchType.LAZY)
    public UsuarioEntity copiadoDe;

    @NotNull
    @Column(nullable = false)
    public boolean ativo;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    public LocalDateTime dhCadastro;

    @Column(nullable = false)
    @UpdateTimestamp
    public LocalDateTime dhUltimaAtualizacao;

    @ColumnDefault("0")
    public Integer qtdUsos;

    @ColumnDefault("false")
    public boolean favorito;
}
