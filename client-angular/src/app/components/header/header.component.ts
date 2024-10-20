import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/services/authentication.service';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  items!: MenuItem[];
  visible: boolean = true;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
  ) { }

  ngOnInit() {
    this.items = [
      {
        label: 'Home',
        routerLink: ['']
      },
      {
        label: 'Search',
        routerLink: ['stocks', 'search']
      },
      {
        label: 'Stocks',
        routerLink: ['stocks', 'all']
      },
      {
        label: 'Login',
        visible: false,
        command: () => this.router.navigate(['/login']),
      },
      {
        label: 'User',
        visible: false,
        items: [
          { label: 'My Stocks', routerLink: ['user', 'stocks'] },
          { label: 'Information', routerLink: ['user', 'information'] },
          { label: 'Market Trends', routerLink: ['marketTrends'] },
          { label: 'Notifications', routerLink: ['user', 'notifications'] },
          { label: 'Sign Out', command: () => this.SignOut() },
        ]
      }
    ];

    let loginItemIndex = this.items
      .findIndex(item => item.label == 'Login');

    let userItemIndex = this.items
      .findIndex(item => item.label == 'User');

    this.authenticationService.userConnection()
      .subscribe(isUserConnected => {
        console.log(isUserConnected);
        
        this.items[loginItemIndex].visible = !isUserConnected;
        this.items[userItemIndex].visible = isUserConnected;

        this.updateVisibility();
      });
  }

  ngOnChanges(){
    let isUserConnected = this.authenticationService.isUserConnected();

    let loginItemIndex = this.items
      .findIndex(item => item.label == 'Login');

    let userItemIndex = this.items
      .findIndex(item => item.label == 'User');

    this.items[loginItemIndex].visible = !isUserConnected;
    this.items[userItemIndex].visible = isUserConnected;
  }

  SignOut() {
    this.authenticationService.DisconnectUser();
    this.router.navigate(['/']);
  }

  updateVisibility(): void {
    this.visible = false;
    setTimeout(() => this.visible = true, 0);
  }
}