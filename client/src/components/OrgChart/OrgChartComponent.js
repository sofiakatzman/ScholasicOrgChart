import React, { useEffect, useRef, useState } from 'react';
import { OrgChart } from 'd3-org-chart';
import * as d3 from 'd3';

const OrgChartComponent = () => {
  const chartContainerRef = useRef();
  const [orgData, setOrgData] = useState(null);

  useEffect(() => {
    fetch('/api/org-chart-flat', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setOrgData(
        data.filter(person => person.id !== 'recuHSRqLYauu7SUE')
      ))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!orgData || !chartContainerRef.current) return;

    // Clear previous chart
    d3.select(chartContainerRef.current).selectAll('*').remove();

    // Initialize org chart
    const chart = new OrgChart()
      .container(chartContainerRef.current)
      .data(orgData)
      .nodeWidth(() => 250)
      .nodeHeight(() => 100)
      .childrenMargin(() => 40)
      .compactMarginBetween(() => 15)
      .layout('left') // options: top, left, right, bottom
      .compactMarginPair(() => 80)
      .nodeContent((d) => `
  <div style="
    background: white;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 12px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    font-family: sans-serif;
    width: 230px;
    box-sizing: border-box;
    height: 100px;
  ">
    <div style="font-weight: bold; font-size: 16px; color: #333;">${d.data.name}</div>
    <div style="font-size: 13px; color: #666;">${d.data.title || ''}</div>
  </div>
`)
      .render();
      chart.fit()

  }, [orgData]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {!orgData ? <p>Loading...</p> : <div ref={chartContainerRef}></div>}
    </div>
  );
};

export default OrgChartComponent;
