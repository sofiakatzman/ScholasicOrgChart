import { useEffect, useState, useRef } from 'react';
import OrgChart from '@dabeng/react-orgchart';
import "./OrgChart.css";
import $ from 'jquery';

export default function OrgChartWrapper() {
  const [orgData, setOrgData] = useState(null);
  const [scale, setScale] = useState(1); // stateful zoom level

  const chartRef = useRef(null);

  function exportPDF(){
    chartRef.current.exportTo("org-chart","pdf");
  }

  function exportPNG(){
    chartRef.current.exportTo("org-chart","png");
  }

  function applyZoom(newScale) {
    const chart = $('.orgchart');
    chart.css('transform', `scale(${newScale})`);
  }

  function zoomIN() {
    const newScale = Math.min(scale + 0.25, 7);
    setScale(newScale);
    applyZoom(newScale);
  }

  function zoomOUT() {
    const newScale = Math.max(scale - 0.25, 0.5);
    setScale(newScale);
    applyZoom(newScale);
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
      />
      <div style={{ marginTop: '1rem' }}>
        <button onClick={exportPDF}>[ Export as PDF ]</button>
        <button onClick={exportPNG}>[ Export as PNG ]</button>
        <button onClick={zoomIN}>[ Zoom IN ]</button>
        <button onClick={zoomOUT}>[ Zoom OUT ]</button>
      </div>
    </div>
  );
}
