import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  /**
   * Signal to manage the state of a common loader.
   * Can be used to dynamically toggle loading indicators in the UI.
   */
  commonLoader = signal(false);

  showLoader() {
    this.commonLoader.set(true);
  }
  hideLoader() {
    this.commonLoader.set(false);
  }
  setLoader(value: boolean) {
    this.commonLoader.set(value);
  }
}
