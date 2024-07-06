"use client";

import React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { isDarkMode } from "@/components/common";

export interface GraphCardProps {
  title: string;
  data: Array<LineProps>;
}

export interface LineProps {
  name: string;
  [key: string]: number | string;
}

export const GraphCard = ({ title, data }: GraphCardProps) => {
  const dataKeys: string[] = [];
  data.forEach((lineData) => {
    Object.keys(lineData).forEach((key) => {
      if (key !== "name" && !dataKeys.includes(key)) dataKeys.push(key);
    });
  });

  data.forEach((periodData) => {
    for (const key in periodData)
      if (key !== "name")
        periodData[key] = Math.round((periodData[key] as number) * 100) / 100;
  });

  const tooltipStyle = isDarkMode()
    ? {
        contentStyle: { backgroundColor: "rgb(2 6 23)" },
        itemStyle: { color: "white" },
      }
    : {};

  const generateRandomColor = () =>
    "#" +
    [...Array(6)]
      .map((_, i) => {
        const num = Math.floor(genRandom() * 16);
        if (isDarkMode())
          return (i % 2 === 0 && num < 4 ? num + 2 : num).toString(16);
        else return (i % 2 === 0 && num > 12 ? num - 2 : num).toString(16);
      })
      .join("");

  var seed = 1;
  const genRandom = () => {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  const Graph = () => (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis width={getGraphYWidth(data)} tick={{ fontSize: 12 }} />
        <Tooltip {...tooltipStyle} wrapperStyle={{ fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {dataKeys.map((dataKey, i) => (
          <Line
            key={dataKey}
            type="monotone"
            // isAnimationActive={false}
            dataKey={dataKey}
            stroke={generateRandomColor()}
            isAnimationActive={false}
            // dot={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );

  return (
    <div className="w-full h-full p-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg shadow">
      <div className="w-full h-[10%] flex align-center justify-center">
        <h1 className="text-xl">{title}</h1>
      </div>
      <div className="w-full h-[90%]">
        <Graph />
      </div>
    </div>
  );
};

const getGraphYWidth = (data: Array<LineProps>) => {
  let max = 0;

  data.forEach((linedata) => {
    Object.values(linedata).forEach((point) => {
      if (typeof point === "number" && point > max) {
        max = point;
      }
    });
  });

  const width = Math.log(max) * 4;
  if (max === 0 || width < 30) return 30;
  if (width > 200) return 60;

  return width;
};
