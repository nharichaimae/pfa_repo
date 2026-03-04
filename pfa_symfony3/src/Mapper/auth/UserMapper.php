<?php

namespace App\auth\Mapper;

use App\Entity\user\Utilisateur;
use App\DTO\auth\LoginResponseDTO;
use App\DTO\auth\UserResponseDTO;

class UserMapper
{
    public static function toLoginResponse(Utilisateur $user, string $token): LoginResponseDTO
    {
        return new LoginResponseDTO(
            true,
            $token,
            $user->getId(),
            $user->getEmail(),
            $user->getRole() ,
            $user->getNom(),    
            $user->getPrenom()   
        );
    }
}
