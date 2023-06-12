import {Crawl} from "@/stores/actions/type";

export const _Crawl = (data: any) => {

    return {
        type: Crawl,
        data: data
    }
}
