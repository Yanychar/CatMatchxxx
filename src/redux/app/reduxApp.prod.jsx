
import 'babel-polyfill';
import React from 'react';
import configureStore from '../store/configureStoreClientmanager';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import ReduxModal from "../../../../../frontend/npmComponents/reduxModal/ReduxModal";
import Clientmanager from "../containers/Clientmanager";
import * as moment from 'moment';
import 'moment/locale/ru';

moment.locale('ru');

const store = configureStore();

render(
    <Provider store={store}>
        <div id="provider-root">
            <Clientmanager/>
            <ReduxModal bs4/>
        </div>
    </Provider>,
document.getElementById('clientmanager-root'));
