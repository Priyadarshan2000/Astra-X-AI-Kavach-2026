import { Cell, Pie, PieChart } from 'recharts'

export default function ConfidenceGauge({ value = 94 }) {
  const data = [
    { name: 'score', value },
    { name: 'rest', value: 100 - value },
  ]
  return (
    <div className="relative grid place-items-center">
      <PieChart width={180} height={180}>
        <Pie data={data} dataKey="value" innerRadius={62} outerRadius={80} startAngle={210} endAngle={-30} stroke="none">
          <Cell fill="#00e5ff" />
          <Cell fill="#ff2e97" />
        </Pie>
      </PieChart>
      <div className="absolute text-center">
        <div className="font-display text-3xl text-mist text-glow">{value}%</div>
        <div className="hud-label">AI confidence</div>
      </div>
    </div>
  )
}
