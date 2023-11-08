import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Product Search App';
  locationChoice: string = '';
  zipCode: string = '';
  onSubmit(formValue: any) {
    console.log(formValue);
    // Handle the form submission, for example making an API call
  }
}
