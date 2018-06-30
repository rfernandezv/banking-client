import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent implements OnInit {
  constructor(private http: HttpClient){
  }

  ngOnInit() : void{
    console.log("richar");
    /*
      this.http.get(environment.apiUrl+'/users/getAllUsers').subscribe(data => {
        console.log(data);
      });
      */
    }  
}
