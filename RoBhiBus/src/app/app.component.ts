import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './model/model';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from './pages/login/login.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'RoBhiBus';
  isLoggedIn = false

  constructor(
    private authService: AuthService,
    private dialog: MatDialog
  ){

  }

  login(){
    if(!this.authService.isLoggedIn()){
          const dialogRef = this.dialog.open(LoginComponent,{
            disableClose: true
          });
    
          dialogRef.afterClosed().subscribe((result: boolean) => {
            if (result) {
              // Login successful, stay on page
              this.isLoggedIn = true
              alert('You are now logged in!');
            }
          });
          sessionStorage.setItem('proceededToPay', 'true');
          return;
        }
  }

  logout(){
    this.isLoggedIn = false
    this.authService.logout()
  }
}
