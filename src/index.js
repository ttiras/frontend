import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import React from "react";
import ReactDOM from "react-dom";
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from '@apollo/react-hooks';
import gql from "graphql-tag";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { save, load } from "redux-localstorage-simple";
import { Provider } from "react-redux";



import { fetchProducts } from "./redux/actions/productActions";
import rootReducer from "./redux/reducers/rootReducer";
//import products from "./data/products.json";
import App from "./App";
import "./assets/scss/style.scss";
import * as serviceWorker from "./serviceWorker";

import { composeWithDevTools } from "redux-devtools-extension";
import AuthContextProvider from "./auth/auth-context";

const client = new ApolloClient({
  uri: 'https://woodcraft.herokuapp.com/v1/graphql',
});

client
  .query({
    query: gql`
     {
      products {
        discount
        fullDescription
        new
        price
        id
        name
        rating
        saleCount
        shortDescription
        sku
        stock
        category {
          category {
            category
          }
        }
        image {
          path
        }
        tag {
          tag {
            tag
          }
        }
      }
    }
    `
  })
  .then(result => {
    store.dispatch(fetchProducts(result.data.products))
    });

const store = createStore(
  rootReducer,
  load(),
  composeWithDevTools(applyMiddleware(thunk, save()))
);

ReactDOM.render(
  <Provider store={store}>
    <ApolloProvider client={client}>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </ApolloProvider>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
