export let defaultVSText = `
    precision mediump float;

    attribute vec3 vertPosition;
    attribute vec3 vertColor;
    attribute vec4 aNorm;
    
    varying vec4 lightDir;
    varying vec4 normal;   
 
    uniform vec4 lightPosition;
    uniform mat4 mWorld;
    uniform mat4 mView;
	uniform mat4 mProj;

    void main () {
		//  Convert vertex to camera coordinates and the NDC
        gl_Position = mProj * mView * mWorld * vec4 (vertPosition, 1.0);
        
        //  Compute light direction (world coordinates)
        lightDir = lightPosition - vec4(vertPosition, 1.0);
		
        //  Pass along the vertex normal (world coordinates)
        normal = aNorm;
    }
`;

// TODO: Write the fragment shader

export let defaultFSText = `
    precision mediump float;

    varying vec4 lightDir;
    varying vec4 normal;    
	
    
    void main () {
        vec3 N = normalize(normal.xyz);
        vec3 L = normalize(lightDir.xyz);

        //keep lighting for shading
        float diffuseL = max(dot(N,L), 0.0);

        //determine the color based on the face of the cube
        vec3 baseColor = vec3(0.0, 0.0, 0.0);

        if(abs(N.x) > 0.9){
            baseColor = vec3(1.0, 0.0, 0.0);
        }
        else if(abs(N.y) > 0.9){
            baseColor = vec3(0.0,1.0,0.0);
        }
        else{
            baseColor = vec3(0.0, 0.0, 1.0);
        }

        gl_FragColor = vec4(baseColor * diffuseL, 1.0);
    
    }
`;

// TODO: floor shaders
export let floorVSText = `
    precision mediump float;

    attribute vec3 vertPosition;
    attribute vec4 aNorm;
    
    varying vec4 lightDir;
    varying vec4 normal;
    varying vec4 worldPos;

    uniform vec4 lightPosition;
    uniform mat4 mWorld;
    uniform mat4 mView;
    uniform mat4 mProj;

    void main () {
        worldPos = mWorld * vec4(vertPosition, 1.0);
        gl_Position = mProj * mView * worldPos;
        
        // Pass attributes for fragment shading
        lightDir = lightPosition - worldPos;
        normal = aNorm;
    }
`;

export let floorFSText = `
    precision mediump float;

    varying vec4 lightDir;
    varying vec4 normal;
    varying vec4 worldPos;

    void main () {
        // start setting up checkerboard pattern
        float checkSize = 5.0;
        float x = floor(worldPos.x / checkSize);
        float z = floor(worldPos.z / checkSize);
        
        // check if num is even or odd
        float check = mod(x + z, 2.0);
        
        vec3 color;
        if (check < 1.0) {
            color = vec3(1.0, 1.0, 1.0); // White
        } else {
            color = vec3(0.0, 0.0, 0.0); // Black
        }

        // make sure floor isn't "flat"
        vec3 N = normalize(normal.xyz);
        vec3 L = normalize(lightDir.xyz);
        float diffuse = max(dot(N, L), 0.0);
        
        // ambient lighting
        gl_FragColor = vec4(color * (diffuse + 0.2), 1.0);
    }
`;