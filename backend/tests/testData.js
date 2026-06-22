let token = "";

module.exports = {
    setToken: (value) => {
        token = value;
    },

    getToken: () => token,
};