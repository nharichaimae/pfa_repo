<?php

namespace App\Repository\auth;

use App\Entity\user\Utilisateur;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use App\DTO\auth\LoginRequestDTO;
use App\DTO\auth\LoginResponseDTO;

interface IUser
{

    public function login(
        LoginRequestDTO $log,
        UserPasswordHasherInterface $passwordHasher
    ): ?Utilisateur;
}
