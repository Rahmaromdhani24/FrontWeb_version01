import { Component, AfterViewInit, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { Pistolet } from 'src/app/Modeles/Pistolet';
import { PistoletGeneralService } from 'src/app/services/Agent Qualité Montage Pistolet/pistolet-general.service';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-notifications',
  imports: [MatCardModule ,CommonModule ],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent implements AfterViewInit ,OnInit {

  constructor(private router : Router , private servicePistolet : PistoletGeneralService){}
  notificationsCount: number = 0;
  pistolets: Pistolet[] = [];
  role : string | null ; 
  notification : Notification ; 
  nom_process : string ; 
  plant : string  | null ; 
  fullname  : string  | null ; 
  roleDashboard : string  | null ; 

  ngAfterViewInit(): void {
    const all = document.querySelectorAll<HTMLElement>("main div");
    const dots = document.querySelectorAll<HTMLElement>("span.dot");
    const alertElem = document.querySelector<HTMLElement>(".alert");
    const toggle = document.querySelector<HTMLElement>(".toogle");

    if (toggle && alertElem) {
      toggle.addEventListener("click", () => {
        alertElem.innerHTML = "0";
        all.forEach((a) => {
          a.style.backgroundColor = "white";
          const dot = a.querySelector("div p span.dot") as HTMLElement;
          if (dot) {
            dot.style.display = "none";
          }
        });
      });
    }

    function changeNum() {
      if (alertElem && +alertElem.innerHTML > 0) {
        alertElem.innerHTML = String(+alertElem.innerHTML - 1);
      } else if (alertElem) {
        alertElem.innerHTML = "0";
      }
    }

    function bgChange(id: string) {
      const elem = document.getElementById(id);
      if (elem) {
        elem.style.backgroundColor = "white";
      }
    }

    function displayChange(selector: string) {
      const dot = document.querySelector<HTMLElement>(selector);
      if (dot) {
        dot.style.display = "none";
      }
    }

    all.forEach((a) => {
      const didi = a.id;
      a.addEventListener(
        "click",
        () => {
          bgChange(didi);
          displayChange(`#${didi} div p span.dot`);
          changeNum();
        },
        { once: true }
      );
    });
  }
  /**********************************************************************************************/
  ngOnInit(): void {
    this.role= localStorage.getItem('role') ;//, "AGENT_QUALITE_PISTOLET");
    this.roleDashboard = localStorage.getItem('roleDashboard') ;
    this.fullname =  localStorage.getItem('fullName') ;
    this.plant=   localStorage.getItem('plant') ;
     if( this.role =="AGENT_QUALITE_PISTOLET"){
       this.nom_process ="Montage Pistolet"; 
       this.recupererNombreNotificationsPistolet() ; 
       this.recupererListePistoletsNonValides() ;
     }
 
       
   }
 
   recupererNombreNotificationsPistolet(){
     this.servicePistolet.getNombreNotifications().subscribe({
       next: (count) => {
         this.notificationsCount = count;
         console.error('nombre notifications est  :', this.notificationsCount);
 
       },
       error: (err) => {
         console.error('Erreur lors de la récupération des notifications :', err);
       }
     });
   }
 
   recupererListePistoletsNonValides(){
     this.servicePistolet.getPistoletsNonValidees().subscribe({
       next: (data) => {
         this.pistolets = data;
         console.error('pistolets non valides :', this.pistolets);
       },
       error: (err) => {
         console.error('Erreur lors de la récupération des pistolets :', err);
       }
     });
   }
     voirPistolet(pistoletId: number) {
       console.log(`Afficher PDEK pour le pistolet avec ID ${pistoletId}`);
       // Ajouter la logique pour afficher le PDEK de ce pistolet
     }
   
     validerPistolet(pistoletId: number) {
       console.log(`Valider PDEK pour le pistolet avec ID ${pistoletId}`);
     }

  formatPistolet(value: string): string {
  return value.replace('PISTOLET_', '').toLowerCase().replace(/^\w/, c => c.toUpperCase());
}
  logout(){
    localStorage.clear() ;
    this.router.navigate(['/login'])
  }
}