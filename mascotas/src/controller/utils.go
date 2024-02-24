package controller

import (
	"bytes"
	"fmt"
	"github.com/gin-gonic/gin"
	"io"
	"net/http"
	"petplace/back-mascotas/src/model"
	"strconv"
	"strings"
)

const (
	offsetQueryParam = "offset"
	limitQueryParam  = "limit"

	offsetDefault = "0"
	limitDefault  = "10"

	IDParamName = "id"

	logTemplate = "ABMController: %s | method: %s | msg: %s"
)

func getSearchParams(c *gin.Context) (*model.SearchParams, *APIError) {

	offset, err := strconv.Atoi(c.DefaultQuery(offsetQueryParam, offsetDefault))
	if err != nil {
		apiErr := fmt.Errorf("%v: %v", MissingParams, err.Error())
		return nil, NewApiError(apiErr, http.StatusBadRequest)
	}

	limit, err := strconv.Atoi(c.DefaultQuery(limitQueryParam, limitDefault))
	if err != nil {
		apiErr := fmt.Errorf("%v: %v", MissingParams, err.Error())
		return nil, NewApiError(apiErr, http.StatusBadRequest)
	}

	return &model.SearchParams{
		Offset: uint(offset),
		Limit:  uint(limit),
	}, nil
}

func getBodyString(c *gin.Context) string {

	bodyBytes, err := getBody(c)
	if err != nil {
		return ""
	}
	reWriteBody(c, bodyBytes)
	return strings.ReplaceAll(string(bodyBytes), "\n", "")
}

func reWriteBody(c *gin.Context, body []byte) {
	c.Request.Body = io.NopCloser(bytes.NewBuffer(body))
}

func getBody(c *gin.Context) ([]byte, error) {

	var requestBodyBuffer bytes.Buffer

	teeReader := io.TeeReader(c.Request.Body, &requestBodyBuffer)
	bodyBytes, err := io.ReadAll(teeReader)
	if err != nil {
		return nil, err
	}

	return bodyBytes, nil
}
