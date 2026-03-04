package com.example.pfa__springBoot.Repository;


import com.example.pfa__springBoot.Entity.Paiement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
public interface PaiementRepository extends JpaRepository<Paiement, Long> {

    @Query("SELECT p FROM Paiement p WHERE p.abonnement.userId = :userId ORDER BY p.datePaiement DESC")
    List<Paiement> findByUserId(@Param("userId") Long userId);
}
