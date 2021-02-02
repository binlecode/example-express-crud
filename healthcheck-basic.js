
// original script from ref: https://github.com/lennym/express-healthcheck
// refactor to take a list of healthIndicators to resolve UP/DOWN/WARN
// each healthIndicator function should provide a json like:
// `{ status: 'UP', ... other keys ... }`
// 

module.exports = function (options = {}) {
    options.healthy = options.healthy || function () {
        return { uptime: process.uptime() };
    };

    if (typeof options.healthy !== 'function') {
        throw new Error('express-healthcheck `healthy` method must be a function');
    }

    options.indicators = options.indicators || {};
    if (typeof options.indicators !== 'object') {
        throw new Error('express-healthcheck `indicators` argument must be an object');
    }

    return function (req, res, next) {
        try {
            var status = 200,
                response = options.healthy();

            response.indicators = {};
            let statusFlag = 'UP';
            for (const idcKey in options.indicators) {
                const idcStatusData = options.indicators[idcKey]();
                const idcStatusFlag = idcStatusData['status'];
                if (typeof idcStatusFlag === 'string') {
                    if (idcStatusFlag.toUpperCase() === 'DOWN' && statusFlag.toUpperCase() !== 'DOWN') {
                        statusFlag = 'DOWN';
                    } else if (idcStatusFlag.toUpperCase() === 'WARN' && !(['WARN', 'DOWN'].includes(statusFlag.toUpperCase()))) {
                        statusFlag = 'WARN';
                    }
                }
                response.indicators[idcKey] = idcStatusData;
            }
            // assign overall status flag
            response['status'] = statusFlag;

            res.status(status).json(response);
        } catch (e) {
            res.status(500).json(e);
        }
    };
};
