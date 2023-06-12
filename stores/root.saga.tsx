import {all} from "redux-saga/effects";
import {WatchCrawl} from "@/stores/races/saga";

export default function* rootSaga() {
    yield all([
        WatchCrawl()
    ]);
}
