/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  LED GRAND LINE — MOTION TUNING
 * ─────────────────────────────────────────────────────────────────────────────
 *  Every value that controls how the LEDs rest, react to the cursor and settle
 *  lives here. Distances are CSS pixels; forces use the simulation's internal
 *  acceleration units; times are seconds.
 *
 *  idleDrift      Maximum per-particle wander (about 1 px combined).
 *  pushRadius     How far the cursor reaches into the field.
 *  pushStrength   Base cursor push. Cursor speed adds a capped multiplier.
 *  returnSpeed    Spring/damping multiplier applied after a shape has settled.
 *  rippleStrength Ring force. Keep small so rings barely stir the LEDs.
 *  rippleLifetime How long both the DOM ring and the simulation ripple live.
 */

export const idleDrift = 0.42;
export const pushRadius = 54;
export const pushStrength = 980;
export const returnSpeed = 2.5;
export const rippleStrength = 600;
export const rippleLifetime = 0.72;
