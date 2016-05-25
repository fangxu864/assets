/**
 * Author: huangzhiyang
 * Date: 2016/5/25 17:33
 * Description: promiseʵ��  from https://github.com/gf-rd/blog/issues/32
 */
var Deferred = function () {
	var _pending = [], _result, _reason;
	var _this = {
		resolve: function (result) {
			if (_this.promise.status !== 'pending') {
				return;
			}
			_result = result;

			setTimeout(function () {
				processQueue(_pending, _this.promise.status = 'resolved', _result);
				_pending = null;
			}, 0);
		},
		reject: function (reason) {
			if (_this.promise.status !== 'pending') {
				return;
			}
			_reason = reason;

			setTimeout(function () {
				processQueue(_pending, _this.promise.status = 'rejected', null, _reason);
				_pending = null;
			}, 0);
		},
		promise: {
			then: function (onResolved, onRejected) {
				// ����һ���µ�defer������, ���ҽ�defer��callbackͬʱ��ӵ���ǰ��pending�С�
				var defer = Deferred();
				var status = _this.promise.status;
				if (status === 'pending') {
					_pending.push([defer, onResolved, onRejected]);
				} else if (status === 'resolved') {
					onResolved(_result);
				} else if (status === 'rejected') {
					onRejected(_reason);
				}
				return defer.promise;
			},
			status: 'pending'
		}
	};

	function processQueue(pending, status, result, reason) {
		var item, r, i, l, callbackIndex, method, param;
		if (status === 'resolved') {
			callbackIndex = 1;
			method = 'resolve';
			param = result;
		} else {
			callbackIndex = 2;
			method = 'reject';
			param = reason;
		}
		for (i = 0, l = pending.length; i < l; i++) {
			item = pending[i];
			r = item[callbackIndex](param);
			// ����ص��Ľ�����ص���promise(��then����), �����then��������resolve��������
			if (r && typeof r.then === 'function') {
				r.then.call(r, item[0].resolve, item[0].reject);
			} else {
				item[0][method](param);
			}
		}
	}

	return _this;
};

module.exports = Deferred;