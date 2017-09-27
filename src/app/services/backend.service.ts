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

// TODO: make external class, and use internally properly
export class App {
  name: string;
  params: object;
  start: string;
  user: string;
}

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
    know_applist: false,
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
  applist = [];

  constructor(private http: Http) {
  };

  private getOnOff(): Promise<any> {
    const query = this.addTokenGet(environment.backend + 'admin/is_on');
    const statusOp = this.http.get(query).toPromise();
    return statusOp.then(data => this.getOnOffResponse(data), err => BackendService.handleError(err));
  }

  private getOnOffResponse(res: Response): Promise<any> {
    const data = BackendService.extractData(res);
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
    return statusOp.then(data => this.getCalResponse(data), err => BackendService.handleError(err));
  }

  private getCalResponse(res: Response): Promise<any> {
    const data = BackendService.extractData(res);
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
    return statusOp.then(data => this.getAppRespone(data), err => BackendService.handleError(err));
  }

  private getAppRespone(res: Response): Promise<any> {
    const data = BackendService.extractData(res);
    if (!this.hasError(data)) {
      this.status.know_app = true;
      this.app.name = data.data.name;
      this.app.start = data.data.start;
      this.app.user = data.data.user;
      this.app.params = data.data.params;
      console.log('received facade app');
    }
    return Promise.resolve({});
  }

  private getAppList(): Promise<any> {
    const query = this.addTokenGet(environment.backend + 'admin/apps');
    const statusOp = this.http.get(query).toPromise();
    return statusOp.then(data => this.getAppListRespone(data), err => BackendService.handleError(err));
  }

  private getAppListRespone(res: Response): Promise<any> {
    const data = BackendService.extractData(res);
    if (!this.hasError(data)) {
      this.status.know_applist = true;
      this.applist = data.data;
      console.log('received app list');
      console.log('got ' + this.applist.length + ' apps');
    }
    return Promise.resolve({});
  }

  public killApp(): Promise<any> {

    // // this should have worked, but on my mock server it isn't
    // const payload = this.addTokenPost({abc: 123});
    // const killOp = this.http.delete(environment.backend + 'admin/apps/running', payload).toPromise();

    const query = this.addTokenGet(environment.backend + 'admin/apps/running');
    const killOp = this.http.delete(query).toPromise();
    return killOp.then(data => this.getAppRespone(data), err => BackendService.handleError(err));
  }

  public launchApp(app: App): Promise<any> {

    // this should have worked, but on my mock server it isn't
    const payload = this.addTokenPost(app);
    const launchOp = this.http.put(environment.backend + 'admin/apps/running', payload).toPromise();

    return launchOp.then(data => this.getAppRespone(data), err => BackendService.handleError(err));
  }

  public login(user: string, pass: string): Promise<any> {
    // TODO: construct proper JWT payload here
    const payload = {
      username: user,
      password: pass
    };
    const loginOp = this.http.post(environment.backend + 'login', payload).toPromise();
    return loginOp.then(data => this.loginResponse(data), err => BackendService.handleError(err));
  }

  private loginResponse(res: Response): Promise<any> {
    const data = BackendService.extractData(res);
    if (data.error === 0 && data.token) {
      this.logged_in = true;
      this.loginErr = false;
      this.token = data.token;
      console.log('logged in');

      // getting facade state
      this.getOnOff();
      this.getCal();
      this.getApp();
      this.getAppList();
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
    return switchOp.then(data => this.switchFacadeResponse(data), err => BackendService.handleError(err));
  }

  private static extractData(res: Response) {
    const body = res['_body'] || '';
    return JSON.parse(body);
  }

  public switchFacadeResponse(res: Response): Promise<any> {
    const data = BackendService.extractData(res);
    if (!this.hasError(data)) {
      this.facadeRunning = data.on;
      this.getApp();
      console.log('changed facade state');
    }
    return Promise.resolve({});
  }

  private static handleError(error: Response | any) {
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

