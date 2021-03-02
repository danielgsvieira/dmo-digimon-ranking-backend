import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { JSDOM } from 'jsdom';

@Injectable()
export class HttpClient {
  // eslint-disable-next-line class-methods-use-this
  private async get(url: string): Promise<AxiosResponse<string>> {
    const response = await axios.get<string>(url);

    return response;
  }

  private async getHtmlDom(url: string): Promise<JSDOM> {
    const response = await this.get(url);

    return new JSDOM(response.data);
  }

  public async getDocument(url: string): Promise<Document> {
    const dom = await this.getHtmlDom(url);

    return dom.window.document;
  }
}
