import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stockStatus',
  standalone: true
})
export class StockStatusPipe implements PipeTransform {

  transform(stock: number | null | undefined): string {
    if(stock===null ||stock===undefined){
      return 'Unknown Stock'
    }
    switch (true) {
      case stock === 0:
        return 'Out of Stock';

      case stock <= 5:
        return `Only ${stock} left`;

      default:
        return 'In Stock';
    }
  }
}