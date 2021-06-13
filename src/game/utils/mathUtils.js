export const ccw = (ax, ay, bx, by, cx, cy) =>
    (cy - ay) * (bx - ax) > (by - ay) * (cx - ax);

export const isect = (s1, s2) =>
    ccw(s1[0][0], s1[0][1], s2[0][0], s2[0][1], s2[1][0], s2[1][1]) != ccw(s1[1][0], s1[1][1], s2[0][0], s2[0][1], s2[1][0], s2[1][1]) &&
    ccw(s1[0][0], s1[0][1], s1[1][0], s1[1][1], s2[0][0], s2[0][1]) != ccw(s1[0][0], s1[0][1], s1[1][0], s1[1][1], s2[1][0], s2[1][1]);

/**
 * @param {number} octaves
 * @param {number} lacunarity
 * @param {number} gain
 * @param {number} x
 * @param {number} y
 * @param {(x: number, y: number) => number} noiseFunc
 * @returns {number}
 */
export const fbm = (octaves, lacunarity, gain, x, y, noiseFunc) => {
    let amp = 0.5;
    let freq = 1;
    let z = 0;
    for (let i = 0; i < octaves; i++) {
        z += amp * noiseFunc(freq * x, freq * y);
        freq *= lacunarity;
        amp *= gain;
    }
    return z;
}
