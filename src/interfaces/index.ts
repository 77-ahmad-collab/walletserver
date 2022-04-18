export interface TokensBody {
  [key: string]: number;
}
export type CoinData = {
  [key: string]: {
    data: number[];
    name: string;
  };
};
