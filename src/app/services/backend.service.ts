import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import {environment} from '../../environments/environment';


@Injectable()
export class BackendService {
  logged_in = false;
  token = '';
  facadeRunning = false;
  knowFacadeState = 0;

  constructor(private http: Http) {
    // TODO: get facade state, then set the knownstatevar and finally change template to show loading bar until this state is done
  };

  public login(user: string, pass: string): Promise<any> {
    // TODO: construct proper JWT payload here
    const payload = new URLSearchParams();
    payload.append('username', user);
    payload.append('password', pass);
    // TODO: there is something wrong here - this doesn't get sent properly, fix protocol/form-tokenization
    const loginOp = this.http.post(environment.backend + 'login', payload.toString()).toPromise();
    return loginOp.then(data => this.loginResponse(data), err => this.handleError(err));
  }

  private loginResponse(res: Response): Promise<any> {
    const body = res['_body'] || '';
    const data = JSON.parse(body);
    if (data.error === 0 && data.token) {
      this.logged_in = true;
      this.token = data.token;
      console.log('logged in');
    }
    return Promise.resolve({});
  }

  public switchFacade(): boolean {
    console.log(this.facadeRunning ? 'was running' : 'was stopped');
    console.log('switching facade on/off');
    // TODO: add actual call here
    this.facadeRunning = !this.facadeRunning;
    console.log(this.facadeRunning ? 'is running now' : 'is stopped now');
    return true;
  }

  // public isOn(): Promise<any> {
  //   this.http.get(environment.backend + '');
  //   return null;
  //   // if (this.bars.length == 0) {
  //   //   const obs = this.http.get(BARS).toPromise();
  //   //   return obs.then(data => this.extractBars(data), err => this.handleError(err));
  //   // } else {
  //   //   return(Promise.resolve(this.bars));
  //   // }
  // }

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


  // getNearbyBarsCSV(lat: number, long: number, dist: number, search: string): Promise<any> {
  //   // console.log("dist: "+dist);
  //   return new Promise((resolve, reject) => {
  //
  //     const nearbyBars = this.bars.filter((bar) => {
  //       return this.distance(bar, lat, long) <= dist;
  //     });
  //
  //     // console.dir(nearbyBars);
  //
  //     resolve({
  //       data: nearbyBars,
  //       paging: {}
  //     })
  //   });
  // }
}

