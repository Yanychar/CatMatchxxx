
import 'babel-polyfill';
import React from 'react';
import configureStore from '../store/configureStoreClientmanager';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import DevTools from '../../../../../frontend/npmComponents/devTools/DevTools';
import ReduxModal from "../../../../../frontend/npmComponents/reduxModal/ReduxModal";
import Clientmanager from "../containers/Clientmanager";
import * as moment from 'moment';
import 'moment/locale/ru';

moment.locale('ru');

const root = document.getElementById('clientmanager-root');

const store = configureStore();

console.log('Clientmanager Development');

render(
    <Provider store={store}>
        <div id="provider-root">
            <DevTools/>

            <ReduxModal bs4/>
        </div>
    </Provider>,
root
);

if (module.hot) {module.hot.accept()}
