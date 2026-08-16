import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WishlistService } from './wishlist-service';

describe('WishlistService', () => {
  let service: WishlistService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(WishlistService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('getWishlist requests /wishlist and maps items & wishlist_count', (done) => {
    const mock = { data: { items: [{ id:1, image: 'p.png' }], wishlist_count: 2 } } as any;
    service.getWishlist().subscribe(res => {
      expect(res.data.items.length).toBe(1);
      expect(res.data.wishlist_count).toBe(2);
      done();
    });
    const req = httpMock.expectOne('http://127.0.0.1:8000/wishlist');
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

});
