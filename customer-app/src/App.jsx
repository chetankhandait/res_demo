import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { SocketProvider } from './context/SocketContext';
import { CartProvider } from './context/CartContext';
import { TableProvider, useTable } from './context/TableContext';
import Layout from './components/Layout';

import Menu from './pages/Menu';
import Landing from './pages/Landing';
import CartPage from './pages/CartPage';
import OrderStatusPage from './pages/OrderStatusPage';

const AppContent = () => {
    const { tableId } = useTable();
    
    // Guard: Redirect to landing if no table, unless already on landing
    // Actually, Landing handles setting the table.
    
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/track/:orderId" element={<OrderStatusPage />} />
            </Routes>
        </Layout>
    );
};

function App() {
  return (
    <Router>
      <SocketProvider>
        <TableProvider>
          <CartProvider>
            <AppContent />
            <Toaster position="bottom-center" />
          </CartProvider>
        </TableProvider>
      </SocketProvider>
    </Router>
  );
}

export default App;
