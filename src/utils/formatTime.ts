export const formatTime = (time: any) => {
  const mins = ("0" + Math.floor((time / 60000) % 60)).slice(-2);
  const secs = ("0" + Math.floor((time / 1000) % 60)).slice(-2);
  return `${mins}:${secs}`
}