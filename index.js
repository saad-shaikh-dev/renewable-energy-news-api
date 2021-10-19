const port = process.env.PORT || 5005;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const newspapers = [
    {
        name: "telegraph",
        address: "https://www.telegraph.co.uk/climate-change/",
    },
    {
        name: "the-guardian",
        address: "https://www.theguardian.com/environment/climate-crisis",
    },
    {
        name: "the-times",
        address: "https://www.thetimes.co.uk/environment/climate-change",
    },
    {
        name: "al-jazeera",
        address: "https://www.aljazeera.com/tag/climate-change/"
    },
    {
        name: "nytimes",
        address: "https://www.nytimes.com/section/climate"
    },
    {
        name: "cnn",
        address: "https://edition.cnn.com/specials/world/cnn-climate"
    },
];

const app = express();

const articles = [];

app.get("/", (action, reaction) => {
    reaction.json(`This is the climate change news API`);
});

app.get("/news", (action, reaction) => {
    newspapers.map(newspaper =>
        axios
            .get(newspaper.address)
            .then(response => {
                const html = response.data;
                const $ = cheerio.load(html);
                $('a:contains("climate")', html).each(function () {
                    const title = $(this).text();
                    const url = $(this).attr("href");
                    articles.push({ title, url, source: newspaper.name });
                });
            })
            .catch(err => console.log(err))
    );
    reaction.json(articles);
});

app.get("/news/:newspaperId", (req, res) => {
    const newspaperId = req.params.newspaperId;
    const newspaperAddress = newspapers.filter(
        newspaper => newspaper.name == newspaperId
    )[0].address;
    const newspaperBase = newspapers.filter(
        newspaper => newspaper.name == newspaperId
    )[0].base;

    axios
        .get(newspaperAddress)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);
            const specificArticles = [];
            $('a:contains("climate")', html).each(function () {
                const title = $(this).text();
                const url = $(this).attr("href");
                specificArticles.push({ title, url: newspaperBase + url, source: newspaperId });
            });
            res.json(specificArticles)

        })
        .catch(err => console.log(err));
});


app.listen(port, () => console.log(`server running on port ${port}`));
