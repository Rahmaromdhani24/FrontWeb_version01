import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, tap } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import {
  ApexAxisChartSeries, ApexChart, ApexXAxis, ApexDataLabels,
  ApexYAxis, ApexTitleSubtitle, ApexStroke, ApexTooltip, ApexMarkers, ApexFill, ApexAnnotations, ApexLegend
} from 'ng-apexcharts';
import { Observable, of } from 'rxjs';
import { PistoletGeneralService } from 'src/app/services/Agent Qualité Montage Pistolet/pistolet-general.service';
import { MatButtonModule } from '@angular/material/button';
import { ContenuPagePdekDTO } from 'src/app/Modeles/ContenuPagePdekDTO';
import { PdekService } from 'src/app/services/PDEK service/pdek.service';
import { forkJoin } from 'rxjs';
import { Soudure } from 'src/app/Modeles/Soudure';
import { SertissageNormal } from 'src/app/Modeles/SertissageNormal';
import { SertissageNormalService } from 'src/app/services/Agent Qualite Operation Sertissage/sertissage-normal.service';
@Component({
  selector: 'app-pdek-sertissage-normal-simple',
 imports: [
    NgApexchartsModule,
    MatCardModule,
    MatFormFieldModule ,
    CommonModule ,
    FontAwesomeModule ,
    MatButtonModule
  ],
  templateUrl: './pdek-sertissage-normal-simple.component.html',
  styleUrl: './pdek-sertissage-normal-simple.component.scss'
})
export class PdekSertissageNormalSimpleComponent  implements OnInit {
  pages: {
    pageNum: 1;
    sertissages: SertissageNormal[]; // sans 's'
    chartHauteur : any;
  }[] = [];
  contenuPages: ContenuPagePdekDTO[] = [];
  constructor(private pdekService: PdekService , private service: SertissageNormalService  , 
              private router : Router  , private route: ActivatedRoute  ){}
  
   rows = Array.from({ length: 25 }, (_, i) => i + 1);
   showLoader : boolean = true; 
   eight: number[] = Array.from({ length: 8 }, (_, i) => i + 1);
   numCourants : any  =  [1 ,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25]
   anneePDEK : number = 0 ;
   numeroCourant : number ; 
   plantUser : string ; 
   segmentUser : number  ; 
   pistoletsValides: Set<number> = new Set();  // Pour stocker les IDs validés
   matriculeAgentQualite : number ; 
   pdekId : number ; 
   sertissagesParPage: Map<number, SertissageNormal[]> = new Map();
   valeurLGDPdek: string = '';
   tractionValeur : string = ''; 
   hauteurSertissage : number = 0 ; 
   largeurSertissage : number = 0 ; 
   numOutil : string = '';
   numContact: string = '';
   sectionFil : string = '';
   toleranceLargeurSertissage: string = '';
   hauteurIsolant : number = 0 ; 
   largeurIsolant : number = 0 ; 

   toleranceLargeurIsolant: string = '';
   toleranceHauteurIsolant: string = '';
   numPage : number ;
   reponseApi : any ; 
   machine : string =''
   annee  : string =''
   role : string =''
   idPdek: number 
   sertissages : SertissageNormal[] ; 
   ngOnInit(): void {

    this.reponseApi = JSON.parse(localStorage.getItem("reponseApi")!);
    this.idPdek = this.reponseApi.pdekId;
    this.numPage = this.reponseApi.pageNumber;
    const pdekSertissageJson = localStorage.getItem('pdekSertissage');
    if (pdekSertissageJson) {
      const pdekSertissageObj = JSON.parse(pdekSertissageJson); 
      this.valeurLGDPdek = pdekSertissageObj.lgd; 
      this.numContact = pdekSertissageObj.numeroContacts; 
      this.numOutil = pdekSertissageObj.numeroOutils;
      this.sectionFil = this.extraireValeurNumeriqueSectionFil(pdekSertissageObj.sectionFil);
      this.segmentUser = pdekSertissageObj.segment;
      console.log("section de pdek est = "+  this.sectionFil )
    }
    const pdekSertissageNormalJson = localStorage.getItem('sertissage');
    if (pdekSertissageNormalJson) {
      const pdekSertissageObj = JSON.parse(pdekSertissageNormalJson); 
      this.numContact = pdekSertissageObj.numContact; 
      this.numOutil = pdekSertissageObj.numOutil;
      this.sectionFil = this.extraireValeurNumeriqueSectionFil(pdekSertissageObj.sectionFil);  
     this.valeurLGDPdek = pdekSertissageObj.lgd; 
       this.segmentUser = pdekSertissageObj.segment;
      console.log("section de pdek est = "+  this.sectionFil )

    }
    this.plantUser = localStorage.getItem('plant')!;
   // this.segmentUser = parseInt(localStorage.getItem('segment') ?? '0');
    this.matriculeAgentQualite = +localStorage.getItem('matricule')!;

    this.hauteurSertissage= this.chargerHauteurSertissage( this.numOutil ,  this.numContact ,  this.sectionFil ) ; 
    this.largeurSertissage= this.chargerLargeurSertissage( this.numOutil ,  this.numContact ,  this.sectionFil ) ; 
    this.toleranceLargeurSertissage= this.chargerToleranceLargeurSertissage( this.numOutil ,  this.numContact ,  this.sectionFil ) ; 
    this.hauteurIsolant= this.chargerHauteurIsolant( this.numOutil ,  this.numContact ,  this.sectionFil ) ; 
    this.largeurIsolant= this.chargerLargeurIsolant( this.numOutil ,  this.numContact ,  this.sectionFil ) ; 
    this.toleranceLargeurIsolant= this.chargerToleranceLargeurIsolant( this.numOutil ,  this.numContact ,  this.sectionFil ) ; 
    this.toleranceHauteurIsolant= this.chargerToleranceHauteurIsolant( this.numOutil ,  this.numContact ,  this.sectionFil ) ; 
    this.tractionValeur = this.tractionValeur = this.decodeHtml(this.chargerTraction( this.numOutil ,  this.numContact ,  this.sectionFil )) ; 
    this.chargerToutesLesPages();


  }
  

  hideLoader(): void { this.showLoader = false;  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.hideLoader();
    }, 6000); // Délai de 5 secondes (ajustez selon vos besoins)
  }
/***************************** Chart moyenne X *****************************************/
generateChartHauteur(hauteurSertissage: number) {
  return {
    series: [{
      name: 'Hauteur',
      data: []
    }],
    chart: {
      type: 'line',
      height: 400,
      background: 'transparent',
      animations: {
        enabled: false,
        easing: 'linear',
        speed: 1,
        animateGradually: { enabled: false },
        dynamicAnimation: { enabled: false }
      },
      toolbar: { show: false }
    },
    xaxis: {
      type: 'numeric',
      min: 1,
      max: 32,
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false }
    },
    yaxis: {
      min: hauteurSertissage - 0.07,
      max: hauteurSertissage + 0.07,
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false }
    },
    stroke: {
      curve: 'straight',
      width: 2
    },
    dataLabels: {
      enabled: false
    },
    markers: {
      size: 5,
      strokeWidth: 1,
      strokeColors: '#000',
      colors: ['#000']
    },
    tooltip: {
      enabled: false,
      y: {
        formatter: (val: number) => `${val.toFixed(2)}`
      }
    },
    fill: {
      type: 'solid'
    },
    legend: {
      show: false
    },
    annotations: {
      yaxis: [
        { y: hauteurSertissage - 0.07, y2: hauteurSertissage - 0.05, fillColor: '#ff00006e', opacity: 0.4 },
        { y: hauteurSertissage - 0.05, y2: (hauteurSertissage  - 0.05)+ 0.03, fillColor: '#ffff0064', opacity: 0.5 },
        { y: (hauteurSertissage  - 0.05)+ 0.03, y2: hauteurSertissage + 0.02, fillColor: '#00c80087', opacity: 0.4 },
        { y: hauteurSertissage + 0.02, y2: hauteurSertissage + 0.05, fillColor: '#ffff0064', opacity: 0.5 },
        { y: hauteurSertissage + 0.05, y2: hauteurSertissage + 0.07, fillColor: '#ff00006e', opacity: 0.4 },
        {
          y: hauteurSertissage - 0.05,
          borderColor: 'red',
          strokeDashArray: 0,
          label: {
            position: 'left',
            text: (hauteurSertissage - 0.05).toFixed(2),
            style: { color: '#fff', background: 'red' }
          }
        },
        {
          y: (hauteurSertissage  - 0.05)+ 0.03,
          borderColor: 'green',
          strokeDashArray: 0,
          label: {
            position: 'left',
            text: ((hauteurSertissage  - 0.05)+ 0.03 )+'',
            style: { color: '#fff', background: 'green' }
          }
        },
        {
          y: hauteurSertissage + 0.02,
          borderColor: 'green',
          strokeDashArray: 0,
          label: {
            position: 'left',
            text: (hauteurSertissage + 0.02)+'',
            style: { color: '#fff', background: 'green' }
          }
        },
        {
          y: hauteurSertissage + 0.05,
          borderColor: 'red',
          strokeDashArray: 0,
          label: {
            position: 'left',
            text: (hauteurSertissage + 0.05)+'',
            style: { color: '#fff', background: 'red' }
          }
        }
      ]
    }
  };
}
getChartHauteur(data: { x: string; y1: number; y2: number; y3: number; y4: number }[]) {
  const flatData: { x: string; y: number }[] = [];

  data.forEach(p => {
    if (p.y1 !== null && p.y1 !== undefined) flatData.push({ x: `${p.x}-1`, y: p.y1 });
    if (p.y2 !== null && p.y2 !== undefined) flatData.push({ x: `${p.x}-2`, y: p.y2 });
    if (p.y3 !== null && p.y3 !== undefined) flatData.push({ x: `${p.x}-3`, y: p.y3 });
    if (p.y4 !== null && p.y4 !== undefined) flatData.push({ x: `${p.x}-4`, y: p.y4 });
  });

  const baseChart = this.generateChartHauteur(this.hauteurSertissage);

  return {
    ...baseChart,
    series: [{
      name: 'Hauteurs successives',
      data: flatData
    }],
      chart: {
      type: 'line',
      height: 400,
      background: 'transparent',
      animations: {
        enabled: false,
        easing: 'linear',
        speed: 1,
        animateGradually: { enabled: false },
        dynamicAnimation: { enabled: false }
      },
      toolbar: { show: false }
    },
    xaxis: {
      ...baseChart.xaxis,
      type: 'category',
      categories: flatData.map(d => d.x),
      labels: { rotate: -45 },
      //title: { text: 'Cycle - Échantillon' }
    },
    tooltip: {
      enabled: true,
      shared: false,
      intersect: true,
      x: {
        formatter: (val: string) => {
          const [cycle, ech] = val.split('-');
          return `Cycle: ${cycle}<br/>Échantillon: ${ech}`;
        }
      },
      y: {
        formatter: (val: number) => `${val.toFixed(3)} mm`
      }
    }
  };
}


 /*********************** Chart d'Étendue R *******************************/

 chargerToutesLesPages(): void {
  this.hauteurSertissage = this.chargerHauteurSertissage(this.numOutil, this.numContact, this.sectionFil);

  this.pdekService.getContenuParNumeroPage(this.idPdek, this.numPage).subscribe({
    next: (sertissages: any[]) => {
      const dataChart = sertissages.map((p: any) => ({
        x: p.numCycle,
        y1: p.hauteurSertissageEch1,
        y2: p.hauteurSertissageEch2,
        y3: p.hauteurSertissageEch3,
        y4: p.hauteurSertissageEchFin
      }));

      // ✅ Assurer qu'on garde une seule page
      this.pages = [{
        pageNum: 1,
        sertissages,
        chartHauteur: this.getChartHauteur(dataChart)
      }];

      this.showLoader = false;
    },
    error: (err) => {
      console.error('Erreur lors de la récupération des pages du PDEK', err);
      this.showLoader = false;
    }
  });
}


getHauteurSertissage(page: any, row: number, col: number): number | null {
      const sertissage = page.sertissages?.[col];
      if (!sertissage) return null;
      const echs = [sertissage.hauteurSertissageEch1,
                   sertissage.hauteurSertissageEch2,
                   sertissage.hauteurSertissageEch3, 
                   sertissage.hauteurSertissageEchFin];
      return echs[row] ?? null;
    }
    

    getLargeurSertissage(page: any, row: number, col: number): number | null {
      const sertissage = page.sertissages?.[col];
      if (!sertissage) return null;
      const echs = [sertissage.largeurSertissage,
                   sertissage.largeurSertissageEchFin];
      return echs[row] ?? null;
    }
    
    getHauteurIsolant(page: any, row: number, col: number): number | null {
      const sertissage = page.sertissages?.[col];
      if (!sertissage) return null;
      const echs = [sertissage.hauteurIsolant,
                   sertissage.hauteurIsolantEchFin];
      return echs[row] ?? null;
    }
    

    getLargeurIsolant(page: any, row: number, col: number): number | null {
      const sertissage = page.sertissages?.[col];
      if (!sertissage) return null;
      const echs = [sertissage.largeurIsolant,
                   sertissage.largeurIsolantEchFin];
      return echs[row] ?? null;
    }
    
    getTraction(page: any, row: number, col: number): number | null {
      const sertissage = page.sertissages?.[col];
      if (!sertissage) return null;
      const echs = [sertissage.traction,
                   sertissage.tractionFinEch];
      return echs[row] ?? null;
    }
    
    
    getNom(page: any, col: number): number | null {
      const sertissage = page.sertissages?.[col];
      return sertissage ? sertissage.matricule : null;
    }
    
  
    getDate(page: any, col: number): string | null {
      const sertissage = page.sertissages?.[col];
      return sertissage ? sertissage.date : null;
    }   
  
  getCodeControle(page: any, col: number): string | null {
    const sertissageIDC = page.sertissagesIDC?.[col];
    return sertissageIDC ? sertissageIDC.code : null;
  }
  getMatriculeAgentQualite(page: any, col: number): string | null {
    const sertissage = page.sertissage?.[col];
    return sertissage ? sertissage.matriculeAgentQualite : null;
  }
  
  getAnnee(page: any, col: number): number | null {
    const sertissage = page.sertissages?.[col];
    if (!sertissage || !sertissage.date) return null;
  
    const date = new Date(sertissage.date);
    return date.getFullYear();
  }

  
 onValiderSertissage(id: number) {
     this.service.validerSertissageNormal(id, this.matriculeAgentQualite).subscribe({
                     next: () => {
                       this.pistoletsValides.add(id); // Marquer ce pistolet comme validé
                 
                       Swal.fire({
                         title: 'Confirmation !',
                         text: 'Pdek Sertissage validé avec succès.',
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
                       console.error('Erreur lors de la validation :', err);
                       Swal.fire({
                         title: 'Erreur',
                         text: 'Erreur lors de la validation',
                         icon: 'error',
                         confirmButtonText: 'OK'
                       });
                     }
                   });
  }
   /*  onValiderSertissage(id: number) {
         this.service.validerSertissageNormal(id, this.matriculeAgentQualite).subscribe({
                         next: () => {
               console.log('Pdek Sertissage  validé avec succès');
               this.pistoletsValides.add(id); // Marquer ce pistolet comme validé
            /*     const sertissage = this.sertissages.find(p => p.id === id);
                 if (sertissage) {
                   sertissage.matriculeAgentQualite = this.matriculeAgentQualite;
                 }
 
                 // MAJ dans page.sertissages aussi
                 for (let page of this.pages) {
                   const target = page.sertissages.find(p => p.id === id);
                   if (target) {
                     target.matriculeAgentQualite = this.matriculeAgentQualite;
                   }
                 }
 
                           Swal.fire({
                             title: 'Confirmation !',
                             text: 'Pdek Sertissage validé avec succès.',
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
                           console.error('Erreur lors de la validation :', err);
                           Swal.fire({
                             title: 'Erreur',
                             text: 'Erreur lors de la validation',
                             icon: 'error',
                             confirmButtonText: 'OK'
                           });
                         }
                       });
      }*/
    
  getNumContact(page: any, col: number): string | null {
    const sertissage = page.sertissages?.[col];
    return sertissage ? sertissage.numContact : null;
  }

  getNumOutil(page: any, col: number): string | null {
    const sertissage = page.sertissages?.[col];
    return sertissage ? sertissage.numOutil : null;
  }
  getSectionFil(page: any, col: number): string | null {
    const sertissage = page.sertissages?.[col];
    return sertissage ? sertissage.sectionFil : null;
  }
  getLGD(page: any, col: number): string | null {
    const sertissage = page.sertissages?.[col];
    return sertissage ? sertissage.sectionFil : null;
  }
  getCode(page: any, col: number): string | null {
    const sertissage = page.sertissages?.[col];
    return sertissage ? sertissage.code : null;
  }
 
  getProduit(page: any, col: number): string | null {
    const sertissage = page.sertissages?.[col];
    return sertissage ? sertissage.produit : null;
  }
  getSerieProduit(page: any, col: number): string | null {
    const sertissage = page.sertissages?.[col];
    return sertissage ? sertissage.serieProduit : null;
  }
  getQuantiteCycle(page: any, col: number): number | null {
    const sertissage = page.sertissages?.[col];
    return sertissage ? sertissage.quantiteCycle : null;
  }
  getNumMachine(page: any, col: number): number | null {
    const sertissage = page.sertissages?.[col];
    return sertissage ? sertissage.numeroMachine : null;
  }
  getOperateur(page: any, col: number): number | null {
    const sertissage = page.sertissages?.[col];
    return sertissage ? sertissage.userSertissageNormal : null;}
  
    getQM(page: any, col: number): number | null {
    const sertissage = page.sertissages?.[col];
    return sertissage ? sertissage.matriculeAgentQualite : null;
  }
  chargerTraction(numeroOutil: string, numeroContact: string, sectionFil: string): string {
    this.service.getTractionValeur(numeroOutil, numeroContact, sectionFil)
      .subscribe({
        next: (data) => {
          this.tractionValeur = data;
        },
        error: (err) => {
          console.error('Erreur lors de la récupération de la traction:', err);
        }
      });
      return  this.tractionValeur  ; 
  }

  chargerHauteurSertissage(numeroOutil: string, numeroContact: string, sectionFil: string): number {
    this.service.getHauteurSertissage(numeroOutil, numeroContact, sectionFil)
      .subscribe({
        next: (data) => {
          this.hauteurSertissage = data;
          this.chargerToutesLesPages();

        },
        error: (err) => {
          console.error('Erreur lors de la récupération de la traction:', err);
        }
      });
      return this.hauteurSertissage 

  }
  chargerLargeurSertissage(numeroOutil: string, numeroContact: string, sectionFil: string): number {
    this.service.getLargeurSertissage(numeroOutil, numeroContact, sectionFil)
      .subscribe({
        next: (data) => {
          this.largeurSertissage = data;
        },
        error: (err) => {
          console.error('Erreur lors de la récupération de la traction:', err);
        }
      });
      return this.largeurSertissage 
  }

  chargerToleranceLargeurSertissage(numeroOutil: string, numeroContact: string, sectionFil: string): string {
    this.service.getToleranceLargeurSertissage(numeroOutil, numeroContact, sectionFil)
      .subscribe({
        next: (data) => {
          this.toleranceLargeurSertissage = data;
        },
        error: (err) => {
          console.error('Erreur lors de la récupération de la traction:', err);
        }
      });
      return this.toleranceLargeurSertissage 

  }


  chargerHauteurIsolant(numeroOutil: string, numeroContact: string, sectionFil: string): number {
    this.service.getHauteurIsolant(numeroOutil, numeroContact, sectionFil)
      .subscribe({
        next: (data) => {
          this.hauteurIsolant = data;
        },
        error: (err) => {
          console.error('Erreur lors de la récupération de la traction:', err);
        }
      });
      return this.hauteurIsolant 

  }
  chargerLargeurIsolant(numeroOutil: string, numeroContact: string, sectionFil: string): number {
    this.service.getLargeurIsolant(numeroOutil, numeroContact, sectionFil)
      .subscribe({
        next: (data) => {
          this.largeurIsolant = data;
        },
        error: (err) => {
          console.error('Erreur lors de la récupération de la traction:', err);
        }
      });
      return this.largeurIsolant 
  }


  chargerToleranceLargeurIsolant(numeroOutil: string, numeroContact: string, sectionFil: string): string {
    this.service.getToleranceLargeurIsolant(numeroOutil, numeroContact, sectionFil)
      .subscribe({
        next: (data) => {
          this.toleranceLargeurIsolant = data;
        },
        error: (err) => {
          console.error('Erreur lors de la récupération de la traction:', err);
        }
      });
      return this.toleranceLargeurIsolant 

  }

  chargerToleranceHauteurIsolant(numeroOutil: string, numeroContact: string, sectionFil: string): string {
    this.service.getToleranceHauteurIsolant(numeroOutil, numeroContact, sectionFil)
      .subscribe({
        next: (data) => {
          this.toleranceHauteurIsolant = data;
        },
        error: (err) => {
          console.error('Erreur lors de la récupération de la traction:', err);
        }
      });
      return this.toleranceHauteurIsolant 

  }
  /* naviger(){
    localStorage.removeItem('reponseApi')
    this.router.navigate(['/dashboard']);
  }  */
  decodeHtml(html: string): string {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }
 /* extraireValeurNumeriqueSectionFil(sectionFil: string): string {
    if (!sectionFil) {
      return "0.00";
    }
    const match = sectionFil.match(/[0-9]+(\.[0-9]+)?/);
    const value = match ? parseFloat(match[0]) : 0;
    return value.toFixed(2); // forcer 2 chiffres après la virgule sous forme de string
  }*/
 extraireValeurNumeriqueSectionFil(sectionFil: string): string {
  if (!sectionFil) {
    return "0.00";
  }

  const trimmed = sectionFil.trim();

  // Si c'est du type "2x0.35 mm²", on le retourne tel quel
  if (/^\d+x\d+(\.\d+)?/.test(trimmed)) {
    const match = trimmed.match(/^\d+x\d+(\.\d+)?/);
    return match ? match[0] : "0.00";
  }

  // Sinon on extrait la première valeur numérique seule (ex: "2.5 mm²" => "2.50")
  const match = trimmed.match(/\d+(\.\d+)?/);
  const value = match ? parseFloat(match[0]) : 0;
  return value.toFixed(2);
}


  naviger() {
    localStorage.removeItem('reponseApi');
    localStorage.removeItem('pdekSertissage');
    localStorage.removeItem('sertissage');
    // Trick pour forcer reload
    this.router.navigateByUrl('/dashboard', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/dashboard']);
    });
  }
  
  imprimerPDEK() {
const printContents = document.querySelector('.pdf-container')?.innerHTML;
  const originalContents = document.body.innerHTML;

  document.body.innerHTML = printContents || '';
  window.print();
  document.body.innerHTML = originalContents;
  location.reload(); // Recharge la page pour retrouver l’état initia
}

}