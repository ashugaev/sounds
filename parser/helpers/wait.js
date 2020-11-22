const wait = time => new Promise(rs => setTimeout(rs, time));

module.exports = { wait };
