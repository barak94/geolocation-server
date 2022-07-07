
module.exports = {

    inputCheck: (source, destination) => {

        let s = source.toLowerCase().replace(' ', '');
        let d = destination.toLowerCase().replace(' ', '');
        let id;
        if (s > d) {
            id = s + d;
        } else {
            id = d + s;
        }
        return id;
    }
}