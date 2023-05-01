varying vec2 vUv;
varying vec3 vPos;
varying vec2 vCoordinates;
attribute vec3 aCoordinates;
attribute float aDirection;
attribute float aSpeed;
attribute float aOffset;
attribute float aPress;

uniform float move;
uniform float time;
uniform vec2 mouse;

uniform float mousePressed;
uniform float transition;

void main() {
    vUv = uv;
    vec3 pos = position;
    
    // pos.x += sin(1.0*move*aSpeed)*3.0;
    // pos.y += sin(1.0*move*aSpeed)*3.0;
    // pos.z = mod(position.z + move * 200.0 * aSpeed + aOffset, 2000.0) - 100.0;

    vec3 stable = position;
    float dist = distance(stable.xy, mouse);
    float area = 1.0 - smoothstep(0.0, 300.0, dist);

    stable.x += 50.0 * sin(0.1 * time * aPress) * aDirection * area * mousePressed;
    stable.y += 50.0 * sin(0.1 * time * aPress) * aDirection * area * mousePressed;
    stable.z += 200.0 * cos(0.1 * time * aPress) * aDirection * area * mousePressed;

    // pos = mix(pos, stable, transition);

    vec4 mvPosition = modelViewMatrix * vec4(stable, 1.0);
    gl_PointSize = 4000.0 * (1.0 / - mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;

    vCoordinates = aCoordinates.xy;
    vPos = pos;
}