//this is the function that will take the call
interface VisitedInterface {
  [key: string]: {
    validPaths: number; // number of valid paths for this square
    highestFail: number; // if this number is greater than the current time we can ignore it
    highestSuccess: number; // if this number is greater than the current time we have to ignore it
  };
}

const visited: VisitedInterface = {};
let totalValidPaths = 0;

export default function findPath(
  start: [x: number, y: number],
  end: [x: number, y: number],
  time: number,
  grid: number[][]
) {
  const startTime = grid[start[0]][start[1]];
  const endCoord = serializeCoord(end);
  heatSeek([], start, startTime, "start", endCoord);

  function heatSeek(
    path: number[][],
    xy: number[],
    currentTime: number,
    prev: string,
    endCoord: string
  ) {
    //TODO: I am worried about path's mutation and if it copies it to the new instance, or if it uses the reference in memory -- haven't leetcoded in a while
    path.push(xy); // add the current coord to the path

    if (serializeCoord(xy) === endCoord) {
      // if we have reached the end
      totalValidPaths++;
      mapPass(currentTime, path);
    }

    currentTime += grid[xy[0]][xy[1]]; // get the current time expense

    if (currentTime > time) {
      mapFail(currentTime, path);
    }

    const uniqueMoves = uniqueMove(xy[0], xy[1], prev); // get the possible moves from this coord
    uniqueMoves.forEach((move) => {
      const coord = serializeCoord(move);
      if (visited[coord]) {
        /*
         * If we have visited this coord before and the highest
         * success / failure is greater than the currentTime
         */
        if (
          currentTime > visited[coord].highestFail ||
          currentTime > visited[coord].highestSuccess
        ) {
          return; //ignore
        }
      }
      heatSeek(path, move[0], currentTime, move[1], endCoord);
    });
  }
}

function serializeCoord(xy) {
  return xy.join(",");
}

function mapPass(currentTime: number, path: number[][]) {}

function mapFail(currentTime: number, path: number[][]) {}

function uniqueMove(x: number, y: number, prev) {
  const tiles: [number[], string][] = [];
  function moveUp() {
    tiles.push([[x + 1, y], "right"]);
  }
  function moveDown() {
    tiles.push([[x, y + 1], "down"]);
  }
  function moveLeft() {
    tiles.push([[x - 1, y], "left"]);
  }
  function moveRight() {
    tiles.push([[x, y - 1], "up"]);
  }
  switch (prev) {
    case "up":
      moveLeft();
      moveRight();
      moveDown();
      break;
    case "down":
      moveLeft();
      moveRight();
      moveUp();
      break;
    case "left":
      moveRight();
      moveUp();
      moveDown();
      break;
    case "right":
      moveLeft();
      moveUp();
      moveDown();
      break;
    case "start":
      moveLeft();
      moveRight();
      moveUp();
      moveDown();
      break;
    default:
      throw new Error("Invalid direction");
  }
  return tiles;
}
