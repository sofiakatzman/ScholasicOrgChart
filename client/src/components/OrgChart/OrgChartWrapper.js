import { useEffect, useState, useRef } from 'react';
import OrgChart from '@dabeng/react-orgchart';
// import '@dabeng/react-orgchart/dist/style.css';

export default function OrgChartWrapper() {
  const [orgData, setOrgData] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    fetch('/api/org-chart', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setOrgData(data);
        console.log(data);
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
        zoom={true}
      />
    </div>
  );
}