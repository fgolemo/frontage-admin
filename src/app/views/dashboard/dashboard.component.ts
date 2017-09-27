import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {BackendService} from '../../services/backend.service';
import { ModalDirective } from 'ngx-bootstrap/modal/modal.component';
import {CapitalizePipe} from '../../pipes/capitalize.pipe';


@Component({
  templateUrl: 'dashboard.component.html',
})
export class DashboardComponent {
  username = '';
  password = '';
  public appPickerModal;
  apppicker = '';

  constructor(public backend: BackendService) {
  }

  login(): void {
    this.backend.login(this.username, this.password);
  }

  launchApp(): void {
    // TODO: show modal and ask which app
    console.log('TODO: ask which app to launch');
  }
}
