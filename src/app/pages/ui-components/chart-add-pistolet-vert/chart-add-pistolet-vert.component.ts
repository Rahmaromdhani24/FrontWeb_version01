import { Component, OnInit } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';

import { 
  LineSeriesService,
  CategoryService,
  LegendService,
  TooltipService,
  StripLineService,
  DataLabelService,
  ChartAnnotationService
} from '@syncfusion/ej2-angular-charts';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ChartModule } from '@syncfusion/ej2-angular-charts';
import { PistoletGeneralService } from 'src/app/services/Agent Qualité Montage Pistolet/pistolet-general.service';
import { ActivatedRoute , Router } from '@angular/router';
import { Observable, of, tap } from 'rxjs';
import { Pistolet } from 'src/app/Modeles/Pistolet';
import { GeneralService } from 'src/app/services/Géneral/general.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-chart-add-pistolet-vert',
  standalone: true,
  imports: [
    ChartModule,
    MatCardModule,
    MatFormFieldModule ,
    MatButtonModule ,
    CommonModule
  ],
  providers: [
    LineSeriesService,
    CategoryService,
    LegendService,
    TooltipService,
    StripLineService,
    DataLabelService,
    ChartAnnotationService
  ],
  templateUrl: './chart-add-pistolet-vert.component.html',
  styleUrls: ['./chart-add-pistolet-vert.component.scss']
})
export class ChartAddPistoletVertComponent  implements OnInit {
  constructor(private pistoletGeneralService: PistoletGeneralService , private router: Router ,
              private route: ActivatedRoute , private general : GeneralService){}

  donneesMoyenne: any[] = []; 
  donneesEtendu: any[] = []; 
  valide: boolean = false;
  idPistolet : number ; 
  numeroCourant : number ; 
  numeroPistolet : number ; 
  typePistolet : string ; 
  idPdek : number ;
  numPage : number ;
  categorie : string ;
  plantUser : string ; 
  segmentUser : number  ; 
  pistolets: Pistolet[] = [];
  pistolet : Pistolet ;
  reponseApi : any ; 
  matriculeAgentQualite : number ; 
       ngOnInit(): void {
       
        this.pistolet = JSON.parse(localStorage.getItem("pistolet") !)  ;   
        this.reponseApi = JSON.parse(localStorage.getItem("reponseApi") !)  ;       
        this.numeroPistolet =  this.pistolet.numeroPistolet ; 
        this.typePistolet = this.pistolet.type ;
        this.categorie =  this.pistolet.categorie ; 
        this.idPdek = parseInt(this.reponseApi.pdekId) ; 
        this.numPage = parseInt(this.reponseApi.pageNumber ); 

        this.plantUser = localStorage.getItem('plant') !;
        this.segmentUser = parseInt(localStorage.getItem('segment') ?? '0');
        this.matriculeAgentQualite= localStorage.getItem('matricule') as unknown as number ;

        console.log('Numéro de pistolet:',  this.numeroPistolet);
        console.log('Type de pistolet:',  this.typePistolet);
        console.log('id de pdek :',  this.idPdek);
        console.log('numero de page de pdek :',  this.numPage);

        this.recupererPistoletByNumeroEtEtat();
        this.pistoletGeneralService.recupererListePistoletsNonValidesAgentQualite() ;
        this.recuepererDernierNumeroDeCycle() ; 
        this.recupererDonneesDeFichierPdekDePageParticulier().subscribe();
          }
  /***************************** Chart moyenne X *******************************************/
    // Titre et style
    public title: string = 'La Moyenne X̄';
    public titleStyle: Object = {
      fontFamily: 'Arial',
      fontWeight: 'bold',
      fontSize: '18px',
      color: '#333'
    };
  
    // Configuration de l'axe X
    public primaryXAxis: Object = {
      valueType: 'Category',
      majorGridLines: { width: 0 },
      labelIntersectAction: 'None',
      labelRotation: 0,
      labelStyle: { 
        color: '#333',
        fontFamily: 'Arial',
        fontSize: '12px'
      },
      edgeLabelPlacement: 'Shift'
    };
  
    // Configuration de l'axe Y
    public primaryYAxis: Object = {
      minimum: 70,
      maximum: 130,
      interval: 10,
      majorTickLines: { width: 0 },
      lineStyle: { width: 0 },
      majorGridLines: { width: 1, color: '#e0e0e0' },
      labelStyle: { 
        // color: '#333',
         //fontFamily: 'Arial',
        // fontSize: '12px'
         color: 'transparent'
       },
      stripLines: [
        // Zones colorées
        { start: 70, end: 80, color: 'rgba(255, 0, 0, 0.43)', zIndex: 'Behind' },
        { start: 80, end: 88, color: 'rgba(255, 255, 0, 0.64)', zIndex: 'Behind' },
        { start: 88, end: 112, color: 'rgba(0, 200, 0, 0.53)', zIndex: 'Behind' },
        { start: 112, end: 120, color: 'rgba(255, 255, 0, 0.64)', zIndex: 'Behind' },
        { start: 120, end: 130, color: 'rgba(255, 0, 0, 0.43)', zIndex: 'Behind' },
        
        // Lignes rouges
        { 
          start: 80, 
          end: 80.1, 
          color: 'red', 
          zIndex: 'Over', // Important: doit être au-dessus
          border: { color: 'red', width: 2 },
          opacity: 1
        },
   
        { 
          start: 100, 
          end: 100.1, 
          color: 'black', 
          zIndex: 'Over', // Important: doit être au-dessus
          border: { color: 'black', width: 1 },
          opacity: 1
        },
        { 
          start: 120, 
          end: 120.2, 
          color: 'red', 
          zIndex: 'Over', // Important: doit être au-dessus
          border: { color: 'red', width: 2 },
          opacity: 1
        }, 
        {
          start: 88,
          end: 88.1,  // Léger décalage pour s'assurer que la ligne est visible
          color: 'black',
          width: 1,
          dashArray: '5,3',  // 5px de tiret, 3px d'espace
          zIndex: 'Over'
        },
        {
          start: 112,
          end: 112.1,
          color: 'black',
          width: 1,
          dashArray: '5,3',
          zIndex: 'Over'
        }
     
      ]
    };
   seriesMoyenne: { x: number, y: number }[] = [];

  
    // Configuration du tooltip
    public tooltip: Object = {
      enable: true,
      format: '${point.x} : <b>${point.y}</b>',
      fill: '#333',
      textStyle: { color: 'white' }
    };
  
    // Configuration des annotations
    public annotations: Object[] = [
      {
        content: '<div style="color: #333; font-weight: bold;">Zone Critique</div>',
        x: '90%',
        y: 125,
        coordinateUnits: 'Point',
        region: 'Chart'
      } ,
      {
        content: '<div style="border-top: 1px dashed black; width: 100%;"></div>',
        x: '0%',
        y: '88',
        coordinateUnits: 'Point',
        region: 'Chart'
      },
      {
        content: '<div style="border-top: 1px dashed black; width: 100%;"></div>',
        x: '0%',
        y: '112',
        coordinateUnits: 'Point',
        region: 'Chart'
      }
    ];
  
    // Style du marqueur
    public marker: Object = {
      visible: true,
      width: 7,
      height: 7,
      fill: '#007bff',
      border: { width: 2, color: 'white' }
    };
  
    // Style de la ligne
    public chartArea: Object = {
      border: { width: 0 }
    };
  
 /*********************** Chart d'Étendue R *******************************/
 public titleEtendue: string = 'L\'étendue R';
 public titleStyleEtendue: Object = {
   fontFamily: 'Arial',
   fontWeight: 'bold',
   size: '18px'
 };

 public primaryXAxisEtendue: Object = {
  minimum: 0,
  maximum: 26, // Ajusté à 26 pour inclure le nouveau point
  interval: 1,
  majorGridLines: { width: 1 },
  minorGridLines: { width: 0 },
  majorTickLines: { width: 1 },
  valueType: 'Double'
};
 public primaryYAxisEtendue: Object = {
   minimum: 0,
   maximum: 14, // Changé de 6 à 10 comme demandé
   interval: 1,
   stripLines: [{
     start: 12,
     end: 12.1,
     color: 'red',
     zIndex: 'Over',
     border: { color: 'red', width: 2 },
     opacity: 1
   }],
 };
 public annotationsEtendue: Object[] = [{
  content: '<div style="border-top: 2px solid red; width:100%"></div>',
  x: '0%',
  y: 12,
  coordinateUnits: 'Point',
  region: 'Chart'
}];

seriesEtendue: { x: number, y: number }[] = [];
 public tooltipEtendue: Object = {
   enable: true,
   format: 'X: ${point.x} <br/> Y: ${point.y}'
 };

 public markerEtendue: Object = {
  visible: true,
  width: 8,
  height: 8,
  fill: '#333',       // Couleur de remplissage
  border: { 
    width: 1, 
    color: '#fff'    // Bordure blanche
  }
};
recuepererDernierNumeroDeCycle(){
  this.pistoletGeneralService.getDernierNumeroCycle(this.typePistolet,  this.numeroPistolet, this.categorie, this.segmentUser, this.plantUser)
  .subscribe({
    next: (numeroCycle) => {
      console.log('Dernier numéro de cycle:', numeroCycle);
      this.numeroCourant = numeroCycle;
    },
    error: (err) => {
      console.error('Erreur récupération du numéro de cycle', err);
    }
  });
  
  }

recupererDonneesDeFichierPdekDePageParticulier(): Observable<Pistolet[]> {
  return this.pistoletGeneralService.getPistoletsParPdekEtPage(this.idPdek, this.numPage).pipe(
    tap((data: Pistolet[]) => {
      this.pistolets = data;
      console.log('Pistolets récupérés :', data);

      this.seriesMoyenne = data.map(p => ({
        x: p.numCourant,
        y: p.moyenne
      }));

      this.donneesMoyenne = this.seriesMoyenne;

      this.seriesEtendue = data.map(p => ({
        x: p.numCourant,
        y: p.etendu
      }));
      this.donneesEtendu = this.seriesEtendue;

      if (data.length > 0) {
        this.numeroCourant = data[data.length - 1].numCourant;
      }
      // Log pour vérification
      console.log('Séries Moyenne récuperer :', this.seriesMoyenne);
      console.log('Séries Étendue récuperer :', this.seriesEtendue);
      console.log('pistoles recuperer de pdek adequat :', this.pistolets);

    }),
    catchError(error => {
      console.error('Erreur lors de la récupération des pistolets', error);
      return of([]); // retourne une liste vide en cas d'erreur
    })
  );
}
validerPdekPistolet(): void {
  this.pistoletGeneralService.getPistoletInformations(this.numeroPistolet , this.typePistolet , this.categorie).subscribe({
    next: (data) => {
      this.pistolet = data;
      this.idPistolet = data.id;
      console.log('id de pistolet validé :', this.idPistolet);
      this.pistoletGeneralService.validerPistolet(this.idPistolet, this.matriculeAgentQualite).subscribe({
        next: () => {
          this.pistoletGeneralService.recupererListePistoletsNonValidesAgentQualite() ;
          this.pistoletGeneralService.getNombreNotifications();
          this.general.nbrNotifications--;

          this.valide = true; // ✅ le bouton est maintenant validé

          console.log('Pistolet validé avec succès.');

          Swal.fire({
            title: 'Confirmation !',
            text: 'Pistolet validé avec succès.',
            icon: 'success',
            confirmButtonText: 'OK',
            customClass: {
              popup: 'custom-popup',
              title: 'custom-title',
              confirmButton: 'custom-confirm-button'
            }
          });
        },
        error: (err) => {
          console.error('Erreur lors de la validation du pistolet :', err);

          Swal.fire({
            title: 'Erreur',
            text: 'Erreur lors de la validation du pistolet.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      });
    },
    error: (err) => {
      console.error('Erreur lors de la récupération du pistolet :', err);
    }
  });
}

recupererPistoletByNumeroEtEtat(): void {
  this.pistoletGeneralService.getPistoletInformations(this.numeroPistolet, this.typePistolet, this.categorie).subscribe({
    next: (data) => {
      console.log('Pistolet récupéré :', data);
      this.pistolet = data;

      const etat = this.recupererEtatPistolet(this.pistolet);
      console.log('État du pistolet :', etat);

      if (etat === 'vert') {
        this.general.nbrNotifications++;

        // Appel ici, après avoir détecté l'état vert
        this.pistoletGeneralService.recupererListePistoletsNonValidesAgentQualite();

        console.log('Notification ajoutée. Total :', this.general.nbrNotifications);
      }
    },
    error: (err) => {
      console.error('Erreur lors de la récupération du pistolet :', err);
    }
  });
}


recupererEtatPistolet(p: Pistolet): string {
  const etat = this.pistoletGeneralService.etatPistolet(p.etendu, p.moyenne, p.type);
  p.activationValider = etat === "vert";
  return etat;
}

naviger(){
  this.router.navigate(['/pdekPistoletVert']);
}
}