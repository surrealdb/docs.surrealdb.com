const { createReadStream, promises: { readdir, stat: getStats } } = require('fs');
const { resolve, join } = require('path');
const S3 = require('aws-sdk/clients/s3');
const { getMIMEType } = require('node-mime-types');

// A big chunk of this script was taken from: https://gist.github.com/jlouros/9abc14239b0d9d8947a3345b99c4ebcb?permalink_comment_id=3493003#gistcomment-3493003
// Requires AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY to be set

const s3 = new S3({ signatureVersion: 'v4' });

// upload file
const uploadFile = async function uploadFile({ path, params, options } = {}) {
    const parameters = { ...params };
    const opts = { ...options };

    try {
        const rstream = createReadStream(resolve(path));

        rstream.once('error', (err) => {
            console.error(`Unable to upload file ${path}, ${err.message}`);
        });

        parameters.Body = rstream;
        parameters.ContentType = getMIMEType(path);
        await s3.upload(parameters, opts).promise();

        console.info(`${parameters.Key} (${parameters.ContentType}) uploaded in bucket ${parameters.Bucket}`);
    } catch (e) {
        throw new Error(`Unable to upload file ${path} at ${parameters.Key}, ${e.message}`);
    }

    return true;
};

// upload directory and its sub-directories if any
const uploadDirectory = async function uploadDirectory({
    path,
    params,
    options,
    rootKey,
} = {}) {
    const parameters = { ...params };
    const opts = { ...options };
    const root = rootKey && rootKey.constructor === String ? rootKey : '';
    let dirPath;

    try {
        dirPath = resolve(path);
        const dirStats = await getStats(dirPath);

        if (!dirStats.isDirectory()) {
            throw new Error(`${dirPath} is not a directory`);
        }

        console.info(`Uploading directory ${dirPath}...`);

        const filenames = await readdir(dirPath);

        if (Array.isArray(filenames)) {
            await Promise.all(filenames.map(async (filename) => {
                const filepath = `${dirPath}/${filename}`;
                const fileStats = await getStats(filepath);

                if (fileStats.isFile()) {
                    parameters.Key = join(root, filename);
                    await uploadFile({
                        path: filepath,
                        params: parameters,
                        options: opts,
                    });
                } else if (fileStats.isDirectory()) {
                    await uploadDirectory({
                        params,
                        options,
                        path: filepath,
                        rootKey: join(root, filename),
                    });
                }
            }));
        }
    } catch (e) {
        throw new Error(`Unable to upload directory ${path}, ${e.message}`);
    }

    console.info(`Directory ${dirPath} successfully uploaded`);
    return true;
};

export async function onSuccess() {
    // const isLocalBuild = process.env.DEPLOY_URL == 'https://0--surrealdb-docs.netlify.app';
    const publish = process.env.DEPLOY_PRIME_URL == 'https://main--surrealdb-docs.netlify.app';
    const buildDir = `${cwd()}/build/`;
    console.log(`Build dir is: "${buildDir}"`);

    if (!publish) {
        console.log(`Will not publish, this is not production.`);
        return;
    }

    console.time('Started publish');
    await uploadDirectory({
        path: buildDir,
        params: {
            Bucket: 'www.surrealdb.com',
        },
        options: {},
        rootKey: 'docs',
    });
    console.timeEnd('Finished publish');
}