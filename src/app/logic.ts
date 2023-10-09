import { eachDayOfInterval, format } from "date-fns";
import data from "./data.json";

export type portfolioEntry = {
	date: string;
	shares: number;
	value: number;
};

const DAILY_CASH_GAIN = 350;

// TODO: implement historical currency exchange
const NOK_PER_USD = 8;

let portfolioData: [portfolioEntry];
let cashInNOK = 0;
let shares = 0;
let last_price = 0;

const priceData: { [date: string]: { [category: string]: string } } = data;

const getPrice = (date: string) => {
	try {
		const price = +priceData[date]["4. close"];
		if (!isNaN(price)) {
			last_price = price;
		}
		return price;
	} catch (error) {
		return NaN;
	}
};

const buyStock = (date: string, budgetInUSD: number) => {
	const price = getPrice(date);
	if (isNaN(price)) {
		return [0, budgetInUSD];
	}
	const sharesBought = Math.floor(budgetInUSD / price);
	const remainingUSD = budgetInUSD - sharesBought * price;

	return [sharesBought, remainingUSD];
};

function* day(start: Date, stop: Date, step?: number) {
	const allDates = eachDayOfInterval({ start: start, end: stop });
	// 	Fri Jan 01 2010 00:00:00 GMT+0100 (GMT+01:00)
	//  Sat Jan 02 2010 00:00:00 GMT+0100 (GMT+01:00)
	//  Sun Jan 03 2010 00:00:00 GMT+0100 (GMT+01:00)
	let counter = 0;
	for (const date of allDates) {
		const formatedDate = format(date, "yyyy-MM-dd");
		cashInNOK += DAILY_CASH_GAIN;
		const [sharesBought, remainingUSD] = buyStock(
			formatedDate,
			cashInNOK / NOK_PER_USD
		);
		shares += sharesBought;
		cashInNOK = remainingUSD * NOK_PER_USD;
		const currentPortfolio: portfolioEntry = {
			date: formatedDate,
			shares: shares,
			value: last_price * shares * NOK_PER_USD,
		};
		if (step) {
			counter += 1;
			if (counter % step === 0) {
				counter = 0;
				yield currentPortfolio;
			}
		} else {
			yield currentPortfolio;
		}
	}
}

export { day };
