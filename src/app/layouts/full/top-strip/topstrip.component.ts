import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatToolbarModule } from '@angular/material/toolbar';


@Component({
    selector: 'app-topstrip',
    imports: [TablerIconsModule, MatButtonModule, MatMenuModule , MatToolbarModule],
    templateUrl: './topstrip.component.html',
})
export class AppTopstripComponent {
    constructor() { }

}
