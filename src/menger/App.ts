import {
  CanvasAnimation,
  WebGLUtilities
} from "../lib/webglutils/CanvasAnimation.js";
import { GUI } from "./Gui.js";
import { MengerSponge } from "./MengerSponge.js";
import { mengerTests } from "./tests/MengerTests.js";
import {
  defaultFSText,
  defaultVSText,
  floorFSText,
  floorVSText
} from "./Shaders.js";
import { Mat4, Vec4 } from "../lib/TSM.js";
 
export interface MengerAnimationTest {
  reset(): void;
  setLevel(level: number): void;
  getGUI(): GUI;
  draw(): void;
}
 
export class MengerAnimation extends CanvasAnimation {
  private gui: GUI;
 
  /* The Menger sponge */
  private sponge: MengerSponge = new MengerSponge(1);
 
  /* Menger Sponge Rendering Info */
  private mengerVAO: WebGLVertexArrayObjectOES = -1;
  private mengerProgram: WebGLProgram = -1;
 
  /* Menger Buffers */
  private mengerPosBuffer: WebGLBuffer = -1;
  private mengerIndexBuffer: WebGLBuffer = -1;
  private mengerNormBuffer: WebGLBuffer = -1;
 
  /* Menger Attribute Locations */
  private mengerPosAttribLoc: GLint = -1;
  private mengerNormAttribLoc: GLint = -1;
 
  /* Menger Uniform Locations */
  private mengerWorldUniformLocation: WebGLUniformLocation = -1;
  private mengerViewUniformLocation: WebGLUniformLocation = -1;
  private mengerProjUniformLocation: WebGLUniformLocation = -1;
  private mengerLightUniformLocation: WebGLUniformLocation = -1;
 
  /* Global Rendering Info */
  private lightPosition: Vec4 = new Vec4();
  private backgroundColor: Vec4 = new Vec4();
 
  /* Floor Rendering Info */
  private floorVAO: WebGLVertexArrayObjectOES = -1;
  private floorProgram: WebGLProgram = -1;
 
  /* Floor Buffers */
  private floorPosBuffer: WebGLBuffer = -1;
  private floorNormBuffer: WebGLBuffer = -1;
  private floorIndexBuffer: WebGLBuffer = -1;
 
  /* Floor Attribute Locations */
  private floorPosAttribLoc: GLint = -1;
  private floorNormAttribLoc: GLint = -1;
 
  /* Floor Uniform Locations */
  private floorWorldUniformLocation: WebGLUniformLocation = -1;
  private floorViewUniformLocation: WebGLUniformLocation = -1;
  private floorProjUniformLocation: WebGLUniformLocation = -1;
  private floorLightUniformLocation: WebGLUniformLocation = -1;
 
  /* Floor Geometry - 100x100 plane at y = -2.0 */
  private floorPositions: Float32Array = new Float32Array([
    -100.0, -2.0, -100.0, 1.0,
     100.0, -2.0, -100.0, 1.0,
     100.0, -2.0,  100.0, 1.0,
    -100.0, -2.0,  100.0, 1.0
  ]);
 
  private floorNormals: Float32Array = new Float32Array([
    0.0, 1.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0
  ]);
 
  private floorIndices: Uint16Array = new Uint16Array([
    0, 2, 1,
    0, 3, 2
  ]);
 
 
  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    this.gui = new GUI(canvas, this, this.sponge);
    this.reset();
  }
 
  public reset(): void {
    this.lightPosition = new Vec4([-10.0, 10.0, -10.0, 1.0]);
    // Standard background color from the rubric
    this.backgroundColor = new Vec4([0.0, 0.37254903, 0.37254903, 1.0]);
 
    this.initMenger();
    this.initFloor();
 
    this.gui.reset();
  }
 
  public initMenger(): void {
    this.sponge.setLevel(1);
    const gl: WebGLRenderingContext = this.ctx;
 
    this.mengerProgram = WebGLUtilities.createProgram(gl, defaultVSText, defaultFSText);
    gl.useProgram(this.mengerProgram);
 
    this.mengerVAO = this.extVAO.createVertexArrayOES() as WebGLVertexArrayObjectOES;
    this.extVAO.bindVertexArrayOES(this.mengerVAO);
 
    this.mengerPosAttribLoc = gl.getAttribLocation(this.mengerProgram, "vertPosition");
    this.mengerPosBuffer = gl.createBuffer() as WebGLBuffer;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.mengerPosBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.sponge.positionsFlat(), gl.STATIC_DRAW);
    gl.vertexAttribPointer(this.mengerPosAttribLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.mengerPosAttribLoc);
 
    this.mengerNormAttribLoc = gl.getAttribLocation(this.mengerProgram, "aNorm");
    this.mengerNormBuffer = gl.createBuffer() as WebGLBuffer;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.mengerNormBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.sponge.normalsFlat(), gl.STATIC_DRAW);
    gl.vertexAttribPointer(this.mengerNormAttribLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.mengerNormAttribLoc);
 
    this.mengerIndexBuffer = gl.createBuffer() as WebGLBuffer;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mengerIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.sponge.indicesFlat(), gl.STATIC_DRAW);
 
    this.extVAO.bindVertexArrayOES(null); // UNBIND
 
    this.mengerWorldUniformLocation = gl.getUniformLocation(this.mengerProgram, "mWorld") as WebGLUniformLocation;
    this.mengerViewUniformLocation = gl.getUniformLocation(this.mengerProgram, "mView") as WebGLUniformLocation;
    this.mengerProjUniformLocation = gl.getUniformLocation(this.mengerProgram, "mProj") as WebGLUniformLocation;
    this.mengerLightUniformLocation = gl.getUniformLocation(this.mengerProgram, "lightPosition") as WebGLUniformLocation;
  }
 
  public initFloor(): void {
    const gl: WebGLRenderingContext = this.ctx;
 
    this.floorProgram = WebGLUtilities.createProgram(gl, floorVSText, floorFSText);
    gl.useProgram(this.floorProgram);
 
    this.floorVAO = this.extVAO.createVertexArrayOES() as WebGLVertexArrayObjectOES;
    this.extVAO.bindVertexArrayOES(this.floorVAO);
 
    this.floorPosAttribLoc = gl.getAttribLocation(this.floorProgram, "vertPosition");
    this.floorPosBuffer = gl.createBuffer() as WebGLBuffer;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.floorPosBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.floorPositions, gl.STATIC_DRAW);
    gl.vertexAttribPointer(this.floorPosAttribLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.floorPosAttribLoc);
 
    this.floorNormAttribLoc = gl.getAttribLocation(this.floorProgram, "aNorm");
    this.floorNormBuffer = gl.createBuffer() as WebGLBuffer;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.floorNormBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.floorNormals, gl.STATIC_DRAW);
    gl.vertexAttribPointer(this.floorNormAttribLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.floorNormAttribLoc);
 
    this.floorIndexBuffer = gl.createBuffer() as WebGLBuffer;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.floorIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.floorIndices, gl.STATIC_DRAW);
 
    this.extVAO.bindVertexArrayOES(null); // UNBIND
 
    this.floorWorldUniformLocation = gl.getUniformLocation(this.floorProgram, "mWorld") as WebGLUniformLocation;
    this.floorViewUniformLocation = gl.getUniformLocation(this.floorProgram, "mView") as WebGLUniformLocation;
    this.floorProjUniformLocation = gl.getUniformLocation(this.floorProgram, "mProj") as WebGLUniformLocation;
    this.floorLightUniformLocation = gl.getUniformLocation(this.floorProgram, "lightPosition") as WebGLUniformLocation;
  }
 
  public draw(): void {
    const gl: WebGLRenderingContext = this.ctx;
 
    /* Clear canvas */
    gl.clearColor(this.backgroundColor.r, this.backgroundColor.g, this.backgroundColor.b, this.backgroundColor.a);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    gl.frontFace(gl.CCW);
    gl.cullFace(gl.BACK);
 
    /* --- DRAW MENGER SPONGE --- */
    gl.useProgram(this.mengerProgram);
    this.extVAO.bindVertexArrayOES(this.mengerVAO);
 
    if (this.sponge.isDirty()) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.mengerPosBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, this.sponge.positionsFlat(), gl.STATIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.mengerNormBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, this.sponge.normalsFlat(), gl.STATIC_DRAW);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mengerIndexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.sponge.indicesFlat(), gl.STATIC_DRAW);
      this.sponge.setClean();
    }
 
    gl.uniformMatrix4fv(this.mengerWorldUniformLocation, false, new Float32Array(this.sponge.uMatrix().all()));
    gl.uniformMatrix4fv(this.mengerViewUniformLocation, false, new Float32Array(this.gui.viewMatrix().all()));
    gl.uniformMatrix4fv(this.mengerProjUniformLocation, false, new Float32Array(this.gui.projMatrix().all()));
    gl.uniform4fv(this.mengerLightUniformLocation, this.lightPosition.xyzw);
 
    gl.drawElements(gl.TRIANGLES, this.sponge.indicesFlat().length, gl.UNSIGNED_INT, 0);
 
    /* --- DRAW FLOOR --- */
    gl.useProgram(this.floorProgram);
    this.extVAO.bindVertexArrayOES(this.floorVAO);
 
    gl.uniformMatrix4fv(this.floorWorldUniformLocation, false, new Float32Array(Mat4.identity.all()));
    gl.uniformMatrix4fv(this.floorViewUniformLocation, false, new Float32Array(this.gui.viewMatrix().all()));
    gl.uniformMatrix4fv(this.floorProjUniformLocation, false, new Float32Array(this.gui.projMatrix().all()));
    gl.uniform4fv(this.floorLightUniformLocation, this.lightPosition.xyzw);
 
    gl.drawElements(gl.TRIANGLES, this.floorIndices.length, gl.UNSIGNED_SHORT, 0);
    
    // Cleanup state
    this.extVAO.bindVertexArrayOES(null);
  }
 
  public setLevel(level: number): void {
    this.sponge.setLevel(level);
  }
 
  public getGUI(): GUI {
    return this.gui;
  }
}
 
export function initializeCanvas(): void {
  const canvas = document.getElementById("glCanvas") as HTMLCanvasElement;
  const canvasAnimation: MengerAnimation = new MengerAnimation(canvas);
  mengerTests.registerDeps(canvasAnimation);
  canvasAnimation.start();
}