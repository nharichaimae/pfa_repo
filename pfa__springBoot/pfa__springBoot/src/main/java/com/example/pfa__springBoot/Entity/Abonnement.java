package com.example.pfa__springBoot.Entity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;
import java.time.LocalDateTime;

@Entity
@Table(name = "abonnement")
@Getter @Setter
public class Abonnement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String type;

    @Column(name = "date_debut")
    private LocalDate dateDebut;

    @Column(name = "date_fin")
    private LocalDate dateFin;// vient de Symfony
    private String statut; // ACTIF / EXPIRE

    @OneToMany(mappedBy = "abonnement")
    private List<Paiement> paiements;
}