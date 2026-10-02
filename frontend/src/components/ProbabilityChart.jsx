import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const ProbabilityChart = ({ probabilities }) => {
  const data = Object.entries(probabilities).map(([label, value]) => ({
    label,
    value: (value * 100).toFixed(2),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical">
        <XAxis type="number" domain={[0, 100]} />
        <YAxis type="category" dataKey="label" width={60} />
        <Tooltip
          formatter={(value) => `${value}%`}
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}
        />
        <Bar dataKey="value" fill="#DC2626" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ProbabilityChart;
