import {
    Crawl, CrawlSuccess
} from "@/stores/actions/type";
import {put, call, takeLatest} from "redux-saga/effects";
import axios from 'axios';

function* crawlSaga(action: any) {
    try {
        const response = yield call(axios.get, '/api/scrape');
        const scrapedData = response.data;
        if (scrapedData) {
            const dataCrawl = scrapedData.data;
            yield put({
                type: CrawlSuccess,
                data: dataCrawl
            });
        }
    } catch (error) {
        console.log(error)
    }
}

export function* WatchCrawl() {
    yield takeLatest(Crawl, crawlSaga);
}
