import "../styles/AnalyticsCharts.css"

export default function AnalyticsCharts({ data }) {
  const topTopics = Object.entries(data.topicData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  const totalMood = Object.values(data.moodData).reduce((a, b) => a + b, 0)
  const moodPercentages = {
    happy: totalMood > 0 ? ((data.moodData.happy / totalMood) * 100).toFixed(1) : 0,
    neutral: totalMood > 0 ? ((data.moodData.neutral / totalMood) * 100).toFixed(1) : 0,
    sad: totalMood > 0 ? ((data.moodData.sad / totalMood) * 100).toFixed(1) : 0,
  }

  return (
    <div className="analytics-charts">
      <div className="chart-container">
        <h3>Learning Time by Topic</h3>
        <div className="bar-chart">
          {topTopics.map(([topic, hours], idx) => (
            <div key={idx} className="bar-item">
              <div className="bar-label">{topic}</div>
              <div className="bar-wrapper">
                <div className="bar" style={{ width: `${(hours / topTopics[0][1]) * 100}%` }}>
                  <span className="bar-value">{hours.toFixed(1)}h</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="chart-container">
        <h3>Learning Mood Distribution</h3>
        <div className="pie-chart">
          <div className="pie-item happy">
            <div className="pie-segment" style={{ width: `${moodPercentages.happy}%` }}></div>
            <span className="pie-label">Happy: {moodPercentages.happy}%</span>
          </div>
          <div className="pie-item neutral">
            <div className="pie-segment" style={{ width: `${moodPercentages.neutral}%` }}></div>
            <span className="pie-label">Neutral: {moodPercentages.neutral}%</span>
          </div>
          <div className="pie-item sad">
            <div className="pie-segment" style={{ width: `${moodPercentages.sad}%` }}></div>
            <span className="pie-label">Sad: {moodPercentages.sad}%</span>
          </div>
        </div>
      </div>

      <div className="chart-container full-width">
        <h3>Top Learning Topics</h3>
        <div className="topics-table">
          <div className="table-header">
            <div className="col-topic">Topic</div>
            <div className="col-hours">Hours</div>
            <div className="col-logs">Logs</div>
          </div>
          {topTopics.map(([topic, hours], idx) => {
            const logCount = data.logs.filter((log) => log.topic === topic).length
            return (
              <div key={idx} className="table-row">
                <div className="col-topic">{topic}</div>
                <div className="col-hours">{hours.toFixed(1)}h</div>
                <div className="col-logs">{logCount}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
