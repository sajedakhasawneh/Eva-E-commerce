import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GoogleTranslateService {

  constructor() { }

  loadGoogleTranslateScript() {
    const script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.head.appendChild(script);
  }
}
