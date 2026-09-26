package com.superdev.helpdesk.services;

import com.superdev.helpdesk.dtos.ticket.*;
import com.superdev.helpdesk.enums.Papel;
import com.superdev.helpdesk.enums.StatusTicket;
import com.superdev.helpdesk.exceptions.RegraNegocio;
import com.superdev.helpdesk.models.Ticket;
import com.superdev.helpdesk.models.Usuario;
import com.superdev.helpdesk.repositories.TicketRepository;
import jakarta.validation.Valid;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
public class TicketService {
    private final TicketRepository repository;
    private final UsuarioService usuarioService;

    public TicketService(TicketRepository repository, UsuarioService usuarioService){
        this.repository = repository;
        this.usuarioService = usuarioService;
    }

    public List<Ticket> listar() {
        return repository.findAll();
    }

    private String gerarNumeroProtocolo(Ticket ticket){
        String dataCriacao = ticket.getDataCriacao().format(DateTimeFormatter.BASIC_ISO_DATE); // ANOMESDIA
        String numero = String.format("%05d", ticket.getId());
        return dataCriacao + "-" + numero;
    }

    public Ticket criar(TicketCriarDto dado){
        Usuario usuario = usuarioService.obterPorId(dado.solicitanteId());
        if (usuario.getPapel() != Papel.SOLICITANTE){
            throw new RegraNegocio("Tickets podem ser abertos somente por usuários com papel de 'SOLICITANTE'");
        }

        String numeroProtocoloFake = UUID.randomUUID().toString().substring(0, 20);

        Ticket ticket = Ticket.builder()
                .titulo(dado.titulo())
                .descricao(dado.descricao())
                .setor(dado.setor())
                .solicitante(usuario)
                .status(StatusTicket.ABERTO)
                .numeroProtocolo(numeroProtocoloFake)
                .build();

        /*
        * Executa o INSERT agora, ainda dentro da transação (sem commit). O banco gera o valor da
        * da coluna IDENTITY e o Hibernate preenche o ticket.getId()
        * */
        repository.saveAndFlush(ticket);

        // Com id e data é possível gerar o número do protocolo
        String numeroProtocolo = gerarNumeroProtocolo(ticket);
        ticket.setNumeroProtocolo(numeroProtocolo);

        return ticket;
    }

    public Ticket associar(int id, TicketAssociarDto dado){
        Ticket ticket = repository.findById(id).orElseThrow();
        Usuario usuario = usuarioService.obterPorId(dado.usuarioId());

        if(ticket.getStatus() != StatusTicket.ABERTO){
            throw new RegraNegocio("Tickets podem ser associados somente com status Aberto");
        }

        if(usuario.getPapel() != Papel.ATENDENTE){
            throw new RegraNegocio("Tickets podem ser associados somente usuários com papel de Atendente");
        }

        ticket.setAtendente(usuario);
        ticket.setStatus(StatusTicket.EM_ANALISE);
        return repository.save(ticket);
    }

    public Ticket cancelar(int id, TicketCancelarDto dado) {
        Ticket ticket = repository.findById(id).orElseThrow();

        if (ticket.getStatus() == StatusTicket.CANCELADO){
            throw new RegraNegocio("Tickets não podem ser cancelados quando já estão cancelados");
        }else if (ticket.getStatus() == StatusTicket.RESOLVIDO){
            throw new RegraNegocio("Tickets não podem ser cancelados quando já estão resolvido");
        }

        ticket.setStatus(StatusTicket.CANCELADO);
        ticket.setMotivoCancelamento(dado.motivoCancelamento());
        return repository.save(ticket);
    }

    public Ticket resolver(int id, TicketResolverDto dado) {
        Ticket ticket = repository.findById(id).orElseThrow();

        if (ticket.getStatus() != StatusTicket.EM_ANALISE){
            throw new RegraNegocio("Ticket não pode ser resolvido quando não estiver em análise");
        }

        ticket.setStatus(StatusTicket.RESOLVIDO);
        ticket.setDescricaoSolucao(dado.descricaoSolucao());
        return repository.save(ticket);
    }

    public Ticket definirPrioridade(int id, @Valid TicketDefinirPrioridadeDto dado) {
        Ticket ticket = repository.findById(id).orElseThrow();

        if (ticket.getStatus() != StatusTicket.EM_ANALISE){
            throw new RegraNegocio("Não é possível definir prioridade do ticket quando status não está em análise");
        }

        ticket.setPrioridade(dado.prioridade());
        return repository.save(ticket);
    }
}