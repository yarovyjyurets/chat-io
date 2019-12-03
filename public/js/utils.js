function attachSocketIOHandlers(...fns) {
  return (arg) => fns.forEach(fn => fn(arg));
}