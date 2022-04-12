class TwoWayMap {
    private map = null;
    private reverseMap = null;
    
    constructor(map) {
        this.map = map;
        this.reverseMap = {};
        for (const key in map) {
            this.reverseMap[map[key]] = key;
        }
    }
    get(key) {
        return this.map[key];
    }
    revGet(key) {
        return this.reverseMap[key];
    }
}

export default TwoWayMap;