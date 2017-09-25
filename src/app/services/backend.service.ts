import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import {environment} from '../../environments/environment';

// TODO: encapsulate response object properly
// export class FResponse {
//   error: number;
//   data: object;
// }

@Injectable()
export class BackendService {
  logged_in = false;
  loginErr = false;
  token = '';
  errorMsg = '--';
  error = false;
  facadeRunning = false;
  status = { // TODO: make internal class
    changing: false,
    know_on: false,
    know_app: false,
    know_cal: false
  };
  cal = { // TODO: make external class
    on: '',
    off: '',
    default: '',
    params: {}
  };
  app = { // TODO: make external class
    name: '',
    params: {},
    start: '',
    user: ''
  };

  constructor(private http: Http) {
  };

  private getOnOff(): Promise<any> {
    const query = this.addTokenGet(environment.backend + 'admin/is_on');
    const statusOp = this.http.get(query).toPromise();
    return statusOp.then(data => this.getOnOffResponse(data), err => this.handleError(err));
  }

  private getOnOffResponse(res: Response): Promise<any> {
    const data = this.extractData(res);
    if (!this.hasError(data)) {
      this.status.know_on = true;
      this.facadeRunning = data.on;
      console.log('received facade state');
    }
    return Promise.resolve({});
  }

  private getCal(): Promise<any> {
    const query = this.addTokenGet(environment.backend + 'admin/cal');
    const statusOp = this.http.get(query).toPromise();
    return statusOp.then(data => this.getCalResponse(data), err => this.handleError(err));
  }

  private getCalResponse(res: Response): Promise<any> {
    const data = this.extractData(res);
    if (!this.hasError(data)) {
      this.status.know_cal = true;
      this.cal.on = data.on;
      this.cal.off = data.off;
      this.cal.default = data.default;
      this.cal.params = data.params;
      console.log('received facade cal');
    }
    return Promise.resolve({});
  }

  private getApp(): Promise<any> {
    const query = this.addTokenGet(environment.backend + 'admin/apps/running');
    const statusOp = this.http.get(query).toPromise();
    return statusOp.then(data => this.getAppRespone(data), err => this.handleError(err));
  }

  private getAppRespone(res: Response): Promise<any> {
    const data = this.extractData(res);
    if (!this.hasError(data)) {
      this.status.know_app = true;
      this.app.name = data.data.name;
      console.log(this.app.name !== '');
      console.log(this.app.name);
      this.app.start = data.data.start;
      this.app.user = data.data.user;
      this.app.params = data.data.params;
      console.log('received facade app');
    }
    return Promise.resolve({});
  }

  public killApp(): Promise<any> {
    // TODO: implement
    return Promise.resolve({});
  }

  public login(user: string, pass: string): Promise<any> {
    // TODO: construct proper JWT payload here
    const payload = {
      username: user,
      password: pass
    };
    const loginOp = this.http.post(environment.backend + 'login', payload).toPromise();
    return loginOp.then(data => this.loginResponse(data), err => this.handleError(err));
  }

  private loginResponse(res: Response): Promise<any> {
    const data = this.extractData(res);
    if (data.error === 0 && data.token) {
      this.logged_in = true;
      this.loginErr = false;
      this.token = data.token;
      console.log('logged in');

      // getting facade state
      this.getOnOff();
      this.getCal();
      this.getApp();
    } else {
      // TODO: write service that looks up error codes and echoes the right error message
      this.loginErr = true;
    }
    return Promise.resolve({});
  }

  private addTokenPost(payload: object): object {
    if (this.token !== '') {
      payload['token'] = this.token;
    } else {
      console.error('trying to add token without token');
    }
    return payload;
  }

  private addTokenGet(query: string): string {
    // TODO: test if there is already a '?' in the query, if yes, change ? to &
    query += '?token=' + this.token;
    return query
  }

  private hasError(data: object): boolean {
    if (data['error'] === 0) {
      this.error = false;
      this.status.changing = false;
      this.errorMsg = '';
      return false;
    } else {
      // TODO: write service that looks up error codes and echoes the right error message to this.errorMsg
      this.error = true;
      this.errorMsg = 'TODO: add correct err msg here. Code: ' + data['error'];
      return true;
    }
  }

  public switchFacade(onoff: boolean): Promise<any> {
    this.status.changing = true;
    const payload = {
      on: onoff
    };

    const switchOp = this.http.post(environment.backend + 'admin/is_on', this.addTokenPost(payload)).toPromise();
    return switchOp.then(data => this.switchFacadeResponse(data), err => this.handleError(err));
  }

  private extractData(res: Response) {
    const body = res['_body'] || '';
    const data = JSON.parse(body);
    return data;
  }

  public switchFacadeResponse(res: Response): Promise<any> {
    const data = this.extractData(res);
    if (!this.hasError(data)) {
      this.facadeRunning = data.on;
      this.getApp();
      console.log('changed facade state');
    }
    return Promise.resolve({});
  }

  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

}

