
export interface Book {
  id: number;
  title: string;
  author: string;
  category_id: number;
  category_name?: string;
  publisher: string;
  isbn: string;
  language: string;
  pages: number;
  price: number;
  stock: number;
  description: string;
  image_url?: string;
  image?: string;
}

export interface CreateBookDto {
  title: string;
  author: string;
  category_id: number;
  publisher: string;
  isbn: string;
  language: string;
  pages: number;
  price: number;
  stock: number;
  description: string;
}

export interface UpdateBookDto {
  title?: string;
  author?: string;
  category_id?: number;
  publisher?: string;
  isbn?: string;
  language?: string;
  pages?: number;
  price?: number;
  stock?: number;
  description?: string;
}
