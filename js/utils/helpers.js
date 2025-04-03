export function degToRad(degrees) {
    return degrees * (Math.PI / 180);
}

export function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

export function lerp(start, end, alpha) {
    return start * (1 - alpha) + end * alpha;
}
