import React from 'react';
import {Provider} from 'react-redux';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/scss/font-awesome.scss';
import DevTools from "./DevTools";
import configureStore from './appStore';
import CategoryMatcherWrapper from "./CategoryMatcherWrapper";

function App(props) {

    const store = configureStore(props.marketplaces);
    return (
    // <div className="App">
    //   <CategoryMatcher/>
    // </div>

      <Provider store={store}>
          <div className="App">
              <CategoryMatcherWrapper/>
              {<DevTools/>}
          </div>
      </Provider>
  );

}

export default App;
