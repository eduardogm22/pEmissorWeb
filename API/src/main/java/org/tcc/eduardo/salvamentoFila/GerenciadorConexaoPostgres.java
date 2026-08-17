package org.tcc.eduardo.salvamentoFila;

import jakarta.ws.rs.InternalServerErrorException;
import org.tcc.eduardo.entity.PontoLeituraEntity;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.Collections;
import java.util.List;

public class GerenciadorConexaoPostgres {
    private final PontoLeituraEntity pontoLeituraEntity;

    public GerenciadorConexaoPostgres(PontoLeituraEntity pontoLeituraEntity) {
        this.pontoLeituraEntity = pontoLeituraEntity;
    }

    private Connection getConnection() {
        try {
            String url = "jdbc:postgresql://" + pontoLeituraEntity.url + ":" + pontoLeituraEntity.porta + "/" + pontoLeituraEntity.nomeBanco;
            System.out.println(url);
            return DriverManager.getConnection(url, pontoLeituraEntity.usuario, pontoLeituraEntity.senha);
        } catch (SQLException e) {
            throw new InternalServerErrorException("Erro ao conectar ao banco de dados! " + e.getMessage());
        }
    }
    public void inserirRegistro(String tabela, List<Object> lstValores) {
        String strValores = String.join(", ", Collections.nCopies(lstValores.size(), "?"));
        String sql = String.format("INSERT INTO %s VALUES (%s);", tabela, strValores);
        try ( PreparedStatement stmt = this.getConnection().prepareStatement(sql) ) {
            for (int i = 0; i < lstValores.size(); i++) {
                stmt.setObject(i + 1, lstValores.get(i));
            }
            stmt.executeUpdate();
        } catch (SQLException e) {
            throw new InternalServerErrorException("Erro ao inserir registra na tabela " + tabela + "! " + e.getMessage());
        }
    }
}
