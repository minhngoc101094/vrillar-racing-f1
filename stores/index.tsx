import {configureStore} from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import RootSaga from '@/stores/root.saga';
import Reducers from '@/stores/root.reducer';

export const RootState = (state: ReturnType<typeof store.getState>) => {
    return state;
};

const sagaMiddleware = createSagaMiddleware();
const store = configureStore({
    reducer: Reducers,
    middleware: [sagaMiddleware],
});

if (typeof window !== 'undefined' && !localStorage.getItem("crawl")) {
    localStorage.setItem("crawl", JSON.stringify(store.getState().crawl));
}

store.subscribe(() => {
    try {
        localStorage.setItem("crawl", JSON.stringify(store.getState().crawl));
    } catch (e) {
        console.log(e);
    }
});

sagaMiddleware.run(RootSaga);

export default store;
