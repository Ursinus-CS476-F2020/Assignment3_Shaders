precision mediump float;

const float GR = 1.618034; // Golden ratio
const float RES = 0.001; // Length to move to a neighboring pixel
const float BLUR_WIDTH = 3.0;
const int NUM_ITERS = 20;

// The 2D position of the pixel in this fragment, interpolated via
// barycentric coordinates from positions of triangle vertices
varying vec2 v_position;
// The 2D texture coordinate in this fragment, interpolated via
// barycentric coordinates from positions of triangle vertices
varying highp vec2 v_texture;

uniform sampler2D uSampler;

void main() {
    float x = v_texture.x;
    float y = v_texture.y;
    float numTotal = 0.0;
    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
    vec3 a = vec3(0.0, 0.0, 0.0);
    vec3 b = vec3(1.0, 1.0, 1.0);
    for (int iter = 0; iter < NUM_ITERS; iter++) {
        for (int channel = 0; channel < 3; channel++) {
            // TODO: Implement the method of golden sections to find
            // the value for each channel that minimizes the sum
            // of the absolute values of the differences to the value
            // in that channel:
            // https://en.wikipedia.org/wiki/Golden-section_search#Iterative_algorithm

            // Step 1: Compute a c and a d for this channel
            // c = b - (b-a)/GR
            // d = a + (b-a)/GR
            float diff = (b[channel] - a[channel])/GR;
            float c = b[channel] - diff;
            float d = a[channel] + diff;
            // Step 2: Compute the sum of the absolute values of difference of pixels
            // to c and d in a neighborhood of the texture coordinate (x, y)
            float sumC = 0.0;
            float sumD = 0.0;
            for (float dx = -BLUR_WIDTH; dx <= BLUR_WIDTH; dx++) {
                for (float dy = -BLUR_WIDTH; dy <= BLUR_WIDTH; dy++) {
                    vec4 color = texture2D(uSampler, vec2(x+RES*dx, y+RES*dy));
                    sumC += abs(c - color[channel]);
                    sumD += abs(d - color[channel]);
                }
            }
            // Step 3: Figure out how to move interval
            // if sum(c) < sum(d), then b = d
            if (sumC < sumD) {
                b[channel] = d;
            }
            // else, then a = c
            else {
                a[channel] = c;
            }
        }
    }


    gl_FragColor = vec4((a+b)/2.0, 1.0);
}
