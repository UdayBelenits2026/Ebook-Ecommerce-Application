import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CartService } from './cart-service';

describe('CartService', () => {
  let service: CartService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(CartService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('getCart maps response and normalizes image', (done) => {
    const mockResp = {
      success: true,
      data: {
        items: [{ price: '100', quantity: '2', stock: '5', rating: '4', subtotal: '200', image: 'img.png' }],
        cart_count: '3',
        subtotal: '300',
        shipping: '20',
        grand_total: '320'
      }
    } as any;

    service.getCart().subscribe(res => {
      expect(res.data.cart_count).toBe(3);
      expect(res.data.items.length).toBe(1);
      expect(res.data.items[0].price).toBe(100);
      expect(res.data.items[0].image).toContain('http');
      done();
    });

    const req = httpMock.expectOne('http://127.0.0.1:8000/cart');
    expect(req.request.method).toBe('GET');
    req.flush(mockResp);
  });

  it('getCartCount updates subject on response', (done) => {
    service.getCartCount().subscribe();
    const req = httpMock.expectOne('http://127.0.0.1:8000/cart/count');
    req.flush({ data: { cart_count: 7 } });
    // Allow tap to run
    setTimeout(() => {
      service.cartCount$.subscribe(c => {
        expect(c).toBe(7);
        done();
      }).unsubscribe();
    });
  });

});
