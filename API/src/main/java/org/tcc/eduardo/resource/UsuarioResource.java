package org.tcc.eduardo.resource;

import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.tcc.eduardo.dto.*;
import org.tcc.eduardo.enums.Cargo;
import org.tcc.eduardo.enums.Equipe;
import org.tcc.eduardo.service.UsuarioService;

import java.util.List;

@Path("/usuario")
public class UsuarioResource {
    @Inject
    UsuarioService usuarioService;

    @POST
    @Path("/login")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response verificarLogin(LoginDTO loginDTO) {
        UsuarioOutDTO usuarioOutDTO = usuarioService.verificaLogin(loginDTO.username(), loginDTO.senha());
        return Response.ok()
                .entity(usuarioOutDTO)
                .build();
    }

    @POST
    @Path("/login/admin")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response verificarLoginAdmin(LoginDTO loginDTO) {
        if (usuarioService.verificaLoginAdmin(loginDTO.username(), loginDTO.senha())) {
            return Response.ok().build();
        } else {
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response cadastrarUsuario(@Valid UsuarioInDTO usuarioInDTO) {
        UsuarioOutDTO usuarioOutDTO = usuarioService.cadastra(usuarioInDTO);
        return Response.ok()
                .entity(usuarioOutDTO)
                .build();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response retornarUsuarios() {
        return Response.ok()
                .entity(usuarioService.retornaTodos())
                .build();
    }
    @GET
    @Path("/cargos")
    public Response retornarCargos() {
        Cargo[] cargos = usuarioService.retornaCargos();
        return Response.ok(cargos).build();
    }
    @GET
    @Path("/equipes")
    public Response retornarEquipes() {
        Equipe[] equipes = usuarioService.retornaEquipes();
        return Response.ok(equipes).build();
    }
}
