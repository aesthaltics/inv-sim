import ALPHA_API_KEY from "@/keys/alpha-vantage";
const alpha = require("alphavantage")({ key: ALPHA_API_KEY });

const result = async (ticker: string) => {
	return await alpha.data.daily(ticker, "full", "json");
};

const searchAlpha = async (ticker: string) => {
	const data = await alpha.data.search(ticker)
	return data
}

const storeResult = async (ticker: string) => {
	const data = await result(ticker);
	return data
};

export { result, storeResult, searchAlpha };
