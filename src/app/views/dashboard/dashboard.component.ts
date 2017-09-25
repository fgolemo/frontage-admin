import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {BackendService} from '../../services/backend.service';

@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent {
  username = '';
  password = '';

  constructor(private backend: BackendService) {
  }

  login(): void {
    this.backend.login(this.username, this.password);
  }
}
