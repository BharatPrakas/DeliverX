import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Loader } from './common/component/loader/loader';
import { CommonService } from './common/services/common-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Loader],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private commonService = inject(CommonService);
  protected readonly title = signal('DeliverX');
  protected readonly commonLoader = this.commonService.commonLoader;
}
