import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './home/not-found/not-found.component';
import { UserLoginComponent } from './home/user-login/user-login.component';
import { UserRegisterComponent } from './home/user-register/user-register.component';
import { UserInformationComponent } from './home/user-information/user-information.component';
import { StocksViewerComponent } from './home/stocks-viewer/stocks-viewer.component';
import { StocksSearchComponent } from './home/stocks-search/stocks-search.component';
import { StockInformationComponent } from './home/stock-information/stock-information.component';
import { StockSharesComponent } from './home/stock-shares/stock-shares.component';
import { connectedUserGuard } from 'src/routeGuards/connected-user.guard';
import { StocksFilterPaginationTableComponent } from './partial-views/stocks-filter-pagination-table/stocks-filter-pagination-table.component';
import { NotificationCenterComponent } from './partial-views/notification-center/notification-center.component';
import { MarketTrendsComponent } from './partial-views/market-trends/market-trends.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: UserLoginComponent },
  { path: 'register', component: UserRegisterComponent },
  {
    path: 'stocks',
    children: [
      { path: 'search', component: StocksSearchComponent },
      { path: 'information', component: StockInformationComponent },
      { path: 'all', component: StocksFilterPaginationTableComponent }
    ],
  },
  { path: 'marketTrends', component: MarketTrendsComponent, canActivate: [connectedUserGuard] },
  {
    path: 'user',
    children: [
      { path: 'stocks', component: StocksViewerComponent },
      { path: 'stocks', children: [
        { path: 'shares', component: StockSharesComponent}
      ]},
      { path: 'information', component: UserInformationComponent },
      { path: 'notifications', component: NotificationCenterComponent }
    ],
    canActivateChild: [connectedUserGuard]
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule { }