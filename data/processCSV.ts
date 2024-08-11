import Papa from "papaparse";

export const parseCSV = async (file: File) => {
  const data: any[] = await new Promise((resolve, reject) => {
    Papa.parse(file, {
      complete(results, file) {
        resolve(results.data);
      },
      error(err, file) {
        reject(err);
      },
    });
  });

  if (!data) {
    alert("Data in CSV file could not be parsed.");
    return;
  }

  let startPointer = 0;
  let mapping = null;
  while (startPointer < data.length) {
    const curRow = data[startPointer] as string[];

    const tempMapping = curRow.map((element) => {
      if (isPrice(element)) return "price";
      else if (isDate(element)) return "date";
      else return "other";
    });

    if (tempMapping.includes("price") && tempMapping.includes("date")) {
      mapping = tempMapping;
      break;
    }

    startPointer++;
  }

  if (!mapping) {
    alert("Could not find a row in the CSV file with a date and a price.");
    return;
  }

  const dateIndex = mapping.indexOf("date");
  const priceIndex = mapping.indexOf("price");

  interface IN {
    date: Date;
    price: number;
  }

  const culledInput: IN[] = [];
  for (let i = startPointer; i < data.length; i++) {
    if (!isDate(data[i][dateIndex]) || !isPrice(data[i][priceIndex])) continue;

    const date = new Date(data[i][dateIndex]);
    const price = Number(data[i][priceIndex]);

    culledInput.push({ date, price });
  }

  // @ts-ignore
  culledInput.sort((a, b) => a.date - b.date);

  const offset = Math.max(
    culledInput[0].date.getDate(),
    culledInput[culledInput.length - 1].date.getDate()
  );

  const monthlyBalance: {
    [key: string]: { positive: number; negative: number };
  } = {};

  culledInput.forEach((input) => {
    if (input.date.getDate() > offset)
      input.date.setMonth(input.date.getMonth() + 1);

    const month = getMonth(input.date);
    if (!(month in monthlyBalance))
      monthlyBalance[month] = {
        positive: 0,
        negative: 0,
      };

    if (input.price >= 0) monthlyBalance[month].positive += input.price;
    else monthlyBalance[month].negative += input.price;
  });

  const result = {
    positive: 0,
    negative: 0,
  };

  Object.values(monthlyBalance).forEach((balance) => {
    result.positive += balance.positive;
    result.negative += balance.negative;
  });

  const len = Object.keys(monthlyBalance).length;
  result.positive = parseFloat((result.positive / len).toFixed(2));
  result.negative = parseFloat((result.negative / len).toFixed(2));

  return result;
};

const isPrice = (price: string) => {
  const monthMatch = /^-?[0-9]+(,|\.)[0-9]{2}$/gm;
  return monthMatch.test(price);
};

var isDate = (date: string) => {
  const d = new Date(date);
  // @ts-ignore
  return d !== "Invalid Date" && !isNaN(d);
};

export const getMonth = (date: Date) => {
  const fullMonth = date.getMonth();
  const year = Math.floor(fullMonth / 12) + date.getFullYear();
  const month = (fullMonth % 12) + 1;
  return `${year}-${month < 10 ? "0" : ""}${month}`;
};
