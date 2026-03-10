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

        //compute the shade of the base color based on lighting conditions
        gl_FragColor = vec4(baseColor * diffuseL, 1.0);
    
        }
`;

// TODO: floor shaders

export let floorVSText = ``;
export let floorFSText = ``;