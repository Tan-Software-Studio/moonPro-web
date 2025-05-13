const token = "So11111111111111111111111111111111111111112";
const symbol = "WSOL";
const bq_apikey = process.env.NEXT_PUBLIC_STREAM_BITQUERY_API;
const intervalTV = [
  "1S",
  "1",
  "5",
  "15",
  "30",
  "45",
  "60",
  "120",
  "180",
  "240",
  "1D",
];
export { token, symbol, bq_apikey, intervalTV };
