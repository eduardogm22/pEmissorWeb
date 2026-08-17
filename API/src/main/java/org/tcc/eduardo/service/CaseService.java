package org.tcc.eduardo.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.NotFoundException;
import org.jspecify.annotations.NonNull;
import org.tcc.eduardo.dto.CaseInDTO;
import org.tcc.eduardo.dto.CaseOutDTO;
import org.tcc.eduardo.entity.CaseEntity;
import org.tcc.eduardo.entity.UsuarioEntity;
import org.tcc.eduardo.enums.TipoDoc;

import java.util.List;
import java.util.stream.Stream;

@ApplicationScoped
public class CaseService {
    @Transactional
    public CaseOutDTO cadastra(CaseInDTO caseInDTO) {
        UsuarioEntity proprietario = UsuarioEntity.findById(caseInDTO.idProprietario());
        if (proprietario == null) {
            throw new NotFoundException("Usuário não encontrado!");
        }
        if( caseInDTO.nome().isBlank() || caseInDTO.conteudo().isBlank() || caseInDTO.tipoDoc() == null ) {
            throw new BadRequestException("Campos obrigatórios faltando na requisição.");
        }
        CaseEntity caseEntity = salvarCaseEntityBD(caseInDTO, proprietario);
        return CaseOutDTO.fromEntity(caseEntity);
    }
    public List<CaseOutDTO> retorna(TipoDoc tipoDoc, Long idProprietario, boolean buscarDosOutros) {
        if(tipoDoc == null) {
            throw new BadRequestException("Tipo de documento não informado!");
        }
        if ( idProprietario != null && !buscarDosOutros ) {
            return retornaPorIdProprietario(tipoDoc, idProprietario);
        } else if ( idProprietario != null ) {
            return retornaDosOutros(tipoDoc, idProprietario);
        } else {
            return retornaTodosDoDoc(tipoDoc);
        }
    }
    public List<CaseOutDTO> retornaTodosDoDoc(TipoDoc tipoDoc) {
        try ( Stream<CaseEntity> caseStream = CaseEntity.findAll().stream() ) {
            return caseStream
                    .filter(caseEntity -> caseEntity.tipoDoc == tipoDoc)
                    .map(CaseOutDTO::fromEntity)
                    .toList();
        }
    }
    public List<CaseOutDTO> retornaPorIdProprietario(TipoDoc tipoDoc, Long idProprietario) {
        UsuarioEntity proprietario = UsuarioEntity.findById(idProprietario);
        if (proprietario == null) {
            throw new NotFoundException("Usuário não encontrado!");
        }
        try( Stream<CaseEntity> caseStream = proprietario.caseEntities.stream() ) {
            return caseStream
                    .filter(caseEntity -> caseEntity.tipoDoc == tipoDoc)
                    .map(CaseOutDTO::fromEntity)
                    .toList();
        }
    }
    public List<CaseOutDTO> retornaDosOutros(TipoDoc tipoDoc, Long idProprietario) {
        try ( Stream<CaseEntity> caseStream = CaseEntity.findDosOutros(idProprietario).stream() ) {
            return caseStream
                    .filter(caseEntity -> caseEntity.tipoDoc == tipoDoc)
                    .map(CaseOutDTO::fromEntity)
                    .toList();
        }
    }
    public CaseOutDTO retornaPorId(Long id) {
        CaseEntity caseEntity = CaseEntity.findById(id);
        if(caseEntity == null) {
            throw new NotFoundException("Case não encontrado!");
        }
        return CaseOutDTO.fromEntity(caseEntity);
    }



    private static @NonNull CaseEntity salvarCaseEntityBD(CaseInDTO caseInDTO, UsuarioEntity proprietario) {
        CaseEntity caseEntity = new CaseEntity(
                caseInDTO.nome(),
                caseInDTO.descricao(),
                caseInDTO.conteudo(),
                caseInDTO.tipoDoc(),
                proprietario,
                caseInDTO.favorito()
        );
        caseEntity.persist();
        return caseEntity;
    }
}
