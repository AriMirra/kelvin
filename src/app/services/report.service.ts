import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {HttpService} from './http.service';
import {Point} from '../../shared/reports/Point';
import {ReportParameters} from '../../shared/reports/ReportParameters';

@Injectable({
    providedIn: 'root'
})
export class ReportService {

    constructor(private http: HttpService) {
    }

    /**
     * Method that returns an array of points based on the given report parameters.
     *
     * @param {ReportParameters} reportParameters
     * @returns {Observable<Point[]>}
     */
    getReport(reportParameters: ReportParameters): Observable<Point[]> {
        const json = reportParameters.asJson();
        return this.http.post('/report', json)
            .pipe(
                map((response) => {
                    console.log(response);
                    const map1 = response.body.map(p => Point.fromAny(p));
                    console.log(map1);
                    return map1;
                }),
                catchError(err => {
                    console.log(err);
                    return Observable.of(null);
                })
            );
    }

}
