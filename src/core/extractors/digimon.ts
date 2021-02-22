import { Digimon } from '../models/digimon';
import { Rank } from '../models/rank';
import { HttpClient } from '../services/http-client';
import { RankExtractor } from './rank';

export class DigimonExtractor {
  private static excludedDigimons = [
    'https://dmowiki.com/Tanemon',
    'https://dmowiki.com/Apocalymon',
  ];

  public static async extract(): Promise<Digimon[]> {
    const rankList = await RankExtractor.extract();
    const digimonList = await DigimonExtractor.getDigimonList(rankList);
    await DigimonExtractor.getAttributtes(digimonList);

    return digimonList;
  }

  private static async getDigimonLinkElements(url: string): Promise<NodeListOf<Element>> {
    const document = await HttpClient.getDocument(url);

    return document.querySelectorAll('#mw-pages > div > div > div > ul > li > a');
  }

  private static async getDigimonList(rankList: Rank[]): Promise<Digimon[]> {
    const digimonList: Digimon[] = [];
    for (let i = 0; i < rankList.length; i += 1) {
      const rank = rankList[i];
      const digimonElements = await DigimonExtractor.getDigimonLinkElements(rank.url);

      const digimons: Digimon[] = [];
      digimonElements.forEach((el: HTMLAnchorElement) => {
        const name = el.innerHTML;
        const url = `https://dmowiki.com${el.href}`;
        if (!DigimonExtractor.excludedDigimons.includes(url)) {
          digimons.push(new Digimon(name, url, rankList[i]));
        }
      });
      digimonList.push(...digimons);
    }

    return digimonList;
  }

  private static async getAttributtes(digimonList: Digimon[]): Promise<void> {
    for (let i = 0; i < digimonList.length; i += 1) {
      const digimon = digimonList[i];

      const page = await HttpClient.getDocument(digimon.url);

      console.log(digimon.name);
      digimon.form = DigimonExtractor.getInnerHtml(page, '#scraper-digimon-form > a');
      digimon.attribute = DigimonExtractor.getInnerHtml(page, '#scraper-digimon-attribute > span');
      digimon.elementalAttribute = DigimonExtractor.getInnerHtml(
        page,
        '#scraper-digimon-naturalattribute > span',
      );
      digimon.hp = DigimonExtractor.getHp(page);
      digimon.ds = DigimonExtractor.getDs(page);
      digimon.at = DigimonExtractor.getAt(page);
      digimon.as = DigimonExtractor.getAs(page);
      digimon.ct = DigimonExtractor.getCt(page);
      digimon.ht = DigimonExtractor.getHt(page);
      digimon.de = DigimonExtractor.getDe(page);
      digimon.ev = DigimonExtractor.getEv(page);
    }
  }

  private static getInnerHtml(page: Document, query: string): string {
    return page.querySelector(query).innerHTML;
  }

  private static getStatsValue(page: Document, content: string, dontContains?: string[]): string {
    let td = null;
    page.querySelectorAll('td').forEach((el) => {
      if (el.innerHTML.includes(content) && td === null) {
        let valid = true;
        dontContains?.forEach((dont) => {
          if (el.innerHTML.includes(dont)) {
            valid = false;
          }
        });
        console.log(el.innerHTML);
        td = valid ? el : null;
      }
    });

    return td.nextElementSibling.innerHTML;
  }

  private static getHp(page: Document): number {
    const value = DigimonExtractor.getStatsValue(page, 'Health Points');

    return Number.parseInt(value, 10);
  }

  private static getDs(page: Document): number {
    console.log('getDs');
    const value = DigimonExtractor.getStatsValue(page, 'Digi-Soul');

    return Number.parseInt(value, 10);
  }

  private static getAt(page: Document): number {
    console.log('getAt');
    const value = DigimonExtractor.getStatsValue(page, 'Attack', ['Attack Speed', 'Attacker']);

    return Number.parseInt(value, 10);
  }

  private static getAs(page: Document): number {
    console.log('getAs');
    const value = DigimonExtractor.getStatsValue(page, 'Attack Speed');

    return Number.parseFloat(value);
  }

  private static getCt(page: Document): number {
    console.log('getCt');
    const value = DigimonExtractor.getStatsValue(page, 'Critical Hit').replace('%', '');

    return Number.parseFloat(value);
  }

  private static getHt(page: Document): number {
    console.log('getHt');
    const value = DigimonExtractor.getStatsValue(page, 'Hit Rate');

    return Number.parseInt(value, 10);
  }

  private static getDe(page: Document): number {
    console.log('getDe');
    const value = DigimonExtractor.getStatsValue(page, 'Defense');

    return Number.parseInt(value, 10);
  }

  private static getEv(page: Document): number {
    console.log('getEv');
    const value = DigimonExtractor.getStatsValue(page, 'Evade').replace('%', '');

    return Number.parseFloat(value);
  }
}
