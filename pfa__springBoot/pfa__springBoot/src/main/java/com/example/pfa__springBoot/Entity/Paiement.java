package com.example.pfa__springBoot.Entity;
import jakarta.persistence.*;
import java.util.List;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "paiement")
@Getter @Setter
public class Paiement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double montant;
    @Column(name = "date_paiement")
    private LocalDateTime datePaiement;
    private String statut; // SUCCESS / FAILED

    @ManyToOne
    @JoinColumn(name = "abonnement_id")
    private Abonnement abonnement;
}