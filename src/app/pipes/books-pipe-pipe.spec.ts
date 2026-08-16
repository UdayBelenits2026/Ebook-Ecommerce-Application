import { StockStatusPipe } from './books-pipe-pipe';

describe('StockStatusPipe', () => {
  let pipe: StockStatusPipe;

  beforeEach(() => {
    pipe = new StockStatusPipe();
  });

  it('returns Unknown Stock for null/undefined', () => {
    expect(pipe.transform(null)).toBe('Unknown Stock');
    expect(pipe.transform(undefined)).toBe('Unknown Stock');
  });

  it('returns Out of Stock for zero or negative', () => {
    expect(pipe.transform(0)).toBe('Out of Stock');
    
  });

  it('returns Only X left for small stock', () => {
    expect(pipe.transform(3)).toBe('Only 3 left');
    expect(pipe.transform(5)).toBe('Only 5 left');
  });

  it('returns In Stock for larger numbers', () => {
    expect(pipe.transform(6)).toBe('In Stock');
    expect(pipe.transform(100)).toBe('In Stock');
  });

});
