module.exports = {
    publicPath: './',
}

import fs from 'fs';

const optimizeDepsElementPlusIncludes = ["element-plus/es", '@vuemap/vue-amap/es']
fs.readdirSync("node_modules/element-plus/es/components").map((dirname) => {
    fs.access(
        `node_modules/element-plus/es/components/${dirname}/style/css.mjs`,
        (err) => {
            if (!err) {
                optimizeDepsElementPlusIncludes.push(
                    `element-plus/es/components/${dirname}/style/css`
                )
            }
        }
    )
})
