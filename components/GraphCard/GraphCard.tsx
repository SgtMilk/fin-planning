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

  const Graph = () => (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis width={80} />
        <Tooltip />
        <Legend />
        {dataKeys.map((dataKey) => (
          <Line
            key={dataKey}
            type="monotone"
            dataKey={dataKey}
            stroke={generateRandomColor()}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );

  return (
    <div className="w-full h-full p-5 bg-slate-50 border border-slate-200 rounded-lg shadow">
      <div className="w-full h-[10%] flex align-center justify-center">
        <h1 className="text-2xl">{title}</h1>
      </div>
      <div className="w-full h-[90%]">
        <Graph />
      </div>
    </div>
  );
};

const generateRandomColor = () =>
  "#" +
  [...Array(6)]
    .map((_, i) => {
      const num = Math.floor(Math.random() * 16);
      return (i % 2 === 0 && num < 2 ? num + 2 : num).toString(16);
    })
    .join("");
