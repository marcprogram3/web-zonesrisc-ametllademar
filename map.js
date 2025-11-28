const map = new ol.Map({
  target: 'map',
  layers: [new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    })
  })],
  view: new ol.View({
    center: ol.proj.fromLonLat([0.803, 40.883]),
    zoom: 14.3
  })
});

const vectorSource = new ol.source.Vector();
const vectorLayer = new ol.layer.Vector({ source: vectorSource });
map.addLayer(vectorLayer);

window.zonesRisc.forEach(zona => {
  const coords = zona.polygon.map(p => ol.proj.fromLonLat([p[0], p[1]]));
  const feature = new ol.Feature(new ol.geom.Polygon([coords]));
  feature.set('zona', zona);
  vectorSource.addFeature(feature);
});

// Colors groc → vermell fosc
function getColor(nivell) {
  const palette = ['#fef3c7', '#fde68a', '#fbbf24', '#f97316', '#dc2626'];
  return palette[nivell - 1] || '#dc2626';
}

vectorLayer.setStyle(feature => {
  const nivell = feature.get('zona').nivell;
  const baseColor = getColor(nivell);
  const opacity = nivell === 5 ? 0.55 : nivell === 4 ? 0.50 : nivell === 3 ? 0.45 : nivell === 2 ? 0.40 : 0.35;

  return new ol.style.Style({
    fill: new ol.style.Fill({ color: baseColor + Math.floor(opacity * 255).toString(16).padStart(2, '0') }),
    stroke: new ol.style.Stroke({ color: baseColor, width: 2 }) // línies més fines
  });
});

// Popup
const popup = new ol.Overlay({
  element: document.createElement('div'),
  positioning: 'bottom-center',
  offset: [0, -10]
});
popup.getElement().className = 'ol-popup';
popup.getElement().innerHTML = '<div id="popup-content"></div>';
map.addOverlay(popup);

map.on('click', evt => {
  const feature = map.forEachFeatureAtPixel(evt.pixel, f => f);
  if (feature && feature.get('zona')) {
    const z = feature.get('zona');
    document.getElementById('popup-content').innerHTML = `
      <strong style="font-size:1.5em;color:#7f1d1d">${z.name}</strong><br>
      <b style="font-size:1.7em;color:#dc2626">${z.mentions} mencions</b><br>
      Nivell de risc: <strong>${z.nivell}/5</strong><br><br>
      ${z.description}
    `;
    popup.setPosition(evt.coordinate);
  } else {
    popup.setPosition(undefined);
  }
});

// Llegenda amb barra de color
const legend = document.createElement('div');
legend.className = 'legend';
legend.innerHTML = `
  <h4>Intensitat del risc percebut</h4>
  <div style="display:flex;align-items:center;margin:15px 0;">
    <div style="width:240px;height:32px;background:linear-gradient(to right,#fef3c7,#fde68a,#fbbf24,#f97316,#dc2626);
      border-radius:16px;border:3px solid #fff;box-shadow:0 6px 20px rgba(0,0,0,0.3);"></div>
    <span style="margin-left:16px;font-weight:700;color:#1f2937;">Baix → Alt</span>
  </div>
  ${window.zonesRisc
    .sort((a,b) => b.nivell - a.nivell || b.mentions - a.mentions)
    .map(z => `
      <div class="legend-item">
        <div class="legend-color" style="background:${getColor(z.nivell)}"></div>
        <div><strong>${z.name}</strong> – ${z.mentions} mencions (nivell ${z.nivell})</div>
      </div>
    `).join('')}
`;
document.querySelector('.map-wrapper').appendChild(legend);