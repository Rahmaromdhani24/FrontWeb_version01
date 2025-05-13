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
import { PdekTorsadageSimpleComponent } from './Agent qualité/Pdeks all process/pdek-torsadage/pdek-torsadage-simple.component';
import { PdekSertissageIDCSimpleComponent } from './Agent qualité/Pdeks all process/pdek-sertissage-idcsimple/pdek-sertissage-idcsimple.component';
import { PdekSertissageNormalSimpleComponent } from './Agent qualité/Pdeks all process/pdek-sertissage-normal-simple/pdek-sertissage-normal-simple.component';
import { AuthGuard } from './services/guards/auth.guard';

export const routes: Routes = [

  { path: "", component: LoginUserComponent }, 
  { path: "login", component: LoginUserComponent }, 
  { path: "pdekPistoletJaune", component: PdekPistoletJauneComponent ,  canActivate: [AuthGuard]}, 
  { path: "pdekPistoletRouge", component: PdekPistoletRougeComponent , canActivate: [AuthGuard]}, 
  { path: "pdekPistoletVert", component: PdekPistoletVertComponent , canActivate: [AuthGuard]}, 
  { path: "pdekPistoletBleu", component: PdekPistoletBleuComponent , canActivate: [AuthGuard]}, 
 
  {  path: 'pdek-pistolet-bleu/:id',component: PagePdekPistoletBleuComponent , canActivate: [AuthGuard] } ,
  {  path: 'pdek-pistolet-jaune/:id',component: PagePdekPistoletJauneComponent , canActivate: [AuthGuard] } ,
  {  path: 'pdek-pistolet-rouge/:id',component: PagePdekPistoletRougeComponent , canActivate: [AuthGuard] } ,
  {  path: 'pdek-pistolet-vert/:id',component: PagePdekPistoletVertComponent  , canActivate: [AuthGuard]} ,

  {  path: 'pdeks-soudure/:id',component: PdekSoudureComponent , canActivate: [AuthGuard]} ,
  {  path: 'pdeks-torsadage/:id',component: PdekTorsadageComponent , canActivate: [AuthGuard]} ,
  {  path: 'pdeks-sertissageIDC/:id',component: PdekSertissageIDCComponent , canActivate: [AuthGuard]} ,
  {  path: 'pdeks-sertissage/:id',component: PdekSertissageNormalComponent , canActivate: [AuthGuard]} ,

  {  path: 'pdekSoudure',component: PdekSoudureSimpleComponent , canActivate: [AuthGuard]} ,
  {  path: 'pdekTorsadage',component: PdekTorsadageSimpleComponent , canActivate: [AuthGuard]} ,
  {  path: 'pdekSertissageIDC',component: PdekSertissageIDCSimpleComponent , canActivate: [AuthGuard]} ,
  {  path: 'pdekSertissage',component: PdekSertissageNormalSimpleComponent , canActivate: [AuthGuard]} ,
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
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.PagesRoutes),
      },
      {
        path: 'ui-components',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./pages/ui-components/ui-components.routes').then(
            (m) => m.UiComponentsRoutes
          ),
      },
     
    ],
  },
 {
     path: 'unauthorized', component: PageNotFoundComponent ,

  },
  {
     path: '**', component: PageNotFoundComponent ,

  },
];

  