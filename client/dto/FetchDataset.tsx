export const fetchDataset = (link: string) => fetch(link, {
  method: 'GET',
  next: {
    revalidate: 60
  }
})
.then(async (res) => {
  return await res.json();
})
.catch(_ => {
  return null;
});