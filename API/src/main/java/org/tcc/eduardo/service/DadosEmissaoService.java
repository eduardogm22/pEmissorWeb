package org.tcc.eduardo.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;
import org.jspecify.annotations.NonNull;
import org.tcc.eduardo.dto.DadosEmissaoDTO;
import org.tcc.eduardo.entity.DadosEmissaoEntity;
import org.tcc.eduardo.entity.UsuarioEntity;

@ApplicationScoped
public class DadosEmissaoService {
    @Transactional
    public DadosEmissaoDTO cadastra(DadosEmissaoDTO dadosEmissaoDTO) {
        UsuarioEntity usuarioEntity = UsuarioEntity.findById(dadosEmissaoDTO.usuario_id());
        if (usuarioEntity == null) {
            throw new NotFoundException("Usuário não encontrado!");
        }
        if (DadosEmissaoEntity.findByUsuario_id(dadosEmissaoDTO.usuario_id()) != null) {
            throw new ClientErrorException("Usuário já tem dados emissão cadastrados! Faça uma atualização.", Response.Status.CONFLICT);
        }
        DadosEmissaoEntity dadosEmissaoEntity = salvarDadosEmissaoEntityBD(dadosEmissaoDTO, usuarioEntity);
        return DadosEmissaoDTO.fromEntity(dadosEmissaoEntity);
    }

    private static @NonNull DadosEmissaoEntity salvarDadosEmissaoEntityBD(DadosEmissaoDTO dadosEmissaoDTO, UsuarioEntity usuarioEntity) {
        DadosEmissaoEntity dadosEmissaoEntity = new DadosEmissaoEntity(
                usuarioEntity,
            dadosEmissaoDTO.proxNumeroNFe(),
            dadosEmissaoDTO.proxNumeroNFCe(),
            dadosEmissaoDTO.proxNumeroCTe(),
            dadosEmissaoDTO.proxNumeroNFSe(),
            dadosEmissaoDTO.proxNumeroMDFe(),
            dadosEmissaoDTO.serie(),
            dadosEmissaoDTO.cpfCnpjEmissor(),
            dadosEmissaoDTO.ieEmissor(),
            dadosEmissaoDTO.imEmissor(),
            dadosEmissaoDTO.cUFEmissor(),
            dadosEmissaoDTO.cidadeEmissor()
        );
        dadosEmissaoEntity.persist();
        return dadosEmissaoEntity;
    }

    public DadosEmissaoDTO retornaPorUsuario_id(Long usuario_id) {
        DadosEmissaoEntity dadosEmissaoEntity = DadosEmissaoEntity.findByUsuario_id(usuario_id);
        if (dadosEmissaoEntity == null) {
            throw new NotFoundException("DadosEmissao não encontrados para o usuário id: " + usuario_id);
        }
        return DadosEmissaoDTO.fromEntity(dadosEmissaoEntity);
    }
    @Transactional
    public DadosEmissaoDTO atualiza(DadosEmissaoDTO dadosEmissaoDTO) {
        UsuarioEntity usuarioEntity = UsuarioEntity.findById(dadosEmissaoDTO.usuario_id());
        if (usuarioEntity == null) {
            throw new NotFoundException("Usuário não encontrado!");
        }
        DadosEmissaoEntity dadosEmissaoEntity = DadosEmissaoEntity.findByUsuario_id(dadosEmissaoDTO.usuario_id());

        dadosEmissaoEntity.proxNumeroNFe = dadosEmissaoDTO.proxNumeroNFe();
        dadosEmissaoEntity.proxNumeroNFCe = dadosEmissaoDTO.proxNumeroNFCe();
        dadosEmissaoEntity.proxNumeroNFSe = dadosEmissaoDTO.proxNumeroNFSe();
        dadosEmissaoEntity.proxNumeroCTe = dadosEmissaoDTO.proxNumeroCTe();
        dadosEmissaoEntity.proxNumeroMDFe = dadosEmissaoDTO.proxNumeroMDFe();
        dadosEmissaoEntity.serie = dadosEmissaoDTO.serie();
        dadosEmissaoEntity.cpfCnpjEmissor = dadosEmissaoDTO.cpfCnpjEmissor();
        dadosEmissaoEntity.ieEmissor = dadosEmissaoDTO.ieEmissor();
        dadosEmissaoEntity.imEmissor = dadosEmissaoDTO.imEmissor();
        dadosEmissaoEntity.cUFEmissor = dadosEmissaoDTO.cUFEmissor();
        dadosEmissaoEntity.cidadeEmissor = dadosEmissaoDTO.cidadeEmissor();

        return DadosEmissaoDTO.fromEntity(dadosEmissaoEntity);
    }
    @Transactional
    public void deleta(Long usuario_id) {
        DadosEmissaoEntity dadosEmissaoEntity = DadosEmissaoEntity.findByUsuario_id(usuario_id);
        dadosEmissaoEntity.delete();
    }
}