import { marked } from 'marked';
import notes from '../research/usd259-bond-2026.md?raw';

// Render only the repository's trusted research document, never user input.
const content = document.querySelector('#research-content');
content.innerHTML = marked.parse(notes, { gfm: true });
content.querySelectorAll('table').forEach(table => {
  const wrapper = document.createElement('div');
  wrapper.className = 'research-table';
  wrapper.tabIndex = 0;
  wrapper.setAttribute('role', 'region');
  wrapper.setAttribute('aria-label', 'Research data table; scroll horizontally to view all columns');
  table.before(wrapper);
  wrapper.append(table);
});
