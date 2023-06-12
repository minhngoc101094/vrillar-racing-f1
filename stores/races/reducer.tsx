import {
    Crawl, CrawlSuccess
} from "@/stores/actions/type";

let DEFAULT = "";

if (typeof window !== 'undefined' && localStorage.getItem("crawl")) {
    DEFAULT = JSON.parse(localStorage.getItem("crawl") as string);
}

const CrawlReducer = (state = DEFAULT, action: any) => {
    switch (action.type) {
        case Crawl:
            return state;
        case CrawlSuccess:
            return action.data
        default:
            return state;
    }
}

export default CrawlReducer;
