<?php

namespace App\Repository\auth;

use App\Entity\user\Utilisateur;
use App\DTO\auth\LoginResponseDTO;
use App\DTO\auth\LoginRequestDTO;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserRepository extends ServiceEntityRepository implements IUser
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Utilisateur::class);
    }
// UserRepository.php
public function login(LoginRequestDTO $log ,UserPasswordHasherInterface $passwordHasher): ?Utilisateur
{
    $user = $this->findOneBy(['email' => $log->getEmail()]);

    if (!$user || !$passwordHasher->isPasswordValid($user, $log->getPassword())) {
        return null;
    }

    return $user; 
}

}

