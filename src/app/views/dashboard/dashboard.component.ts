import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {App, BackendService} from '../../services/backend.service';
import {ModalDirective} from 'ngx-bootstrap/modal/modal.component';
import {CapitalizePipe} from '../../pipes/capitalize.pipe';

@Component({
  templateUrl: 'dashboard.component.html',
})
export class DashboardComponent {
  username = '';
  password = '';
  public appPickerModal;
  apppicker = {
    name: '',
    params: {}
  };

  // TODO outsource
  // qtd: any[] = {};

  constructor(public backend: BackendService) {
  }

  login(): void {
    this.backend.login(this.username, this.password);
  }

  launchApp(): void {
    const app = new App();
    app.name = this.apppicker.name;
    app.params = this.apppicker.params;

    this.backend.launchApp(app);
    // this.appPickerModal.hide();
  }
}
