import { ShoppingCartOutlined } from '@mui/icons-material';
import Button from '@mui/material/Button';

export default function Home() {
  function onCheckout() {
    fetch('/api/checkout')
      .then(res => res.json())
      .then(console.log);
  }

  return (
    <>
      <Button variant="contained" startIcon={<ShoppingCartOutlined />} onClick={onCheckout}>
        Checkout
      </Button>
    </>
  );
}
