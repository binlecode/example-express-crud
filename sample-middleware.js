


module.exports = function (options) {
    options = options || {};
    
    // options.healthy = options.healthy || function () {
    //     return { uptime: process.uptime() };
    // };

    return function (req, res, next) {
        try {
            for (const key in req) {
                console.log(
                    `HTTP Req ${key}: ${req[key]}`    
                );
            }
            next();
        } catch (e) {
            res.status(500).json(e);
        }
    };
};
