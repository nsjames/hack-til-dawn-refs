export const minutesAgo = minutes => +new Date() - minutes*6000;
export const hoursAgo = hours => +new Date() - minutesAgo(hours*60);