import { Int8Attribute } from "three";

const TILE_SIZE = 5;
const GRID_SIZE = 10;
const OBSTACLE_DENSITY = -0.3; // Value between -1 and 1
const CAMERA_HEIGHT = 1.7;
const SPEED = 0.1;

export default {
  TILE_SIZE: TILE_SIZE,
  GRID_SIZE: GRID_SIZE,
  AREA_SIZE: GRID_SIZE / 2,
  MAP_SIZE: GRID_SIZE * TILE_SIZE,
  OBSTACLE_DENSITY: OBSTACLE_DENSITY,
  CAMERA_HEIGHT: CAMERA_HEIGHT,
  SPEED: SPEED,
  TILE_CENTER_OFFSET: TILE_SIZE / 2,
  DISPLAY_AXES: false,
  DISPLAY_GRID: false,
  FPS: true,
  RELOAD: () => init()
}
