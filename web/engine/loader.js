function loadImg(src) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = src;
  });
}

export async function loadImgs(paths, update) {
  let loaded = 0;
  const total = paths.length;

  const imgs = await Promise.all(
    paths.map(src =>
      loadImg(src).then(img => {
        loaded++;
        update(loaded, total);
        return img;
      })
    )
  );


  return imgs;
}

