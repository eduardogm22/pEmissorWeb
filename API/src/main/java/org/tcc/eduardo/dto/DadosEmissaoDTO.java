package org.tcc.eduardo.dto;

import org.tcc.eduardo.entity.DadosEmissaoEntity;

import java.time.LocalDateTime;

public record DadosEmissaoDTO(
    Long usuario_id,
    Long proxNumeroNFe,
    Long proxNumeroNFCe,
    Long proxNumeroCTe,
    Long proxNumeroNFSe,
    Long proxNumeroMDFe,
    Integer serie,
    LocalDateTime dhEmissao,
    String cpfCnpjEmissor,
    String ieEmissor,
    String imEmissor,
    String cUFEmissor,
    String cidadeEmissor
) {
    public static DadosEmissaoDTO fromEntity(DadosEmissaoEntity dadosEmissaoEntity) {
        return new DadosEmissaoDTO(
            dadosEmissaoEntity.usuarioEntity.id,
            dadosEmissaoEntity.proxNumeroNFe,
            dadosEmissaoEntity.proxNumeroNFCe,
            dadosEmissaoEntity.proxNumeroCTe,
            dadosEmissaoEntity.proxNumeroNFSe,
            dadosEmissaoEntity.proxNumeroMDFe,
            dadosEmissaoEntity.serie,
            null,
            dadosEmissaoEntity.cpfCnpjEmissor,
            dadosEmissaoEntity.ieEmissor,
            dadosEmissaoEntity.imEmissor,
            dadosEmissaoEntity.cUFEmissor,
            dadosEmissaoEntity.cidadeEmissor
        );
    }
}