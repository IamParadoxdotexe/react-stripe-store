//import * as XLSX from 'xlsx';
import { Product } from '@/pages/api/stripe/products';
import { arrayOf } from '@/utils/functions/arrayOf';
import { generateKeys } from '@/utils/functions/generateKeys';
//import { isEqual } from '@/utils/functions/isEqual';
import { useServiceState } from '@/utils/hooks/useServiceState';
import { DrawerService, DrawerType } from '@/services/DrawerService';
import { ProductService } from '@/services/ProductService';
import { Button } from '@mui/material';
import { ProductCard } from '@/components/ProductCard';
import { Visual } from '@/components/Visual';
import AddProductsVisual from '@/visuals/AddProducts.svg';
import styles from './admin.module.scss';

// const CELL_REGEX = /^([A-Z]+)([\d]+)$/;

export default function AdminPage() {
  const _products = useServiceState(ProductService.products);
  const loading = !_products;

  const products = arrayOf(_products);

  // const onImport = async (event: any) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const data = await file.arrayBuffer();
  //     const workbook = XLSX.read(data);

  //     const rows: { [row: string]: any } = {};

  //     // loop through cells of first sheet
  //     const sheet = workbook.Sheets[workbook.SheetNames[0]];

  //     for (const [cell, { v: value }] of Object.entries(sheet)) {
  //       // parse row/col from cell key
  //       const parsedCell = CELL_REGEX.exec(cell) ?? [];
  //       const [col, row] = parsedCell.slice(1);

  //       // skip non-cells and header row
  //       if (!col || row === '1') {
  //         continue;
  //       }

  //       // get column header value
  //       const attribute = sheet[`${col}1`].v;

  //       // create new row data object if needed
  //       if (!rows[row]) {
  //         rows[row] = {};
  //       }

  //       // update row attribute
  //       rows[row][attribute] = value;
  //     }

  //     for (const [row, data] of Object.entries(rows)) {
  //       const rowKeys = Object.keys(data);
  //       for (const key of ['name', 'description', 'price']) {
  //         if (!rowKeys.includes(key)) {
  //           throw Error(`Row ${row} missing "${key}" value.`);
  //         }
  //       }

  //       // parse core product data
  //       const product: Product = {
  //         id: data.id?.toString() ?? '',
  //         name: data.name,
  //         description: data.description,
  //         price: {
  //           id: '',
  //           amount: data.price
  //         },
  //         images: data.images?.split(',') ?? [],
  //         metadata: {}
  //       };

  //       // parse metadata
  //       for (const key of Object.keys(data)) {
  //         if (key.startsWith('metadata.')) {
  //           product.metadata[key.split('.')[1]] = data[key].toString();
  //         }
  //       }

  //       // check if product is new or has new values
  //       if (!product.id || !isEqual(product, _products?.[product.id], { omit: ['price.id'] })) {
  //         console.log(`Updating product "${product.name}: ${product.description}"...`);
  //         ProductService.update(product);
  //       }
  //     }
  //   }
  // };

  const onProductClick = (product?: Product) => {
    DrawerService.open(DrawerType.UPDATE_PRODUCT, {
      product
    });
  };

  return (
    <div className={styles.products}>
      <div className={styles.products__header}>
        <div>
          <div className={styles.header__title}>All Products</div>
          <div className={styles.header__subtitle}>{products.length} available products </div>
        </div>

        <div className={styles.header__actions}>
          <Button variant="contained" onClick={() => onProductClick()}>
            Add product
          </Button>
        </div>
      </div>

      <div className={styles.products__grid}>
        {!loading &&
          products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              variant="horizontal"
              readOnly
              onClick={() => onProductClick(product)}
            />
          ))}

        {loading && generateKeys(20).map(i => <ProductCard key={i} variant="horizontal" />)}

        {!loading && !products.length && (
          <Visual
            visual={<AddProductsVisual />}
            title="No products available!"
            subtitle='Start selling now by clicking "Add Product".'
          />
        )}
      </div>

      {/* <input
        type="file"
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        onInput={onImport}
      />

      <Button color="primary" onClick={() => ProductService.export()}>
        Copy products data
      </Button> */}
    </div>
  );
}
