export const formatTime = (time: any) => {
  const hrs = Math.floor((time / 3600000) % 60)
  const mins = time > 3600000
    ? ("0" + Math.floor((time / 60000) % 60)).slice(-2)
    : Math.floor((time / 60000) % 60)
  const secs = ("0" + Math.floor((time / 1000) % 60)).slice(-2);
  return `${time > 3600000 ? `${hrs}:` : ""}${mins}:${secs}`
}