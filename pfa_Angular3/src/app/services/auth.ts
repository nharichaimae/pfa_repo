import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'token';
  private readonly ROLE_KEY = 'role';
  private readonly USER_ID_KEY = 'userId';
  private readonly NOM_KEY = 'nom';
  private readonly PRENOM_KEY = 'prenom';


  setAuth(token: string, role: string, userId: number,nom: string, prenom: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.ROLE_KEY, role);
    localStorage.setItem(this.USER_ID_KEY, userId.toString());
    localStorage.setItem(this.NOM_KEY, nom);
    localStorage.setItem(this.PRENOM_KEY, prenom);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRole(): string | null {
    return localStorage.getItem(this.ROLE_KEY);
  }

  getUserId(): number | null {
    const id = localStorage.getItem(this.USER_ID_KEY);
    return id ? +id : null;
  }

  getNom(): string | null {
  return localStorage.getItem(this.NOM_KEY);
}

getPrenom(): string | null {
  return localStorage.getItem(this.PRENOM_KEY);
}

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.ROLE_KEY);
    localStorage.removeItem(this.USER_ID_KEY);
    window.location.href = '/login';
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  hasRole(role: string): boolean {
    const userRole = this.getRole();
    return userRole?.toLowerCase() === role.toLowerCase();
  }

  getDecodedToken(): any {
  const token = this.getToken();
  if (!token) return null;

  const payload = token.split('.')[1];
  return JSON.parse(atob(payload));
}

getUserInfo() {
  const decoded = this.getDecodedToken();
  if (!decoded) return null;

  return {
    nom: decoded.nom,
    prenom: decoded.prenom,
    email: decoded.username,
    roles: decoded.roles
  };
}

}
