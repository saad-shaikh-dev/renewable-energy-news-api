const port = process.env.PORT || 5006;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const newsSources = [
    {
        name: "telegraph",
        domain: "https://www.telegraph.co.uk",
        url: "https://www.telegraph.co.uk/renewable-energy/",
    },
    {
        name: "the-guardian",
        domain: "https://www.theguardian.com",
        url: "https://www.theguardian.com/environment/renewableenergy",
    },
    {
        name: "the-times",
        domain: "https://www.thetimes.co.uk",
        url: "https://www.thetimes.co.uk/search?source=search-page&q=renewable",
    },
    {
        name: "al-jazeera",
        domain: "https://www.aljazeera.com",
        url: "https://www.aljazeera.com/search/renewable"
    },
    {
        name: "recharge-news",
        domain: "https://www.rechargenews.com",
        url: "https://www.rechargenews.com/"
    },
    {
        name: "renewables-now",
        domain: "https://renewablesnow.com/news",
        url: "https://renewablesnow.com/"
    },
    {
        name: "science-daily",
        domain: "https://www.sciencedaily.com",
        url: "https://www.sciencedaily.com/search/?keyword=renewable#gsc.tab=0&gsc.q=renewable&gsc.page=1"
    },
    {
        name: "renewable-energy-magazine",
        domain: "https://www.renewableenergymagazine.com",
        url: "https://www.renewableenergymagazine.com/search?cx=partner-pub-7794467828055047%3A8692188386&cof=FORID%3A9&ie=UTF-8&q=renewable"
    },
    {
        name: "world-energy-news",
        domain: "https://www.worldenergynews.com",
        url: "https://www.worldenergynews.com/news/search?search=renewable"
    }
];

const app = express();

const articles = [];

app.get("/", (action, reaction) => {
    reaction.json(`Hi, my name is Saad Shaikh and this is the climate change news API. Go to the link 'https://climate-change-feed-api.herokuapp.com/news' to get your news updates`);
});

app.get("/news", (action, reaction) => {
    newsSources.map(newsSource =>
        axios
            .get(newsSource.url)
            .then(response => {
                const html = response.data;
                const $ = cheerio.load(html);
                $('a:contains("renewable")', html).each(function () {
                    const title = $(this).text();
                    const url = $(this).attr("href");
                    const link = () => url.startsWith("/") ? newsSource.domain + url : url
                    articles.push({ title, url: link(), source: newsSource.name });
                });
            })
            .catch(err => console.log(err))
    );
    reaction.json(articles);
});

app.get("/news/:newsSourceId", (req, res) => {
    const newsSourceId = req.params.newsSourceId;
    const newsSourceAddress = newsSources.filter(
        newsSource => newsSource.name == newsSourceId
    )[0].url;
    axios
        .get(newsSourceAddress)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);
            const specificArticles = [];
            $('a:contains("renewable")', html).each(function () {
                const title = $(this).text();
                const url = $(this).attr("href");
                /*   const link = () => url.startsWith("/") ? newsSourceAddress.domain + url : url */
                specificArticles.push({ title, url, source: newsSourceId });
            });
            res.json(specificArticles)

        })
        .catch(err => console.log(err));
});


app.listen(port, () => console.log(`server running on port ${port}`));
