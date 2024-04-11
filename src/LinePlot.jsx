import * as d3 from "d3";
import {useRef, useEffect} from "react";
import PropTypes from 'prop-types';

const LinePlot = ({ data, width = 928, height = 600, voronoi = false }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const marginTop = 20;
    const marginRight = 20;
    const marginBottom = 30;
    const marginLeft = 30;

    const x = d3
      .scaleUtc()
      .domain(d3.extent(data, (d) => d.date))
      .range([marginLeft, width - marginRight]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.unemployment)]).nice()
      .range([height - marginBottom, marginTop]);

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height])
      .attr(
        'style',
        'max-width: 100%; height: auto; overflow: visible; font: 10px sans-serif;'
      );

    // Add the horizontal axis.
    svg
      .append('g')
      .attr('transform', `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

    // Add the vertical axis.
    svg
      .append('g')
      .attr('transform', `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y))
      .call((g) => g.select('.domain').remove())
      .call(
        voronoi
          ? () => {}
          : (g) =>
              g
                .selectAll('.tick line')
                .clone()
                .attr('x2', width - marginLeft - marginRight)
                .attr('stroke-opacity', 0.1)
      )
      .call((g) =>
        g
          .append('text')
          .attr('x', -marginLeft)
          .attr('y', 10)
          .attr('fill', 'currentColor')
          .attr('text-anchor', 'start')
          .text('↑ Unemployment (%)')
      );

    const points = data.map((d) => [x(d.date), y(d.unemployment), d.division]);

    if (voronoi)
      svg
        .append('path')
        .attr('fill', 'none')
        .attr('stroke', '#ccc')
        .attr(
          'd',
          d3.Delaunay.from(points).voronoi([0, 0, width, height]).render()
        );

    const groups = d3.rollup(points, (v) => Object.assign(v, { z: v[0][2] }), (d) => d[2]);

    const line = d3.line();

    const path = svg
      .append('g')
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .selectAll('path')
      .data(groups.values())
      .join('path')
      .style('mix-blend-mode', 'multiply')
      .attr('d', line);

    const dot = svg.append('g').attr('display', 'none');

    dot.append('circle').attr('r', 2.5);

    dot.append('text').attr('text-anchor', 'middle').attr('y', -8);

    const pointerentered = () => {
      path.style('mix-blend-mode', null).style('stroke', '#ddd');
      dot.attr('display', null);
    };

    const pointermoved = (event) => {
      const [xm, ym] = d3.pointer(event);
      const i = d3.leastIndex(points, ([x, y]) => Math.hypot(x - xm, y - ym));
      const [x, y, k] = points[i];

      path
        .style('stroke', ({ z }) => (z === k ? null : '#ddd'))
        .filter(({ z }) => z === k)
        .raise();

      dot.attr('transform', `translate(${x},${y})`);
      dot.select('text').text(k);

      svg.property('value', data[i]).dispatch('input', { bubbles: true });
    };

    const pointerleft = () => {
      path.style('mix-blend-mode', 'multiply').style('stroke', null);
      dot.attr('display', 'none');
      svg.node().value = null;
      svg.dispatch('input', { bubbles: true });
    };

    svg.on('pointerenter', pointerentered).on('pointermove', pointermoved).on('pointerleave', pointerleft).on('touchstart', (event) => event.preventDefault());
  }, [data, voronoi, width, height]);

  return <svg ref={svgRef} />;
};


LinePlot.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    division: PropTypes.string.isRequired,
    date: PropTypes.instanceOf(Date).isRequired,
    unemployment: PropTypes.number.isRequired
  })).isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  marginTop: PropTypes.number,
  marginRight: PropTypes.number,
  marginBottom: PropTypes.number,
  marginLeft: PropTypes.number,
  voronoi: PropTypes.bool
};

export default LinePlot;