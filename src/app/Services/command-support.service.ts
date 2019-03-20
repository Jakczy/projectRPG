import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class CommandSupportService {

  private commandSource = new BehaviorSubject<any>(undefined);
  currentCommand = this.commandSource.asObservable();

  constructor() { }

  processCommand (command: any){
    this.commandSource.next(command);
  }

  /*
  }*/

  getEventSubject(): BehaviorSubject<any> {
    return this.commandSource;
  }
}
