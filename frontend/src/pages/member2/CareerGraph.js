import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

function CareerGraph({ data }) {
  return (
    <BarChart width={400} height={300} data={data}>
      <XAxis dataKey="career" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="score" />
    </BarChart>
  );
}

export default CareerGraph;