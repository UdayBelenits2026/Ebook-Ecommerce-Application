import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import {
ApiResponse,
BookDetails
} from '../interface/book-details-interface';

@Injectable({
providedIn:'root'
})
export class BookDetailsService{

private readonly http=inject(HttpClient);

private readonly api='http://127.0.0.1:8000';

getBook(id:number):Observable<ApiResponse<BookDetails>>{

return this.http.get<ApiResponse<BookDetails>>(
`${this.api}/books/${id}`
);

}

}