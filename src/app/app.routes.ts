import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { LoginUserComponent } from './Authentification/login-user/login-user.component';
import { PageNotFoundComponent } from './Authentification/page-not-found/page-not-found.component';
import { PdekPistoletJauneComponent } from './Agent qualité/Pdeks Pistolet/pdek-pistolet-jaune/pdek-pistolet-jaune.component';
import { PdekPistoletBleuComponent } from './Agent qualité/Pdeks Pistolet/pdek-pistolet-bleu/pdek-pistolet-bleu.component';
import { PdekPistoletVertComponent } from './Agent qualité/Pdeks Pistolet/pdek-pistolet-vert/pdek-pistolet-vert.component';
import { PdekPistoletRougeComponent } from './Agent qualité/Pdeks Pistolet/pdek-pistolet-rouge/pdek-pistolet-rouge.component';
import { PagePdekPistoletBleuComponent } from './Pdeks pages/pdek-pistolet-bleu/page-pdek-pistolet-bleu.component';
import { PagePdekPistoletJauneComponent } from './Pdeks pages/pdek-pistolet-jaune/page-pdek-pistolet-jaune.component';
import { PagePdekPistoletRougeComponent } from './Pdeks pages/pdek-pistolet-rouge/page-pdek-pistolet-rouge.component';
import { PagePdekPistoletVertComponent } from './Pdeks pages/pdek-pistolet-vert/page-pdek-pistolet-vert.component';
import { PdekSoudureComponent } from './Pdeks pages/pdek-soudure/pdek-soudure.component';
import { PdekTorsadageComponent } from './Pdeks pages/pdek-torsadage/pdek-torsadage.component';
import { PdekSertissageIDCComponent } from './Pdeks pages/pdek-sertissage-idc/pdek-sertissage-idc.component';
import { PdekSertissageNormalComponent } from './Pdeks pages/pdek-sertissage-normal/pdek-sertissage-normal.component';
import { PdekSoudureSimpleComponent } from './Agent qualité/Pdeks all process/pdek-soudure/pdek-soudure-simple.component';
export const routes: Routes = [

  
  { path: "", component: LoginUserComponent }, 
  { path: "login", component: LoginUserComponent }, 
  { path: "pdekPistoletJaune", component: PdekPistoletJauneComponent }, 
  { path: "pdekPistoletRouge", component: PdekPistoletRougeComponent }, 
  { path: "pdekPistoletVert", component: PdekPistoletVertComponent }, 
  { path: "pdekPistoletBleu", component: PdekPistoletBleuComponent }, 
 
  {  path: 'pdek-pistolet-bleu/:id',component: PagePdekPistoletBleuComponent  } ,
  {  path: 'pdek-pistolet-jaune/:id',component: PagePdekPistoletJauneComponent  } ,
  {  path: 'pdek-pistolet-rouge/:id',component: PagePdekPistoletRougeComponent  } ,
  {  path: 'pdek-pistolet-vert/:id',component: PagePdekPistoletVertComponent  } ,

  {  path: 'pdeks-soudure/:id',component: PdekSoudureComponent } ,
  {  path: 'pdeks-torsadage/:id',component: PdekTorsadageComponent } ,
  {  path: 'pdeks-sertissageIDC/:id',component: PdekSertissageIDCComponent } ,
  {  path: 'pdeks-sertissage/:id',component: PdekSertissageNormalComponent } ,

  {  path: 'pdekSoudure',component: PdekSoudureSimpleComponent } ,
  {  path: 'pdeks-torsadage',component: PdekTorsadageComponent } ,
  {  path: 'pdeks-sertissageIDC',component: PdekSertissageIDCComponent } ,
  {  path: 'pdeks-sertissage',component: PdekSertissageNormalComponent } ,
    {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.PagesRoutes),
      },
      {
        path: 'ui-components',
        loadChildren: () =>
          import('./pages/ui-components/ui-components.routes').then(
            (m) => m.UiComponentsRoutes
          ),
      },
     
    ],
  },

  {
     path: '**', component: PageNotFoundComponent ,

  },
];
/*{path:"" , component:LoginUserComponent },
  {path:"login" , component:LoginUserComponent },
  {path:"dashboard_Admin" , component:HomeAdminComponent },
  {path:"" , redirectTo:"/login",pathMatch:'full'},
  {path:"**" , component:PageNotFoundComponent} */
  