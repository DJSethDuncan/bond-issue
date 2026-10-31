import { estimate, parseHomeValue } from './calculator.js';
const input = document.querySelector('#home-value');
const slider = document.querySelector('#home-value-slider');
const homeValueStops = [100000, 200000, 300000, 400000, 500000, 1000000, 2000000];
const outcomeOptions = document.querySelectorAll('input[name="outcome"]');
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const number = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });
const labels = { both: 'Both questions', q1: 'Question 1 only', neither: 'Bond fails (no new bonds)' };
const set = (id, text) => { document.getElementById(id).textContent = text; };
function render() {
  const outcome = document.querySelector('input[name="outcome"]:checked');
  const value = parseHomeValue(input.value);
  input.setAttribute('aria-invalid', String(value === null));
  document.querySelector('#value-error').hidden = value !== null;
  if (value !== null) {
    const nearest = homeValueStops.reduce((best, stop, index) =>
      Math.abs(stop - value) < Math.abs(homeValueStops[best] - value) ? index : best, 0);
    slider.value = String(nearest);
    slider.setAttribute('aria-valuetext', `$${number.format(homeValueStops[nearest])}`);
  }
  document.querySelector('#slider-custom').hidden = value === null || homeValueStops.includes(value);
  if (value === null) {
    set('result-context', 'Enter a valid home value to see an estimate');
    set('today-amount', '—');
    set('today-description', 'Estimate unavailable');
    set('change-timing', 'Enter a valid home value to see the estimate and timing.');
    return;
  }
  const result = estimate(value, outcome.value);
  set('result-context', `${labels[outcome.value]} · $${number.format(value)} home`);
  set('today-amount', `${result.todayMonthly < 0 ? '−' : ''}${money.format(Math.abs(result.todayMonthly))}`);
  set('today-description', result.todayAnnual < 0
    ? `Estimated decrease beginning in 2028 · ${money.format(-result.todayAnnual)} less per year`
    : result.todayAnnual === 0 ? 'No estimated change from today’s rate'
    : `Estimated increase · ${money.format(result.todayAnnual)} more per year`);
  const timing = {
    both: 'When would this start? The district’s published estimates do not specify the first tax bill that would include this increase.',
    q1: 'When would this start? No increase from today’s tax rate is projected for Question 1 alone. Your bill could still change if your home’s value or other tax rates change.',
    neither: 'When would this start? The district projects this decrease beginning with the 2028 property-tax bill—not immediately after the election.',
  };
  set('change-timing', timing[outcome.value]);

}
input.addEventListener('input', render);
input.addEventListener('blur', () => {
  const value = parseHomeValue(input.value);
  if (value !== null) input.value = number.format(value);
});
outcomeOptions.forEach(option => option.addEventListener('change', render));
slider.addEventListener('input', () => {
  input.value = number.format(homeValueStops[Number(slider.value)]);
  render();
});
const helpButton = document.querySelector('#appraised-help-button');
const helpOverlay = document.querySelector('#appraised-help');
const helpTrigger = document.querySelector('.value-help-trigger');
let helpTimer;
function showHelp(open) {
  clearTimeout(helpTimer);
  helpOverlay.hidden = !open;
  helpButton.setAttribute('aria-expanded', String(open));
}
helpButton.addEventListener('click', () => showHelp(helpOverlay.hidden));
helpButton.addEventListener('focus', () => {
  if (helpButton.matches(':focus-visible')) showHelp(true);
});
helpTrigger.addEventListener('pointerenter', event => {
  if (event.pointerType === 'mouse') showHelp(true);
});
helpTrigger.addEventListener('pointerleave', event => {
  if (event.pointerType === 'mouse') helpTimer = setTimeout(() => {
    if (!helpTrigger.contains(document.activeElement)) showHelp(false);
  }, 200);
});
helpTrigger.addEventListener('focusout', event => {
  if (!helpTrigger.contains(event.relatedTarget)) showHelp(false);
});
document.querySelector('#appraised-help-close').addEventListener('click', () => {
  helpButton.focus();
  showHelp(false);
});
document.addEventListener('pointerdown', event => {
  if (!helpTrigger.contains(event.target)) showHelp(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !helpOverlay.hidden) {
    helpButton.focus();
    showHelp(false);
  }
});
render();
