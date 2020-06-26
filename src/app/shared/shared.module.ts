import { NgModule } from '@angular/core';

import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        RouterModule,
        CommonModule
    ],
    declarations: [
        BreadcrumbsComponent,
        SidebarComponent,
        HeaderComponent
    ],
    exports: [
        BreadcrumbsComponent,
        SidebarComponent,
        HeaderComponent
    ]
})

export class SharedModule { }
