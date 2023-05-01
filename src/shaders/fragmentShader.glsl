varying vec2 vCoordinates;
varying vec3 vPos;
uniform sampler2D bird;
uniform sampler2D logo;
uniform sampler2D spark;
uniform float move;

void main() {
    vec4 sparkTexture = texture2D(spark, gl_PointCoord);
    vec2 myUV = vec2(vCoordinates.x/512.0, vCoordinates.y/512.0);
    vec4 logoImage = texture2D(logo, myUV);
    vec4 birdImage = texture2D(bird, myUV);

    vec4 final = mix(logoImage, birdImage, smoothstep(0.0, 1.0, fract(move)));

    float alpha = 1.0 - clamp(0.0, 1.0, abs(vPos.z/900.0));

    gl_FragColor = final;
    gl_FragColor.a *= sparkTexture.r * alpha;
}