import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router/routes';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';

/**
 * Ponto de composição da aplicação.
 * Organiza providers globais e o roteador.
 * Não contém implementação de páginas ou painéis.
 */
export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <DataProvider>
          <RouterProvider router={router} />
        </DataProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
