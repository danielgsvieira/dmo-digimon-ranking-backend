import { Injectable } from '@nestjs/common';
import { Digimon } from '../models/digimon';
import { Rank } from '../models/rank';
import { HttpClient } from '../services/http-client';
import { RankExtractor } from './rank';

@Injectable()
export class DigimonExtractor {
  private page: Document;

  private selectorsForRanks = {
    A: '#mw-pages > div > div > div > ul > li > a',
    'A+': '#mw-pages > div > div > div > ul > li > a',
    S: '#mw-pages > div > div > div > ul > li > a',
    'S+': '#mw-pages > div > div > div > ul > li > a',
    SS: '#mw-pages > div > div > div > ul > li > a',
    'SS+': '#mw-pages > div > div > div > ul > li > a',
    SSS: '#mw-pages > div > ul > li > a',
    'SSS+': '#mw-pages > div > ul > li > a',
    U: '#mw-pages > div > ul > li > a',
    'U+': '#mw-pages > div > ul > li > a',
  };

  constructor(
    private httpClient: HttpClient,
    private rankExtractor: RankExtractor,
  ) {
    //
  }

  private excludedDigimons = [
    'https://dmowiki.com/Tanemon',
    'https://dmowiki.com/Apocalymon',
  ];

  public async extract(): Promise<Digimon[]> {
    const rankList = await this.rankExtractor.extract();
    const digimonList = await this.getDigimonList(rankList);
    await this.getAttributtes(digimonList);

    return digimonList;
  }

  private async getDigimonLinkElements(rank: Rank): Promise<NodeListOf<Element>> {
    const document = await this.httpClient.getDocument(rank.url);

    return document.querySelectorAll(this.selectorsForRanks[rank.name]);
  }

  private async getDigimonList(rankList: Rank[]): Promise<Digimon[]> {
    const digimonList: Digimon[] = [];
    for (let i = 0; i < rankList.length; i += 1) {
      const rank = rankList[i];
      const digimonElements = await this.getDigimonLinkElements(rank);

      console.log(digimonElements);

      const digimons: Digimon[] = [];
      digimonElements.forEach((el: HTMLAnchorElement) => {
        const name = el.innerHTML;
        const url = `https://dmowiki.com${el.href}`;
        if (!this.excludedDigimons.includes(url)) {
          digimons.push(new Digimon(name, url, rankList[i]));
        }
      });
      digimonList.push(...digimons);
    }

    return digimonList;
  }

  private async getAttributtes(digimonList: Digimon[]): Promise<void> {
    for (let i = 0; i < digimonList.length; i += 1) {
      const digimon = digimonList[i];

      this.page = await this.httpClient.getDocument(digimon.url);

      digimon.form = this.getInnerHtml('#scraper-digimon-form > a');
      digimon.attribute = this.getInnerHtml('#scraper-digimon-attribute > span');
      digimon.elementalAttribute = this.getInnerHtml('#scraper-digimon-naturalattribute > span');
      digimon.hp = this.getHp();
      digimon.ds = this.getDs();
      digimon.at = this.getAt();
      digimon.as = this.getAs();
      digimon.ct = this.getCt();
      digimon.ht = this.getHt();
      digimon.de = this.getDe();
      digimon.ev = this.getEv();
    }
  }

  private getInnerHtml(query: string): string {
    return this.page.querySelector(query).innerHTML;
  }

  private getStatsValue(content: string, dontContains?: string[]): string {
    let td = null;
    this.page.querySelectorAll('td').forEach((el) => {
      if (el.innerHTML.includes(content) && td === null) {
        let valid = true;
        dontContains?.forEach((dont) => {
          if (el.innerHTML.includes(dont)) {
            valid = false;
          }
        });

        td = valid ? el : null;
      }
    });

    return td.nextElementSibling.innerHTML;
  }

  private getHp(): number {
    const value = this.getStatsValue('Health Points');

    return Number.parseInt(value, 10);
  }

  private getDs(): number {
    const value = this.getStatsValue('Digi-Soul');

    return Number.parseInt(value, 10);
  }

  private getAt(): number {
    const value = this.getStatsValue('Attack', ['Attack Speed', 'Attacker']);

    return Number.parseInt(value, 10);
  }

  private getAs(): number {
    const value = this.getStatsValue('Attack Speed');

    return Number.parseFloat(value);
  }

  private getCt(): number {
    const value = this.getStatsValue('Critical Hit').replace('%', '');

    return Number.parseFloat(value);
  }

  private getHt(): number {
    const value = this.getStatsValue('Hit Rate');

    return Number.parseInt(value, 10);
  }

  private getDe(): number {
    const value = this.getStatsValue('Defense');

    return Number.parseInt(value, 10);
  }

  private getEv(): number {
    const value = this.getStatsValue('Evade').replace('%', '');

    return Number.parseFloat(value);
  }
}
