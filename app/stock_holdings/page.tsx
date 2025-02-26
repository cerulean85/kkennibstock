'use client'
import React, { useState, useRef, useEffect } from 'react';
import MixedLineBarChartComponent2 from '@/graphs/mixedLineBarChart2';
import "react-datepicker/dist/react-datepicker.css";
import DateRangePicker from '@/components/DateRangePicker';
import StackedBarChart from '@/graphs/stackedBarChart'

import * as d3 from 'd3';
import * as topojson from 'topojson-client';


interface Point {
  name: string;
  coords: [number, number];
  url: string;
}

const StockPage = () => {
  const alarmTotal = 1200;
  const alarmFin = 1080;
  let palletData: any = [
    { id: 1, type: "S/C #1", count: 100, stackCount: 453, average: 4.5 },
    { id: 2, type: "S/C #2", count: 200, stackCount: 1912, average: 9.5 },
    { id: 3, type: "S/C #3", count: 200, stackCount: 2800, average: 14.0 },
    { id: 4, type: "S/C #4", count: 250, stackCount: 4320, average: 17.2 },    
    { id: 4, type: "S/C #5", count: 250, stackCount: 4320, average: 17.2 },    
  ];

  const palletTotal = 750;
  const palletStackTotal = 750;
  const palletAver = 12.6;

  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  


  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const resize = () => {
      const container = svgRef.current?.parentElement;
      if (!container) return;

      const width = container.clientWidth;
      const height = container.clientHeight;

      const svg = d3.select(svgRef.current)
        .attr('width', width)
        .attr('height', height);

      const projection = d3.geoMercator()
        .scale((width / 800) * 150)
        .translate([width / 2, height / 2])
        .center([0, 30]) // 중심 좌표 설정 (경도 0, 위도 30)
        // .rotate([0, 0, 0])
        .clipExtent([[0, 0], [width, height]])
        // .clipAngle(90)
        // .fitExtent([[0, 0], [width, height]], { type: 'Sphere' });

      const path: any = d3.geoPath().projection(projection);

      const tooltip = d3.select('body').append('div')
        .style('position', 'absolute')
        .style('background', '#fff')
        .style('padding', '5px')
        .style('border', '1px solid #ccc')
        .style('border-radius', '5px')
        .style('pointer-events', 'none')
        .style('opacity', 0);

      fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
        .then(response => response.json())
        .then(worldData => {
          const countries: any = topojson.feature(worldData, worldData.objects.countries);

          svg.selectAll('path').remove();
          svg.selectAll('circle').remove();

          svg.selectAll('path')
            .data(countries.features)
            .enter().append('path')
            .attr('d', path)
            .attr('fill', '#69b3a2')
            .attr('stroke', '#fff');

          const points: Point[] = [
            { name: 'Seoul', coords: [126.978, 37.5665], url: 'https://en.wikipedia.org/wiki/Seoul' },
            { name: 'New York', coords: [-74.006, 40.7128], url: 'https://en.wikipedia.org/wiki/New_York_City' },
            { name: 'London', coords: [-0.1276, 51.5074], url: 'https://en.wikipedia.org/wiki/London' }
          ];

          svg.selectAll('circle')
            .data(points)
            .enter().append('circle')
            .attr('cx', d => projection(d.coords)?.[0] ?? 0)
            .attr('cy', d => projection(d.coords)?.[1] ?? 0)
            .attr('r', 5)
            .attr('fill', 'red')
            .on('mouseover', (event, d) => {
              tooltip.style('opacity', 1)
                .html(d.name)
                .style('left', `${event.pageX + 10}px`)
                .style('top', `${event.pageY + 10}px`);
            })
            .on('mouseout', () => {
              tooltip.style('opacity', 0);
            })
            .on('click', (event, d) => {
              window.open(d.url, '_blank');
            });
        });
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);


  return (
    <div className='pb-3'>

<div style={{ width: '100%', height: '30vh' }}><svg ref={svgRef}></svg></div>;
{/* <svg ref={svgRef}></svg>; */}

      {/* <div className='series-chart-card'>
        <div className='title d-flex justify-content-between'>
          <label>알람 발생 그래프</label>
          <DateRangePicker></DateRangePicker>
        </div>

        <div className='d-flex justify-content-between px-5 mt-4 '>
          <div className='metric'>
            <div className='met-title'>발생</div>
            <div className='met-value'>{alarmTotal.toLocaleString()}</div>
          </div>
          <div className='metric ms-3'>
            <div className='met-title'>처리</div>
            <div className='met-value'>{alarmFin.toLocaleString()}</div>
          </div>
          <div className='metric ms-3'>
            <div className='met-title'>처리율</div>
            <div className='met-value'>{alarmFin.toLocaleString()}</div>
          </div>
        </div>
        <div className='chart'>
          <MixedLineBarChartComponent2 />
        </div>               
      </div>

      <div className='series-chart-card mt-3'>

        <div className='title d-flex justify-content-between'>
            <label>설비별 알람 발생 그래프</label>
            <DateRangePicker></DateRangePicker>
          </div>

        <div className='chart'>
          <StackedBarChart />

          <div className='d-flex'>
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>설비</th>
                  <th>수량</th>
                  <th>적재수량</th>
                  <th>평균</th>
                </tr>
              </thead>
              <tbody>
              {palletData.map((d: any, i: any) => (
                  <tr key={i}>
                    <td>{d.type}</td>
                    <td>{d.count}</td>
                    <td>{d.stackCount}</td>
                    <td>{d.average}</td>
                  </tr>
                ))}

                <tr>
                  <td>Total</td>
                  <td>{palletTotal}</td>
                  <td>{palletStackTotal}</td>
                  <td>{palletAver}</td>
                </tr>
              </tbody>
            </table>

            <table className="table table-bordered table-striped ms-3">
              <thead>
                <tr>
                  <th>설비</th>
                  <th>수량</th>
                  <th>적재수량</th>
                  <th>평균</th>
                </tr>
              </thead>
              <tbody>
              {palletData.map((d: any, i: any) => (
                  <tr key={i}>
                    <td>{d.type}</td>
                    <td>{d.count}</td>
                    <td>{d.stackCount}</td>
                    <td>{d.average}</td>
                  </tr>
                ))}

                <tr>
                  <td>Total</td>
                  <td>{palletTotal}</td>
                  <td>{palletStackTotal}</td>
                  <td>{palletAver}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>          
      </div> */}

    </div>
  );
};

export default StockPage;