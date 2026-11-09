
import {applyMiddleware, compose, createStore} from 'redux';
import thunk from 'redux-thunk';
import {createLogger} from 'redux-logger';
import DevTools from "./DevTools";
// import * as initActions from '../actions/clientmanagerInitActions';

import rootReducer from './lib/categoryMatcherReducer';
import {loadExportCategories, loadSourceCategories} from "./lib/categoryMatcherActions";


export default function(marketplaces) {
    const logger = createLogger();
    let marketplaceId = 1;
    if(Array.isArray(marketplaces) && marketplaces.length > 0){
        marketplaceId = marketplaces[0].id
    }
    const initialState = {
        marketplaces: marketplaces ?? [],
        marketplaceId: marketplaceId,
        category: {
            loadProgress: false,
            items: [],
        },
        categoryProducts: {
            byCategoryId: {},
        },
        sourceCatalog: {
            categories: [],
            loadingByCategoryId: {},
            errorByCategoryId: {},
            loadedByCategoryId: {},
            loadingRoot: false,
            search: {
                needle: '',
                items: [],
                loading: false,
                error: false,
            },
        },
        externalCatalog: {
            typeOfs: [],
            lastSelected: 0,
            selected: [],
            load: true,
            categories: [],
            scrollTargetId: 0,
        },
        selectedProductId: 0,
        productSuggestions: {
            productId: 0,
            loading: false,
            error: false,
            errorMsg: '',
            items: [],
            dismissed: false,
        },
    }
    const store = createStore(rootReducer, initialState,
        //applyMiddleware(thunk, logger)
        compose(applyMiddleware(thunk, logger),
            DevTools.instrument()
        )
    );

    store.dispatch( loadExportCategories( store.getState().marketplaceId ));
    store.dispatch( loadSourceCategories() );

    console.log('configure store entering. Current store: ', store.getState().marketplaceId );


    // if (module.hot) {
    //     console.log('hot replace reducers');
    //     let accept = module.hot.accept('../reducers/clientmanagerIndex', () => {
    //         console.log('module hot accept callback', accept);
    //         const nextRootReducer = require('../reducers/clientmanagerIndex');
    //         store.replaceReducer(nextRootReducer.default);
    //     });
    // }
    return store;
}
