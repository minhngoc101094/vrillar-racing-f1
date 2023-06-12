import {URL_RESULT} from "@/fetches/config";
import axios from 'axios';
import cheerio from 'cheerio';

const fetchHTML = async (url: string) => {
    const response = await axios.get(url);
    return response.data;
}

const getDataDriver = async (url: string) => {
    const html = await fetchHTML(url);
    const $ = cheerio.load(html);
    let tmpDriverStandings: { pos: number, driver: string, nationality: string, car: string, pts: string }[] = [];
    $('.resultsarchive-table tbody tr td:nth-child(2)').each((idx: number, el: any) => {
        tmpDriverStandings.push({
            pos: Number($(el).text().trim()),
            driver: "",
            nationality: "",
            car: "",
            pts: ""
        });
    });
    $('.resultsarchive-table tbody tr td:nth-child(3) a').each((idx: number, el: any) => {
        const lastName = $(el).children('span:first-child').text().trim();
        const firstName = $(el).children('span:nth-child(2)').text().trim();
        tmpDriverStandings[idx].driver = lastName + " " + firstName;
    });
    $('.resultsarchive-table tbody tr td:nth-child(4)').each((idx: number, el: any) => {
        tmpDriverStandings[idx].nationality = $(el).text().trim();
    });
    $('.resultsarchive-table tbody tr td:nth-child(5) a').each((idx: number, el: any) => {
        tmpDriverStandings[idx].car = $(el).text().trim();
    });
    $('.resultsarchive-table tbody tr td:nth-child(6)').each((idx: number, el: any) => {
        tmpDriverStandings[idx].pts = $(el).text().trim();
    });
    return tmpDriverStandings;
}

const getDataTeam = async (url: string) => {
    const html = await fetchHTML(url);
    const $ = cheerio.load(html);
    let tmpTeamStandings: { pos: number, car: string, pts: string }[] = [];
    $('.resultsarchive-table tbody tr td:nth-child(2)').each((idx: number, el: any) => {
        tmpTeamStandings.push({
            pos: Number($(el).text().trim()),
            car: "",
            pts: ""
        });
    });
    $('.resultsarchive-table tbody tr td:nth-child(3) a').each((idx: number, el: any) => {
        tmpTeamStandings[idx].car = $(el).text().trim();
    });
    $('.resultsarchive-table tbody tr td:nth-child(4)').each((idx: number, el: any) => {
        tmpTeamStandings[idx].pts = $(el).text().trim()
    });
    return tmpTeamStandings;
}

const parseHTML = async (html: string) => {
    const $ = cheerio.load(html);
    let tmpYear: { year: string, link: string, race_result: any, driver_standings: any, team_standings: any }[] = [];
    let tmpResult: { grand_prix: string, date: string, winner: string, car: string, laps: number, time: string }[] = [];
    $('.resultsarchive-filter-wrap:first-child .resultsarchive-filter-item a').each((index: number, element: any) => {
        const link = $(element).attr('href');
        const year = $(element).children().text();
        if (link !== undefined && year !== undefined) {
            tmpYear.push({
                year: year,
                link: link,
                race_result: tmpResult,
                driver_standings: [],
                team_standings: [],
            });
        }
    });

    /*----------------------------------RACE RESULT------------------------------------*/

    $('.resultsarchive-table tbody tr td:nth-child(2) a').each((idx: number, el: any) => {
        tmpResult.push({
            grand_prix: $(el).text().trim(),
            date: "",
            winner: "",
            car: "",
            laps: 0,
            time: "",
        });
    });
    $('.resultsarchive-table tbody tr td:nth-child(3)').each((idx: number, el: any) => {
        tmpResult[idx].date = $(el).text().trim();
    });
    $('.resultsarchive-table tbody tr td:nth-child(4)').each((idx: number, el: any) => {
        const lastName = $(el).children('span:first-child').text().trim();
        const firstName = $(el).children('span:nth-child(2)').text().trim();
        tmpResult[idx].winner = lastName + " " + firstName;
    });
    $('.resultsarchive-table tbody tr td:nth-child(5)').each((idx: number, el: any) => {
        tmpResult[idx].car = $(el).text().trim();
    });
    $('.resultsarchive-table tbody tr td:nth-child(6)').each((idx: number, el: any) => {
        tmpResult[idx].laps = Number($(el).text().trim());
    });
    $('.resultsarchive-table tbody tr td:nth-child(7)').each((idx: number, el: any) => {
        tmpResult[idx].time = $(el).text().trim();
    });

    /*----------------------------------RACE RESULT------------------------------------*/
    if (tmpYear.length > 0) {
        for (let i = 0; i < tmpYear.length; i++) {
            const urlDriver = `${URL_RESULT}/${tmpYear[i].year}/drivers.html`;
            const dataDriver = await getDataDriver(urlDriver);
            if (dataDriver) {
                tmpYear[i].driver_standings = dataDriver;
            }

            const urlTeam = `${URL_RESULT}/${tmpYear[i].year}/team.html`;
            const dataTeam = await getDataTeam(urlTeam);
            if (dataTeam) {
                tmpYear[i].team_standings = dataTeam;
            }
        }
    }
    return tmpYear;

}

export default async (req: any, res: any) => {
    try {
        const html = await fetchHTML(URL_RESULT);
        const resData = await parseHTML(html);
        res.status(200).json({data: resData});
    } catch (error) {
        res.status(500).json({error: 'An error occurred'});
    }
};
