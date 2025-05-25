import { Component } from '@angular/core';
import { AuthService } from '../../model/model';
import {MatDialogRef} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
     // Login
  username = '';
  password = '';

  // Signup
  signupMode = false;
  signupUsername = '';
  signupPassword = '';
  signupEmail = '';
  signupFullName = '';

    constructor(
      private authService: AuthService,
      private dialogRef: MatDialogRef<LoginComponent>
    ){}


    login(){

      if(this.username && this.password){
        this.authService.login(this.username,this.password).subscribe({
          next: (response) => {
            if(response?.result){
              this.authService.setLoginStatus(true);
              this.dialogRef.close(true)
            }else{
              alert("INVALID USERNAME OR PASSWORD")
            }
          }, error: (err) =>{
            alert(err)
          }
        })
      }
    }

    toggleSignup() {
      this.signupMode = !this.signupMode;
    }

    signup() {
      if (this.signupUsername && this.signupPassword && this.signupEmail && this.signupFullName) {
        const now = new Date().toISOString();
        const payload = {
          userId: 0,
          userName: this.signupUsername,
          emailId: this.signupEmail,
          fullName: this.signupFullName,
          role: 'Customer',
          createdDate: now,
          password: this.signupPassword,
          projectName: 'BusBooking',
          refreshToken: '',
          refreshTokenExpiryTime: now
        };
  
        this.authService.signup(payload).subscribe({
          next: (response) => {
            if (response?.result) {
              alert('User created successfully. Please log in.');
              this.signupMode = false;
            } else {
              alert('Signup failed. Try again.');
            }
          },
          error: (err) => {
            alert('Signup error');
            console.error(err);
          }
        });
      }
    }

    cancel(){
      this.dialogRef.close(false)
    }
}
