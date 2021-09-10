const logger = require('../logger')
const memoryCache = require('memory-cache')


function cache(octokit, OctokitOptions) {
    octokit.hook.wrap('request', async (request, options) => {
        const cacheKeyObject = {
            options: options,
            OctokitOptions: OctokitOptions,
        }
        const cacheKey = JSON.stringify(cacheKeyObject)

        if (cacheKey && !config.server.nocache) {
            const cachedRes = memoryCache.get(cacheKey)
            if (cachedRes) {
                logger.info({cacheKey: options}, 'Result returned from cache')
                return cachedRes
            }
        }

        const response = await request(options)

        if (response && options.cacheTime) {
            memoryCache.put(cacheKey, response, 1000 * options.cacheTime)
        }

        return response
    });
}

module.exports = {
    cache,
}
