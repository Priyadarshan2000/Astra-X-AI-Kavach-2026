import { Cell, Pie, PieChart } from 'recharts'

export default function ConfidenceGauge({ value = 94, label = 'HOLD' }) {
  const data = [
    { name: 'score', value },
    { name: 'rest', value: 100 - value },
  ]
  return (
    <div className="relative grid place-items-center">
      <PieChart width={176} height={176}>
        <Pie data={data} dataKey="value" innerRadius={58} outerRadius={78} startAngle={210} endAngle={-30} stroke="none">
          <Cell fill="#00e5ff" />
          <Cell fill="#2a2038" />
        </Pie>
      </PieChart>
      <div className="absolute text-center">
        <div className="font-display text-3xl text-white">{value}%</div>
        <p className="mt-1 font-display text-[9px] tracking-[0.18em] text-white/70">{label}</p>
      </div>
    </div>
  )
}
