import axios, { AxiosResponse } from 'axios';
import { JSDOM } from 'jsdom';

export class HttpClient {
  private static async get(url: string): Promise<AxiosResponse<string>> {
    const response = await axios.get<string>(url);

    return response;
  }

  private static async getHtmlDom(url: string): Promise<any> {
    const response = await HttpClient.get(url);

    return new JSDOM(response.data);
  }

  public static async getDocument(url: string): Promise<Document> {
    const dom = await HttpClient.getHtmlDom(url);

    return dom.window.document;
  }
}
