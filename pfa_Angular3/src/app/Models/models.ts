export interface Equipement {
  id: number;
  nom: string;
  type: string;
  idPiece: number;
  nomPiece: string;
}

export interface ConditionCreate {
  idEquipement: number;
  nomEquipement: string;
  valeur: string;
  dateHeure: string;
}

export interface Condition {
  id: number;
  idEquipement: number;
  nomEquipement: string;
  typeEquipement: string;
  valeur: string;
  dateHeure: string;
}

export interface RegleCreate {
  dateRegle: string | null; 
  heureDebut: string;
  heureFin: string;
  idEquipement: number;
  jours?: string;
  chaqueJour: boolean;
}

export interface Regle {
  idRegle: number;
  dateRegle: string | null; 
  heureDebut: string;
  heureFin: string;
  idEquipement: number;
  nomEquipement: string;
  typeEquipement: string;
  jours?: string;
  chaqueJour: boolean;
}