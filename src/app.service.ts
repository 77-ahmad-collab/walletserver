import { Injectable } from '@nestjs/common';
import { CoinData, TokensBody } from './interfaces';
import CoinGecko from './utils/constants';
import tokens from './utils/tokens.json';
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  async getGraphData(
    Tokens: {
      [key: string]: number;
    },
    days: number,
  ) {
    try {
      let coindataTemp = {};
      let tokenNames = Object.keys(Tokens);
      console.log(Tokens, 'Tokens====__');
      console.log(tokenNames.length, 'tokenNames');
      for (let i = 0; i < tokenNames.length; i++) {
        // @ts-ignore
        const singleName = tokens[tokenNames[i].toLowerCase()]?.id;
        console.log(singleName, 'singleName');
        if (singleName) {
          const request = await CoinGecko.get(
            `/coins/${singleName}/market_chart/`,
            {
              params: {
                vs_currency: 'usd',
                days: `${days}`,
              },
            },
          );
          let response = request.data.prices.splice(0, 25);
          let amount = Tokens[tokenNames[i]];
          coindataTemp = {
            ...coindataTemp,
            [singleName]: {
              data: this.FilterData(response, true, amount),
              name: tokenNames[i],
            },
          };
        }
      }

      const result = this.TotalWalletBalance(coindataTemp, Tokens);
      return result;
    } catch (error) {
      return error;
    }
  }
  FilterData(data: number[], filterPrice: boolean, amount: number) {
    try {
      console.log(data, 'data====>>>');
      let index: number = filterPrice ? 1 : 0;

      //@ts-ignore
      const Arrdata = data.map((element) => element[index]);
      let filterArr = [];
      for (let i = 0; i < Arrdata.length; i++) {
        let ArrdataValue = Arrdata[i] * amount;
        filterArr.push(ArrdataValue);
      }
      console.log(filterArr, 'filterArr');
      return filterArr;
    } catch (error) {
      return error;
    }
  }
  TotalWalletBalance(
    coinData: ConstrainDOMStringParameters,
    Tokens: {
      [key: string]: number;
    },
  ) {
    let keysofToken = Object.keys(coinData);
    let additionAtThisIndex = 0;
    let totalWalletData: { data: number[] } = {
      data: [],
    };
    // console.log(coinData, 'keys of token');

    for (let i = 0; i <= 14; i++) {
      let currentIndex = i;
      additionAtThisIndex = 0;
      for (let j = 0; j < keysofToken.length; j++) {
        let singleTokenName = keysofToken[j];
        // console.log(
        //   coinData[singleTokenName]['data'],
        //   'single token==============',
        //   currentIndex,
        // );
        let thisCoindata = coinData[singleTokenName]['data'][currentIndex];
        // console.log(thisCoindata, 'thisCoindata');
        let AfterMultiplication =
          thisCoindata * Tokens[coinData[singleTokenName].name];
        additionAtThisIndex = additionAtThisIndex + AfterMultiplication;
      }
      totalWalletData['data'].push(additionAtThisIndex);
    }
    console.log(totalWalletData, 'total wallet data');
    return totalWalletData;
  }
  async getTokenHoldingProfit(Tokens: TokensBody, period: number) {
    try {
      const days = {
        30: `price_change_percentage_30d`,
        60: `price_change_percentage_60d`,
      };
      console.log(Tokens, 'Tokens====__');
      let tokenNames = Object.keys(Tokens);
      let pricesInUsd = [];
      for (let i = 0; i < tokenNames.length; i++) {
        // @ts-ignore
        const singleName = tokens[tokenNames[i].toLowerCase()]?.id;
        if (singleName) {
          const request = await CoinGecko.get(`/coins/${singleName}`);
          const data: {
            market_data: {
              price_change_percentage_30d: number;
              price_change_percentage_60d: number;
            };
          } = request.data;
          pricesInUsd.push(data.market_data[days[period]] / 100);
        }
      }
      const profit = pricesInUsd.reduce((partialSum, a) => partialSum + a, 0);

      return profit;
    } catch (error) {
      return error;
    }
  }
}
