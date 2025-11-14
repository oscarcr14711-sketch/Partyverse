// Lightweight Lottie preprocessor to expand simple loopOut('cycle') expressions
// into repeated keyframes so animations loop correctly on mobile (which doesn't
// evaluate AE expressions).

type AnyObject = { [key: string]: any };

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

function isKeyframedProperty(node: AnyObject): boolean {
  return node && typeof node === 'object' && Array.isArray(node.k) && typeof node.x === 'string';
}

function expandLoopOutCycle(node: AnyObject, totalFrames: number) {
  try {
    if (!isKeyframedProperty(node)) return;
    const expr: string = node.x || '';
    if (!expr.includes("loopOut('cycle'") && !expr.includes('loopOut("cycle"')) return;

    const frames = node.k as AnyObject[];
    if (!frames || frames.length < 2) return;

    // Only process if keyframes have time (t) markers
    const firstT = typeof frames[0].t === 'number' ? frames[0].t : 0;
    const lastT = typeof frames[frames.length - 1].t === 'number' ? frames[frames.length - 1].t : firstT;
    const patternDuration = lastT - firstT;
    if (patternDuration <= 0) return;

    const newFrames: AnyObject[] = [];
    // Always include the original frames
    for (const f of frames) newFrames.push(deepClone(f));

    // Repeat the pattern until we reach totalFrames
    let offset = patternDuration;
    while (lastT + offset <= totalFrames) {
      for (let i = 0; i < frames.length; i++) {
        // skip duplicating the first frame to avoid time collisions
        if (i === 0) continue;
        const f = deepClone(frames[i]);
        if (typeof f.t === 'number') f.t = f.t + offset;
        newFrames.push(f);
      }
      offset += patternDuration;
    }

    // Replace keyframes and remove expression
    node.k = newFrames;
    delete node.x;
  } catch {
    // Swallow errors - best effort patch only
  }
}

function traverseAndPatch(obj: AnyObject, totalFrames: number) {
  if (!obj || typeof obj !== 'object') return;

  // If this node looks like a keyframed property with an expression, try to expand it
  if (isKeyframedProperty(obj)) {
    expandLoopOutCycle(obj, totalFrames);
  }

  // Recurse into children and normalize arrays
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (!val || typeof val !== 'object') continue;

    if (Array.isArray(val)) {
      // Process each element
      for (let i = 0; i < val.length; i++) {
        const item = val[i];
        if (item && typeof item === 'object') traverseAndPatch(item, totalFrames);
      }
      // If this is a layers array, strip text layers (ty === 5)
      if (key === 'layers') {
        obj[key] = (val as AnyObject[]).filter((layer) => {
          try {
            return layer.ty !== 5;
          } catch {
            return true;
          }
        });
      }
    } else {
      traverseAndPatch(val, totalFrames);
    }
  }
}

export function patchLottieLoops(lottieJson: AnyObject): AnyObject {
  try {
    const clone = deepClone(lottieJson);
    const totalFrames = typeof clone.op === 'number' ? clone.op : 300;
    traverseAndPatch(clone, totalFrames);
    return clone;
  } catch {
    return lottieJson;
  }
}

export default patchLottieLoops;
