import * as XLSX from 'xlsx';
import { Product } from '@/pages/api/stripe/products';
import { isEqual } from '@/utils/functions/isEqual';
import { useServiceState } from '@/utils/hooks/useServiceState';
import { ProductService } from '@/services/ProductService';
import { Button } from '@mui/material';

const CELL_REGEX = /^([A-Z]+)([\d]+)$/;

export default function Products() {
  const products = useServiceState(ProductService.products);

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
        if (!product.id || !isEqual(product, products[product.id], { omit: ['price.id'] })) {
          console.log(`Updating product "${product.name}: ${product.description}"...`);
          ProductService.create(product);
        }
      }
    }
  };

  return (
    <div>
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
