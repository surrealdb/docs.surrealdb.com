export const onSuccess = async function() {
    console.log(process.env.DEPLOY_URL);
    console.log('can fetch: ' + (await fetch(process.env.DEPLOY_URL)).status);
}
  