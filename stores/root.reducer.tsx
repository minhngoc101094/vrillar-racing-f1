import CrawlReducer from "@/stores/races/reducer";
import {combineReducers} from "redux";

const reducer = combineReducers({
    crawl: CrawlReducer
});

export default reducer;
