export function downloadChartAsImage(canvasOrContainerId: string, filename: string = 'buzzmetrics-chart.png') {
  const container = document.getElementById(canvasOrContainerId);
  if (!container) return;

  const canvas = container.querySelector('canvas') || (container instanceof HTMLCanvasElement ? container : null);
  if (!canvas) return;

  // Create a temporary canvas with a solid white background so dark theme charts export clearly
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const ctx = tempCanvas.getContext('2d');
  if (!ctx) return;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
  ctx.drawImage(canvas, 0, 0);

  const imageURI = tempCanvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = filename;
  link.href = imageURI;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
