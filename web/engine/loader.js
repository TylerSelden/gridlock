const paths = [
  "hpw.png",
  "apw.png",
  "rpw.png",
  "hpb.png",
  "apb.png",
  "rpb.png"
]


function loadImg(src) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = src;
  });
}

export async function loadImgs(update) {
  let loaded = 0;
  const total = paths.length;

  let imgs = {};

  await Promise.all(
    paths.map(async (path) => {
      const img = await loadImg(`./assets/${path}`);
      imgs[path] = img;
      loaded++;
      update(loaded, total);
    })
  );

  return imgs;
}

