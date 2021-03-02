import { Injectable } from '@nestjs/common';
import { Rank } from '../models/rank';
import { HttpClient } from '../services/http-client';

@Injectable()
export class RankExtractor {
  private url = 'https://dmowiki.com/Rank_System';

  constructor(
    private httpClient: HttpClient,
  ) {
    //
  }

  public async extract(): Promise<Rank[]> {
    const rankList = await this.getRankList();

    return rankList;
  }

  private async getRankElements(): Promise<NodeListOf<Element>> {
    const document = await this.httpClient.getDocument(this.url);

    return document.querySelectorAll('#mw-content-text > div > ul > li > ul > li > a');
  }

  private async getRankList(): Promise<Rank[]> {
    const rankElements = await this.getRankElements();

    const rankList: Rank[] = [];
    rankElements.forEach((el: HTMLAnchorElement) => {
      const name = el.firstElementChild.getAttribute('alt').replace('.png', '');
      const url = `https://dmowiki.com${el.href}`;
      rankList.push(new Rank(name, url));
    });

    return rankList;
  }
}
