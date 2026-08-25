(() => {
  const mapElement = document.querySelector('#russia-map');
  if (!mapElement || typeof window.d3 === 'undefined') return;

  const width = 1600;
  const height = 850;
  const cities = [
    { name: 'Калининград', lat: 54.7104, lon: 20.4522, dx: 14, dy: 22 },
    { name: 'Санкт-Петербург', lat: 59.9311, lon: 30.3609, dx: 16, dy: -35, major: true },
    { name: 'Архангельск', lat: 64.5393, lon: 40.5187, dx: 15, dy: 25 },
    { name: 'Москва', lat: 55.7558, lon: 37.6173, dx: -145, dy: -25, major: true },
    { name: 'Ярославль', lat: 57.6261, lon: 39.8845, dx: 15, dy: -28 },
    { name: 'Брянск', lat: 53.2434, lon: 34.3642, dx: -110, dy: -12 },
    { name: 'Киров', lat: 58.6036, lon: 49.668, dx: -100, dy: -16 },
    { name: 'Казань', lat: 55.7963, lon: 49.1088, dx: -145, dy: 18, major: true },
    { name: 'Нижнекамск', lat: 55.6312, lon: 51.8144, dx: -82, dy: 32 },
    { name: 'Ижевск', lat: 56.8527, lon: 53.2115, dx: 15, dy: -15, major: true },
    { name: 'Пермь', lat: 58.0105, lon: 56.2502, dx: 15, dy: -32 },
    { name: 'Самара', lat: 53.1959, lon: 50.1002, dx: 15, dy: 10 },
    { name: 'Тольятти', lat: 53.5078, lon: 49.4204, dx: -160, dy: 20, major: true },
    { name: 'Уфа', lat: 54.7388, lon: 55.9721, dx: -150, dy: 40, major: true },
    { name: 'Магнитогорск', lat: 53.4072, lon: 58.9791, dx: -55, dy: 45 },
    { name: 'Орск', lat: 51.2293, lon: 58.4752, dx: 14, dy: 32 },
    { name: 'Екатеринбург', lat: 56.8389, lon: 60.6057, dx: 48, dy: -62, major: true },
    { name: 'Челябинск', lat: 55.1644, lon: 61.4368, dx: 16, dy: 28, major: true },
    { name: 'Тюмень', lat: 57.153, lon: 65.5343, dx: 15, dy: 18 },
    { name: 'Курган', lat: 55.441, lon: 65.3411, dx: 15, dy: 34 },
    { name: 'Сургут', lat: 61.254, lon: 73.3962, dx: 18, dy: -8, major: true },
    { name: 'Омск', lat: 54.9885, lon: 73.3242, dx: 15, dy: 34 },
    { name: 'Томск', lat: 56.4846, lon: 84.9476, dx: 15, dy: -15 },
    { name: 'Новосибирск', lat: 55.0084, lon: 82.9357, dx: 15, dy: 28 },
    { name: 'Барнаул', lat: 53.3548, lon: 83.7698, dx: -15, dy: 45 },
    { name: 'Красноярск', lat: 56.0153, lon: 92.8932, dx: 15, dy: -10 },
    { name: 'Севастополь', lat: 44.6167, lon: 33.5254, dx: 18, dy: -34, mapDx: 36 },
    { name: 'Ростов-на-Дону', lat: 47.2357, lon: 39.7015, dx: -125, dy: 5 },
    { name: 'Анапа', lat: 44.8948, lon: 37.3163, dx: 18, dy: 2 },
    { name: 'Краснодар', lat: 45.0355, lon: 38.9753, dx: 18, dy: 38 },
    { name: 'Ессентуки', lat: 44.0445, lon: 42.8606, dx: 15, dy: 12 },
    { name: 'Южно-Сахалинск', lat: 46.9591, lon: 142.738, dx: -140, dy: 35, major: true }
  ];

  const svg = d3.select(mapElement);
  d3.json('https://raw.githubusercontent.com/simp37/Russia_geoJSON/master/Russia.geojson')
    .then((russia) => {
      const projection = d3.geoConicConformal()
        .parallels([48, 72])
        .rotate([-105, 0])
        .center([0, 64])
        .fitExtent([[26, 28], [width - 26, height - 28]], russia);
      const path = d3.geoPath(projection);
      const features = russia.type === 'FeatureCollection' ? russia.features : [russia];

      svg.append('g').attr('class', 'map-country').selectAll('path').data(features).join('path').attr('class', 'country-shape').attr('d', path);
      const layer = svg.append('g').attr('class', 'cities-layer');

      cities.forEach((city) => {
        const coords = projection([city.lon, city.lat]);
        if (!coords) return;
        const cityX = coords[0] + (city.mapDx || 0);
        const cityY = coords[1] + (city.mapDy || 0);
        const cityGroup = layer.append('g')
          .attr('class', `map-city${city.major ? ' major' : ''}`)
          .attr('transform', `translate(${cityX},${cityY})`)
          .attr('tabindex', city.major ? null : 0)
          .attr('role', city.major ? null : 'button')
          .attr('aria-label', city.major ? null : city.name);
        const inner = cityGroup.append('g').attr('class', 'map-city-inner');

        inner.append('circle').attr('class', 'map-city-hit').attr('r', 14);
        inner.append('circle').attr('class', 'map-city-dot').attr('r', 5);
        inner.append('title').text(city.name);

        const fontSize = city.major ? 17 : 14;
        const labelWidth = Math.max(72, city.name.length * fontSize * 0.6 + 24);
        const labelHeight = city.major ? 34 : 30;
        const preferredLabelX = city.dx || 15;
        const labelX = Math.max(12 - cityX, Math.min(preferredLabelX, width - 12 - cityX - labelWidth));
        const labelY = city.dy || -15;

        inner.append('line').attr('class', 'map-city-line').attr('x1', 0).attr('y1', 0).attr('x2', labelX > 0 ? labelX : labelX + labelWidth).attr('y2', labelY);
        inner.append('rect').attr('class', 'map-city-label-bg').attr('x', labelX).attr('y', labelY - labelHeight / 2).attr('width', labelWidth).attr('height', labelHeight).attr('rx', 3);
        inner.append('text').attr('class', 'map-city-label').attr('x', labelX + 12).attr('y', labelY + 1).text(city.name);

        if (!city.major) {
          const cityNode = cityGroup.node();
          const toggleCity = (event) => {
            event.stopPropagation();
            const wasOpen = cityNode.classList.contains('is-open');
            mapElement.querySelectorAll('.map-city:not(.major)').forEach((node) => node.classList.remove('is-open'));
            cityNode.classList.toggle('is-open', !wasOpen);
          };
          cityNode.addEventListener('click', toggleCity);
          cityNode.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') toggleCity(event);
          });
        }
      });

      document.addEventListener('click', (event) => {
        if (event.target.closest?.('.map-city')) return;
        mapElement.querySelectorAll('.map-city:not(.major)').forEach((node) => node.classList.remove('is-open'));
      });
    })
    .catch(() => mapElement.closest('.projects-map-scroller')?.classList.add('map-load-error'));
})();
