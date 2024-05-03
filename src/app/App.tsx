import { Page, ToastContainer } from '@dynatrace/strato-components-preview';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { Guide } from './pages/Guide';

export const App = () => {
  return (
    <Page>
      <Page.Header>
        <Header />
      </Page.Header>
      <Page.Main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/guide" element={<Guide />} />
        </Routes>
      </Page.Main>
      <ToastContainer />
    </Page>
  );
};
