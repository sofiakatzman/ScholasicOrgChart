import { useEffect, useState, useRef } from 'react';
import OrgChart from '@dabeng/react-orgchart';
import "./OrgChart.css";
import $ from 'jquery';

export default function OrgChartWrapper() {
  const [orgData, setOrgData] = useState(null);

  const chartRef = useRef(null);

  function exportPDF(){
    chartRef.current.exportTo("org-chart","pdf");
  }

  function exportPNG(){
    chartRef.current.exportTo("org-chart","png");
  }


  function reset() {
    const chart = $('.orgchart');
    chart.css('transform', `scale(1)`);
    }

  useEffect(() => {
    fetch('/api/org-chart', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setOrgData(data);
      })
      .catch(console.error);
  }, []);

  if (!orgData) return <p>Loading...</p>;

  return (
    <div>
      <OrgChart
        ref={chartRef}
        datasource={orgData}
        collapsible={true}
        draggable={true}
        pan={true}
        direction="l2r"
        verticalLevel={2}
        multipleSelect={false}
        zoom={true}
      />
      <div style={{ marginTop: '1rem' }}>
        <button onClick={exportPDF}>[ Export as PDF ]</button>
        <button onClick={exportPNG}>[ Export as PNG ]</button>
        <button onClick={reset}>[ Reset ]</button>
      </div>
    </div>
  );
}
