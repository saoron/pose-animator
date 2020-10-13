/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import * as paper from 'paper';
import 'babel-polyfill';

import { SVGUtils } from './utils/svgUtils';
import { PoseIllustration } from './illustrationGen/illustration';
import { Skeleton } from './illustrationGen/skeleton';
import { toggleLoadingUI, setStatusText } from './utils/demoUtils';

import * as boySVG from './resources/illustration/boy.svg';
import * as girlSVG from './resources/illustration/girl.svg';
import * as girlSH from './resources/illustration/girlSH.svg';

import * as boy_doughnut from './resources/images/boy_doughnut.jpg';
import * as tie_with_beer from './resources/images/tie_with_beer.jpg';
import * as test_img from './resources/images/test.png';
import * as full_body from './resources/images/full-body.png';
import * as full_body_1 from './resources/images/full-body_1.png';
import * as full_body_2 from './resources/images/full-body_2.png';

import { FileUtils } from './utils/fileUtils';

// clang-format on
const avatarSvgs = {
  girl: girlSVG.default,
  boy: boySVG.default,
  women: girlSH.default,
};
const sourceImages = {
  boy_doughnut: boy_doughnut.default,
  tie_with_beer: tie_with_beer.default,
  test_img: test_img.default,
  full_body: full_body.default,
  full_body_1: full_body_1.default,
  full_body_2: full_body_2.default,
};

let skeleton;
let illustration;
let canvasScope;

const CANVAS_WIDTH = 513;
const CANVAS_HEIGHT = 513;

let predictedPoses;
let sourceImage;

async function loadImage(imagePath) {
  const image = new Image();
  const promise = new Promise((resolve, reject) => {
    image.crossOrigin = '';
    image.onload = () => {
      resolve(image);
    };
  });

  image.src = imagePath;
  return promise;
}

function getIllustrationCanvas() {
  return document.querySelector('.illustration-canvas');
}

/**
 * Draw the results from the multi-pose estimation on to a canvas
 */
function drawDetectionResults() {
  if (!predictedPoses || !predictedPoses.length || !illustration) {
    return;
  }
  skeleton.reset();
  canvasScope.project.clear();

  illustration.updateSkeleton(predictedPoses[0], null);
  illustration.draw(canvasScope, sourceImage.width, sourceImage.height);
}

/**
 * Loads an image, feeds it into posenet the posenet model, and
 * calculates poses based on the model outputs
 */
async function testImageAndEstimatePoses() {
  toggleLoadingUI(true);
  setStatusText('Loading FaceMesh model...');
  document.getElementById('results').style.display = 'none';

  // Reload facemesh model to purge states from previous runs.
  //facemesh = await facemesh_module.load();

  // Load an example image
  setStatusText('Loading image...');
  sourceImage = await loadImage(sourceImages[guiState.sourceImage]);

  // Estimates poses
  setStatusText('Predicting...');
  predictedPoses = [
    {
      score: 0.609039797926979,
      keypoints: [
        {
          score: 0.9988994598388672,
          part: 'nose',
          position: { x: 269.22895899635347, y: 125.8142920551597 },
        },
        {
          score: 0.9999165534973145,
          part: 'leftEye',
          position: { x: 287.11140738213106, y: 94.9544927134588 },
        },
        {
          score: 0.9998458623886108,
          part: 'rightEye',
          position: { x: 227.23768724959186, y: 90.78930326101845 },
        },
        {
          score: 0.942374587059021,
          part: 'leftEar',
          position: { x: 329.1020306427655, y: 123.72407010649893 },
        },
        {
          score: 0.9569503664970398,
          part: 'rightEar',
          position: { x: 191.9429920578977, y: 116.4578516418368 },
        },
        {
          score: 0.6634409427642822,
          part: 'leftShoulder',
          position: { x: 331.86793646830995, y: 261.8487254747621 },
        },
        {
          score: 0.9035882353782654,
          part: 'rightShoulder',
          position: { x: 127.73411563317136, y: 246.11425451731404 },
        },
        {
          score: 0.9275650382041931,
          part: 'leftElbow',
          position: { x: 365.3398518506655, y: 428.28396723891973 },
        },
        {
          score: 0.9611034393310547,
          part: 'rightElbow',
          position: { x: 137.96159974517525, y: 496.9929471405564 },
        },
        {
          score: 0.8923328518867493,
          part: 'leftWrist',
          position: { x: 372.19717699822746, y: 328.4008351633985 },
        },
        {
          score: 0.8667539954185486,
          part: 'rightWrist',
          position: { x: 286.60021964678043, y: 335.7995206465517 },
        },
        {
          score: 0.18988096714019775,
          part: 'leftHip',
          position: { x: 315.226239308309, y: 543.4245567024914 },
        },
        {
          score: 0.02712242864072323,
          part: 'rightHip',
          position: { x: 196.04915237797837, y: 540.7767087847342 },
        },
        {
          score: 0.010286564938724041,
          part: 'leftKnee',
          position: { x: 307.65759989445314, y: 518.883897559652 },
        },
        {
          score: 0.0028752353973686695,
          part: 'rightKnee',
          position: { x: 263.0752716955044, y: 535.4873082795496 },
        },
        {
          score: 0.007510093972086906,
          part: 'leftAnkle',
          position: { x: 314.45532356904175, y: 522.4464724889525 },
        },
        {
          score: 0.0032299424055963755,
          part: 'rightAnkle',
          position: { x: 290.5325438642316, y: 520.6055090714985 },
        },
      ],
    },
  ];

  // Draw poses.
  drawDetectionResults();

  toggleLoadingUI(false);
  document.getElementById('results').style.display = 'block';
}

let guiState = {
  // Selected image
  sourceImage: Object.keys(sourceImages)[0],
  avatarSVG: Object.keys(avatarSvgs)[2],
  // Detection debug
  showKeypoints: true,
  showSkeleton: true,
  // Illustration debug
  showCurves: false,
  showLabels: false,
};

/**
 * Kicks off the demo by loading the posenet model and estimating
 * poses on a default image
 */
export async function bindPage() {
  canvasScope = paper.default;
  let canvas = getIllustrationCanvas();
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  canvasScope.setup(canvas);

  setStatusText('Loading SVG file...');
  await loadSVG(Object.values(avatarSvgs)[2]);
}

window.onload = bindPage;

// Target is SVG string or path
async function loadSVG(target) {
  let svgScope = await SVGUtils.importSVG(target);
  skeleton = new Skeleton(svgScope);
  illustration = new PoseIllustration(canvasScope);
  illustration.bindSkeleton(skeleton, svgScope);
  testImageAndEstimatePoses();
}
