uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uCOlorOffset;
uniform float uColorMultiplier;

   varying float vElevation;
    void main(){
        float colorStrength = (vElevation + uCOlorOffset) * uColorMultiplier;
        vec3 mixColor = mix(uDepthColor,uSurfaceColor,colorStrength);
        gl_FragColor = vec4(mixColor,1.0);
    }