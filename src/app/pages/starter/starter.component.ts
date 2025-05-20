import { Component, ViewEncapsulation } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { AppErreursProcessComponent } from 'src/app/components/erreurs-process/erreurs-process.component';
import { AppTopEmployeesComponent } from 'src/app/components/top-employees/top-employees.component';
import { AppBlogComponent } from 'src/app/components/apps-blog/apps-blog.component';
import { AppEffectifOperateursComponent } from 'src/app/components/effectif-operateurs/effectif-operateurs.component';
import { AppPdekProcessComponent } from 'src/app/components/pdek-process/pdek-process.component';
import { StatSuperAdminPDEKComponent } from 'src/app/components/stat-super-admin-pdek/stat-super-admin-pdek.component';
import { StatSuperAdminComponent } from 'src/app/components/stat-super-admin/stat-super-admin.component';
import { PdekProcessPistoletComponent } from 'src/app/components/pdek-process-pistolet/pdek-process-pistolet.component';



@Component({
  selector: 'app-starter',
  imports: [
    MaterialModule,
    AppPdekProcessComponent , 
    AppEffectifOperateursComponent,
    AppErreursProcessComponent,
    AppTopEmployeesComponent,
    StatSuperAdminPDEKComponent , 
    StatSuperAdminComponent , 
    PdekProcessPistoletComponent,

  ],
  templateUrl: './starter.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class StarterComponent { 
role = localStorage.getItem('role')||''
}