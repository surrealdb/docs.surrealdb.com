export const onPostBuild = function() {
    console.log("Hello world from onPostBuild event!");
    console.log(JSON.stringify({arguments}));
}
  