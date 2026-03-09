import { Mat3, Mat4, Vec3, Vec4 } from "../lib/TSM.js";

/* A potential interface that students should implement */
interface IMengerSponge 
{
  setLevel(level: number): void;
  isDirty(): boolean;
  setClean(): void;
  normalsFlat(): Float32Array;
  indicesFlat(): Uint32Array;
  positionsFlat(): Float32Array;
}

/**
 * Represents a Menger Sponge
 */
export class MengerSponge implements IMengerSponge 
{

  // data structures to help store sponge
  private positions: number[] = [];
  private indices: number[] = [];
  private normals: number[] = [];
  private level: number = 0;
  private dirty: boolean = true;

  constructor(level: number) 
  {
	  this.setLevel(level);
	  // TODO: other initialization
  }

  /**
   * Returns true if the sponge has changed.
   */
  public isDirty(): boolean 
  {
       return this.dirty;
  }

  public setClean(): void 
  {
    this.dirty = false;
  }

  public setLevel(level: number): void
  {
	  // initializes the cube
    this.level = level;

    // clears any existing data first
    this.positions = [];
    this.indices = [];
    this.normals = [];

    // generates sponge located at origin with size of 1
    this.generateSponge(level, 0, 0, 0, 1.0);

    this.dirty = true;
  }

// generates the sponge (starting at 0)
private generateSponge(level: number, x: number, y: number, z: number, size: number): void 
{
    if (level === 0) 
      {
      // Base case
      this.addCube(x, y, z, size);
      return;
    }

    const newSize = size / 3;
    const offset = newSize;

    // Generates the 27 potential cube positions
    for (let i = -1; i <= 1; i++) 
      {
      for (let j = -1; j <= 1; j++) 
        {
        for (let k = -1; k <= 1; k++) 
          {
          // Checks if this cube should be removed
          const isRemoved = (Math.abs(i) + Math.abs(j) + Math.abs(k)) <= 1;

          if (!isRemoved) 
            {
            // Generates sponge at next level
            this.generateSponge(
              level - 1,
              x + i * offset,
              y + j * offset,
              z + k * offset,
              newSize
            );
          }
        }
      }
    }
  }


  // generates cube at x,y,z position with its given size
  // also adds vertices, indices, and normals to the arrays
  private addCube(x: number, y: number, z: number, size: number): void 
  {
    const half = size / 2;

    const minX = x - half, maxX = x + half;
    const minY = y - half, maxY = y + half;
    const minZ = z - half, maxZ = z + half;

    // Define the 4 vertices for each of the 6 cube faces
    const faceVertices = [
      // Front face (+z)
      [minX, minY, maxZ], [maxX, minY, maxZ], [maxX, maxY, maxZ], [minX, maxY, maxZ],
      // Back face (-z)
      [maxX, minY, minZ], [minX, minY, minZ], [minX, maxY, minZ], [maxX, maxY, minZ],
      // Left face (-x)
      [minX, minY, maxZ], [minX, minY, minZ], [minX, maxY, minZ], [minX, maxY, maxZ],
      // Right face (+x)
      [maxX, minY, minZ], [maxX, minY, maxZ], [maxX, maxY, maxZ], [maxX, maxY, minZ],
      // Top face (+y)
      [minX, maxY, maxZ], [maxX, maxY, maxZ], [maxX, maxY, minZ], [minX, maxY, minZ],
      // Bottom face (-y)
      [minX, minY, minZ], [maxX, minY, minZ], [maxX, minY, maxZ], [minX, minY, maxZ]
    ];

    // Face normals for each face
    const faceNormals = [
      [0, 0, 1, 0],   // Front
      [0, 0, -1, 0],  // Back
      [-1, 0, 0, 0],  // Left
      [1, 0, 0, 0],   // Right
      [0, 1, 0, 0],   // Top
      [0, -1, 0, 0]   // Bottom
    ];

    // Current vertex index is the length divided by 4 because 4 floats are pushed per vertex
    let currentIndex = this.positions.length / 4;

    // Add triangles and normals
    for (let f = 0; f < 6; f++) {
      const normal = faceNormals[f];

      for (let v = 0; v < 4; v++) {
        const vertex = faceVertices[f * 4 + v];

        // Push 4 floats per position (x, y, z, w)
        this.positions.push(vertex[0], vertex[1], vertex[2], 1.0);

        // Push 4 floats per normal (nx, ny, nz, nw)
        this.normals.push(normal[0], normal[1], normal[2], normal[3]);
      }

      // Pushes two triangles per face
      this.indices.push(
        currentIndex + 0, currentIndex + 1, currentIndex + 2,
        currentIndex + 0, currentIndex + 2, currentIndex + 3
      );

      currentIndex += 4;
    }
  }

  /* Returns a flat Float32Array of the sponge's vertex positions */
  public positionsFlat(): Float32Array 
  {
	  return new Float32Array(this.positions);
  }

  /**
   * Returns a flat Uint32Array of the sponge's face indices
   */
  public indicesFlat(): Uint32Array 
  {
    return new Uint32Array(this.indices);
  }

  /**
   * Returns a flat Float32Array of the sponge's normals
   */
  public normalsFlat(): Float32Array 
  {
	  return new Float32Array(this.normals);
  }

  /**
   * Returns the model matrix of the sponge
   */
  public uMatrix(): Mat4 {

    // TODO: change this, if it's useful
    const ret : Mat4 = new Mat4().setIdentity();

    return ret;
  }
  
}
