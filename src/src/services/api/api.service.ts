import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {Observable} from 'rxjs';

import {StorageConstant} from '../../constants/storage.constant';
import {Item} from '../../interfaces/item.interface';
import {LoaderService} from '../app/loader.service';

import {Http} from '@angular/http';

@Injectable()
export class ApiService {

  constructor(private storage: Storage,
              private loaderService: LoaderService,
              private http: Http) {
    this.getLocalData();
  }

  public getFloorsAndSections(): Observable<Array<Array<number>>> {
    return new Observable(observer => {
      this.getLocalData().subscribe(products => {
        if (!products || !products.length) {
          this.storage.set(StorageConstant.WareHouseList, Products);
          products = Products;
        }

        let floors: Array<number> = [1, 2, 3];
        let sections: Array<number> = [1, 2, 3];

        products.forEach(item => {
          if (!floors.includes(item.floor)) {
            floors.push(item.floor);
          }
          if (!sections.includes(item.section)) {
            sections.push(item.section);
          }
        });

        observer.next([floors, sections]);
      });
    });
  }

  public getProducts(search: any): Observable<Array<Item>> {
    this.loaderService.display(true);

    return new Observable(observer => {
      this.getLocalData().subscribe(products => {
        products = products.filter(item => {
          return ((!search['code'] || item['code'].includes(search['code'])) &&
            (!search['floor'] || item['floor'] === search['floor']) &&
            (!search['section'] || item['section'] === search['section']));
        });
        observer.next(products);
        this.loaderService.display(false);
      });
    });
  }

  public createProduct(product: Item): Observable<boolean> {
    this.loaderService.display(true);

    return new Observable(observer => {
      this.getLocalData()
        .subscribe(products => {
          let index = products.findIndex(item => item['code'] === product['code']);

          if (index === -1) {
            products.push({
              code: product['code'],
              quantity: Number(product['quantity']),
              floor: Number(product['floor']),
              section: Number(product['section'])
            });

            this.setLocalData(products).then(() => {
              observer.next(true);
            });
          }
          else observer.next(false);
          this.loaderService.display(false);
        });
    });
  }

  public editProduct(product: Item): Observable<boolean> {
    this.loaderService.display(true);

    return new Observable(observer => {
      this.getLocalData().subscribe(products => {
        let index = products.findIndex(item => item['code'] === product['code']);

        if (index > -1) {
          products[index] = {
            code: product['code'],
            quantity: Number(product['quantity']),
            floor: Number(product['floor']),
            section: Number(product['section'])
          };
          this.setLocalData(products).then((data) => {
            observer.next(true);
          });
        }
        else observer.next(false);

        this.loaderService.display(false);
      });
    });
  }

  public deleteProduct(product: Item): Observable<boolean> {
    this.loaderService.display(true);

    return new Observable(observer => {
      this.getLocalData().subscribe(products => {
        let index = products.findIndex(item => item['code'] === product['code']);

        if (index > -1) {
          products.splice(index, 1);
          this.setLocalData(products).then((data) => {
            observer.next(true);
          });
        }
        else observer.next(false);
        this.loaderService.display(false);
      });
    });
  }

  private setLocalData(data): Promise<any> {
    return this.storage.set(StorageConstant.WareHouseList, data);
  }

  private getLocalData(): Observable<any> {
    return Observable.fromPromise(
      this.storage.get(StorageConstant.WareHouseList).then((productsStorage: Array<Item>) => {
        return this.http.get('assets/products.json').map(res => res.json()).toPromise().then((productsDefault: Array<Item>) => {
          if (!productsStorage || !productsStorage.length) {
            this.storage.set(StorageConstant.WareHouseList, productsDefault);
            productsStorage = productsDefault;
          }
          return productsStorage;
        });
      })
    );
  }

}



