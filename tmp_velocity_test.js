const vel = {x:650,y:-1000};
const dt_ms = 16; // typical frame ~16ms
const dt_s = dt_ms/1000;
const delta = {x: vel.x * dt_s, y: vel.y * dt_s};
console.log(`dt_ms=${dt_ms} -> delta x=${delta.x.toFixed(2)} px, delta y=${delta.y.toFixed(2)} px`);
