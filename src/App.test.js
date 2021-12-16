import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import Header from './components/Header';

test('renders learn react link', () => {
  const { getByText } = render(
    <Provider store={store}>
      {/* <Header /> */}
    </Provider>
  );
  expect(getByText(/learn/i)).toBeInTheDocument();
});