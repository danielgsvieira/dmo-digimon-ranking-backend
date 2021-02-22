import { Rank } from './rank';

export class Digimon {
  constructor(
    public name: string,
    public url: string,
    public rank: Rank,
    public form?: string,
    public attribute?: string,
    public elementalAttribute?: string,
    public hp?: number,
    public ds?: number,
    public at?: number,
    public as?: number,
    public ct?: number,
    public ht?: number,
    public de?: number,
    public ev?: number,
  ) {
    //
  }
}
