import './app.js';
import { Storage } from './storage.js';
import { toast } from './app.js';

document.querySelector('#exportData').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(Storage.export(), null, 2)], { type: 'application/json' });
  const anchor = document.createElement('a');
  anchor.href = URL.createObjectURL(blob);
  anchor.download = `gate-da-progress-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();
  URL.revokeObjectURL(anchor.href);
  toast('Progress exported');
});

document.querySelector('#importData').addEventListener('change', async (event) => {
  try {
    const payload = JSON.parse(await event.target.files[0].text());
    Storage.import(payload);
    document.querySelector('#importStatus').textContent = 'Import complete. Reloading…';
    setTimeout(() => location.reload(), 600);
  } catch (error) {
    document.querySelector('#importStatus').textContent = error.message;
  }
});
