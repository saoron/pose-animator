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

import * as girlSH from './resources/illustration/girlSH.svg';

import * as full_body_2 from './resources/images/full-body_2.png';

// clang-format on
const avatarSvgs = {
  women: girlSH.default,
};
const sourceImages = {
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
  sourceImage = await loadImage(sourceImages['full_body_2']);
  predictedPoses = [
    {
      score: 0.9409652597763959,
      keypoints: [
        {
          score: 0.9999185800552368,
          part: 'nose',
          position: { x: 207.7155458583906, y: 79.21301103287634 },
        },
        {
          score: 0.9925481677055359,
          part: 'leftEye',
          position: { x: 215.70907662165305, y: 73.3509400364026 },
        },
        {
          score: 0.9999240636825562,
          part: 'rightEye',
          position: { x: 197.58737727756167, y: 73.61917583302301 },
        },
        {
          score: 0.8783358335494995,
          part: 'leftEar',
          position: { x: 219.7083478660435, y: 84.39126860028576 },
        },
        {
          score: 0.9373297095298767,
          part: 'rightEar',
          position: { x: 173.32267743998466, y: 77.96418400033438 },
        },
        {
          score: 0.9889324903488159,
          part: 'leftShoulder',
          position: { x: 224.60027878664812, y: 102.78382178874331 },
        },
        {
          score: 0.9449844360351562,
          part: 'rightShoulder',
          position: { x: 155.15763606357203, y: 109.86909075191512 },
        },
        {
          score: 0.9764326810836792,
          part: 'leftElbow',
          position: { x: 271.08353222668865, y: 90.28854002006324 },
        },
        {
          score: 0.9834730625152588,
          part: 'rightElbow',
          position: { x: 116.77308604689424, y: 96.10834099439332 },
        },
        {
          score: 0.7045027017593384,
          part: 'leftWrist',
          position: { x: 284.01391800090033, y: 40.85296393368495 },
        },
        {
          score: 0.7544713020324707,
          part: 'rightWrist',
          position: { x: 124.80642374462886, y: 47.96590900792222 },
        },
        {
          score: 0.9926081895828247,
          part: 'leftHip',
          position: { x: 217.17482453932558, y: 210.32231727926649 },
        },
        {
          score: 0.996791422367096,
          part: 'rightHip',
          position: { x: 178.44819996885752, y: 209.48431194617126 },
        },
        {
          score: 0.9917946457862854,
          part: 'leftKnee',
          position: { x: 209.59956177292167, y: 300.0313103226836 },
        },
        {
          score: 0.9884691834449768,
          part: 'rightKnee',
          position: { x: 161.40224177364246, y: 290.8316612392084 },
        },
        {
          score: 0.9464741349220276,
          part: 'leftAnkle',
          position: { x: 204.2514684673413, y: 364.3322956960953 },
        },
        {
          score: 0.9194188117980957,
          part: 'rightAnkle',
          position: { x: 138.07288735571538, y: 358.8484967079608 },
        },
      ],
    },
  ];

  // Draw poses.
  drawDetectionResults();
}

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

  await loadSVG(Object.values(avatarSvgs)[0]);
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
