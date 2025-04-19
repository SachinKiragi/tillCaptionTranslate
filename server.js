import axios, { all } from "axios";
import express from 'express'
import cors from 'cors'
import * as cheerio from 'cheerio';


const app = express();

app.use(cors());

app.use(express.json());

const port = 5000;

const baseUrl = "https://www.india.gov.in/schemes-women-department-women-and-child-development?page=";

async function scrapeAllPages() {
    const allSchemes = [];
  
    for (let i = 0; i <= 5; i++) {
      const { data } = await axios.get(`${baseUrl}${i}`);
      const $ = cheerio.load(data);
  
      $(".views-row").each((_, el) => {
        const name = $(el).find("h3 a").text().trim();
        const description = $(el).find(".field-content p").text().trim();
        let link = $(el).find("h3 a").attr("href") || '';
        link = link.trim();
  
        if (!link.startsWith('http')) {
          link = "https://www.india.gov.in" + link;
        }
  
        allSchemes.push({ name, description, link });
      });
    }
  
    console.log(JSON.stringify(allSchemes, null, 2));
    return JSON.stringify(allSchemes, null, 2);
  }
  


app.get('/getSchemes', async(req, res)=>{
    const schems = await scrapeAllPages();
    res.send(schems);
})

app.listen(port, ()=>console.log("listening on port ", port));