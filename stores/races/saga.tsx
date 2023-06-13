import {
    Crawl, CrawlSuccess
} from "@/stores/actions/type";
import {put, call, takeLatest} from "redux-saga/effects";
import axios from 'axios';

function* crawlSaga(action: any):any {
    try {
        const response = yield call(axios.get, '/api/scrape');
        const scrapedData = response.data;
        if (scrapedData) {
            for (const ft of scrapedData.data) {
                try {
                  const res = yield call(axios.get, '/api/scrape?year=' + ft.year);
                  console.log(res.data);
                  ft.driver_standings = res.data.data.driver;
                  ft.team_standings = res.data.data.team;
                } catch (error) {
                  
                }
            }
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
