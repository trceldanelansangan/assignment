class Cache {

    constructor() {
        this.cache = new Map()
    }

    setCache(key, value, timeDuration) {
        if (this.cache.has(key)) {
            console.log('Updating cache data for key: ', key)
            clearTimeout(this.cache.get(key).timeout);
        } else {
            console.log('Saving cache data for key: ', key)
        }

        const timeout = timeDuration ? setTimeout(() => this.cache.delete(key), timeDuration) : null;
        this.cache.set(key, { value, timeout })
    }

    getCache(key) {
        const entry = this.cache.get(key);
        if (entry) {
            console.log('Getting cache data for key: ', key)
            return entry.value;
        }
        return null;
    }
}

module.exports = Cache