import { AxiosError } from 'axios'
import Vue from 'vue'
import { notifyError, notifyHttpError } from './notifications'

const INTERNAL_ERROR_CLASSES = [
  EvalError,
  RangeError,
  ReferenceError,
  SyntaxError,
  TypeError,
  URIError
]

function isInternalError (error) {
  return INTERNAL_ERROR_CLASSES.some(ErrorClass => error instanceof ErrorClass)
}

function except (error, hide = false) {
  const self = except
  if (error instanceof ErrorEvent && error.error) {
    error = error.error // extract the error from the event
  }

  if (isInternalError(error)) {
    self._sentry(error)
    self._log(error)

    if (!hide) {
      self._notify('Internal error')
    }
  } else if (error instanceof AxiosError) {
    const details = (error.code >= 400 && error.code < 500)
    self._sentry(error)
    self._log(error)

    if (!hide) {
      self._notifyHttp(error, details)
    }
  } else {
    self._sentry(error)
    self._log(error)

    if (!hide) {
      self._notify(error)
    }
  }
}
Object.assign(except, {
  vue (error, vm, info) {
    const self = except
    self._sentry(error)
    self._vue(error, vm, info)
    self._log(error)
    self._notify(error)
  },

  setSentry (Sentry) {
    this._sentry = function (error) {
      if (error instanceof Error) {
        Sentry.captureException(error)
      } else {
        Sentry.captureMessage(error.toString())
      }
    }
  },

  _log: console.error,
  _notify: notifyError,
  _notifyHttp: notifyHttpError,
  _sentry () { /* Does nothing by default. Gets overriden by setSentry */ },
  _vue (error, vm, info) {
    Vue.util.warn(error, vm)
  }
})

export { except, except as default }
