import { Rank } from '../models/rank';
import { HttpClient } from '../services/http-client';

export class RankExtractor {
  private static url = 'https://dmowiki.com/Rank_System';

  public static async extract(): Promise<Rank[]> {
    const rankList = await RankExtractor.getRankList();

    return rankList;
  }

  private static async getRankElements(): Promise<NodeListOf<Element>> {
    const document = await HttpClient.getDocument(RankExtractor.url);

    return document.querySelectorAll('#mw-content-text > div > ul > li > ul > li > a');
  }

  private static async getRankList(): Promise<Rank[]> {
    const rankElements = await RankExtractor.getRankElements();

    const rankList: Rank[] = [];
    rankElements.forEach((el: HTMLAnchorElement) => {
      const name = el.firstElementChild.getAttribute('alt').replace('.png', '');
      const url = `https://dmowiki.com${el.href}`;
      rankList.push(new Rank(name, url));
    });

    return rankList;
  }
}
