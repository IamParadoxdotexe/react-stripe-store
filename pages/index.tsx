import { ShoppingCartOutlined } from '@mui/icons-material';
import Button from '@mui/material/Button';

export default function Home() {
  return (
    <>
      <form action="/api/checkout">
        <Button variant="contained" startIcon={<ShoppingCartOutlined />} type="submit">
          Checkout
        </Button>
      </form>
    </>
  );
}
