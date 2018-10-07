import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {HttpService} from './http.service';
import {Report} from '../../shared/reports/Report';
import {ReportParameters} from '../../shared/reports/ReportParameters';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpService) {
  }

  getReport(reportParameters: ReportParameters): Observable<Report> {
    const json = reportParameters.asJson();
    return this.http.post('/report', json)
      .pipe(
        map((response: any) => {
          return response.body;
        }),
        catchError(err => {
          console.log(err);
          return Observable.of(null);
        })
      );
  }
}
