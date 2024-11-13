import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent 
{
  credentials={
    studentEmail:"",
    studentPassword:""
  }
    constructor(private router:Router,private apiService:ApiService){}
    // onLogin():void 
    // {
    //   if (this.credentials.studentEmail==='e' && this.credentials.studentPassword==='p') 
    //   {
    //     this.router.navigate(['/dashboard']);
    //   } 
    //   else 
    //   {
    //     alert('Invalid email or password');
    //   }
    // }
    onLogin()
    {
      this.apiService.login(this.credentials).subscribe(
        {next:(response:any)=>{
          console.log("user successfully login")
          this.apiService.saveToken(response.token)
          this.router.navigate(['/dashboard']);
        },
        error:(error)=>{
          console.log("login NOT successfull")
          console.error(error);
        }}
        )
    }
}