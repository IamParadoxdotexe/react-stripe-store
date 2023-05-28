import { useState } from 'react';
import * as XLSX from 'xlsx';
import { Product } from '@/pages/api/stripe/products';
import { arrayOf } from '@/utils/functions/arrayOf';
import { generateKeys } from '@/utils/functions/generateKeys';
import { isEqual } from '@/utils/functions/isEqual';
import { useServiceState } from '@/utils/hooks/useServiceState';
import { DrawerService, DrawerType } from '@/services/DrawerService';
import { Products, ProductService } from '@/services/ProductService';
import { LoadingButton } from '@mui/lab';
import { Button, Divider } from '@mui/material';
import { ProductCard } from '@/components/ProductCard';
import styles from './products.module.scss';

const CELL_REGEX = /^([A-Z]+)([\d]+)$/;

export default function AdminProducts() {
  const _products = useServiceState(ProductService.products);
  const [_updatedProducts, setUpdatedProducts] = useState<Products>({});

  const products = arrayOf(_products).filter(product => !_updatedProducts[product.id]);
  const updatedProducts = arrayOf(_updatedProducts);
  const loading = !products.length;

  const [publishing, setPublishing] = useState(false);

  const onImport = async (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);

      const rows: { [row: string]: any } = {};

      // loop through cells of first sheet
      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      for (const [cell, { v: value }] of Object.entries(sheet)) {
        // parse row/col from cell key
        const parsedCell = CELL_REGEX.exec(cell) ?? [];
        const [col, row] = parsedCell.slice(1);

        // skip non-cells and header row
        if (!col || row === '1') {
          continue;
        }

        // get column header value
        const attribute = sheet[`${col}1`].v;

        // create new row data object if needed
        if (!rows[row]) {
          rows[row] = {};
        }

        // update row attribute
        rows[row][attribute] = value;
      }

      for (const [row, data] of Object.entries(rows)) {
        const rowKeys = Object.keys(data);
        for (const key of ['name', 'description', 'price']) {
          if (!rowKeys.includes(key)) {
            throw Error(`Row ${row} missing "${key}" value.`);
          }
        }

        // parse core product data
        const product: Product = {
          id: data.id?.toString() ?? '',
          name: data.name,
          description: data.description,
          price: {
            id: '',
            amount: data.price
          },
          images: data.images?.split(',') ?? [],
          metadata: {}
        };

        // parse metadata
        for (const key of Object.keys(data)) {
          if (key.startsWith('metadata.')) {
            product.metadata[key.split('.')[1]] = data[key].toString();
          }
        }

        // check if product is new or has new values
        if (!product.id || !isEqual(product, _products[product.id], { omit: ['price.id'] })) {
          console.log(`Updating product "${product.name}: ${product.description}"...`);
          ProductService.create(product);
        }
      }
    }
  };

  const onProductClick = (product?: Product) => {
    DrawerService.open(DrawerType.CREATE_PRODUCT, {
      product,
      onCreate: newProduct => {
        setUpdatedProducts({ ..._updatedProducts, [newProduct.id]: newProduct });
      }
    });
  };

  const onClear = () => {
    setUpdatedProducts({});
  };

  const onPublish = async () => {
    setPublishing(true);
    for (const product of updatedProducts) {
      await ProductService.create(product);

      delete _updatedProducts[product.id];
      setUpdatedProducts(_updatedProducts);
    }
    setPublishing(false);
  };

  const renderProducts = (products: Product[], skeletons: number) => (
    <>
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
      {loading && generateKeys(skeletons).map(i => <ProductCard key={i} variant="horizontal" />)}
    </>
  );

  return (
    <div className={styles.products}>
      <div className={styles.products__header}>
        <div>
          <div className={styles.header__title}>All Products</div>
          <div className={styles.header__subtitle}>
            {products.length} available products{' '}
            {!!updatedProducts.length && <span>({updatedProducts.length} updated/added)</span>}
          </div>
        </div>

        <div className={styles.header__actions}>
          <Button
            variant="outlined"
            onClick={onClear}
            disabled={!updatedProducts.length || publishing}
          >
            Clear
          </Button>
          <LoadingButton
            variant="contained"
            onClick={onPublish}
            disabled={!updatedProducts.length}
            loading={publishing}
          >
            Publish changes
          </LoadingButton>
        </div>
      </div>
      <div className={styles.products__grid}>
        <Button
          variant="outlined"
          style={{ width: 346, height: 90 }}
          onClick={() => onProductClick()}
        >
          Add product
        </Button>
        {renderProducts(updatedProducts, 2)}
      </div>
      <Divider />
      <div className={styles.products__grid}>
        {renderProducts(products, 20)}

        {/* {products && !products.length && (
          <Visual
            visual={<NoResultsVisual />}
            title="No results found!"
            subtitle='Try searching for something less specific, like "cup".'
          />
        )} */}
      </div>

      <input
        type="file"
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        onInput={onImport}
      />

      <Button color="primary" onClick={() => ProductService.export()}>
        Copy products data
      </Button>
    </div>
  );
}
