export default (condition, msg) => {
    if(!condition) throw new Error(msg);
}