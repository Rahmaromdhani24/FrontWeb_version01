import { PlanActionDTO } from "./PlanActionDTO";

export interface PdekAvecPlans {
  id: number;
  totalPages: number;
  sectionFil: string;
  frequenceControle: number;
  segment: number;
  numMachine: string;
  dateCreation: string; // Format ISO (ex: "2024-05-07")
  typeOperation: string; // ou enum si tu en as un
  plant: string; // ou enum Plant si défini dans ton Angular
  numeroOutils: string;
  numeroContacts: string;
  LGD: string;
  tolerance: number;
  posGradant: string;
  users: any; // ou `string[]` si c’est une liste de "matricule - nom prénom"
  poste: string;
  plans: PlanActionDTO[];
}
