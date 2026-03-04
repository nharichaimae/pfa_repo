package com.example.pfa__springBoot.Controller;


import com.example.pfa__springBoot.DTO.HistoriqueAdminDTO;
import com.example.pfa__springBoot.DTO.UserDTO;
import com.example.pfa__springBoot.Entity.Paiement;
import com.example.pfa__springBoot.Mapper.PaiementMapper;
import com.example.pfa__springBoot.Service.PaiementService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final PaiementService paiementService;
    private final PaiementMapper paiementMapper; // Injection du mapper

    @GetMapping("historique")
    public List<HistoriqueAdminDTO> getHistorique(@RequestHeader("Authorization") String authHeader) {

        List<Paiement> paiements = paiementService.getPaiements();

        return paiements.stream()
                .map(p -> {
                    UserDTO user = paiementService.getUserById(
                            p.getAbonnement().getUserId(),
                            authHeader
                    );

                    return paiementMapper.toHistoriqueAdminDTO(p, user);
                })
                .toList();
    }
}
