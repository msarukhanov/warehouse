import { Component, OnInit} from '@angular/core';

import { ApiService } from '../../services/api/api.service';
import { EventsService } from '../../services/events.service';
import { LoaderService } from '../../services/app/loader.service';
import {Item} from '../../interfaces/item.interface';

@Component({
  selector: 'page-list',
  templateUrl: 'list.component.html',
  providers: [LoaderService]
})
export class ListPage implements OnInit  {

  public isLoading: boolean;

  public items: Array<Item>;

  public searchParams: any  = {
    code: " ",
    floor: null,
    section: null
  };

  constructor(private apiService: ApiService, private eventsService: EventsService, public loaderService: LoaderService) {}

  ngOnInit() {
    this.refreshList();

    this.eventsService.refresh.subscribe((data: Array<Item>) => {
      this.searchParams = data;
      this.refreshList();
    });
    this.loaderService.status.subscribe((val: boolean) => {
      this.isLoading = val;
    });
  }

  private refreshList(): void {
    this.apiService.getProducts(this.searchParams).subscribe((data: Array<Item>) => {
      this.items = data;
    });
  }

  public clearEditForm(): void {
    this.eventsService.editorClosed.emit("");
  }

  public editItem(item): void {
    this.eventsService.passItem.emit(item);
  }
}
