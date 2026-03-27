import { MarketIntermediateAnswers } from '../../types/market/marketIntermediateData';

class MarketAnswersStorage {
  currentAnswersKey: string = 'LUCMarketCurrentAnswers';

  public saveMarketIntermediateAnswers(answers: MarketIntermediateAnswers) {
    sessionStorage.setItem(this.currentAnswersKey, JSON.stringify(answers));
  }

  public getMarketIntermediateAnswers() {
    const data = sessionStorage.getItem(this.currentAnswersKey);
    if (data) {
      return JSON.parse(data) as MarketIntermediateAnswers;
    }
    return null;
  }
}

export const marketAnswersStorage = new MarketAnswersStorage();
