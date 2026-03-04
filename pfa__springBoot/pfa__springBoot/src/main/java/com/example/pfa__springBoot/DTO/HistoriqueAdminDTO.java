package com.example.pfa__springBoot.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class HistoriqueAdminDTO {


    private String nom;
    private String prenom;
    private Double montant;
    private String statutPaiement;
    private String statutAbonnement;
}
