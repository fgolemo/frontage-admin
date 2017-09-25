import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import {environment} from '../../environments/environment';


@Injectable()
export class BackendService {
  logged_in = false;
  loginErr = false;
  token = '';
  errorMsg = '';
  error = false;
  facadeRunning = false;
  knowFacadeState = 0;
  status = {
    changing: false
  };

  constructor(private http: Http) {
    // TODO: get facade state, then set the knownstatevar and finally change template to show loading bar until this state is done
  };

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
    const body = res['_body'] || '';
    const data = JSON.parse(body);
    if (data.error === 0 && data.token) {
      this.logged_in = true;
      this.loginErr = false;
      this.token = data.token;
      console.log('logged in');
    } else {
      // TODO: write service that looks up error codes and echoes the right error message
      this.loginErr = true;
    }
    return Promise.resolve({});
  }

  private addToken(payload: object): object {
    if (this.token !== '') {
      payload['token'] = this.token;
    } else {
      console.error('trying to add token without token');
    }
    return payload;
  }

  public switchFacade(onoff: boolean): Promise<any> {
    this.status.changing = true;
    const payload = {
      on: onoff
    };

    // TODO: add token-adding payload wrapper function

    const switchOp = this.http.post(environment.backend + 'admin/is_on', this.addToken(payload)).toPromise();
    return switchOp.then(data => this.switchFacadeResponse(data), err => this.handleError(err));
  }

  public switchFacadeResponse(res: Response): Promise<any> {
    const body = res['_body'] || '';
    const data = JSON.parse(body);
    if (data.error === 0) {
      this.error = false;
      this.status.changing = false;
      console.log(data.on);
      this.facadeRunning = data.on;
      console.log('changed facade state');
    } else {
      // TODO: write service that looks up error codes and echoes the right error message to this.errorMsg
      this.error = true;
    }

    return Promise.resolve({});
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

