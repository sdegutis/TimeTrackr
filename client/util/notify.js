export function notifyResult(ok, error) {
  if (ok) {
    UIkit.notification({
      message: 'Operation succeeded.',
      status: 'success',
      pos: 'bottom-left',
    });
  }
  else {
    UIkit.notification({
      message: error || 'Operation failed.',
      status: 'danger',
      pos: 'bottom-left',
    });
  }
}
