import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {BsDropdownModule, ModalModule} from 'ngx-bootstrap';
import {CapitalizePipe} from '../../pipes/capitalize.pipe';
import {FilterbynamePipe} from '../../pipes/filterbyname.pipe';
import {GetparamsPipe} from '../../pipes/getparams.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    DashboardRoutingModule,
    ChartsModule
  ],
  declarations: [
    DashboardComponent,
    CapitalizePipe,
    FilterbynamePipe,
    GetparamsPipe
  ]
})
export class DashboardModule { }
