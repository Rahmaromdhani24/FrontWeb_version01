export interface PdekResultat {
    id: number;
    typeOperation: string;
    typePistolet: string;
    categorie: string;
    plant: string;
    segment: number;
    totalPages: number;
    usersRempliePDEK: string[];
    status: string;
    planAction: string | null;
  }
  