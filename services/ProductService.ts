import clipboardCopy from 'clipboard-copy';
import Fuse from 'fuse.js';
import { BehaviorSubject } from 'rxjs';
import { Product } from '@/pages/api/stripe/products';
import { arrayOf } from '@/utils/functions/arrayOf';
import { dictOf } from '@/utils/functions/dictOf';
import { getUrl } from '@/utils/functions/getUrl';

export type Products = {
  [id: string]: Product;
};

export const ProductService = new (class {
  public products = new BehaviorSubject<Products>({});

  public load() {
    fetch(getUrl('/api/stripe/products'))
      .then(res => res.json())
      .then((products: Product[]) => {
        this.products.next(dictOf(products, 'id'));
      });
  }

  public search(query: string): Product[] {
    const fuse = new Fuse(arrayOf(this.products.value), {
      keys: ['name', 'description']
    });

    const results = fuse.search(query);
    return results.map(result => result.item);
  }

  public async create(product: Product) {
    await fetch(getUrl('/api/stripe/products/create'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(product)
    });
  }

  public export() {
    const rows: (string | undefined)[][] = [['id', 'price', 'name', 'description', 'images']];

    const metadataIndices: { [key: string]: number } = {};

    for (const product of arrayOf(this.products.value)) {
      const row = [
        product.id,
        `${product.price.amount}`,
        product.name,
        product.description,
        product.images.join(',')
      ];

      // look for metadata
      for (const [key, value] of Object.entries(product.metadata)) {
        // add new metadata header if needed
        if (!metadataIndices[key]) {
          metadataIndices[key] = rows[0].length;
          rows[0].push(`metadata.${key}`);
        }

        // add metadata value to correct index (can create sparse array)
        row[metadataIndices[key]] = value;
      }

      rows.push(row);
    }

    clipboardCopy(rows.map(row => row.join('\t')).join('\n'));
  }

  public onProductUpdated(product: Product) {
    this.products.next({
      ...this.products.value,
      [product.id]: product
    });
  }

  public onProductDeleted(productId: string) {
    delete this.products.value[productId];
    this.products.next({ ...this.products.value });
  }
})();
