import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { LoginUserComponent } from './Authentification/login-user/login-user.component';
import { PageNotFoundComponent } from './Authentification/page-not-found/page-not-found.component';
import { ChartPistoletJaunePDFComponent } from './pages/ui-components/ChartsPDEK/chart-pistolet-jaune-pdf/chart-pistolet-jaune-pdf.component';
import { PdekPistoletJauneComponent } from './Agent qualité/Pdeks Pistolet/pdek-pistolet-jaune/pdek-pistolet-jaune.component';
import { PdekPistoletBleuComponent } from './Agent qualité/Pdeks Pistolet/pdek-pistolet-bleu/pdek-pistolet-bleu.component';
import { PdekPistoletVertComponent } from './Agent qualité/Pdeks Pistolet/pdek-pistolet-vert/pdek-pistolet-vert.component';
import { PdekPistoletRougeComponent } from './Agent qualité/Pdeks Pistolet/pdek-pistolet-rouge/pdek-pistolet-rouge.component';

export const routes: Routes = [

  
  { path: "", component: LoginUserComponent }, 
  { path: "login", component: LoginUserComponent }, 
  { path: "chartPistoletJaune", component: ChartPistoletJaunePDFComponent }, 
  { path: "pdekPistoletJaune", component: PdekPistoletJauneComponent }, 
  { path: "pdekPistoletRouge", component: PdekPistoletRougeComponent }, 
  { path: "pdekPistoletVert", component: PdekPistoletVertComponent }, 
  { path: "pdekPistoletBleu", component: PdekPistoletBleuComponent }, 


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
  