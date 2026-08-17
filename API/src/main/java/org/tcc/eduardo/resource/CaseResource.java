package org.tcc.eduardo.resource;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Response;
import org.tcc.eduardo.dto.CaseInDTO;
import org.tcc.eduardo.dto.CaseOutDTO;
import org.tcc.eduardo.enums.TipoDoc;
import org.tcc.eduardo.service.CaseService;

import java.util.List;

@Path("/case")
public class CaseResource extends PanacheEntity {
    @Inject
    CaseService caseService;

    @POST
    public Response cadastrarCase(CaseInDTO caseInDTO) {
        CaseOutDTO caseOutDTO = caseService.cadastra(caseInDTO);
        return Response.ok()
                .entity(caseOutDTO)
                .build();
    }
    @GET
    public Response retornarCases(
            @QueryParam("tipoDoc") TipoDoc tipoDoc,
            @QueryParam("idProprietario") Long idProprietario,
            @QueryParam("dosOutros") boolean buscarDosOutros
    ) {
        List<CaseOutDTO> lstCaseOutDTO = caseService.retorna(tipoDoc, idProprietario, buscarDosOutros);
        return Response
                .ok()
                .entity(lstCaseOutDTO)
                .build();
    }
    @GET
    @Path("{id}")
    public Response retornarCasePorId(Long id) {
        CaseOutDTO caseOutDTO = caseService.retornaPorId(id);
        return Response
                .ok()
                .entity(caseOutDTO)
                .build();
    }
}
