import { Component, OnInit } from '@angular/core';
import { MenuController } from 'ionic-angular';

import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { ApiService } from '../../services/api/api.service';
import { EventsService } from '../../services/events.service';


@Component({
  selector: 'wh-search',
  templateUrl: 'search.component.html'
})
export class Search implements OnInit {

  public searchForm: FormGroup;
  public floors: Array<number>;
  public sections: Array<number>;

  constructor(private apiService:ApiService, private eventsService: EventsService, public menuCtrl: MenuController, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.updateLists();
    this.searchForm = this.formBuilder.group({
      code: new FormControl(''),
      floor: new FormControl(''),
      section: new FormControl('')
    });
    this.clearSearchForm();
    this.eventsService.editorClosed.subscribe(() => {
      this.updateLists();
    })
  }

  private updateLists(): void {
    this.apiService.getFloorsAndSections().subscribe((data:Array<Array<number>>) => {
      this.floors = data[0];
      this.sections = data[1]
    });
  }

  public clearSearchForm():  void {
    this.searchForm.reset();
  }

  public closeSearch(): void {
    this.menuCtrl.close("left");
  }

  public saveSearchForm(): void {
    this.eventsService.refresh.emit({
      code:  this.searchForm.value.code,
      floor: Number(this.searchForm.value.floor),
      section: Number(this.searchForm.value.section)
    });
    this.menuCtrl.close("left");
  }
}
