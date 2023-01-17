import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatDateTime } from "@/utils";

type PriceProps = {
  data: any[];
};

export function Price(props: PriceProps) {
  const data = props.data.map((x) => ({
    createdAt: formatDateTime(x.attributes.createdAt),
    平均价格: x.attributes.avg,
    最高价格: x.attributes.max,
    最低价格: x.attributes.min,
    推荐价格: x.attributes.suggested,
  }));

  return (
    <ResponsiveContainer>
      <LineChart width={500} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="createdAt" padding={{ left: 30, right: 30 }} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="平均价格" stroke="#8884d8" />
        <Line type="monotone" dataKey="推荐价格" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
}
