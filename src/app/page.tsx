"use client";
import Image from "next/image";
import { result, storeResult, searchAlpha } from "@/app/handleStockPrice";
import { PureComponent, useState, useRef } from "react";
import { day, portfolioEntry } from "./logic";
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";

export default function Home() {
	const [portfolio, setPortfolio] = useState<portfolioEntry[]>([]);
	const gen = useRef(day(new Date("2010-01-01"), new Date("2019-12-31"), 7));
	const [intervalRef, setIntervalRef] = useState<number>();

	const startAuto = () => {
		setIntervalRef(window.setInterval(handleClick, 10));
	};
	const stopAuto = () => {
		if (intervalRef !== undefined) {
			window.clearInterval(intervalRef);
			setIntervalRef(undefined);
			return;
		}
	};

	const handleAuto = () => {
		if (intervalRef !== undefined) {
			stopAuto();
			return;
		}
		startAuto();
	};

	const handleClick = async () => {
		const result = gen.current.next();

		if (!result.done) {
			setPortfolio((prev_portfolio) => {
				return prev_portfolio.concat([result.value]);
			});
		}
	};
	return (
		<main className="flex flex-col items-center justify-center h-screen w-screen">
			<div>Portfolio Value</div>
			<div className="flex gap-5">
				<button
					className="w-24 h-10 rounded-full bg-gradient-to-r from-indigo-700 via-pink-600 to-red-500 hover:scale-125 active:scale-90 duration-150"
					onClick={() => {
						handleClick();
					}}
				>
					Next Day
				</button>
				<button
					className="w-24 h-10 rounded-full bg-gradient-to-r from-indigo-700 via-pink-600 to-red-500 hover:scale-125 active:scale-90 duration-150"
					onClick={handleAuto}
				>
					{intervalRef !== undefined ? "Stop" : "Auto"}
				</button>
			</div>

			<DrawChart data={portfolio} />
		</main>
	);
}

const DrawChart = ({ data }: { data: portfolioEntry[] }) => {
	return (
		<ResponsiveContainer width="80%" height="80%">
			<AreaChart
				width={500}
				height={400}
				data={data}
				margin={{
					top: 10,
					right: 30,
					left: 0,
					bottom: 0,
				}}
			>
				<defs>
					<linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
						<stop
							offset="5%"
							stopColor="#82ca9d"
							stopOpacity={0.8}
						/>
						<stop
							offset="95%"
							stopColor="#82ca9d"
							stopOpacity={0}
						/>
					</linearGradient>
				</defs>

				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="date" />
				<YAxis />
				<Tooltip />
				<Area
					type="monotone"
					dataKey="value"
					stroke="#82ca9d"
					fill="url(#colorUv)"
				/>
			</AreaChart>
		</ResponsiveContainer>
	);
};
