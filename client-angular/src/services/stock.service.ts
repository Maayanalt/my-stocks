import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Stock } from 'models/stocks/stock';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import { environment } from 'environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  lastUpdateTime: Date | undefined;
  allStocks: BehaviorSubject<Stock[]> = new BehaviorSubject<Stock[]>([]);

  constructor(private httpClient: HttpClient) {
    this.lastUpdateTime = new Date();
  }

  GetAllStocks(): Observable<Stock[]> {
    if (!this.shouldBeUpdated(this.lastUpdateTime, new Date()))
      return this.allStocks.asObservable();

    return this.httpClient.get<Stock[]>(`${environment.server_url}/Stock`).pipe(
      tap(res => {
        this.allStocks.next(res);
        this.lastUpdateTime = new Date();
      }),
      switchMap(() => this.allStocks.asObservable())
    );
  }

  GetStockBySymbolAsync(stockSymbol: string): Observable<Stock> {
    return this.httpClient
      .get<Stock>(`${environment.server_url}/Stock/symbol/${stockSymbol}`);
  }

  GetStockByNameAsync(stockName: string): Observable<Stock> {
    return this.httpClient
      .get<Stock>(`${environment.server_url}/Stock/name/${stockName}`);
  }

  FindStocksByNameAsync(stockName: string): Observable<Stock[]> {
    return this.httpClient
      .get<Stock[]>(`${environment.server_url}/Stock/find/name/${stockName}`)
  }

  shouldBeUpdated(startTime: Date | undefined, endTime: Date): boolean {
    if(startTime == undefined)
      return true;

    const differenceInMillis = endTime.getTime() - startTime.getTime();
    const thirtyMinutesInMillis = 30 * 60 * 1000;

    return differenceInMillis < thirtyMinutesInMillis;
  }
}