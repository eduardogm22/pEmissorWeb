package org.tcc.eduardo.salvamentoFila;

import jakarta.ws.rs.InternalServerErrorException;
import org.codelibs.jcifs.smb.CIFSContext;
import org.codelibs.jcifs.smb.context.SingletonContext;
import org.codelibs.jcifs.smb.impl.NtlmPasswordAuthenticator;
import org.codelibs.jcifs.smb.impl.SmbAuthException;
import org.codelibs.jcifs.smb.impl.SmbFile;
import org.codelibs.jcifs.smb1.SmbException;
import org.tcc.eduardo.entity.PontoLeituraEntity;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

public class GerenciadorArquivosSMB {
    private final PontoLeituraEntity pontoLeituraEntity;

    public GerenciadorArquivosSMB(PontoLeituraEntity pontoLeituraEntity) {
        this.pontoLeituraEntity = pontoLeituraEntity;
    }

    private CIFSContext getAuthContext() {
        CIFSContext context = SingletonContext.getInstance();
        NtlmPasswordAuthenticator credentials = new NtlmPasswordAuthenticator(
                this.pontoLeituraEntity.dominio,
                this.pontoLeituraEntity.usuario,
                this.pontoLeituraEntity.senha
        );
        return context.withCredentials(credentials);
    }

    public boolean testarSalvamento(String url) {
        try ( SmbFile file = new SmbFile(url + "teste.txt", getAuthContext()) ) {
            return file.canRead() && file.canWrite();
        } catch (Exception e) {
            throw new InternalServerErrorException("Erro ao verificar conexão SMB! Erro: " + e.getMessage());
        }
    }

    public void salvarArquivo(String url, String conteudo, String nome) {
        try( SmbFile file = new SmbFile(url + nome, getAuthContext()) ) {
            OutputStream outStream = file.getOutputStream();
            outStream.write(conteudo.getBytes(StandardCharsets.UTF_8));
            outStream.flush();
        } catch (SmbAuthException e) {
            throw new InternalServerErrorException("Erro ao conectar no SMB! Usuário ou senha do Windows incorretos.");
        } catch (SmbException e) {
            throw new InternalServerErrorException("Não foi possível salvar o arquivo na pasta compartilhada: " + e.getMessage());
        } catch (IOException e) {
            throw new InternalServerErrorException("Erro de comunicação com o compartilhamento: " + e.getMessage());
        }
    }
    public String lerArquivo(String url, String nome) {
        try( SmbFile file = new SmbFile(url + nome, getAuthContext()) ) {
            if (file.exists()) {
                OutputStream outputStream = file.getOutputStream();
                return outputStream.toString();
            } else {
                return "";
            }
        } catch (SmbAuthException e) {
            throw new InternalServerErrorException("Erro ao conectar no SMB! Usuário ou senha do Windows incorretos.");
        } catch (SmbException e) {
            throw new InternalServerErrorException("Não foi possível salvar o arquivo na pasta compartilhada: " + e.getMessage());
        } catch (IOException e) {
            throw new InternalServerErrorException("Erro de comunicação com o compartilhamento: " + e.getMessage());
        }
    }
}
