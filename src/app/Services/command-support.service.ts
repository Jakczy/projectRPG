import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class CommandSupportService {

  private commandSource = new BehaviorSubject<string>(undefined);
  currentCommand = this.commandSource.asObservable();

  constructor() { }

  processCommand (command: string){
    this.commandSource.next(command);
    return false;
  }

  getEventSubject(): BehaviorSubject<string> {
    return this.commandSource;
  }
}
