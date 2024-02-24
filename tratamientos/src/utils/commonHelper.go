package utils

import "errors"

func FailOnError(err error) {
	if err != nil {
		panic(err)
	}
}

func FailIfZeroValue[T comparable](data ...T) error {
	var zeroValue T
	for _, v := range data {
		if v == zeroValue {
			return errors.New("one of required fields is empty")
		}
	}
	return nil
}
