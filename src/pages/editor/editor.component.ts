import {Component} from '@angular/core';
import {MenuController} from 'ionic-angular';

import {Validators, FormBuilder, FormGroup, FormControl} from '@angular/forms';

import {ApiService} from '../../services/api/api.service';
import {EventsService} from '../../services/events.service';
import {Item} from '../../interfaces/item.interface'


@Component({
  selector: 'wh-editor',
  templateUrl: 'editor.component.html'
})
export class Editor {

  public editForm: FormGroup;
  private newForm: boolean = true;

  constructor(private apiService: ApiService,
              private eventsService: EventsService,
              private menuCtrl: MenuController,
              private formBuilder: FormBuilder) {

    this.editForm = this.formBuilder.group({
      code: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(/^([A-Z]){2,4} ([0-9]){4,6}$/)
      ])),
      quantity: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(/^\d+$/)
      ])),
      floor: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(/^\d+$/)
      ])),
      section: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(/^\d+$/)
      ]))
    });

    this.clearEditForm();

    this.eventsService.passItem.subscribe((data: Item) => {
      this.editForm.patchValue(data);
      this.editForm.markAsPristine();
      this.newForm = false;
      this.menuCtrl.open("right");
    });

    this.eventsService.editorClosed.subscribe(() => {
      this.clearEditForm();
    })

  }

  public clearEditForm(): void {
    this.editForm.reset();
    this.newForm = true;
    this.editForm.markAsPristine();
  }

  public closeEditor(): void {
    this.menuCtrl.close("right");
  }

  private refreshList(): void {
    this.clearEditForm();
    this.eventsService.refresh.emit("");
    this.closeEditor();
  }

  public deleteItem(): void {
    this.apiService.deleteProduct(this.editForm.value).subscribe((result: boolean) => {
      if (result) {
        this.refreshList();
      }
    });
  }

  public updateList(): void {
    if (this.newForm) {
      this.apiService.createProduct(this.editForm.value).subscribe((result: boolean) => {
        if (result) {
          this.refreshList();
        }
      });
    }
    else {
      this.apiService.editProduct(this.editForm.value).subscribe((result: boolean) => {
        if (result) {
          this.refreshList();
        }
      });
    }
  }
}
