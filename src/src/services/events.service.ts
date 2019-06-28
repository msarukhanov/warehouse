import {Injectable, EventEmitter} from '@angular/core';

@Injectable()
export class EventsService {
  public passItem = new EventEmitter();
  public refresh = new EventEmitter();
  public editorClosed = new EventEmitter();
}
