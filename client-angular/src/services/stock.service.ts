import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MarketTrend } from 'src/models/marketTrends/market-trend';
import { Stock } from 'src/models/stocks/stock';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  lastUpdateTime: Date | undefined;
  allStocks: BehaviorSubject<Stock[]> = new BehaviorSubject<Stock[]>([]);
  stockEndPointUrl: string = `${environment.server_url}/Stock`;

  constructor(private httpClient: HttpClient) {
    this.lastUpdateTime = new Date();
  }

  GetAllStocks(): Observable<Stock[]> {
    if (!this.shouldBeUpdated(this.lastUpdateTime, new Date()))
      return this.allStocks.asObservable();

    return this.httpClient.get<Stock[]>(this.stockEndPointUrl).pipe(
      tap(res => {
        this.allStocks.next(res);
        this.lastUpdateTime = new Date();
      }),
      switchMap(() => this.allStocks.asObservable())
    );
  }

  GetStockBySymbol(stockSymbol: string): Observable<Stock> {
    return this.httpClient
      .get<Stock>(`${this.stockEndPointUrl}/symbol/${stockSymbol}`);
  }

  FindStocksByName(stockName: string): Observable<Stock[]> {
    return this.httpClient
      .get<Stock[]>(`${this.stockEndPointUrl}/find/${stockName}`)
  }

  GetMarketsTrends(): Observable<MarketTrend[]>{
    return this.httpClient
      .get<MarketTrend[]>(`${this.stockEndPointUrl}/marketTrends`)
  }
  
  shouldBeUpdated(startTime: Date | undefined, endTime: Date): boolean {
    if(startTime == undefined)
      return true;

    const differenceInMillis = endTime.getTime() - startTime.getTime();
    const thirtyMinutesInMillis = 30 * 60 * 1000;

    return differenceInMillis < thirtyMinutesInMillis;
  }
}